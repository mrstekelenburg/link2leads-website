/* Welkom bij naam + confetti na boeken.
   1. Komt iemand binnen via een link met ?voor=Bedrijfsnaam (bijv. uit een campagnemail:
      https://link2leads.nl/?voor={{company_name}}), dan staat boven de kop "Hoi Bedrijfsnaam, ...".
      De naam wordt 30 dagen onthouden in deze browser en vult op /book alvast de bedrijfsnaam in.
   2. Direct na een bevestigde fitcheck op /book valt er een keer confetti (nog voor de korte vragen).
   De tekst staat in een data-attribuut, zodat het vertaalscript er niet aan komt; bij wisselen
   van taal zetten we hem zelf om. Zelfde bestand op link2leads.co. */
(function () {
  'use strict';
  if (window.__l2lWelkom) return;
  window.__l2lWelkom = 1;

  var KEY = 'l2l_voor', DAGEN = 30;
  var rust = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Naam ophalen, opschonen en onthouden ──
  function schoon(s) {
    if (!s) return '';
    s = String(s);
    if (/\{\{|\}\}|%7B/i.test(s)) return ''; // niet ingevulde merge tag
    s = s.replace(/[^\p{L}\p{N} &.'\-]/gu, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/[\s,]+(b\.?\s?v\.?|n\.?\s?v\.?|v\.?o\.?f\.?|holding|ltd\.?|llc|inc\.?|gmbh)$/i, '').trim();
    if (s.length < 2 || s.length > 50) return '';
    return s;
  }
  var naam = '';
  try {
    var q = new URLSearchParams(location.search);
    naam = schoon(q.get('voor') || q.get('bedrijf'));
    if (naam) localStorage.setItem(KEY, JSON.stringify({ n: naam, t: Date.now() }));
    else {
      var o = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (o && o.n && Date.now() - o.t < DAGEN * 864e5) naam = schoon(o.n);
    }
  } catch (e) {}

  function isEn() { return (document.documentElement.getAttribute('lang') || 'nl').toLowerCase().indexOf('en') === 0; }

  var css =
    '.l2w-pill{display:inline-flex;align-items:center;gap:8px;margin:0 auto 14px;padding:7px 14px 7px 10px;border-radius:999px;' +
    'background:rgba(47,111,237,.12);border:1px solid rgba(47,111,237,.3);color:#F0EFED;font-size:14.5px;font-weight:500;line-height:1.3;' +
    'opacity:0;transform:translateY(6px);transition:opacity .6s ease,transform .6s ease;max-width:100%}' +
    '.l2w-pill.l2w-in{opacity:1;transform:none}' +
    '.l2w-pill::after{content:attr(data-t)}' +
    '.l2w-zwaai{display:inline-block;transform-origin:70% 70%;animation:l2wZwaai 1.8s ease-in-out 1s 2}' +
    '@keyframes l2wZwaai{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(16deg)}40%,80%{transform:rotate(-8deg)}}' +
    '.l2w-wrap{text-align:center}' +
    '@media (max-width:760px){.l2w-pill{font-size:13.5px}}' +
    '@media (prefers-reduced-motion:reduce){.l2w-zwaai{animation:none}.l2w-pill{transition:none}}';

  function groet() {
    var h = document.querySelector('h1.hero-h');
    if (!naam || !h) return;
    var w = document.createElement('div'); w.className = 'l2w-wrap';
    var p = document.createElement('div'); p.className = 'l2w-pill';
    var z = document.createElement('span'); z.className = 'l2w-zwaai'; z.setAttribute('aria-hidden', 'true'); z.textContent = '👋';
    p.appendChild(z);
    function tekst() {
      p.setAttribute('data-t', isEn() ? 'Hi ' + naam + ', good to see you here' : 'Hoi ' + naam + ', fijn dat je even kijkt');
      p.setAttribute('aria-label', p.getAttribute('data-t'));
    }
    tekst();
    document.addEventListener('l2l:langchange', tekst);
    w.appendChild(p);
    h.parentNode.insertBefore(w, h);
    requestAnimationFrame(function () { requestAnimationFrame(function () { p.classList.add('l2w-in'); }); });
  }

  function vulBoeking() {
    var f = document.getElementById('fCompany');
    if (naam && f && !f.value) f.value = naam;
  }

  // ── Confetti ──
  function confetti() {
    if (rust) return;
    var c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:500';
    document.body.appendChild(c);
    var x = c.getContext('2d'), W = innerWidth, H = innerHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var kl = ['#2F6FED', '#5B8FF5', '#BFD4FF', '#F0EFED', '#FFD166', '#4ADE80'], st = [];
    var n = W < 760 ? 90 : 160;
    for (var i = 0; i < n; i++) {
      var links = i % 2 === 0, hoek = (links ? -60 : -120) * Math.PI / 180 + (Math.random() - 0.5) * 0.9, v = 9 + Math.random() * 9;
      st.push({ x: links ? 0 : W, y: H * 0.75, vx: Math.cos(hoek) * v, vy: Math.sin(hoek) * v, w: 6 + Math.random() * 6, h: 3 + Math.random() * 4,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3, k: kl[i % kl.length] });
    }
    var eind = performance.now() + 4200;
    (function teken(t) {
      x.clearRect(0, 0, W, H);
      var over = Math.max(0, Math.min(1, (eind - t) / 1200));
      st.forEach(function (s) {
        s.vy += 0.22; s.vx *= 0.985; s.vy *= 0.985; s.x += s.vx; s.y += s.vy; s.r += s.vr;
        x.save(); x.globalAlpha = over; x.translate(s.x, s.y); x.rotate(s.r); x.fillStyle = s.k; x.fillRect(-s.w / 2, -s.h / 2, s.w, s.h); x.restore();
      });
      if (t < eind) requestAnimationFrame(teken); else c.remove();
    })(performance.now());
  }

  // Confetti zodra de fitcheck bevestigd is: dat is het moment dat de vragenstap (sq)
  // in beeld komt. s3 blijft als vangnet voor het geval de vragen worden overgeslagen.
  function wachtOpBevestiging() {
    if (!window.MutationObserver) return;
    var klaar = false;
    ['sq', 's3'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      new MutationObserver(function () {
        if (!klaar && el.classList.contains('active')) { klaar = true; confetti(); }
      }).observe(el, { attributes: true, attributeFilter: ['class'] });
    });
  }

  function start() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    groet();
    vulBoeking();
    wachtOpBevestiging();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
