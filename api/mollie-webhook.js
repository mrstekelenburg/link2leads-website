// Mollie belt dit adres zodra de status van een betaling verandert.
// Mollie stuurt alleen een id mee, dus de status wordt hier opgehaald bij Mollie zelf.
// Alleen bij status "paid" gaat er mail uit: naar jou met de order, naar de koper als bevestiging.

const nodemailer = require('nodemailer');
const M = require('./_mail');
const { esc } = M;

function transporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: Number(process.env.MAIL_PORT || 465) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

// Dubbele webhookcalls voor dezelfde betaling niet twee keer mailen.
const GEMAILD = new Set();

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const id = (req.body && req.body.id) || '';
  if (!id || !/^tr_[A-Za-z0-9]+$/.test(String(id))) return res.status(200).end();

  const key = process.env.MOLLIE_API_KEY;
  if (!key) return res.status(200).end();

  try {
    const r = await fetch('https://api.mollie.com/v2/payments/' + id, {
      headers: { 'Authorization': 'Bearer ' + key }
    });
    const p = await r.json();
    if (!r.ok || !p || p.status !== 'paid') return res.status(200).end();
    if (GEMAILD.has(id)) return res.status(200).end();
    GEMAILD.add(id);
    if (GEMAILD.size > 2000) GEMAILD.clear();

    const m = p.metadata || {};
    const bedrag = Number(p.amount.value).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const from = `"Link2Leads" <${process.env.MAIL_FROM || 'info@link2leads.nl'}>`;
    const notify = process.env.NOTIFY_EMAIL || 'demi@link2leads.nl';
    const t = transporter();

    await t.sendMail({
      from,
      to: notify,
      replyTo: m.email || undefined,
      subject: `BETAALD ${bedrag} euro - leadbestand ${m.aantal} leads - ${m.ref || id}`,
      html: M.shell({
        title: 'Leadbestand betaald',
        badge: 'Intern',
        footerNote: 'Interne notificatie.',
        preheader: `${m.naam || ''}${m.bedrijf ? ' · ' + m.bedrijf : ''} · ${m.aantal} leads`,
        ref: m.ref || id,
        body: [
          M.h1(`Betaald: ${esc(m.aantal)} leads`),
          M.p('Er is betaald. Bouwen en binnen een werkdag leveren.', { gap: 24 }),
          M.detailTable([
            ['Bedrag', `${bedrag} euro incl. btw (${m.excl_btw} excl.)`],
            ['Aantal', `${m.aantal} leads`],
            ['Verrijking', m.verrijking],
            ['Per lead', m.per_lead],
            ['Koper', `${m.naam || ''}${m.bedrijf ? ' · ' + m.bedrijf : ''}`],
            ['E-mail', m.email ? { raw: `<a href="mailto:${M.escAttr(m.email)}" style="color:${M.C.accent2};">${esc(m.email)}</a>` } : ''],
            ['Mollie', p.id]
          ]),
          M.spacer(18),
          M.answerTable({ 'Doelgroep zoals opgegeven': m.doelgroep || '' })
        ].join('')
      }),
      text: [
        `Er is betaald. Bouwen en binnen een werkdag leveren.`,
        ``,
        `Bedrag: ${bedrag} euro inclusief btw (${m.excl_btw} exclusief)`,
        `Aantal leads: ${m.aantal}`,
        `Verrijking: ${m.verrijking}`,
        `Prijs per lead: ${m.per_lead}`,
        ``,
        `Doelgroep zoals opgegeven:`,
        `${m.doelgroep}`,
        ``,
        `Koper: ${m.naam}${m.bedrijf ? ' - ' + m.bedrijf : ''}`,
        `E-mail: ${m.email}`,
        ``,
        `Mollie: ${p.id}`,
        `Referentie: ${m.ref || '-'}`
      ].join('\n')
    });

    if (m.email) {
      await t.sendMail({
        from,
        to: m.email,
        replyTo: 'info@link2leads.nl',
        subject: `Betaling ontvangen, je leadbestand wordt gebouwd — Link2Leads ${m.ref || ''}`,
        html: M.shell({
          title: 'Betaling ontvangen',
          badge: 'Leads kopen',
          footerNote: 'Je ontvangt deze mail omdat je een leadbestand bij Link2Leads hebt gekocht.',
          preheader: `Je betaling van ${bedrag} euro is binnen. We bouwen je bestand.`,
          ref: m.ref || '',
          body: [
            M.h1(`Bedankt, ${esc(m.naam || '')}`),
            M.p(`Je betaling van <strong style="color:${M.C.text};">${esc(bedrag)} euro</strong> is binnen. Wij bouwen het bestand en leveren het binnen een werkdag als Excel en CSV. De factuur volgt apart.`, { gap: 24 }),
            M.detailTable([
              ['Aantal', `${m.aantal} leads`],
              ['Verrijking', m.verrijking],
              ['Bedrag', `${bedrag} euro incl. btw`]
            ]),
            M.spacer(18),
            M.answerTable({ 'Doelgroep': m.doelgroep || '' }),
            M.spacer(),
            `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:${M.C.panel};border:1px solid ${M.C.border2};border-radius:14px;">
              <tr><td style="padding:24px 22px;">
                ${M.label('Goed om te weten')}
                <p style="margin:0;font-family:${M.FONT};font-size:14px;line-height:1.65;color:${M.C.muted};">
                  Moet de doelgroep nog scherper, antwoord dan gewoon op deze mail.
                  <br><br>
                  Blijkt de doelgroep kleiner dan het aantal dat je hebt gekocht, dan leveren we wat er is en storten we het verschil binnen vijf werkdagen terug.
                </p>
              </td></tr>
            </table>`,
            M.spacer(),
            M.signoff('', { name: 'Anne-Roos', lead: 'Groet,' })
          ].join('')
        }),
        text: [
          `Hoi ${m.naam || ''},`,
          ``,
          `Je betaling van ${bedrag} euro is binnen. Dank je.`,
          ``,
          `Wat je hebt gekocht:`,
          `- ${m.aantal} leads`,
          `- Verrijking: ${m.verrijking}`,
          `- Doelgroep: ${m.doelgroep}`,
          ``,
          `Wij bouwen het bestand en leveren het binnen een werkdag als Excel en CSV.`,
          `Moet de doelgroep nog scherper, mail dan gewoon terug op deze mail.`,
          ``,
          `Blijkt de doelgroep kleiner dan het aantal dat je hebt gekocht, dan leveren we wat er is`,
          `en storten we het verschil binnen vijf werkdagen terug.`,
          ``,
          `De factuur volgt apart.`,
          ``,
          `Anne-Roos Mol`,
          `Link2Leads`,
          `info@link2leads.nl - 085 080 5381`
        ].join('\n')
      });
    }

    return res.status(200).end();
  } catch (e) {
    console.error('mollie-webhook', e);
    return res.status(200).end();
  }
};
