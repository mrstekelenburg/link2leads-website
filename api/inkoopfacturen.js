/* /api/inkoopfacturen
   Zet factuurbijlagen (pdf) uit de mail in de boekhoudmap op OneDrive.
   Vervangt de drie Make-scenario's "Inkoopfacturen uit mail naar OneDrive".
   Wordt elke ochtend aangeroepen door Supabase (cron), per postvak.

   Beveiliging:
   - alleen met de sleutel uit REMIND_SECRET als Authorization: Bearer ...
   - leest alleen de postvakken uit POSTVAKKEN hieronder
   - schrijft alleen pdf's, alleen in de boekhoudmap van SCHIJF

   Regels (gelijk aan Make):
   - mail met bijlage van de laatste 3 dagen, niet van een eigen adres
   - bijlage is een pdf
   - onderwerp of bestandsnaam bevat een factuurwoord (WOORD)
   - bestandsnaam bevat geen overeenkomst, contract of eigen verkoopfactuur (NIET)
   - bestandsnaam: "JJJJ-MM-DD Afzender - bijlage.pdf", bestaat hij al dan wordt hij vervangen
   - map: /Zakelijk/Boekhouder/Algemeen/JJJJ kwartaal/Qn JJJJ/Inkoop/Uit mail

   Query: ?postvak=demi@link2leads.nl (standaard alle), ?dagen=3, ?droog=1 (alleen laten zien, niets opslaan)

   Nodig in Entra op de app van de site: Mail.Read en Files.ReadWrite.All (toepassingsmachtigingen). */

const POSTVAKKEN = ['demi@link2leads.nl', 'info@link2leads.nl', 'anneroos@link2leads.nl'];
const EIGEN = ['demi@link2leads.nl', 'info@link2leads.nl', 'info@link2talent.nl', 'demi@link2talent.nl', 'mrstekelenburg@hotmail.com'];
const SCHIJF = 'demi@link2leads.nl';
const WOORD = /\b(factuur|facturen|factura|invoice|invoices|receipt|kwitantie|ontvangstbewijs|betaalbewijs|nota|bon|bestelling|creditnota|credit note|rekening|billing|betalingsbewijs|order confirmation|orderbevestiging)\b/i;
const NIET = /(overeenkomst|contract|link2 ?(talent|group|leads)[ _]aan|^factuur[ _]?20\d\d)/i;
const MAX_BYTES = 25 * 1024 * 1024;
const GRAPH = 'https://graph.microsoft.com/v1.0';

function authorized(req) {
  const secrets = [process.env.REMIND_SECRET, process.env.CRON_SECRET].filter(Boolean);
  if (!secrets.length) return false;
  const hdr = String(req.headers['authorization'] || '').replace(/^Bearer\s+/i, '').trim();
  return !!hdr && secrets.includes(hdr);
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

// Datum in Nederlandse tijd, als [jaar, maand, dag]
function nlDatum(iso) {
  const s = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Amsterdam' }).format(new Date(iso));
  return s.split('-').map(Number);
}

function doelmap(iso) {
  const [jaar, maand] = nlDatum(iso);
  const q = Math.ceil(maand / 3);
  if (jaar === 2026 && q === 1) return '/Zakelijk/Boekhouder/Algemeen/2026 kwartaal/Q1 2026/Inkoopfacturen Q1 2026/Uit mail';
  return `/Zakelijk/Boekhouder/Algemeen/${jaar} kwartaal/Q${q} ${jaar}/Inkoop/Uit mail`;
}

const schoon = s => String(s || '').replace(/[\/:*?<>|#%"\\]/g, '-').trim();
const pad = p => p.split('/').map(encodeURIComponent).join('/');

async function fout(res, wat) {
  const t = await res.text().catch(() => '');
  let code = '';
  try { code = (JSON.parse(t).error || {}).code || ''; } catch (e) { /* geen json */ }
  const hint = res.status === 403 ? ' (machtiging ontbreekt in Entra: Mail.Read of Files.ReadWrite.All)' : '';
  return new Error(`${wat} ${res.status} ${code}${hint}`.trim());
}

async function verwerkPostvak(token, postvak, dagen, droog) {
  const uit = { postvak, berichten: 0, pdfs: 0, geplaatst: [], fouten: [] };
  const h = { Authorization: 'Bearer ' + token };
  const vanaf = new Date(Date.now() - dagen * 86400000).toISOString().slice(0, 10);
  const eigen = EIGEN.concat([postvak]);
  let url = `${GRAPH}/users/${encodeURIComponent(postvak)}/messages`
    + `?$filter=${encodeURIComponent(`receivedDateTime ge ${vanaf}T00:00:00Z and hasAttachments eq true`)}`
    + '&$select=id,subject,from,receivedDateTime&$top=50'
    + `&$expand=${encodeURIComponent('attachments($select=id,name,size)')}`;
  let rondes = 0;
  while (url && rondes < 20) {
    rondes++;
    const r = await fetch(url, { headers: h });
    if (!r.ok) throw await fout(r, 'mail lezen');
    const j = await r.json();
    for (const m of (j.value || [])) {
      const van = ((m.from || {}).emailAddress || {});
      if (eigen.includes(String(van.address || '').toLowerCase())) continue;
      uit.berichten++;
      for (const a of (m.attachments || [])) {
        const naam = String(a.name || '');
        if (!/\.pdf$/i.test(naam)) continue;
        if (!WOORD.test(`${m.subject || ''} ${naam}`)) continue;
        if (NIET.test(naam)) continue;
        uit.pdfs++;
        const [jj, mm, dd] = nlDatum(m.receivedDateTime);
        const datum = `${jj}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
        const bestand = `${datum} ${schoon(van.name || van.address)} - ${schoon(naam)}`;
        const map = doelmap(m.receivedDateTime);
        if (droog) { uit.geplaatst.push({ map, bestand, droog: true }); continue; }
        try {
          if (a.size && a.size > MAX_BYTES) throw new Error('bijlage te groot');
          const b = await fetch(`${GRAPH}/users/${encodeURIComponent(postvak)}/messages/${m.id}/attachments/${a.id}/$value`, { headers: h });
          if (!b.ok) throw await fout(b, 'bijlage ophalen');
          const bytes = Buffer.from(await b.arrayBuffer());
          const doel = `${GRAPH}/users/${encodeURIComponent(SCHIJF)}/drive/root:${pad(map + '/' + bestand)}:/content?@microsoft.graph.conflictBehavior=replace`;
          const u = await fetch(doel, { method: 'PUT', headers: { ...h, 'Content-Type': 'application/pdf' }, body: bytes });
          if (!u.ok) throw await fout(u, 'opslaan');
          uit.geplaatst.push({ map, bestand });
        } catch (e) {
          uit.fouten.push({ bestand, fout: String(e && e.message || e).slice(0, 240) });
        }
      }
    }
    url = j['@odata.nextLink'] || '';
  }
  return uit;
}

module.exports = async (req, res) => {
  if (!authorized(req)) return res.status(401).json({ ok: false, error: 'geen toegang' });
  if (!(process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET)) {
    return res.status(200).json({ ok: false, error: 'MS_* variabelen ontbreken' });
  }
  const q = req.query || {};
  const droog = String(q.droog || '') === '1';
  const dagen = Math.min(Math.max(parseInt(q.dagen, 10) || 3, 1), 31);
  const gevraagd = String(q.postvak || '').trim().toLowerCase();
  if (gevraagd && !POSTVAKKEN.includes(gevraagd)) return res.status(403).json({ ok: false, error: 'postvak niet toegestaan' });
  const lijst = gevraagd ? [gevraagd] : POSTVAKKEN;

  let token;
  try { token = await graphToken(); } catch (e) { return res.status(502).json({ ok: false, error: String(e.message || e) }); }

  const resultaat = [];
  let ok = true;
  for (const pv of lijst) {
    try {
      const r = await verwerkPostvak(token, pv, dagen, droog);
      if (r.fouten.length) ok = false;
      resultaat.push(r);
    } catch (e) {
      ok = false;
      resultaat.push({ postvak: pv, fout: String(e && e.message || e).slice(0, 240) });
    }
  }
  return res.status(ok ? 200 : 502).json({ ok, droog, dagen, resultaat });
};
