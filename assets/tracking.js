/* Link2Leads - tracking
   Google Analytics + Meta Pixel.
   Gebruik l2lTrack('naam', {..}) om een gebeurtenis te loggen. */
(function () {
  var GA = 'G-Q4JTLMX0B7';
  var PIXEL = '35218029017788041';

  var g = document.createElement('script');
  g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
  document.head.appendChild(g);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA);

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', PIXEL);
  fbq('track', 'PageView');

  var META = { booking_confirmed: 'Schedule', questionnaire_completed: 'Lead', contact_submitted: 'Lead' };

  window.l2lTrack = function (name, params) {
    if (window.gtag) window.gtag('event', name, params || {});
    if (window.fbq) {
      if (META[name]) fbq('track', META[name]);
      else fbq('trackCustom', name, params || {});
    }
  };
})();
