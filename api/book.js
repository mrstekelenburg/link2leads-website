const nodemailer = require('nodemailer');
const graph = require('./_graph');

const M = require('./_mail');
const { esc, weekdayOf, KLANT_URL, SIGNER } = M;

function transporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 465),
    secure: Number(process.env.MAIL_PORT || 465) === 465,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

function pad(n) { return String(n).padStart(2, '0'); }

// Bouwt een agenda-uitnodiging (.ics) voor Europe/Amsterdam.
// dateKey = 'JJJJ-MM-DD', time = 'UU:MM', duur in minuten.
function buildIcs(opts) {
  var dk = String(opts.dateKey || '');
  var tm = String(opts.time || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dk) || !/^\d{2}:\d{2}$/.test(tm)) return null;

  var y = +dk.slice(0, 4), mo = +dk.slice(5, 7), d = +dk.slice(8, 10);
  var h = +tm.slice(0, 2), mi = +tm.slice(3, 5);

  var startLocal = y + pad(mo) + pad(d) + 'T' + pad(h) + pad(mi) + '00';
  var endMin = h * 60 + mi + (opts.minutes || 30);
  var endLocal = y + pad(mo) + pad(d) + 'T' + pad(Math.floor(endMin / 60)) + pad(endMin % 60) + '00';

  var stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  var uid = (opts.ref || 'l2l') + '-' + Date.now() + '@link2leads.nl';

  function esc(t) {
    return String(t || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Link2Leads//Booking//NL',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Amsterdam',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + stamp,
    'DTSTART;TZID=Europe/Amsterdam:' + startLocal,
    'DTEND;TZID=Europe/Amsterdam:' + endLocal,
    'SUMMARY:' + esc('Strategiecall Link2Leads' + (opts.companyName ? ' x ' + opts.companyName : '')),
    'DESCRIPTION:' + esc('Strategiecall van 30 minuten met Link2Leads.\nJe ontvangt de meeting-link uiterlijk een dag van tevoren.\n\nBoekingsnummer: ' + (opts.ref || '')),
    'LOCATION:' + esc('Online (link volgt per mail)'),
    'ORGANIZER;CN=Link2Leads:mailto:' + (opts.organizer || 'demi@link2leads.nl'),
    'ATTENDEE;CN=' + esc(opts.name || '') + ';RSVP=TRUE:mailto:' + (opts.email || ''),
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Strategiecall Link2Leads over 15 minuten',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Morgen je strategiecall met Link2Leads',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const b = req.body || {};
  const notify = process.env.NOTIFY_EMAIL || b.notifyEmail || 'demi@link2leads.nl';
  const from = `"Link2Leads" <${process.env.MAIL_FROM || 'info@link2leads.nl'}>`;
  const t = transporter();

  try {
    if (b.type === 'answers' || b.stage === 'answers') {
      // ===== Mail 2: ingevulde vragenlijst =====
      const ref = b.ref || '';
      const wd = weekdayOf(b.date);

      // Naar Demi
      await t.sendMail({
        from, to: notify, replyTo: b.email,
        subject: `Vragenlijst ingevuld — ${b.name}${b.companyName ? ' (' + b.companyName + ')' : ''} ${ref}`,
        html: M.shell({
          title: 'Vragenlijst ingevuld',
          badge: 'Intern',
          preheader: `${b.name} heeft de vragenlijst ingevuld`,
          ref,
          body: [
            M.h1(`${esc(b.name)} vulde de vragenlijst in`),
            M.p(`Afspraak staat op <strong style="color:${M.C.text};">${esc(b.date)} om ${esc(b.time)}</strong>.`),
            M.label('Contactgegevens'),
            M.detailTable([
              ['Naam', b.name],
              ['E-mail', b.email],
              ['Bedrijf', b.companyName],
              ['Telefoon', b.phone]
            ]),
            `<div style="height:26px;line-height:26px;font-size:0;">&nbsp;</div>`,
            M.label('Antwoorden'),
            M.answerTable(b.answers || {})
          ].join('')
        })
      });

      // Naar de klant (kopie)
      await t.sendMail({
        from, to: b.email,
        subject: `Kopie van je antwoorden — Link2Leads ${ref}`,
        text: [
          `Hoi ${b.name},`,
          ``,
          `Je antwoorden zijn binnen. Hieronder een kopie voor je eigen administratie.`,
          `We bereiden hiermee het gesprek van ${b.date} om ${b.time} voor.`,
          ``,
          Object.entries(b.answers || {}).filter(e => e[1]).map(e => `${e[0]}:\n${e[1]}`).join('\n\n'),
          ``,
          `Rond de onboarding eventueel af via ${KLANT_URL}. Dan weet ik wat je aanbod en doelgroep zijn en kan ik ${wd || 'tijdens de call'} direct met een strategie komen in plaats van eerst alles uit te vragen. Niet verplicht, wel makkelijk.`,
          ``,
          `Bedankt en tot ${wd || 'snel'}.`,
          `${SIGNER} · Link2Leads`,
          `${M.SITE}`
        ].join('\n'),
        html: M.shell({
          title: 'Kopie van je antwoorden',
          badge: 'Strategiecall',
          preheader: 'Je antwoorden zijn binnen. Hier een kopie voor je administratie.',
          ref,
          body: [
            M.h1(`Bedankt, ${esc(b.name)}`),
            M.p(`Je antwoorden zijn binnen. Hieronder een kopie voor je eigen administratie. We bereiden hiermee het gesprek van <strong style="color:${M.C.text};">${esc(b.date)} om ${esc(b.time)}</strong> voor.`, { gap: 24 }),
            M.answerTable(b.answers || {}),
            `<div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>`,
            M.prepBlock(b.date, 'full'),
            `<div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>`,
            M.signoff(b.date)
          ].join('')
        })
      });

      return res.status(200).json({ success: true });
    }

    // ===== Mail 1: boekingsbevestiging =====
    const ref = 'L2L-' + Math.floor(100000 + Math.random() * 900000);
    const wd = weekdayOf(b.date);

    // Laatste controle: is het tijdslot ondertussen niet volgeboekt?
    try {
      if (graph.configured() && b.dateKey && b.time) {
        const vrij = await graph.isFree(b.dateKey, b.time, 30);
        if (!vrij) {
          return res.status(409).json({ success: false, reason: 'slot_taken' });
        }
      }
    } catch (err) {
      console.error('Beschikbaarheidscheck:', err.message);
    }

    // Eerst proberen we de afspraak echt in de Outlook-agenda te zetten.
    // Lukt dat, dan verstuurt Outlook zelf de uitnodiging met Teams-link en
    // hoeft er geen .ics mee. Lukt het niet, dan valt hij terug op de .ics.
    let calendar = null, calendarError = null;
    try {
      calendar = await graph.createEvent({
        dateKey: b.dateKey, time: b.time, minutes: 30, ref,
        name: b.name, email: b.email, companyName: b.companyName, phone: b.phone
      });
    } catch (err) {
      calendarError = err.message;
      console.error('Graph:', err.message);
    }

    const ics = calendar ? null : buildIcs({
      dateKey: b.dateKey, time: b.time, minutes: 30, ref,
      name: b.name, email: b.email, companyName: b.companyName, organizer: notify
    });
    const icsAttach = ics ? [{ filename: 'strategiecall-link2leads.ics', content: ics, contentType: 'text/calendar; charset=utf-8; method=REQUEST' }] : [];
    const icsAlt = ics ? [{ contentType: 'text/calendar; charset=utf-8; method=REQUEST', content: ics }] : [];

    // Naar Demi
    await t.sendMail({
      from, to: notify, replyTo: b.email,
      attachments: icsAttach,
      subject: `Nieuwe boeking — ${b.name}${b.companyName ? ' (' + b.companyName + ')' : ''} · ${b.date} ${b.time}`,
      html: M.shell({
        title: 'Nieuwe strategiecall geboekt',
        badge: 'Intern',
        preheader: `${b.name} · ${b.date} om ${b.time}`,
        ref,
        body: [
          M.h1('Nieuwe strategiecall geboekt'),
          M.p(`${esc(b.name)} heeft een strategiecall geboekt. De vragenlijst volgt in een aparte mail zodra die is ingevuld.`, { gap: 24 }),
          M.detailTable([
            ['Naam', b.name],
            ['E-mail', b.email],
            ['Bedrijf', b.companyName],
            ['Telefoon', b.phone],
            ['Datum', b.date],
            ['Tijd', `${b.time} (CET) · 30 minuten`]
          ]),
          `<div style="height:20px;line-height:20px;font-size:0;">&nbsp;</div>`,
          calendar
            ? M.p(`De afspraak staat in de agenda en de uitnodiging is vanuit Outlook verstuurd.${calendar.joinUrl ? ` <a href="${M.escAttr(calendar.joinUrl)}" style="color:${M.C.accent2};">Teams-link</a>` : ''}`, { color: M.C.green, gap: 0 })
            : M.p(`Let op: de afspraak kon niet in de agenda gezet worden${calendarError ? ' (' + esc(calendarError) + ')' : ''}. Zet hem handmatig in je agenda.`, { color: M.C.amber, gap: 0 })
        ].join('')
      })
    });

    // Naar de klant
    await t.sendMail({
      from, to: b.email,
      attachments: icsAttach,
      alternatives: icsAlt,
      subject: `Je strategiecall staat — ${b.date} om ${b.time}`,
      text: [
        `Hoi ${b.name},`,
        ``,
        `Je strategiecall met Link2Leads staat ingepland.`,
        calendar ? `Je krijgt zo een agenda-uitnodiging met de deelnamelink.` : `Je ontvangt de meeting-link uiterlijk een dag van tevoren.`,
        ``,
        `Datum: ${b.date}`,
        `Tijd: ${b.time} (CET) · 30 minuten`,
        calendar && calendar.joinUrl ? `Deelnemen: ${calendar.joinUrl}` : `Format: online, link volgt`,
        ``,
        `Handig als je vooraf even je gegevens achterlaat via ${KLANT_URL}. Dan weet ik wat je aanbod en doelgroep zijn en kan ik ${wd || 'tijdens de call'} direct met een strategie komen in plaats van eerst alles uit te vragen. Niet verplicht, wel makkelijk.`,
        ``,
        `Bedankt en tot ${wd || 'snel'}.`,
        `${SIGNER} · Link2Leads`,
        `${M.SITE}`,
        ``,
        `Ref ${ref}`
      ].join('\n'),
      html: M.shell({
        title: 'Je afspraak is bevestigd',
        badge: 'Strategiecall',
        preheader: `${b.date} om ${b.time} · 30 minuten`,
        ref,
        body: [
          M.h1(`Je afspraak staat, ${esc(b.name)}`),
          M.p(`Je strategiecall met Link2Leads is ingepland.${calendar ? ' Je krijgt zo een agenda-uitnodiging met de deelnamelink.' : ' Je ontvangt de meeting-link uiterlijk een dag van tevoren.'}`, { gap: 24 }),
          M.detailTable([
            ['Datum', b.date],
            ['Tijd', `${b.time} (CET)`],
            ['Duur', '30 minuten'],
            calendar && calendar.joinUrl
              ? ['Deelnemen', { raw: `<a href="${M.escAttr(calendar.joinUrl)}" style="color:${M.C.accent2};text-decoration:none;font-weight:700;">Deelnemen aan de call</a>` }]
              : ['Format', 'Online · link volgt per mail']
          ]),
          `<div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>`,
          M.prepBlock(b.date),
          `<div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>`,
          M.signoff(b.date)
        ].join('')
      })
    });

    return res.status(200).json({ success: true, ref });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false });
  }
};
