// Kort contactformulier: naam + e-mail + vraag.
// Bewust de laagste drempel op de site: geen agenda, geen call, gewoon een vraag.
const nodemailer = require('nodemailer');

const M = require('./_mail');
const { esc, SIGNER } = M;

const BOOK_URL = 'https://link2leads.nl/book';
const KENNIS_URL = 'https://www.link2leads.nl/kennis';

function transporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: Number(process.env.MAIL_PORT || 465) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

// Simpele in-memory rate limit per IP. Vercel-instanties zijn kortlevend,
// dus dit vangt alleen de botherhalingen binnen dezelfde instantie op.
const HITS = new Map();
function tooMany(ip) {
  const now = Date.now();
  const win = 10 * 60 * 1000;
  const list = (HITS.get(ip) || []).filter(t => now - t < win);
  list.push(now);
  HITS.set(ip, list);
  if (HITS.size > 500) HITS.clear();
  return list.length > 5;
}

function nextBlock() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${M.C.panel};border:1px solid ${M.C.border2};border-radius:14px;">
    <tr><td style="padding:24px 22px;">
      ${M.label('Wat er nu gebeurt')}
      <p style="margin:0 0 20px;font-family:${M.FONT};font-size:14px;line-height:1.65;color:${M.C.muted};">
        Ik lees je vraag zelf en antwoord binnen &eacute;&eacute;n werkdag, met een concreet antwoord in plaats van een uitnodiging voor een gesprek.
        Wil je liever meteen doorpraten, plan dan hieronder de gratis fitcheck. Dat hoeft niet.
        <br><br>
        Ondertussen staat het meeste al op papier: prijzen, wat wel en niet als positieve reactie telt, en wat onze campagnes werkelijk opleveren.
      </p>
      ${M.button(BOOK_URL, 'Plan de gratis fitcheck')}
    </td></tr>
  </table>`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const { name, email, company, question, website, type } = body;
  const isScan = type === 'marktscan';

  // Honeypot: echte bezoekers laten dit veld leeg.
  if (website) return res.status(200).json({ ok: true, ref: 'L2L-000000' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (tooMany(ip)) {
    return res.status(429).json({ error: 'Je hebt net al een bericht gestuurd. Antwoord volgt binnen een werkdag.' });
  }

  if (!name || !email) return res.status(400).json({ error: 'Naam en e-mail zijn verplicht' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email))) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.' });
  }
  if (String(name).length > 120 || String(email).length > 160 ||
      String(company || '').length > 160 || String(question || '').length > 4000) {
    return res.status(400).json({ error: 'Een van de velden is te lang.' });
  }

  const ref = 'L2L-' + Math.floor(100000 + Math.random() * 900000);
  const notify = process.env.NOTIFY_EMAIL || 'demi@link2leads.nl';
  const from = `"Link2Leads" <${process.env.MAIL_FROM || 'info@link2leads.nl'}>`;
  const t = transporter();

  try {
    // ===== Bevestiging naar de afzender =====
    await t.sendMail({
      from,
      to: email,
      replyTo: 'info@link2leads.nl',
      subject: isScan ? `Je marktscan is aangevraagd - Link2Leads ${ref}` : `Je vraag is binnen - Link2Leads ${ref}`,
      text: [
        `Hoi ${name},`,
        ``,
        `Je bericht is binnen. Ik lees het zelf en antwoord binnen een werkdag.`,
        ``,
        question ? `Je vraag:\n${question}` : '',
        ``,
        `Wil je liever meteen doorpraten, plan dan de gratis fitcheck via ${BOOK_URL}. Dat hoeft niet.`,
        `Het meeste staat trouwens al op papier: ${KENNIS_URL}`,
        ``,
        `Groet,`,
        `${SIGNER} · Link2Leads`,
        `info@link2leads.nl · 085 080 5381`,
        ``,
        `Ref ${ref}`
      ].filter(Boolean).join('\n'),
      html: M.shell({
        title: 'Je vraag is binnen',
        badge: 'Contact',
        footerNote: 'Je ontvangt deze mail omdat je het contactformulier op link2leads.nl hebt ingevuld.',
        preheader: 'Je bericht is binnen. Antwoord volgt binnen een werkdag.',
        ref,
        body: [
          M.h1(isScan ? 'Je marktscan is aangevraagd' : `Hoi ${esc(name)}, je vraag is binnen`),
          M.p(isScan
            ? 'We rekenen uit hoeveel bedrijven er in je doelgroep passen, hoeveel beslissers daarvan bereikbaar zijn en welk volume daarbij realistisch is. Je krijgt het binnen een werkdag, met een eerlijk oordeel of koude e-mail bij je markt past.'
            : 'Ik lees hem zelf en je hoort binnen een werkdag van me. Geen automatische reeks en geen verkoopmail, gewoon antwoord op wat je vraagt.'),
          question ? M.answerTable({ [isScan ? 'Je doelgroep' : 'Je vraag']: question }) : '',
          '<div style="height:22px"></div>',
          nextBlock(),
          '<div style="height:22px"></div>',
          M.signoff('')
        ].join('')
      })
    });

    // ===== Notificatie naar ons =====
    await t.sendMail({
      from,
      to: notify,
      replyTo: email,
      subject: `${isScan ? 'MARKTSCAN' : 'Contactformulier'} - ${name}${company ? ' (' + company + ')' : ''} - ${ref}`,
      text: [
        `Naam: ${name}`,
        `E-mail: ${email}`,
        company ? `Bedrijf: ${company}` : '',
        ``,
        `Vraag:`,
        question || '(geen vraag ingevuld)',
        ``,
        `Ref ${ref}`
      ].filter(Boolean).join('\n'),
      html: M.shell({
        title: 'Nieuw contactformulier',
        badge: 'Contactformulier',
        footerNote: 'Interne notificatie.',
        preheader: `${name}${company ? ' — ' + company : ''}`,
        ref,
        body: [
          M.h1('Nieuw contactformulier'),
          M.detailTable([
            ['Naam', name],
            ['E-mail', { raw: `<a href="mailto:${M.escAttr(email)}" style="color:${M.C.accent2};">${esc(email)}</a>` }],
            ['Bedrijf', company || ''],
          ]),
          '<div style="height:18px"></div>',
          M.answerTable({ 'Vraag': question || '(geen vraag ingevuld)' })
        ].join('')
      })
    });

    return res.status(200).json({ ok: true, ref });
  } catch (err) {
    console.error('contact.js', err);
    return res.status(500).json({ error: 'Versturen is niet gelukt. Mail ons direct op info@link2leads.nl.' });
  }
};
