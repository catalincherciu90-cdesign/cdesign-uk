/* C Design — Google Analytics 4 loader.
   To activate: replace the GA_ID value below with your GA4 Measurement ID
   (looks like G-XXXXXXXXXX). While it stays as the placeholder, this script
   does nothing, so it is safe to ship. */
(function () {
  var GA_ID = 'G-XXXXXXXXXX'; // <-- put your GA4 Measurement ID here
  if (!GA_ID || GA_ID.indexOf('G-') !== 0 || GA_ID === 'G-XXXXXXXXXX') return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
