/* C Design — cookie consent UI for Google Analytics 4 (Consent Mode v2).
   The Google tag itself (gtag.js) is loaded INLINE in the <head> of each page
   with analytics_storage defaulting to 'denied'. This file only shows the
   consent banner, updates consent after the visitor chooses, and adds a
   "Cookie settings" link to the footer. GA_ID must match the inline snippet. */
(function () {
  var GA_ID = 'G-TB9SZT1PVZ';
  var STORE_KEY = 'cd_cookie_consent'; // 'granted' | 'denied'
  var PRIVACY_URL = '/politica-confidentialitate';

  // gtag is defined by the inline snippet; define a fallback just in case.
  window.dataLayer = window.dataLayer || [];
  var gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag = gtag;

  function readChoice() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
  function saveChoice(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) {} }
  function apply(granted) {
    gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
  }

  // ---- Consent banner (re-openable via window.cdCookieSettings) ----
  var stylesAdded = false;
  function addStyles() {
    if (stylesAdded) return; stylesAdded = true;
    var css = document.createElement('style');
    css.textContent =
      '.cd-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:460px;' +
      'background:#fff;color:#2E3436;border:1px solid #e6ecec;border-radius:16px;' +
      'box-shadow:0 20px 60px -20px rgba(20,40,60,.35);padding:20px 22px;' +
      "font-family:'Inter',system-ui,sans-serif;animation:cdccIn .35s ease}" +
      '@keyframes cdccIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}' +
      '.cd-cc h4{margin:0 0 6px;font-size:1.02rem;font-weight:700;color:#2E3436;' +
      "font-family:'Poppins','Inter',sans-serif}" +
      '.cd-cc p{margin:0 0 14px;font-size:.9rem;line-height:1.55;color:#5b6472}' +
      '.cd-cc a{color:#008587;text-decoration:underline}' +
      '.cd-cc-row{display:flex;gap:10px;flex-wrap:wrap}' +
      '.cd-cc-btn{flex:1;min-width:120px;border:0;cursor:pointer;border-radius:10px;padding:11px 16px;' +
      "font-family:'Poppins','Inter',sans-serif;font-weight:600;font-size:.92rem;transition:transform .12s,background .2s}" +
      '.cd-cc-btn:hover{transform:translateY(-1px)}' +
      '.cd-cc-accept{background:#00AAAC;color:#fff}.cd-cc-accept:hover{background:#008587}' +
      '.cd-cc-reject{background:#f2f7f7;color:#2E3436;border:1px solid #e6ecec}' +
      '.cd-cc-reject:hover{background:#e9f1f1}' +
      '.cd-cc-settings{cursor:pointer}' +
      '@media(max-width:520px){.cd-cc{left:12px;right:12px;bottom:12px;padding:18px}}';
    document.head.appendChild(css);
  }

  function showBanner() {
    if (document.querySelector('.cd-cc')) return; // already open
    addStyles();
    var box = document.createElement('div');
    box.className = 'cd-cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie consent');
    box.innerHTML =
      '<h4>We value your privacy 🍪</h4>' +
      '<p>We use cookies to understand how visitors use our site so we can improve it. ' +
      'You can accept or decline analytics cookies. See our <a href="' + PRIVACY_URL + '">Privacy Policy</a>.</p>' +
      '<div class="cd-cc-row">' +
      '<button class="cd-cc-btn cd-cc-reject" type="button">Decline</button>' +
      '<button class="cd-cc-btn cd-cc-accept" type="button">Accept</button>' +
      '</div>';
    document.body.appendChild(box);

    function decide(granted) {
      saveChoice(granted ? 'granted' : 'denied');
      apply(granted);
      box.style.transition = 'opacity .25s, transform .25s';
      box.style.opacity = '0';
      box.style.transform = 'translateY(14px)';
      setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 260);
    }
    box.querySelector('.cd-cc-accept').addEventListener('click', function () { decide(true); });
    box.querySelector('.cd-cc-reject').addEventListener('click', function () { decide(false); });
  }

  // Public API — used by the footer "Cookie settings" link.
  window.cdCookieSettings = function () { showBanner(); };

  function injectFooterLink() {
    var bars = document.querySelectorAll('.footer-bottom');
    for (var i = 0; i < bars.length; i++) {
      var bar = bars[i];
      if (bar.querySelector('.cd-cc-settings')) continue;
      var span = document.createElement('span');
      var a = document.createElement('a');
      a.href = '#';
      a.className = 'cd-cc-settings';
      a.textContent = 'Cookie settings';
      a.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
      span.appendChild(a);
      bar.appendChild(span);
    }
  }

  function onReady(fn) {
    if (document.body) fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // Honour any prior choice; then wire up footer link and (if needed) show banner.
  var existing = readChoice();
  if (existing === 'granted') apply(true);
  else if (existing === 'denied') apply(false);

  onReady(function () {
    injectFooterLink();
    if (existing !== 'granted' && existing !== 'denied') showBanner();
  });
})();
