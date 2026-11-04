/* Feestdagthema's - subtiele decoratie rond feestdagen.
   Kiest op datum (tijdzone Amsterdam) een thema, bij overlap telt de volgorde in THEMAS.
   Bekijken buiten de periode: voeg ?thema=halloween|sinterklaas|kerst|oudnieuw|pasen|koningsdag toe aan de url.
   Alles is decoratie: geen klikbare lagen over de site (behalve de paaseitjes), en bij
   "minder beweging" op het apparaat staat alles stil. Zelfde bestand op link2leads.co, daar NL = false. */
(function () {
  'use strict';
  var NL = true; // Sinterklaas en Koningsdag alleen op de Nederlandse site
  if (window.__l2lThema) return;
  window.__l2lThema = 1;

  // ── Datum in Nederland ──
  function nu() {
    try {
      var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).split('-');
      return { j: +p[0], m: +p[1], d: +p[2] };
    } catch (e) { var t = new Date(); return { j: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() }; }
  }
  function dagnr(j, m, d) { return Math.round(Date.UTC(j, m - 1, d) / 864e5); }
  function pasen(j) { // Eerste paasdag (Gregoriaans)
    var a = j % 19, b = Math.floor(j / 100), c = j % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mnd = Math.floor((h + l - 7 * m + 114) / 31), dag = ((h + l - 7 * m + 114) % 31) + 1;
    return dagnr(j, mnd, dag);
  }

  var T = nu(), vandaag = dagnr(T.j, T.m, T.d);
  function tussen(m1, d1, m2, d2) { return vandaag >= dagnr(T.j, m1, d1) && vandaag <= dagnr(T.j, m2, d2); }

  // Volgorde = voorrang bij overlap
  var THEMAS = [
    { id: 'koningsdag', actief: function () { return NL && tussen(4, 24, 4, 27); } },
    { id: 'pasen', actief: function () { var p = pasen(T.j); return vandaag >= p - 4 && vandaag <= p + 2; } },
    { id: 'halloween', actief: function () { return tussen(10, 25, 10, 31); } },
    { id: 'sinterklaas', actief: function () { return NL && tussen(11, 28, 12, 5); } },
    { id: 'kerst', actief: function () { return NL ? tussen(12, 6, 12, 26) : tussen(12, 1, 12, 26); } },
    { id: 'oudnieuw', actief: function () { return tussen(12, 27, 12, 31) || tussen(1, 1, 1, 2); } }
  ];

  var gekozen = null;
  try {
    var q = new URLSearchParams(location.search).get('thema');
    if (q) THEMAS.forEach(function (t) { if (t.id === q) gekozen = t.id; });
  } catch (e) {}
  if (!gekozen) THEMAS.forEach(function (t) { if (!gekozen && t.actief()) gekozen = t.id; });
  if (!gekozen) return;

  var rust = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var klein = window.innerWidth < 760;

  // ── Basisstijl ──
  var css =
    '.l2t-laag{position:fixed;pointer-events:none;z-index:150}' +
    '.l2t-slinger{top:0;left:0;right:0;height:26px;overflow:hidden}' +
    '.l2t-slinger svg{display:block;width:100%;height:26px}' +
    '.l2t-hoek{left:18px;bottom:16px;width:62px;height:62px;opacity:0;transition:opacity 1.2s ease;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}' +
    '.l2t-hoek.l2t-in{opacity:.95}' +
    '.l2t-hoek svg{width:100%;height:100%;display:block}' +
    '.l2t-doek{inset:0;width:100%;height:100%}' +
    '.l2t-vlieg{top:90px;left:0;will-change:transform}' +
    '.l2t-lamp{animation:l2tFlik 2.4s ease-in-out infinite}' +
    '@keyframes l2tFlik{0%,100%{opacity:1}50%{opacity:.35}}' +
    '.l2t-wieg{animation:l2tWieg 4s ease-in-out infinite;transform-origin:50% 100%}' +
    '@keyframes l2tWieg{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}' +
    '.l2t-ei{position:absolute;width:22px;height:28px;z-index:5;cursor:pointer;pointer-events:auto;transition:transform .25s ease,opacity .4s ease}' +
    '.l2t-ei:hover{transform:rotate(-12deg) scale(1.1)}' +
    '.l2t-ei.l2t-weg{transform:translateY(-30px) scale(.4);opacity:0}' +
    '.l2t-haas{left:0;bottom:70px;width:58px;height:70px;transform:translateX(-46px);transition:transform 1.4s ease}' +
    '.l2t-haas.l2t-in{transform:translateX(-8px)}' +
    '@media (max-width:760px){.l2t-hoek{width:46px;height:46px;left:12px;bottom:12px}.l2t-slinger,.l2t-slinger svg{height:20px}}' +
    '@media (prefers-reduced-motion:reduce){.l2t-lamp,.l2t-wieg{animation:none}}';

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function plaats(e) { document.body.appendChild(e); return e; }

  // ── Bouwstenen ──
  function slinger(soort) {
    var w = 1200, n = soort === 'lampjes' ? 30 : 24, stap = w / n, s = '';
    if (soort === 'lampjes') {
      var kl = ['#FF5A5A', '#FFD166', '#4ADE80', '#5B8FF5', '#F472B6'];
      s += '<path d="M0 4 ' + Array.apply(null, Array(n)).map(function (_, i) { return 'Q' + (i * stap + stap / 2) + ' 14 ' + ((i + 1) * stap) + ' 4'; }).join(' ') + '" fill="none" stroke="rgba(240,239,237,.35)" stroke-width="1.2"/>';
      for (var i = 0; i < n; i++) {
        var x = i * stap + stap / 2;
        s += '<g class="l2t-lamp" style="animation-delay:' + (i % 5) * 0.45 + 's"><rect x="' + (x - 1.6) + '" y="8" width="3.2" height="3" fill="#3a3f48"/>' +
          '<ellipse cx="' + x + '" cy="15" rx="3.2" ry="4.6" fill="' + kl[i % 5] + '"/></g>';
      }
    } else { // vlaggetjes Koningsdag
      var vk = ['#FF7A00', '#AE1C28', '#FFFFFF', '#21468B', '#FF7A00'];
      s += '<path d="M0 3 L' + w + ' 3" stroke="rgba(240,239,237,.4)" stroke-width="1"/>';
      for (var j = 0; j < n; j++) {
        var x0 = j * stap + 4, x1 = (j + 1) * stap - 4;
        s += '<path d="M' + x0 + ' 3 L' + x1 + ' 3 L' + (x0 + x1) / 2 + ' 20 Z" fill="' + vk[j % 5] + '" opacity=".9"/>';
      }
    }
    return plaats(el('div', 'l2t-laag l2t-slinger', '<svg viewBox="0 0 ' + w + ' 26" preserveAspectRatio="none" aria-hidden="true">' + s + '</svg>'));
  }

  function hoek(svg, wieg) {
    var e = plaats(el('div', 'l2t-laag l2t-hoek', '<div class="' + (wieg && !rust ? 'l2t-wieg' : '') + '" style="width:100%;height:100%">' + svg + '</div>'));
    e.setAttribute('aria-hidden', 'true');
    setTimeout(function () { e.classList.add('l2t-in'); }, 600);
    return e;
  }

  // Vallende deeltjes (sneeuw of pepernoten) op een canvas
  function vallen(soort) {
    if (rust) return;
    var c = plaats(el('canvas', 'l2t-laag l2t-doek')), x = c.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2), W, H, deel = [];
    c.setAttribute('aria-hidden', 'true');
    function maat() { W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
    maat(); addEventListener('resize', maat);
    var aantal = soort === 'sneeuw' ? (klein ? 28 : 55) : (klein ? 5 : 9);
    function nieuw(boven) {
      return { x: Math.random() * W, y: boven ? -10 : Math.random() * H, r: soort === 'sneeuw' ? 1 + Math.random() * 2.2 : 4 + Math.random() * 2.5,
        v: soort === 'sneeuw' ? 0.25 + Math.random() * 0.55 : 0.5 + Math.random() * 0.6, w: Math.random() * 6.28, a: soort === 'sneeuw' ? 0.35 + Math.random() * 0.45 : 0.9 };
    }
    for (var i = 0; i < aantal; i++) deel.push(nieuw(false));
    function teken() {
      if (document.hidden) { requestAnimationFrame(teken); return; }
      x.clearRect(0, 0, W, H);
      for (var i = 0; i < deel.length; i++) {
        var p = deel[i];
        p.y += p.v; p.w += 0.01; p.x += Math.sin(p.w) * 0.3;
        if (p.y > H + 10) deel[i] = p = nieuw(true);
        x.globalAlpha = p.a;
        if (soort === 'sneeuw') { x.fillStyle = '#fff'; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.28); x.fill(); }
        else { // pepernoot: bruin rondje met lichter vlekje
          x.fillStyle = '#9A5B2E'; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.28); x.fill();
          x.fillStyle = '#C98A52'; x.beginPath(); x.arc(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.35, 0, 6.28); x.fill();
        }
      }
      x.globalAlpha = 1;
      requestAnimationFrame(teken);
    }
    teken();
  }

  // Iets dat af en toe over het bovenste deel van het scherm vliegt
  function vlieger(svg, breedte, hoogte, elke, duur) {
    if (rust) return;
    var e = plaats(el('div', 'l2t-laag l2t-vlieg', svg));
    e.style.width = breedte + 'px'; e.style.height = hoogte + 'px';
    e.style.transform = 'translateX(-' + (breedte + 40) + 'px)';
    e.setAttribute('aria-hidden', 'true');
    function vlucht() {
      if (document.hidden) return;
      e.style.top = (80 + Math.random() * 120) + 'px';
      var start = null, van = -breedte - 40, tot = innerWidth + 40;
      function stap(t) {
        if (!start) start = t;
        var f = (t - start) / duur;
        if (f >= 1) { e.style.transform = 'translateX(' + van + 'px)'; return; }
        e.style.transform = 'translate(' + (van + (tot - van) * f) + 'px,' + Math.sin(f * 9) * 8 + 'px)';
        requestAnimationFrame(stap);
      }
      requestAnimationFrame(stap);
    }
    setTimeout(vlucht, 4000);
    setInterval(vlucht, elke);
  }

  // Vuurwerk, een paar keer bij het laden
  function vuurwerk() {
    if (rust) return;
    var c = plaats(el('canvas', 'l2t-laag l2t-doek')), x = c.getContext('2d'), W = innerWidth, H = innerHeight, dpr = Math.min(window.devicePixelRatio || 1, 2), vonken = [];
    c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var kl = ['#5B8FF5', '#FFD166', '#F472B6', '#4ADE80', '#FFFFFF'];
    function knal() {
      var cx = W * (0.15 + Math.random() * 0.7), cy = H * (0.12 + Math.random() * 0.3), k = kl[Math.floor(Math.random() * kl.length)];
      for (var i = 0; i < 46; i++) { var h = i / 46 * 6.28, s = 1.4 + Math.random() * 2.2; vonken.push({ x: cx, y: cy, vx: Math.cos(h) * s, vy: Math.sin(h) * s, l: 1, k: k }); }
    }
    [500, 1300, 2100].forEach(function (t) { setTimeout(knal, t); });
    var eind = performance.now() + 5200;
    (function teken(t) {
      x.clearRect(0, 0, W, H);
      vonken = vonken.filter(function (v) { return v.l > 0; });
      vonken.forEach(function (v) {
        v.x += v.vx; v.y += v.vy; v.vy += 0.03; v.vx *= 0.985; v.l -= 0.013;
        x.globalAlpha = Math.max(v.l, 0); x.fillStyle = v.k; x.beginPath(); x.arc(v.x, v.y, 1.8, 0, 6.28); x.fill();
      });
      if (t < eind) requestAnimationFrame(teken); else c.remove();
    })(performance.now());
  }

  // Paaseitjes verstopt in de pagina (in secties, niet in beeld vast)
  function eitjes() {
    var secties = [].slice.call(document.querySelectorAll('section')).filter(function (s) { return s.offsetHeight > 250; });
    if (!secties.length) secties = [document.body];
    var kl = [['#F9A8D4', '#FDF2F8'], ['#93C5FD', '#EFF6FF'], ['#FDE68A', '#FFFBEB']], gekozenS = [];
    while (gekozenS.length < Math.min(3, secties.length)) {
      var s = secties[Math.floor(Math.random() * secties.length)];
      if (gekozenS.indexOf(s) < 0) gekozenS.push(s);
    }
    gekozenS.forEach(function (s, i) {
      if (getComputedStyle(s).position === 'static') s.style.position = 'relative';
      var k = kl[i % 3];
      var ei = el('div', 'l2t-ei', '<svg viewBox="0 0 22 28" aria-hidden="true"><ellipse cx="11" cy="16" rx="10" ry="12" fill="' + k[0] + '"/>' +
        '<path d="M2 15 Q6 12 11 15 T20 15" stroke="' + k[1] + '" stroke-width="2.2" fill="none"/><circle cx="7" cy="21" r="1.6" fill="' + k[1] + '"/><circle cx="15" cy="21" r="1.6" fill="' + k[1] + '"/></svg>');
      ei.title = 'Gevonden!';
      ei.style.left = (6 + Math.random() * 84) + '%';
      ei.style.bottom = (10 + Math.random() * 30) + 'px';
      ei.addEventListener('click', function () { ei.classList.add('l2t-weg'); setTimeout(function () { ei.remove(); }, 450); });
      s.appendChild(ei);
    });
  }

  // ── Tekeningen ──
  var SVG = {
    pompoen: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M30 14 q2 -8 8 -9" stroke="#4D7C3A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="20" cy="38" rx="13" ry="18" fill="#E8742A"/><ellipse cx="44" cy="38" rx="13" ry="18" fill="#E8742A"/><ellipse cx="32" cy="38" rx="13" ry="19" fill="#F28C38"/>' +
      '<path d="M22 32 l5 -5 l3 6 z M42 32 l-5 -5 l-3 6 z" fill="#2B1608"/><path d="M21 43 q11 9 22 0 l-3 3 l-3 -2 l-3 3 l-3 -3 l-3 3 l-3 -2 z" fill="#2B1608"/></svg>',
    vleermuis: '<svg viewBox="0 0 120 40" aria-hidden="true" fill="#1A1C22" stroke="rgba(240,239,237,.25)" stroke-width=".6">' +
      '<path d="M10 14 q6 -6 12 0 q4 -5 8 0 q-2 -6 -8 -8 q-2 3 -4 3 q-2 0 -4 -3 q-6 2 -8 8 q4 -5 8 0 z" transform="translate(0 6)"/>' +
      '<path d="M10 14 q6 -6 12 0 q4 -5 8 0 q-2 -6 -8 -8 q-2 3 -4 3 q-2 0 -4 -3 q-6 2 -8 8 q4 -5 8 0 z" transform="translate(44 0) scale(.8)"/>' +
      '<path d="M10 14 q6 -6 12 0 q4 -5 8 0 q-2 -6 -8 -8 q-2 3 -4 3 q-2 0 -4 -3 q-6 2 -8 8 q4 -5 8 0 z" transform="translate(80 14) scale(.65)"/></svg>',
    mijter: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 56 L16 26 Q32 2 48 26 L48 56 Z" fill="#C8102E"/>' +
      '<path d="M16 56 L48 56" stroke="#E5B94E" stroke-width="5"/><path d="M32 12 L32 54" stroke="#E5B94E" stroke-width="3"/>' +
      '<path d="M24 30 L40 30 M32 22 L32 40" stroke="#E5B94E" stroke-width="4" stroke-linecap="round"/></svg>',
    boom: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="28" y="50" width="8" height="10" rx="1" fill="#6B4226"/>' +
      '<path d="M32 6 L50 30 L40 30 L54 50 L10 50 L24 30 L14 30 Z" fill="#2F7D4F"/>' +
      '<path d="M32 2 l2.4 5 5.4 .6 -4 3.6 1.2 5.3 -5 -2.8 -5 2.8 1.2 -5.3 -4 -3.6 5.4 -.6 z" fill="#FFD166"/>' +
      '<circle cx="26" cy="26" r="2.4" fill="#FF5A5A"/><circle cx="38" cy="36" r="2.4" fill="#5B8FF5"/><circle cx="22" cy="44" r="2.4" fill="#FFD166"/><circle cx="42" cy="46" r="2.4" fill="#F472B6"/></svg>',
    slee: '<svg viewBox="0 0 220 50" aria-hidden="true" fill="rgba(240,239,237,.85)">' +
      // rendieren
      '<g><path d="M140 30 q10 -6 20 0 l2 10 h-3 l-2 -7 h-14 l-2 7 h-3 z"/><path d="M160 24 l5 -6 l4 2 l-2 4 l4 -1 l-1 3 l-6 2 z"/><path d="M165 18 l-2 -6 M167 18 l3 -6" stroke="rgba(240,239,237,.85)" stroke-width="1.4"/></g>' +
      '<g transform="translate(36 0)"><path d="M140 30 q10 -6 20 0 l2 10 h-3 l-2 -7 h-14 l-2 7 h-3 z"/><path d="M160 24 l5 -6 l4 2 l-2 4 l4 -1 l-1 3 l-6 2 z"/><path d="M165 18 l-2 -6 M167 18 l3 -6" stroke="rgba(240,239,237,.85)" stroke-width="1.4"/><circle cx="170" cy="22" r="1.8" fill="#FF5A5A"/></g>' +
      // teugels en slee met kerstman
      '<path d="M100 34 L142 32" stroke="rgba(240,239,237,.6)" stroke-width="1" fill="none"/>' +
      '<path d="M40 30 h58 q6 0 6 6 v2 h-64 z"/><path d="M36 44 h66 q6 0 8 -4" stroke="rgba(240,239,237,.85)" stroke-width="2.2" fill="none"/>' +
      '<circle cx="74" cy="20" r="6" fill="#F0D2B6"/><path d="M66 30 q0 -12 16 -10 l2 10 z" fill="#C8102E"/><path d="M68 18 q6 -12 14 -2 l4 -2" fill="#C8102E"/><circle cx="87" cy="14" r="2" fill="#fff"/>' +
      '<path d="M44 30 q-2 -12 10 -10 q8 2 6 10 z" fill="#6B4226"/></svg>',
    oliebol: '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="52" rx="24" ry="5" fill="#F0EFED" opacity=".9"/>' +
      '<circle cx="32" cy="36" r="17" fill="#B9773A"/><circle cx="26" cy="30" r="4" fill="#3A2416"/><circle cx="38" cy="38" r="3.2" fill="#3A2416"/>' +
      '<circle cx="34" cy="27" r="2.6" fill="#3A2416"/><path d="M18 30 q8 -10 26 -6 q-6 -4 -14 -2 q-8 2 -12 8 z" fill="#fff" opacity=".9"/>' +
      '<circle cx="24" cy="23" r="1.5" fill="#fff"/><circle cx="40" cy="21" r="1.3" fill="#fff"/></svg>',
    haas: '<svg viewBox="0 0 58 70" aria-hidden="true"><ellipse cx="34" cy="10" rx="5" ry="14" fill="#E9E4DC"/><ellipse cx="46" cy="12" rx="5" ry="13" fill="#E9E4DC" transform="rotate(14 46 12)"/>' +
      '<ellipse cx="34" cy="10" rx="2.2" ry="9" fill="#F9A8D4"/><ellipse cx="38" cy="38" rx="18" ry="16" fill="#F0EFED"/>' +
      '<circle cx="44" cy="35" r="2.4" fill="#1A1C22"/><ellipse cx="54" cy="42" rx="2.4" ry="2" fill="#F472B6"/><path d="M54 45 q-3 4 -6 2" stroke="#1A1C22" stroke-width="1" fill="none"/>' +
      '<rect x="0" y="50" width="46" height="20" fill="#F0EFED"/><ellipse cx="40" cy="62" rx="6" ry="4" fill="#E9E4DC"/></svg>'
  };

  function start() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    document.documentElement.setAttribute('data-thema', gekozen);
    switch (gekozen) {
      case 'halloween':
        hoek(SVG.pompoen, true);
        vlieger(SVG.vleermuis, klein ? 90 : 120, klein ? 30 : 40, 45000, 9000);
        break;
      case 'sinterklaas':
        hoek(SVG.mijter, true);
        vallen('pepernoten');
        break;
      case 'kerst':
        slinger('lampjes');
        hoek(SVG.boom, false);
        vallen('sneeuw');
        vlieger(SVG.slee, klein ? 150 : 220, klein ? 34 : 50, 60000, 12000);
        break;
      case 'oudnieuw':
        hoek(SVG.oliebol, true);
        vuurwerk();
        break;
      case 'pasen':
        var h = plaats(el('div', 'l2t-laag l2t-haas', SVG.haas)); h.setAttribute('aria-hidden', 'true');
        setTimeout(function () { h.classList.add('l2t-in'); }, 1500);
        eitjes();
        break;
      case 'koningsdag':
        slinger('vlaggetjes');
        break;
    }
  }

  // Pas starten als de pagina er staat, zodat het niets vertraagt
  function later() { if (window.requestIdleCallback) requestIdleCallback(start, { timeout: 1500 }); else setTimeout(start, 300); }
  if (document.readyState === 'complete') later(); else addEventListener('load', later);
})();
