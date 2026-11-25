/* /api/reactie
   Verstuurt een melding "nieuwe reactie op je campagne" naar een opdrachtgever.
   Wordt aangeroepen door Supabase (functie reactie-doorsturen) zodra Smartlead
   een reactie meldt. Vervangt de Make-scenario's.

   Beveiliging:
   - alleen met de sleutel uit REMIND_SECRET als Authorization: Bearer ...
   - alleen naar adressen uit ONTVANGERS hieronder. Een nieuwe opdrachtgever
     komt er dus pas bij door hem hier toe te voegen.

   Afzender is altijd reacties@notificaties.link2leads.nl, zodat deze meldingen
   de reputatie van info@ en demi@ niet raken. Lukt versturen vanaf dat adres
   niet, dan gaat er niets uit en komt de fout terug (geen terugval op info@).

   Body (JSON): { to, cc, subject, html, text, replyTo, replyToName,
                  attachments: [{ name, contentType, base64 }], route }
   route: 'auto' (standaard), 'graph-eigen', 'graph-alias' of 'smtp'. */

const nodemailer = require('nodemailer');

const AFZENDER = 'reacties@notificaties.link2leads.nl';
const AFZENDER_NAAM = 'Link2Leads Reacties';
const ONTVANGERS = [
  'demi@link2leads.nl',
  'anneroos@link2leads.nl',
  'hank@gratisenergiecheck.nl',
  'george@vipisolutions.nl'
];

function authorized(req) {
  const secrets = [process.env.REMIND_SECRET, process.env.CRON_SECRET].filter(Boolean);
  if (!secrets.length) return false;
  const hdr = String(req.headers['authorization'] || '').replace(/^Bearer\s+/i, '').trim();
  return !!hdr && secrets.includes(hdr);
}

function lijst(v) {
  return (Array.isArray(v) ? v : String(v || '').split(/[,;]/))
    .map(s => String(s || '').trim().toLowerCase()).filter(Boolean);
}

async function graphToken() {
  const url = `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.MS_CLIENT_ID,
      client_secret: process.env.MS_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials'
    })
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.access_token) throw new Error('token ' + res.status);
  return j.access_token;
}

// postbus = de mailbox waaruit verstuurd wordt. Bij 'graph-eigen' is dat het
// reacties-adres zelf, bij 'graph-alias' de mailbox van Demi met het
// reacties-adres als afzender.
async function viaGraph(m, postbus) {
  const token = await graphToken();
  const adr = a => ({ emailAddress: { address: a } });
  const message = {
    subject: m.subject,
    body: { contentType: 'HTML', content: m.html },
    from: { emailAddress: { address: AFZENDER, name: AFZENDER_NAAM } },
    toRecipients: m.to.map(adr),
    ccRecipients: m.cc.map(adr)
  };
  if (m.replyTo) message.replyTo = [{ emailAddress: { address: m.replyTo, name: m.replyToName || undefined } }];
  if (m.attachments.length) {
    message.attachments = m.attachments.map(a => ({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: a.name, contentType: a.contentType || 'application/octet-stream', contentBytes: a.base64
    }));
  }
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(postbus)}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, saveToSentItems: true })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    let code = '';
    try { code = JSON.parse(t).error.code + ': ' + JSON.parse(t).error.message; } catch (e) { code = t; }
    throw new Error(`graph ${res.status} ${String(code).slice(0, 180)}`);
  }
}

async function viaSmtp(m) {
  const port = Number(process.env.MAIL_PORT || 465);
  const t = nodemailer.createTransport({
    host: process.env.MAIL_HOST, port, secure: port === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
  await t.sendMail({
    from: `"${AFZENDER_NAAM}" <${AFZENDER}>`,
    to: m.to, cc: m.cc.length ? m.cc : undefined,
    replyTo: m.replyTo ? (m.replyToName ? `"${String(m.replyToName).replace(/"/g, '')}" <${m.replyTo}>` : m.replyTo) : undefined,
    subject: m.subject, html: m.html, text: m.text || undefined,
    attachments: m.attachments.map(a => ({ filename: a.name, content: Buffer.from(a.base64, 'base64'), contentType: a.contentType || undefined }))
  });
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorized(req)) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  const b = (req.body && typeof req.body === 'object') ? req.body : {};
  const m = {
    to: lijst(b.to), cc: lijst(b.cc),
    subject: String(b.subject || '').slice(0, 300),
    html: String(b.html || ''), text: String(b.text || ''),
    replyTo: String(b.replyTo || '').trim(), replyToName: String(b.replyToName || '').trim(),
    attachments: (Array.isArray(b.attachments) ? b.attachments : [])
      .filter(a => a && a.name && a.base64).slice(0, 10)
  };
  if (!m.to.length || !m.subject || !m.html) return res.status(400).json({ ok: false, error: 'to, subject en html zijn verplicht' });
  const fout = m.to.concat(m.cc).filter(a => !ONTVANGERS.includes(a));
  if (fout.length) return res.status(403).json({ ok: false, error: 'ontvanger niet toegestaan', adressen: fout });

  const eigenaar = process.env.MS_CALENDAR_USER || 'demi@link2leads.nl';
  const routes = {
    'graph-eigen': () => viaGraph(m, AFZENDER),
    'graph-alias': () => viaGraph(m, eigenaar),
    'smtp': () => viaSmtp(m)
  };
  const keuze = String(b.route || 'auto');
  // 'auto' probeert alleen Microsoft. SMTP (het info@-account van de site) alleen op uitdrukkelijk verzoek,
  // want die route kan de afzender niet garanderen.
  // 25-11-2026: eerst 'graph-alias' (verstuurd uit de mailbox van Demi, afzender blijft reacties@), zodat elke
  // doorgestuurde reactie net als bij Make in Demi's Verzonden items staat. Lukt dat niet, dan 'graph-eigen'.
  const volgorde = routes[keuze] ? [keuze] : ['graph-alias', 'graph-eigen'];
  const pogingen = [];
  for (const r of volgorde) {
    try {
      await routes[r]();
      return res.status(200).json({ ok: true, route: r, pogingen });
    } catch (e) {
      pogingen.push({ route: r, fout: String(e && e.message || e).slice(0, 240) });
    }
  }
  return res.status(502).json({ ok: false, error: 'versturen mislukt', pogingen });
};
