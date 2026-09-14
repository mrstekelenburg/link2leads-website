/* Link2Leads - vaste WhatsApp-knop rechtsonder, op elke pagina.
   Vervangt de oude chatwidget. Eén bestand, geen externe scripts. */
(function () {
  var NUMMER = '31850805381';                 // 085 080 5381 in internationale notatie
  var TEKST  = 'Hoi Link2Leads, ik heb een vraag.';
  var HREF   = 'https://wa.me/' + NUMMER + '?text=' + encodeURIComponent(TEKST);

  function bouw() {
    if (document.getElementById('l2l-wa')) return;

    var css = document.createElement('style');
    css.textContent = [
      '#l2l-wa{position:fixed !important;right:20px !important;bottom:20px !important;z-index:400;',
      'width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;',
      'background:#25D366;box-shadow:0 8px 24px rgba(0,0,0,.34),0 0 0 1px rgba(255,255,255,.10);',
      '-webkit-tap-highlight-color:transparent;transition:transform .18s ease,box-shadow .18s ease;}',
      '#l2l-wa svg{width:31px;height:31px;display:block;fill:#fff;}',
      '#l2l-wa:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(0,0,0,.42),0 0 0 1px rgba(255,255,255,.14);}',
      '#l2l-wa:focus-visible{outline:3px solid #BFD4FF;outline-offset:3px;}',
      '@media (max-width:640px){#l2l-wa{right:16px !important;bottom:calc(16px + env(safe-area-inset-bottom,0px)) !important;',
      'width:52px;height:52px;}#l2l-wa svg{width:28px;height:28px;}}',
      '@media (prefers-reduced-motion:reduce){#l2l-wa{transition:none;}#l2l-wa:hover{transform:none;}}'
    ].join('');
    document.head.appendChild(css);

    var a = document.createElement('a');
    a.id = 'l2l-wa';
    a.href = HREF;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Stuur ons een WhatsApp-bericht');
    a.title = 'WhatsApp: 085 080 5381';
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.61-.93-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.45 0 1.45 1.06 2.85 1.21 3.05.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01c-1.75 0-3.47-.47-4.98-1.36l-.36-.21-3.7.97.99-3.62-.23-.37a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.45-9.43 2.52 0 4.89.98 6.67 2.76a9.37 9.37 0 0 1 2.77 6.68c0 5.2-4.24 9.42-9.43 9.42zM20.5 3.49A11.8 11.8 0 0 0 12.04 0C5.49 0 .16 5.33.16 11.88c0 2.09.55 4.13 1.59 5.93L0 24l6.34-1.66a11.83 11.83 0 0 0 5.69 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.42-8.42z"/></svg>';
    a.addEventListener('click', function () {
      if (window.l2lTrack) window.l2lTrack('whatsapp_click');
    });
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bouw);
  } else {
    bouw();
  }
})();
