/* Microsoft Graph — maakt de afspraak aan in de Outlook-agenda van Link2Leads
   en laat Outlook zelf de uitnodiging naar de prospect sturen (incl. Teams-link).

   Benodigde omgevingsvariabelen in Vercel:
     MS_TENANT_ID        - de tenant-id uit Entra
     MS_CLIENT_ID        - de app-id (client-id) van de app-registratie
     MS_CLIENT_SECRET    - het geheim van die app-registratie
     MS_CALENDAR_USER    - het postvak waarin de afspraak komt (bijv. demi@link2leads.nl)
     MS_EXTRA_ATTENDEES  - optioneel, komma-gescheiden extra deelnemers (bijv. anneroos@link2leads.nl)

   Ontbreekt een van de eerste vier, dan doet deze module niets en valt
   api/book.js automatisch terug op het meesturen van een .ics-bestand. */

const GRAPH = 'https://graph.microsoft.com/v1.0';

function configured() {
  return !!(process.env.MS_TENANT_ID && process.env.MS_CLIENT_ID &&
            process.env.MS_CLIENT_SECRET && process.env.MS_CALENDAR_USER);
}

async function token() {
  const url = `https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: process.env.MS_CLIENT_ID,
    client_secret: process.env.MS_CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials'
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Token mislukt (' + res.status + '): ' + txt.slice(0, 300));
  }
  const data = await res.json();
  return data.access_token;
}

function pad(n) { return String(n).padStart(2, '0'); }

/* Zet 'JJJJ-MM-DD' + 'UU:MM' + duur om naar het formaat dat Graph verwacht. */
function window_(dateKey, time, minutes) {
  const h = +time.slice(0, 2), mi = +time.slice(3, 5);
  const endTotal = h * 60 + mi + minutes;
  return {
    start: `${dateKey}T${pad(h)}:${pad(mi)}:00`,
    end: `${dateKey}T${pad(Math.floor(endTotal / 60))}:${pad(endTotal % 60)}:00`
  };
}

/* Maakt de afspraak aan. Geeft { joinUrl, webLink, id } terug bij succes,
   of null als er geen configuratie is. Gooit een fout als Graph weigert. */
async function createEvent(opts) {
  if (!configured()) return null;

  const dk = String(opts.dateKey || '');
  const tm = String(opts.time || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dk) || !/^\d{2}:\d{2}$/.test(tm)) {
    throw new Error('Ongeldige datum of tijd voor de agenda-afspraak');
  }

  const w = window_(dk, tm, opts.minutes || 30);
  const user = encodeURIComponent(process.env.MS_CALENDAR_USER);

  const attendees = [{
    emailAddress: { address: opts.email, name: opts.name || opts.email },
    type: 'required'
  }];

  (process.env.MS_EXTRA_ATTENDEES || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .forEach(a => attendees.push({ emailAddress: { address: a }, type: 'required' }));

  const body = {
    subject: 'Strategiecall Link2Leads' + (opts.companyName ? ' x ' + opts.companyName : ''),
    body: {
      contentType: 'HTML',
      content:
        `<p>Strategiecall van ${opts.minutes || 30} minuten met Link2Leads.</p>` +
        (opts.companyName ? `<p>Bedrijf: ${opts.companyName}</p>` : '') +
        (opts.phone ? `<p>Telefoon: ${opts.phone}</p>` : '') +
        `<p>Boekingsnummer: ${opts.ref || '-'}</p>`
    },
    start: { dateTime: w.start, timeZone: 'W. Europe Standard Time' },
    end: { dateTime: w.end, timeZone: 'W. Europe Standard Time' },
    attendees,
    isOnlineMeeting: true,
    onlineMeetingProvider: 'teamsForBusiness',
    allowNewTimeProposals: true,
    reminderMinutesBeforeStart: 15,
    transactionId: String(opts.ref || Date.now())
  };

  const res = await fetch(`${GRAPH}/users/${user}/events`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + (await token()),
      'Content-Type': 'application/json',
      Prefer: 'outlook.timezone="W. Europe Standard Time"'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error('Agenda-afspraak mislukt (' + res.status + '): ' + txt.slice(0, 400));
  }

  const ev = await res.json();
  return {
    id: ev.id,
    webLink: ev.webLink,
    joinUrl: (ev.onlineMeeting && ev.onlineMeeting.joinUrl) || null
  };
}

module.exports = { configured, createEvent };
