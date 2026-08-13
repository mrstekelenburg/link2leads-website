const nodemailer = require('nodemailer');

const M = require('./_mail');
const { esc, SIGNER } = M;

const BOOK_URL = 'https://link2leads.nl/book';

function transporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: Number(process.env.MAIL_PORT || 465) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

// Blok "Wat er nu gebeurt", zelfde stijl als het voorbereidingsblok in de boekingsmail.
function nextBlock() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${M.C.panel};border:1px solid ${M.C.border2};border-radius:14px;">
    <tr><td style="padding:24px 22px;">
      ${M.label('Wat er nu gebeurt')}
      <p style="margin:0 0 20px;font-family:${M.FONT};font-size:14px;line-height:1.65;color:${M.C.muted};">
        Staat je gesprek al in de agenda? Dan hoef je verder niets te doen, ik kom voorbereid met een voorstel voor de aanpak.
        Is er nog geen moment geprikt, kies er dan hieronder een.
        <br><br>
        Daarna volgen de overeenkomst en de factuur. Wij starten met domeinen, mailboxen en opwarming zodra die getekend en voldaan zijn, en binnen veertien dagen daarna draait je campagne. Is dat al geregeld, dan gaan we direct aan de slag.
      </p>
      ${M.button(BOOK_URL, 'Gesprek inplannen')}
    </td></tr>
  </table>`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, company, answers } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Naam en e-mail zijn verplicht' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email))) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.' });
  }

  const ref = 'L2L-' + Math.floor(100000 + Math.random() * 900000);
  const notify = process.env.NOTIFY_EMAIL || 'demi@link2leads.nl';
  const from = `"Link2Leads" <${process.env.MAIL_FROM || 'info@link2leads.nl'}>`;
  const t = transporter();

  try {
    // ===== Naar de klant =====
    await t.sendMail({
      from, to: email,
      subject: `Je vragenlijst is binnen — Link2Leads ${ref}`,
      text: [
        `Hoi ${name},`,
        ``,
        `Je antwoorden zijn binnen. Hieronder een kopie voor je eigen administratie.`,
        `Ik neem ze door en gebruik ze als basis voor het strategiegesprek, zodat we die tijd aan de aanpak besteden in plaats van aan uitvragen.`,
        ``,
        Object.entries(answers || {}).filter(e => e[1]).map(e => `${e[0]}:\n${e[1]}`).join('\n\n'),
        ``,
        `Staat je gesprek al in de agenda? Dan hoef je verder niets te doen. Is er nog geen moment geprikt, kies er dan een via ${BOOK_URL}.`,
        ``,
        `Daarna volgen de overeenkomst en de factuur. Wij starten met domeinen, mailboxen en opwarming zodra die getekend en voldaan zijn, en binnen veertien dagen daarna draait je campagne. Is dat al geregeld, dan gaan we direct aan de slag.`,
        ``,
        `Bedankt en tot snel.`,
        `${SIGNER} · Link2Leads`,
        `${M.SITE}`,
        ``,
        `Ref ${ref}`
      ].join('\n'),
      html: M.shell({
        title: 'Je vragenlijst is binnen',
        badge: 'Vragenlijst',
        footerNote: 'Je ontvangt deze mail omdat je de vragenlijst van Link2Leads hebt ingevuld.',
        preheader: 'Je antwoorden zijn binnen. Hier een kopie voor je administratie.',
        ref,
        body: [
          M.h1(`Bedankt, ${esc(name)}`),
          M.p(`Je antwoorden zijn binnen. Hieronder een kopie voor je eigen administratie. Ik neem ze door en gebruik ze als basis voor het strategiegesprek, zodat we die tijd aan de aanpak besteden in plaats van aan uitvragen.`, { gap: 24 }),
          M.answerTable(answers || {}),
          `<div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>`,
          nextBlock(),
          `<div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>`,
          M.signoff()
        ].join('')
      })
    });

    // ===== Naar Demi =====
    await t.sendMail({
      from, to: notify, replyTo: email,
      subject: `Volledige vragenlijst ingevuld — ${name}${company ? ' (' + company + ')' : ''} · ${ref}`,
      html: M.shell({
        title: 'Volledige vragenlijst ingevuld',
        badge: 'Intern',
        preheader: `${name}${company ? ' · ' + company : ''} vulde de volledige vragenlijst in`,
        ref,
        body: [
          M.h1(`${esc(name)} vulde de volledige vragenlijst in`),
          M.p(`Binnengekomen via de vragenlijst op link2leads.nl/klant.`, { gap: 24 }),
          M.label('Contactgegevens'),
          M.detailTable([
            ['Naam', name],
            ['E-mail', email],
            ['Bedrijf', company]
          ]),
          `<div style="height:26px;line-height:26px;font-size:0;">&nbsp;</div>`,
          M.label('Antwoorden'),
          M.answerTable(answers || {})
        ].join('')
      })
    });

    return res.status(200).json({ success: true, ref });
  } catch (err) {
    console.error('Mail error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
