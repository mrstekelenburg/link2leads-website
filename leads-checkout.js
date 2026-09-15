// Direct afrekenen op /leads.
// De browser stuurt alleen het aantal leads en welke verrijking is aangevinkt.
// De prijs wordt HIER uitgerekend, nooit meegestuurd, zodat niemand zijn eigen bedrag kan invullen.

const PRIJZEN = {
  // staffel: vanaf dit aantal geldt deze prijs per lead, exclusief btw
  tiers: [
    { min: 10000, p: 0.10 },
    { min: 5000,  p: 0.12 },
    { min: 1000,  p: 0.15 },
    { min: 500,   p: 0.20 }
  ],
  // verrijking per lead, exclusief btw
  opts: {
    linkedin: { p: 0.03, naam: 'LinkedIn-profiel' },
    phone:    { p: 0.05, naam: 'Telefoonnummer' },
    opener:   { p: 0.10, naam: 'Persoonlijke openingszin' }
  },
  btw: 0.21,
  minDirect: 250,   // onder dit bedrag (excl. btw) alleen telling aanvragen
  maxDirect: 1500,  // boven dit bedrag (excl. btw) alleen telling en factuur
  minLeads: 500,
  maxLeads: 50000
};

function prijsPerLead(n) {
  for (const t of PRIJZEN.tiers) if (n >= t.min) return t.p;
  return PRIJZEN.tiers[PRIJZEN.tiers.length - 1].p;
}

function bereken(volume, keys) {
  const n = Math.round(Number(volume) / 500) * 500;
  if (!n || n < PRIJZEN.minLeads || n > PRIJZEN.maxLeads) return null;
  const basis = n * prijsPerLead(n);
  let extra = 0;
  const namen = [];
  for (const k of keys) {
    const o = PRIJZEN.opts[k];
    if (!o) continue;
    extra += o.p * n;
    namen.push(o.naam);
  }
  const excl = Math.round((basis + extra) * 100) / 100;
  const incl = Math.round(excl * (1 + PRIJZEN.btw) * 100) / 100;
  return { n, excl, incl, namen, perLead: excl / n };
}

const HITS = new Map();
function tooMany(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (HITS.get(ip) || []).filter(t => now - t < win);
  list.push(now);
  HITS.set(ip, list);
  if (HITS.size > 500) HITS.clear();
  return list.length > 8;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const b = req.body || {};
  const { name, email, company, target, volume, website } = b;
  const keys = Array.isArray(b.opts) ? b.opts.slice(0, 5) : [];

  // Honeypot
  if (website) return res.status(200).json({ ok: true, checkoutUrl: 'https://www.link2leads.nl/leads' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (tooMany(ip)) return res.status(429).json({ error: 'Even wachten graag. Mail info@link2leads.nl als het niet lukt.' });

  if (!name || !email) return res.status(400).json({ error: 'Naam en e-mail zijn verplicht.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email))) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.' });
  }
  if (!target) return res.status(400).json({ error: 'Beschrijf kort wie je wil bereiken.' });
  if (String(name).length > 120 || String(email).length > 160 ||
      String(company || '').length > 160 || String(target).length > 1000) {
    return res.status(400).json({ error: 'Een van de velden is te lang.' });
  }

  const calc = bereken(volume, keys);
  if (!calc) return res.status(400).json({ error: 'Kies een aantal tussen 500 en 50.000 leads.' });
  if (calc.excl < PRIJZEN.minDirect) {
    return res.status(400).json({ error: `Direct afrekenen kan vanaf ${PRIJZEN.minDirect} euro exclusief btw. Vraag hieronder een telling aan, dan sturen we je een prijs.` });
  }
  if (calc.excl > PRIJZEN.maxDirect) {
    return res.status(400).json({ error: 'Bij dit bedrag doen we eerst een telling en sturen we een factuur. Vraag hieronder je telling aan.' });
  }

  const key = process.env.MOLLIE_API_KEY;
  if (!key) return res.status(500).json({ error: 'Afrekenen staat nog niet aan. Mail info@link2leads.nl.' });

  const ref = 'L2L-' + Math.floor(100000 + Math.random() * 900000);
  const beschrijving = `Leadbestand ${calc.n} leads (${ref})`;

  try {
    const r = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: { currency: 'EUR', value: calc.incl.toFixed(2) },
        description: beschrijving,
        redirectUrl: 'https://www.link2leads.nl/leads?betaald=' + ref,
        webhookUrl: 'https://www.link2leads.nl/api/mollie-webhook',
        locale: 'nl_NL',
        metadata: {
          ref,
          naam: String(name),
          email: String(email),
          bedrijf: String(company || ''),
          doelgroep: String(target),
          aantal: calc.n,
          verrijking: calc.namen.join(', ') || 'geen',
          excl_btw: calc.excl.toFixed(2),
          per_lead: calc.perLead.toFixed(3)
        }
      })
    });

    const data = await r.json();
    if (!r.ok || !data || !data._links || !data._links.checkout) {
      console.error('Mollie payment mislukt', r.status, data && data.detail);
      return res.status(502).json({ error: 'Betaling starten lukt nu niet. Mail info@link2leads.nl, dan regelen we het handmatig.' });
    }

    return res.status(200).json({
      ok: true,
      ref,
      bedrag: calc.incl.toFixed(2),
      checkoutUrl: data._links.checkout.href
    });
  } catch (e) {
    console.error('leads-checkout', e);
    return res.status(500).json({ error: 'Betaling starten lukt nu niet. Mail info@link2leads.nl.' });
  }
};
