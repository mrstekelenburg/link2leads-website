/* Wie heeft de vragenlijst op /klant al ingevuld?

   Tot 24-11-2026 werd dat alleen bijgehouden als categorie "L2L vragenlijst
   binnen" op een afspraak die op het moment van insturen al in de agenda stond.
   Vulde iemand de vragenlijst in VOOR de uitnodiging er was (vaak bij een
   handmatige uitnodiging na een belletje van Anne-Roos), dan kreeg hij later
   toch "je vragenlijst hebben we nog niet binnen" (Arnold, Albers Zeilmakerij).

   Daarom komt elke inzending nu ook in Supabase (tabel vragenlijsten, project
   Link2Leads Master). api/remind.js vraagt voor elke herinnering na of er een
   vragenlijst binnen is: zelfde e-mailadres, zelfde bedrijfsdomein (geen gmail
   e.d.) of dezelfde bedrijfsnaam, laatste 120 dagen. De tabel zelf is dicht
   (RLS); alleen de twee functies hieronder zijn met de publieke sleutel aan te
   roepen. Een fout of time-out hier laat nooit een inzending of herinnering
   mislukken. */

const SB_URL = process.env.SUPABASE_URL || 'https://sjveusdzkmthwglmfvqa.supabase.co';
const SB_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_QBNwdypj2cg1pbnuEid2CA_vXlbS9Rv';

async function rpc(fn, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal
    });
    if (!res.ok) throw new Error(fn + ' ' + res.status + ': ' + (await res.text()).slice(0, 200));
    const txt = await res.text();
    return txt ? JSON.parse(txt) : null;
  } finally {
    clearTimeout(timer);
  }
}

/* Inzending vastleggen. */
async function registreer({ email, company, ref, site }) {
  await rpc('vragenlijst_registreer', {
    p_email: String(email || ''),
    p_bedrijf: company ? String(company) : null,
    p_ref: ref ? String(ref) : null,
    p_site: site || 'nl'
  });
}

/* Inzending met de antwoorden zelf vastleggen (sinds 24-11-2026), zodat ze op
   de persoonlijke campagnepagina van de klant terug te zien zijn. */
async function opslaan({ email, company, ref, site, answers, name }) {
  await rpc('vragenlijst_opslaan', {
    p_email: String(email || ''),
    p_bedrijf: company ? String(company) : null,
    p_ref: ref ? String(ref) : null,
    p_site: site || 'nl',
    p_antwoorden: answers && typeof answers === 'object' ? answers : null,
    p_naam: name ? String(name) : null
  });
}

/* true als er voor een van deze adressen of dit bedrijf een vragenlijst binnen is. */
async function binnen(emails, company) {
  const list = (emails || []).map(e => String(e || '').trim()).filter(Boolean);
  if (!list.length && !company) return false;
  return (await rpc('vragenlijst_binnen', { p_emails: list, p_bedrijf: company ? String(company) : null })) === true;
}

module.exports = { registreer, opslaan, binnen, rpc };
