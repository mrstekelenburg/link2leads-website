/* Alleen voor /preview-stijl: scroll-animaties, optellende cijfers, oplichtende stappen, spotlight en cursor */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) return;

  /* 1. Koppen komen woord voor woord binnen */
  function splitWords(el) {
    var i = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var parts = n.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          var s = document.createElement('span');
          s.className = 'pw';
          s.style.setProperty('--i', i++);
          s.textContent = p;
          frag.appendChild(s);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') {
        n.classList.add('pw');
        n.style.setProperty('--i', i++);
      }
    });
    el.classList.add('pw-wrap');
  }
  var heads = document.querySelectorAll('.big-h, .steps4-h, .contact-section h2, .g-title');
  Array.prototype.forEach.call(heads, splitWords);
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('pw-in'); io.unobserve(e.target); } });
  }, { threshold: 0.35 });
  Array.prototype.forEach.call(heads, function (h) { io.observe(h); });

  /* 2. Cijfers tellen op zodra ze in beeld komen */
  var nums = document.querySelectorAll('.cs-card .cs-stats b, .cs-stats b, .cs-sticker b, .hstat b');
  function countUp(el) {
    var raw = el.textContent.trim();
    var m = raw.match(/^([^\d]*)([\d.]+(?:,\d+)?)(.*)$/);
    if (!m) return;
    var pre = m[1], numTxt = m[2], post = m[3];
    var dec = numTxt.indexOf(',') > -1 ? numTxt.split(',')[1].length : 0;
    var target = parseFloat(numTxt.replace(/\./g, '').replace(',', '.'));
    if (!isFinite(target) || target === 0) return;
    var useDots = numTxt.indexOf('.') > -1 || target >= 1000;
    var t0 = null, dur = 1400;
    function fmt(v) {
      var s = v.toFixed(dec).replace('.', ',');
      if (useDots) { var p = s.split(','); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); s = p.join(','); }
      return pre + s + post;
    }
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(target * e);
      if (k < 1) requestAnimationFrame(step); else el.textContent = raw;
    }
    el.textContent = fmt(0);
    requestAnimationFrame(step);
  }
  var io2 = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); io2.unobserve(e.target); } });
  }, { threshold: 0.6 });
  Array.prototype.forEach.call(nums, function (n) { io2.observe(n); });

  /* 3. Stappen lichten een voor een op terwijl je door de sectie scrollt */
  var steps = document.querySelectorAll('.s4-grid .blk-card');
  if (steps.length) {
    var sec = document.getElementById('zowerkthet');
    var ticking = false;
    function upd() {
      var r = sec.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.75 - r.top) / (r.height * 0.8);
      var n = Math.max(0, Math.min(steps.length, Math.floor(p * steps.length) + 1));
      Array.prototype.forEach.call(steps, function (s, i) { s.classList.toggle('st-on', i < n); });
      ticking = false;
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  if (!desktop) return;

  /* 4. Licht dat de muis volgt op kaarten */
  var cards = document.querySelectorAll('.blk-card, .ksig-c, .cs-card, .p-card, .review-card, .who-card');
  Array.prototype.forEach.call(cards, function (c) {
    c.classList.add('spot');
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* 5. Eigen cursor met "Bekijk" boven cases en inbox-screenshots */
  var cur = document.createElement('div');
  cur.className = 'pv-cursor';
  cur.innerHTML = '<span>Bekijk</span>';
  document.body.appendChild(cur);
  var tx = 0, ty = 0, x = 0, y = 0;
  addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function loop() {
    x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    cur.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    requestAnimationFrame(loop);
  })();
  var targets = document.querySelectorAll('.cs-card, .inbox-item');
  Array.prototype.forEach.call(targets, function (t) {
    t.addEventListener('pointerenter', function () { cur.classList.add('on'); });
    t.addEventListener('pointerleave', function () { cur.classList.remove('on'); });
  });
})();
