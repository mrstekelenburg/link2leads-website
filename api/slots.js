const graph = require('./_graph');

/* Geeft de vrije tijdslots voor één dag terug.
   Aanroep: GET /api/slots?date=JJJJ-MM-DD
   Antwoord: { slots: ['09:00','10:30',...], live: true|false }

   live=false betekent dat de agenda niet geraadpleegd kon worden en dat
   het standaardrooster is teruggegeven. De boekingspagina blijft dan werken. */

const TZ = 'Europe/Amsterdam';

function pad(n) { return String(n).padStart(2, '0'); }

/* Het standaardrooster: ma t/m do 09:00-16:30, vr 09:00-12:30. */
function baseSlots(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  if (day === 0 || day === 6) return [];
  const endH = day === 5 ? 12.5 : 16.5;
  const out = [];
  for (let h = 9; h <= endH; h += 0.5) {
    out.push(pad(Math.floor(h)) + ':' + (h % 1 ? '30' : '00'));
  }
  return out;
}

/* Huidige datum en tijd in Amsterdam, ongeacht de serverzone. */
function nowInTz() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date()).reduce((a, p) => (a[p.type] = p.value, a), {});
  return {
    dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: (+parts.hour === 24 ? 0 : +parts.hour) * 60 + (+parts.minute)
  };
}

function toMin(hhmm) { return +hhmm.slice(0, 2) * 60 + (+hhmm.slice(3, 5)); }

/* Haalt alles op wat er in de agenda staat en filtert die tijden eruit. */
async function filterByCalendar(dateKey, slots) {
  if (!slots.length) return slots;
  const busy = await graph.getBusy(dateKey);
  if (busy === null) return slots;
  return slots.filter(t => {
    const start = toMin(t);
    return !graph.overlaps(busy, start, start + 30);
  });
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const dateKey = String((req.query && req.query.date) || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return res.status(400).json({ error: 'Ongeldige datum' });
  }

  let slots = baseSlots(dateKey);

  // Verleden en te korte termijn eruit.
  const now = nowInTz();
  const notice = Number(process.env.BOOKING_MIN_NOTICE_HOURS || 2) * 60;
  if (dateKey < now.dateKey) slots = [];
  else if (dateKey === now.dateKey) {
    slots = slots.filter(t => toMin(t) >= now.minutes + notice);
  }

  let live = false;
  try {
    if (graph.configured() && slots.length) {
      slots = await filterByCalendar(dateKey, slots);
      live = true;
    }
  } catch (err) {
    console.error('Slots:', err.message);
  }

  return res.status(200).json({ slots, live });
};
