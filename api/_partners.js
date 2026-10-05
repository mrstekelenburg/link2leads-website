// Partners die Link2Leads doorverkopen. De code staat in hun link:
// link2leads.nl/?ref=<code> of link2leads.nl/book?ref=<code>
// Nieuwe partner: een regel toevoegen. Code alleen kleine letters, cijfers en streepjes.
const PARTNERS = {
  voorbeeld: { naam: 'VOORBEELD', commissie: '10% recurring' }
};

function cleanCode(raw) {
  const c = String(raw || '').toLowerCase().trim();
  return /^[a-z0-9-]{1,40}$/.test(c) ? c : '';
}

// Geeft { code, naam, commissie, bekend } terug, of null als er geen code is.
function partnerFor(raw) {
  const code = cleanCode(raw);
  if (!code) return null;
  const p = PARTNERS[code];
  return p
    ? { code, naam: p.naam, commissie: p.commissie, bekend: true }
    : { code, naam: code, commissie: '', bekend: false };
}

module.exports = { PARTNERS, partnerFor, cleanCode };
