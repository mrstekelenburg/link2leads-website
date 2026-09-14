/* Link2Leads - hulpje om te zien wat de pagina langer maakt dan de footer.
   Laadt alleen met ?debug in de URL, bijvoorbeeld link2leads.nl/?debug
   Zet niets vast en verandert niets aan de pagina. */
(function () {
  function naam(el) {
    var t = el.tagName.toLowerCase();
    if (el.id) return t + '#' + el.id;
    if (el.className && typeof el.className === 'string') {
      return t + '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    }
    return t;
  }

  function meet() {
    var f = document.querySelector('footer');
    if (!f) return 'geen footer gevonden';
    var footerBottom = Math.round(f.getBoundingClientRect().bottom + window.scrollY);
    var docHoogte = Math.round(document.documentElement.scrollHeight);
    var over = docHoogte - footerBottom;

    var regels = [];
    regels.push('pagina: ' + docHoogte + 'px');
    regels.push('footer eindigt op: ' + footerBottom + 'px');
    regels.push('te veel: ' + over + 'px');
    regels.push('breedte: ' + document.documentElement.scrollWidth + ' / ' + window.innerWidth);

    if (over > 2) {
      var daders = [];
      var alles = document.body.querySelectorAll('*');
      for (var i = 0; i < alles.length; i++) {
        var el = alles[i];
        var cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.display === 'none') continue;
        var r = el.getBoundingClientRect();
        if (r.height === 0 && r.width === 0) continue;
        var bodem = Math.round(r.bottom + window.scrollY);
        if (bodem > footerBottom + 2) {
          daders.push({ n: naam(el), o: bodem - footerBottom, p: cs.position });
        }
      }
      // alleen de diepste elementen, grootste overschrijding eerst
      daders.sort(function (a, b) { return b.o - a.o; });
      regels.push('---');
      if (!daders.length) {
        regels.push('geen element voorbij de footer: het zit in html of body zelf');
      } else {
        for (var j = 0; j < Math.min(daders.length, 8); j++) {
          regels.push(daders[j].n + '  +' + daders[j].o + 'px  (' + daders[j].p + ')');
        }
      }
    }
    return regels.join('\n');
  }

  function toon() {
    var box = document.getElementById('l2l-check');
    if (!box) {
      box = document.createElement('pre');
      box.id = 'l2l-check';
      box.style.cssText = 'position:fixed;left:8px;right:8px;top:8px;z-index:99999;margin:0;' +
        'max-height:60vh;overflow:auto;padding:12px 14px;border-radius:12px;' +
        'background:rgba(5,6,9,.94);border:1px solid #2F6FED;color:#F0EFED;' +
        'font:500 12px/1.5 ui-monospace,Menlo,monospace;white-space:pre-wrap;';
      box.addEventListener('click', function () { box.remove(); });
      document.body.appendChild(box);
    }
    box.textContent = meet() + '\n---\ntik om te sluiten';
  }

  window.addEventListener('load', function () { toon(); setTimeout(toon, 1500); });
})();
