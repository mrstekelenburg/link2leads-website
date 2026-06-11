const nodemailer = require('nodemailer');

const ACCENT = '#2F6FED';

function transporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: Number(process.env.MAIL_PORT || 465) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

function wrap(title, inner, ref) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f5f7;padding:32px 16px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="padding:22px 28px;border-bottom:1px solid #e5e7eb;">
        <span style="font-size:18px;font-weight:800;color:#111;">Link<span style="color:${ACCENT};">2</span>Leads</span>
      </div>
      <div style="padding:28px;">
        <h2 style="margin:0 0 16px;font-size:19px;color:#111;">${title}</h2>
        ${inner}
        ${ref ? `<p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">Referentienummer: ${ref}</p>` : ''}
      </div>
    </div>
  </div>`;
}

function rows(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v)
    .map(([k, v]) => `
      <tr>
        <td style="padding:9px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f3f4f6;vertical-align:top;white-space:nowrap;">${esc(k)}</td>
        <td style="padding:9px 12px;font-size:13px;color:#111;border-bottom:1px solid #f3f4f6;vertical-align:top;">${esc(v)}</td>
      </tr>`).join('');
}

function table(obj) {
  return `<table style="width:100%;border-collapse:collapse;border:1px solid #f3f4f6;border-radius:8px;">${rows(obj)}</table>`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const b = req.body || {};
  const notify = process.env.NOTIFY_EMAIL || b.notifyEmail || 'demi@link2leads.nl';
  const from = `"Link2Leads" <${process.env.MAIL_USER}>`;
  const t = transporter();

  try {
    if (b.type === 'answers') {
      // ===== Mail 2: ingevulde vragenlijst =====
      const ref = b.ref || '';
      const contact = { Naam: b.name, 'E-mail': b.email, Bedrijf: b.companyName, Telefoon: b.phone, Afspraak: `${b.date} om ${b.time}` };

      // Naar Demi
      await t.sendMail({
        from, to: notify, replyTo: b.email,
        subject: `Vragenlijst ingevuld — ${b.name}${b.companyName ? ' (' + b.companyName + ')' : ''} ${ref}`,
        html: wrap('Vragenlijst ingevuld',
          `<p style="font-size:14px;color:#374151;margin:0 0 18px;">${esc(b.name)}${b.companyName ? ' van ' + esc(b.companyName) : ''} heeft de vragenlijst ingevuld.</p>
           <h3 style="font-size:14px;color:#111;margin:0 0 8px;">Contactgegevens</h3>${table(contact)}
           <h3 style="font-size:14px;color:#111;margin:20px 0 8px;">Ingevulde vragenlijst</h3>${table(b.answers || {})}`, ref)
      });

      // Naar de klant (kopie)
      await t.sendMail({
        from, to: b.email,
        subject: `Kopie van je antwoorden — Link2Leads ${ref}`,
        html: wrap(`Bedankt, ${esc(b.name)}!`,
          `<p style="font-size:14px;color:#374151;margin:0 0 18px;">Je antwoorden zijn ontvangen. Hieronder een kopie voor je eigen administratie. We bereiden hiermee het gesprek van <strong>${esc(b.date)} om ${esc(b.time)}</strong> voor.</p>
           ${table(b.answers || {})}`, ref)
      });

      return res.status(200).json({ success: true });
    }

    // ===== Mail 1: boekingsbevestiging =====
    const ref = 'L2L-' + Math.floor(100000 + Math.random() * 900000);
    const details = { Naam: b.name, 'E-mail': b.email, Bedrijf: b.companyName, Telefoon: b.phone, Datum: b.date, Tijd: `${b.time} (CET) · 30 minuten` };

    // Naar Demi
    await t.sendMail({
      from, to: notify, replyTo: b.email,
      subject: `Nieuwe boeking — ${b.name}${b.companyName ? ' (' + b.companyName + ')' : ''} · ${b.date} ${b.time}`,
      html: wrap('Nieuwe strategiecall geboekt',
        `<p style="font-size:14px;color:#374151;margin:0 0 18px;">${esc(b.name)} heeft een strategiecall geboekt. De vragenlijst volgt in een aparte mail zodra die is ingevuld.</p>
         ${table(details)}`, ref)
    });

    // Naar de klant
    await t.sendMail({
      from, to: b.email,
      subject: `Je strategiecall is bevestigd — ${b.date} om ${b.time}`,
      html: wrap('Je afspraak is bevestigd!',
        `<p style="font-size:14px;color:#374151;margin:0 0 18px;">Hoi ${esc(b.name)}, je strategiecall met Link2Leads staat ingepland. Je ontvangt de meeting-link uiterlijk een dag van tevoren.</p>
         ${table({ Datum: b.date, Tijd: `${b.time} (CET) · 30 minuten`, Format: 'Web conferencing' })}`, ref)
    });

    return res.status(200).json({ success: true, ref });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false });
  }
};
