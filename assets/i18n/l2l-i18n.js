/* ============================================================
   Link2Leads i18n engine + language switcher
   - Source language: NL (renders by default, best for NL SEO)
   - Client-side swap to EN / ES via l2l-i18n-data.js dictionary
   - Language persisted in localStorage + ?lang= URL param
   ============================================================ */
(function () {
  "use strict";

  var LANGS = ["nl", "en", "es"];
  var STORAGE_KEY = "l2l_lang";
  var DATA = window.L2L_I18N_DATA || {};

  // ---- current language (URL param wins, then storage, then nl) ----
  function readLang() {
    try {
      var p = new URLSearchParams(window.location.search).get("lang");
      if (p && LANGS.indexOf(p) !== -1) return p;
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && LANGS.indexOf(s) !== -1) return s;
    } catch (e) {}
    return "nl";
  }

  var current = readLang();

  // ---- caches of original NL content, filled once ----
  var textNodes = [];   // { node, original }
  var attrNodes = [];   // { el, attr, original }
  var built = false;

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CANVAS: 1, SVG: 1 };
  var TRANSLATE_ATTRS = ["placeholder", "title", "alt", "aria-label"];

  function isInSwitcher(node) {
    var el = node.nodeType === 1 ? node : node.parentNode;
    while (el) {
      if (el.classList && el.classList.contains("l2l-lang")) return true;
      el = el.parentNode;
    }
    return false;
  }

  function collect() {
    // text nodes
    var walker = document.createTreeWalker(
      document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          var p = n.parentNode;
          if (!p || SKIP_TAGS[p.nodeName]) return NodeFilter.FILTER_REJECT;
          if (isInSwitcher(n)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    var node;
    while ((node = walker.nextNode())) {
      textNodes.push({ node: node, original: node.nodeValue });
    }
    // translatable attributes
    var all = document.body.querySelectorAll("*");
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (isInSwitcher(el)) continue;
      for (var a = 0; a < TRANSLATE_ATTRS.length; a++) {
        var attr = TRANSLATE_ATTRS[a];
        if (el.hasAttribute(attr) && el.getAttribute(attr).trim()) {
          attrNodes.push({ el: el, attr: attr, original: el.getAttribute(attr) });
        }
      }
      // submit / button input values
      if (el.tagName === "INPUT" &&
          (el.type === "submit" || el.type === "button") &&
          el.value && el.value.trim()) {
        attrNodes.push({ el: el, attr: "value", original: el.value });
      }
    }
    built = true;
  }

  // translate one raw string, preserving surrounding whitespace
  function tr(raw, lang) {
    if (lang === "nl") return raw;
    var lead = (raw.match(/^\s*/) || [""])[0];
    var trail = (raw.match(/\s*$/) || [""])[0];
    var key = raw.trim();
    var entry = DATA[key];
    if (entry && entry[lang]) return lead + entry[lang] + trail;
    return raw; // no translation -> keep NL (source of truth)
  }

  function trAttr(raw, lang) {
    if (lang === "nl") return raw;
    var entry = DATA[raw.trim()];
    if (entry && entry[lang]) return entry[lang];
    return raw;
  }

  // head elements (title + meta description) handled explicitly
  var headCache = null;
  function cacheHead() {
    headCache = {
      title: document.title,
      metaDesc: null, metaDescOrig: "",
      ogTitle: null, ogTitleOrig: "",
      ogDesc: null, ogDescOrig: ""
    };
    var md = document.querySelector('meta[name="description"]');
    if (md) { headCache.metaDesc = md; headCache.metaDescOrig = md.getAttribute("content") || ""; }
    var ot = document.querySelector('meta[property="og:title"], meta[name="twitter:title"]');
    if (ot) { headCache.ogTitle = ot; headCache.ogTitleOrig = ot.getAttribute("content") || ""; }
    var od = document.querySelector('meta[property="og:description"], meta[name="twitter:description"]');
    if (od) { headCache.ogDesc = od; headCache.ogDescOrig = od.getAttribute("content") || ""; }
  }

  function applyHead(lang) {
    if (!headCache) return;
    document.title = trAttr(headCache.title, lang);
    if (headCache.metaDesc) headCache.metaDesc.setAttribute("content", trAttr(headCache.metaDescOrig, lang));
    if (headCache.ogTitle) headCache.ogTitle.setAttribute("content", trAttr(headCache.ogTitleOrig, lang));
    if (headCache.ogDesc) headCache.ogDesc.setAttribute("content", trAttr(headCache.ogDescOrig, lang));
  }

  function apply(lang) {
    for (var i = 0; i < textNodes.length; i++) {
      var t = textNodes[i];
      var next = tr(t.original, lang);
      if (t.node.nodeValue !== next) t.node.nodeValue = next;
    }
    for (var j = 0; j < attrNodes.length; j++) {
      var an = attrNodes[j];
      var nv = trAttr(an.original, lang);
      if (an.attr === "value") { if (an.el.value !== nv) an.el.value = nv; }
      else an.el.setAttribute(an.attr, nv);
    }
    applyHead(lang);
    document.documentElement.setAttribute("lang", lang);
  }

  function persist(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    try {
      var url = new URL(window.location.href);
      if (lang === "nl") url.searchParams.delete("lang");
      else url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url);
    } catch (e) {}
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1) return;
    current = lang;
    if (!built) collect();
    apply(lang);
    persist(lang);
    updateSwitcherState();
  }

  // ---------------- switcher UI ----------------
  var FLAGS = {
    nl: '<svg viewBox="0 0 9 6" class="l2l-flag" aria-hidden="true"><rect width="9" height="6" fill="#21468B"/><rect width="9" height="4" fill="#fff"/><rect width="9" height="2" fill="#AE1C28"/></svg>',
    en: '<svg viewBox="0 0 60 30" class="l2l-flag" aria-hidden="true"><clipPath id="l2lgb"><rect width="60" height="30"/></clipPath><g clip-path="url(#l2lgb)"><rect width="60" height="30" fill="#012169"/><path d="M0,0 60,30 M60,0 0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 60,30 M60,0 0,30" clip-path="url(#l2lgb)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/></g></svg>',
    es: '<svg viewBox="0 0 9 6" class="l2l-flag" aria-hidden="true"><rect width="9" height="6" fill="#AA151B"/><rect width="9" height="3" y="1.5" fill="#F1BF00"/></svg>'
  };
  var LABELS = { nl: "NL", en: "EN", es: "ES" };
  var TITLES = { nl: "Nederlands", en: "English", es: "Español" };

  var switcherEl = null;

  function buildSwitcher() {
    var wrap = document.createElement("div");
    wrap.className = "l2l-lang";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Language / Taal / Idioma");
    for (var i = 0; i < LANGS.length; i++) {
      var lang = LANGS[i];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "l2l-lang-btn";
      btn.setAttribute("data-lang", lang);
      btn.setAttribute("title", TITLES[lang]);
      btn.setAttribute("aria-label", TITLES[lang]);
      btn.innerHTML = FLAGS[lang] + '<span class="l2l-lang-lbl">' + LABELS[lang] + "</span>";
      btn.addEventListener("click", (function (l) {
        return function (e) { e.preventDefault(); setLang(l); };
      })(lang));
      wrap.appendChild(btn);
    }
    switcherEl = wrap;
    return wrap;
  }

  function updateSwitcherState() {
    if (!switcherEl) return;
    var btns = switcherEl.querySelectorAll(".l2l-lang-btn");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-lang") === current;
      btns[i].classList.toggle("is-active", on);
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  function mountSwitcher() {
    var sw = buildSwitcher();
    var navInner = document.querySelector(".nav-inner");
    if (navInner) {
      var ham = navInner.querySelector(".nav-hamburger, #hamburger");
      sw.classList.add("in-nav");
      if (ham) navInner.insertBefore(sw, ham);
      else navInner.appendChild(sw);
      return;
    }
    var nav = document.querySelector("nav");
    if (nav) {
      sw.classList.add("in-nav", "in-simple-nav");
      nav.appendChild(sw);
      return;
    }
    // fallback: fixed pill top-right
    sw.classList.add("l2l-lang-fixed");
    document.body.appendChild(sw);
  }

  function injectStyles() {
    if (document.getElementById("l2l-i18n-styles")) return;
    var css =
      ".l2l-lang{display:inline-flex;align-items:center;gap:2px;padding:3px;border-radius:100px;" +
      "background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(8px);}" +
      ".l2l-lang.in-nav{margin-left:10px;flex-shrink:0;}" +
      ".l2l-lang.in-simple-nav{margin-left:auto;}" +
      ".l2l-lang-fixed{position:fixed;top:20px;right:16px;z-index:10001;}" +
      ".l2l-lang-btn{display:inline-flex;align-items:center;gap:5px;cursor:pointer;border:none;" +
      "background:transparent;color:rgba(255,255,255,0.7);font:600 12px/1 Inter,system-ui,sans-serif;" +
      "padding:5px 9px;border-radius:100px;transition:background .15s,color .15s;}" +
      ".l2l-lang-btn:hover{color:#fff;background:rgba(255,255,255,0.08);}" +
      ".l2l-lang-btn.is-active{color:#fff;background:var(--accent,#2F6FED);}" +
      ".l2l-flag{width:18px;height:12px;border-radius:2px;display:block;box-shadow:0 0 0 1px rgba(0,0,0,.15);flex-shrink:0;}" +
      ".l2l-lang-lbl{letter-spacing:.3px;}" +
      "@media(max-width:640px){.l2l-lang-lbl{display:none;}.l2l-lang-btn{padding:6px;}" +
      ".l2l-lang.in-nav{margin-left:6px;}}";
    var st = document.createElement("style");
    st.id = "l2l-i18n-styles";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function reveal() {
    document.documentElement.classList.remove("i18n-pending");
  }

  function init() {
    injectStyles();
    cacheHead();
    collect();
    mountSwitcher();
    apply(current);
    persist(current);
    updateSwitcherState();
    reveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // failsafe: never leave content hidden
  setTimeout(reveal, 1500);

  // expose for debugging / manual calls
  window.L2L_setLang = setLang;
})();
