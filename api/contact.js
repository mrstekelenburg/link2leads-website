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

// Gratis mailproviders: hierop leveren we geen sample, want dan is eenmalig per bedrijf niets waard.
const GRATIS_MAIL = new Set(['gmail.com','googlemail.com','hotmail.com','hotmail.nl','hotmail.be','outlook.com','outlook.nl','live.nl','live.com','icloud.com','me.com','yahoo.com','yahoo.co.uk','ziggo.nl','kpnmail.nl','planet.nl','telfort.nl','upcmail.nl','casema.nl','home.nl','xs4all.nl','proton.me','protonmail.com','gmx.com','mail.com','aol.com']);

// Welke domeinen al een sample hebben gehad. Dit leeft per serverinstantie,
// dus het vangt de herhalingen op; het echte logboek is de notificatiemail.
const SAMPLES = new Set();
function tooMany(ip) {
  const now = Date.now();
  const win = 10 * 60 * 1000;
  const list = (HITS.get(ip) || []).filter(t => now - t < win);
  list.push(now);
  HITS.set(ip, list);
  if (HITS.size > 500) HITS.clear();
  return list.length > 5;
}

// Teksten per soort aanvraag. Zelfde woorden in onderwerp, kop, tekst- en HTML-versie.
const KIND = {
  vraag: {
    subject: 'Je vraag is binnen',
    h1: (name) => `Hoi ${esc(name)}, je vraag is binnen`,
    intro: 'Ik lees hem zelf en je hoort binnen een werkdag van me. Geen automatische reeks en geen verkoopmail, gewoon antwoord op wat je vraagt.',
    label: 'Je vraag',
    next: 'Ik lees je vraag zelf en antwoord binnen een werkdag, met een concreet antwoord in plaats van een uitnodiging voor een gesprek. Wil je liever meteen doorpraten, plan dan hieronder de gratis fitcheck. Dat hoeft niet.',
    footer: 'Je ontvangt deze mail omdat je het contactformulier op link2leads.nl hebt ingevuld.'
  },
  marktscan: {
    subject: 'Je marktscan is aangevraagd',
    h1: () => 'Je marktscan is aangevraagd',
    intro: 'We rekenen uit hoeveel bedrijven er in je doelgroep passen, hoeveel beslissers daarvan bereikbaar zijn en welk volume daarbij realistisch is. Je krijgt het binnen een werkdag, met een eerlijk oordeel of koude e-mail bij je markt past.',
    label: 'Je doelgroep',
    next: 'De marktscan komt binnen een werkdag in je mailbox. Wil je de uitkomst direct doorpraten, plan dan hieronder de gratis fitcheck. Dat hoeft niet.',
    footer: 'Je ontvangt deze mail omdat je de gratis marktscan op link2leads.nl hebt aangevraagd.'
  },
  sample: {
    subject: 'Je 10 gratis leads zijn aangevraagd',
    h1: () => 'Je 10 gratis leads zijn aangevraagd',
    intro: 'We zoeken tien bedrijven uit je doelgroep, met beslisser en geverifieerd zakelijk e-mailadres, en sturen ze binnen een werkdag naar dit adres. Zo zie je zelf wat je van ons krijgt voordat je een grotere lijst bestelt. Eenmalig per bedrijf.',
    label: 'Je doelgroep',
    next: 'De tien leads komen binnen een werkdag in je mailbox. Wil je meteen een grotere lijst of een campagne bespreken, plan dan hieronder de gratis fitcheck. Dat hoeft niet.',
    footer: 'Je ontvangt deze mail omdat je 10 gratis leads op link2leads.nl hebt aangevraagd.'
  },
  leads: {
    subject: 'Je leadaanvraag is binnen',
    h1: (name) => `Hoi ${esc(name)}, je leadaanvraag is binnen`,
    intro: 'We tellen eerst hoeveel bedrijven er in je selectie passen en sturen je binnen een werkdag die telling met de prijs erbij. Pas als je daarmee akkoord gaat, bouwen we de lijst. Je zit nergens aan vast voordat je ja zegt.',
    label: 'Je aanvraag',
    next: 'De telling met prijs komt binnen een werkdag in je mailbox. Wil je de doelgroep liever eerst doorpraten, plan dan hieronder de gratis fitcheck. Dat hoeft niet.',
    footer: 'Je ontvangt deze mail omdat je een leadaanvraag op link2leads.nl hebt gedaan.'
  }
};

function nextBlock(k) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${M.C.panel};border:1px solid ${M.C.border2};border-radius:14px;">
    <tr><td style="padding:24px 22px;">
      ${M.label('Wat er nu gebeurt')}
      <p style="margin:0 0 20px;font-family:${M.FONT};font-size:14px;line-height:1.65;color:${M.C.muted};">
        ${esc(k.next)}
        <br><br>
        Ondertussen staat het meeste al op papier: prijzen, wat wel en niet als positieve reactie telt, en wat onze campagnes werkelijk opleveren. Je vindt het in de <a href="${KENNIS_URL}" style="color:${M.C.accent2};">kennisbank</a>.
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
  const isLeads = type === 'leads';
  const isSample = type === 'sample';

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

  // De gratis sample is eenmalig per bedrijf, dus alleen zakelijke adressen.
  if (isSample) {
    const dom = String(email).toLowerCase().split('@')[1] || '';
    if (GRATIS_MAIL.has(dom)) {
      return res.status(400).json({ error: 'Gebruik je zakelijke e-mailadres, bijvoorbeeld naam@bedrijf.nl. De sample is eenmalig per bedrijf.' });
    }
    if (SAMPLES.has(dom)) {
      return res.status(429).json({ error: 'Voor dit bedrijf is de sample al aangevraagd. Mail info@link2leads.nl als je iets anders nodig hebt.' });
    }
    SAMPLES.add(dom);
    if (SAMPLES.size > 2000) SAMPLES.clear();
  }

  const k = KIND[isScan ? 'marktscan' : isSample ? 'sample' : isLeads ? 'leads' : 'vraag'];

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
      subject: `${k.subject} — Link2Leads ${ref}`,
      text: [
        (isScan || isSample) ? `Hoi,` : `Hoi ${name},`,
        ``,
        k.intro,
        ``,
        question ? `${k.label}:\n${question}` : '',
        ``,
        k.next.replace('hieronder de gratis fitcheck', `de gratis fitcheck via ${BOOK_URL}`),
        `Het meeste staat trouwens al op papier: ${KENNIS_URL}`,
        ``,
        `Groet,`,
        `${SIGNER} · Link2Leads`,
        `info@link2leads.nl · 085 080 5381`,
        ``,
        `Ref ${ref}`
      ].filter(Boolean).join('\n'),
      html: M.shell({
        title: k.subject,
        badge: isLeads ? 'Leads kopen' : isScan ? 'Marktscan' : isSample ? 'Gratis sample' : 'Contact',
        footerNote: k.footer,
        preheader: `${k.subject}. Je hoort binnen een werkdag van ons.`,
        ref,
        body: [
          M.h1(k.h1(name)),
          M.p(k.intro),
          question ? M.answerTable({ [k.label]: question }) : '',
          M.spacer(22),
          nextBlock(k),
          M.spacer(22),
          M.signoff('', { lead: 'Groet,' })
        ].join('')
      })
    });

    // ===== Notificatie naar ons =====
    await t.sendMail({
      from,
      to: notify,
      replyTo: email,
      subject: `${isScan ? 'MARKTSCAN' : isSample ? 'GRATIS SAMPLE' : isLeads ? 'LEADAANVRAAG' : 'Contactformulier'} - ${isScan ? email : name}${company ? ' (' + company + ')' : ''} - ${ref}`,
      text: [
        (isScan || isSample) ? '' : `Naam: ${name}`,
        `E-mail: ${email}`,
        company ? `Bedrijf: ${company}` : '',
        ``,
        (isScan || isSample) ? `Ideale klant:` : isLeads ? `Aanvraag:` : `Vraag:`,
        question || '(geen vraag ingevuld)',
        ``,
        `Ref ${ref}`
      ].filter(Boolean).join('\n'),
      html: M.shell({
        title: isLeads ? 'Nieuwe leadaanvraag' : isScan ? 'Nieuwe marktscan-aanvraag' : isSample ? 'Nieuwe sample-aanvraag' : 'Nieuw contactformulier',
        badge: isLeads ? 'Leads kopen' : isScan ? 'Marktscan' : isSample ? 'Gratis sample' : 'Contactformulier',
        footerNote: 'Interne notificatie.',
        preheader: `${name}${company ? ' — ' + company : ''}`,
        ref,
        body: [
          M.h1(isLeads ? 'Nieuwe leadaanvraag' : isScan ? 'Nieuwe marktscan-aanvraag' : isSample ? 'Nieuwe sample-aanvraag' : 'Nieuw contactformulier'),
          M.detailTable([
            // Bij de marktscan is er geen naamveld: de frontend stuurt het stuk voor de @ mee, dus die regel slaan we over.
            ['Naam', (isScan || isSample) ? '' : name],
            ['E-mail', { raw: `<a href="mailto:${M.escAttr(email)}" style="color:${M.C.accent2};">${esc(email)}</a>` }],
            ['Bedrijf', company || ''],
          ]),
          M.spacer(18),
          M.answerTable({ [isLeads ? 'Aanvraag' : (isScan || isSample) ? 'Ideale klant' : 'Vraag']: question || '(geen vraag ingevuld)' })
        ].join('')
      })
    });

    return res.status(200).json({ ok: true, ref });
  } catch (err) {
    console.error('contact.js', err);
    return res.status(500).json({ error: 'Versturen is niet gelukt. Mail ons direct op info@link2leads.nl.' });
  }
};
