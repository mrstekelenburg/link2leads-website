/* Link2Leads: rustige fade per blok, zoals op de homepage.
   Alleen op leespagina's, niet op formulier- en flowpagina's.
   - doet niets bij prefers-reduced-motion
   - blokken die al in beeld staan bij het laden blijven direct zichtbaar
   - zonder JS blijft alles zichtbaar, de opacity wordt pas door dit script gezet */
(function () {
  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if ((mq && mq.matches) || !('IntersectionObserver' in window)) return;

  var main = document.querySelector('main.page-wrap');
  if (!main) return;

  /* Kruimelpad, meta-regel en lopende tekst doen niet mee: die horen niet te bewegen terwijl je leest. */
  var skip = '.crumb, .page-meta, .prose, .toc';

  var items = [];
  Array.prototype.forEach.call(main.children, function (el) {
    var tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
    if (el.matches && el.matches(skip)) return;
    items.push(el);
  });
  if (!items.length) return;

  var css = document.createElement('style');
  css.textContent =
    '.l2l-rv{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease;}' +
    '.l2l-rv.in{opacity:1;transform:none;}';
  document.head.appendChild(css);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (!e.isIntersecting) return;
      var el = e.target;
      setTimeout(function () { el.classList.add('in'); }, i * 55);
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  var fold = window.innerHeight * 0.92;
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < fold) return; /* staat al in beeld */
    el.classList.add('l2l-rv');
    io.observe(el);
  });

  /* Valnet: mocht een blok om wat voor reden ook niet zijn aangeraakt, zet het na 4 seconden alsnog zichtbaar. */
  setTimeout(function () {
    document.querySelectorAll('.l2l-rv:not(.in)').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    });
  }, 4000);
})();
