// Mollie belt dit adres zodra de status van een betaling verandert.
// Mollie stuurt alleen een id mee, dus de status wordt hier opgehaald bij Mollie zelf.
// Alleen bij status "paid" gaat er mail uit: naar jou met de order, naar de koper als bevestiging.

const nodemailer = require('nodemailer');

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
    const from = `"Link2Leads" <${process.env.MAIL_FROM || 'info@link2leads.nl'}>`;
    const notify = process.env.NOTIFY_EMAIL || 'demi@link2leads.nl';
    const t = transporter();

    await t.sendMail({
      from,
      to: notify,
      subject: `BETAALD ${p.amount.value} euro - leadbestand ${m.aantal} leads - ${m.ref || id}`,
      text: [
        `Er is betaald. Bouwen en binnen een werkdag leveren.`,
        ``,
        `Bedrag: ${p.amount.value} euro inclusief btw (${m.excl_btw} exclusief)`,
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
        subject: `Betaling ontvangen, je leadbestand wordt gebouwd - ${m.ref || ''}`,
        text: [
          `Hoi ${m.naam || ''},`,
          ``,
          `Je betaling van ${p.amount.value} euro is binnen. Dank je.`,
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
