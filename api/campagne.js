/* Persoonlijke campagnepagina van een klant: link2leads.nl/campagne/[code]

   De klant ziet hier zijn vragenlijst, domeinen, leads, copy, updates en
   cijfers, en geeft akkoord of feedback. Alles staat in Supabase (tabellen
   klantpagina*, project Link2Leads Master). De tabellen zijn dicht (RLS); deze
   functie roept alleen de vier functies aan die met de publieke sleutel mogen
   en die altijd eerst de code controleren.

   Bij akkoord, feedback, extra input of interesse in een uitbreiding krijgt
   Demi direct een interne mail. Naar de klant gaat vanaf hier nooit iets:
   het seintje "er staat iets klaar" zet Claude als concept in demi@ klaar. */

const nodemailer = require('nodemailer');
const M = require('./_mail');
const { rpc } = require('./_vragenlijst');
const { esc } = M;

function transporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: Number(process.env.MAIL_PORT || 465) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

const SOORT = { domeinen: 'Domeinnamen', leads: 'Leads', copy: 'Copy' };
const OPTIE = {
  linkedin: 'LinkedIn erbij',
  personalisatie: 'Persoonlijke pagina per prospect',
  volume: 'Meer volume (groter pakket)',
  setter: 'Een setter die de reacties belt'
};

function codeOk(c) { return typeof c === 'string' && /^[A-Za-z0-9]{20,64}$/.test(c); }

async function meld(subject, title, rows, tekst) {
  try {
    const from = `"Link2Leads" <${process.env.MAIL_FROM || 'info@link2leads.nl'}>`;
    const to = process.env.NOTIFY_EMAIL || 'demi@link2leads.nl';
    await transporter().sendMail({
      from, to, subject,
      html: M.shell({
        title, badge: 'Intern', preheader: subject,
        body: [
          M.h1(esc(title)),
          M.detailTable(rows),
          tekst ? M.spacer() + M.label('Tekst van de klant') + M.p(esc(tekst), { color: M.C.text }) : ''
        ].join('')
      })
    });
  } catch (e) { console.error('Melding campagnepagina:', e.message); }
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const b = req.body || {};
  if (!codeOk(b.code)) return res.status(404).json({ error: 'onbekend' });

  try {
    if (b.actie === 'ophalen') {
      const data = await rpc('klantpagina_ophalen', { p_code: b.code });
      return res.status(200).json(data);
    }

    if (b.actie === 'leadkeuze') {
      const data = await rpc('klantpagina_leadkeuze', { p_code: b.code, p_item: Number(b.item), p_keuzes: b.keuzes || {} });
      return res.status(200).json(data);
    }

    if (b.actie === 'beoordeel') {
      const status = b.status === 'akkoord' ? 'akkoord' : 'feedback';
      const r = await rpc('klantpagina_beoordeel', { p_code: b.code, p_item: Number(b.item), p_status: status, p_feedback: b.feedback || null });
      const wat = SOORT[r.soort] || r.soort;
      const rows = [['Klant', r.bedrijf || r.klant], ['Contact', r.naam], ['Onderdeel', `${wat}${r.titel ? ' · ' + r.titel : ''}`]];
      if (r.soort === 'leads') rows.push(['Keuzes', `${r.ja} ja, ${r.nee} nee`]);
      await meld(
        `${status === 'akkoord' ? 'Akkoord' : 'Feedback'} ${wat.toLowerCase()} · ${r.bedrijf || r.klant}`,
        status === 'akkoord' ? `${r.bedrijf || r.klant} gaf akkoord op ${wat.toLowerCase()}` : `${r.bedrijf || r.klant} gaf feedback op ${wat.toLowerCase()}`,
        rows, status === 'feedback' ? b.feedback : ''
      );
      return res.status(200).json({ ok: true });
    }

    if (b.actie === 'input') {
      const soort = ['extra', 'vragenlijst', 'interesse', 'referral', 'review'].includes(b.soort) ? b.soort : 'extra';
      const onderwerp = soort === 'interesse' ? (OPTIE[b.onderwerp] ? b.onderwerp : 'overig') : (b.onderwerp || null);
      const r = await rpc('klantpagina_input_toevoegen', { p_code: b.code, p_soort: soort, p_onderwerp: onderwerp, p_tekst: b.tekst || null });
      const naam = r.bedrijf || r.klant;
      if (soort === 'interesse') {
        await meld(`Koopsignaal: ${naam} wil ${OPTIE[onderwerp] || onderwerp}`, `${naam} klikte op "${OPTIE[onderwerp] || onderwerp}"`,
          [['Klant', naam], ['Contact', r.naam], ['E-mail', r.email], ['Interesse', OPTIE[onderwerp] || onderwerp]], b.tekst);
      } else if (soort === 'referral') {
        await meld(`Doorverwijzing via ${naam}`, `${naam} draagt iemand aan via de persoonlijke omgeving (10% van de eerste contractperiode als korting voor ${naam} als het klant wordt)`,
          [['Aangedragen door', naam], ['Contact', r.naam], ['E-mail', r.email]], b.tekst);
      } else if (soort === 'review') {
        await meld(`Review: ${naam} klikte op de reviewknop`, `${naam} opende de Google-reviewlink in de persoonlijke omgeving`, [['Klant', naam], ['Contact', r.naam]], '');
      } else {
        await meld(`${soort === 'vragenlijst' ? 'Aanvulling vragenlijst' : 'Extra input'} · ${naam}`,
          `${naam} vulde iets aan op de campagnepagina`, [['Klant', naam], ['Contact', r.naam], ['Waar', soort === 'vragenlijst' ? 'Vragenlijst' : 'Extra input']], b.tekst);
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'actie' });
  } catch (e) {
    const msg = String(e.message || '');
    if (/onbekend/.test(msg)) return res.status(404).json({ error: 'onbekend' });
    console.error('Campagnepagina:', msg);
    return res.status(500).json({ error: 'fout' });
  }
};
