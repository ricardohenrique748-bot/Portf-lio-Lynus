/* ============================================================
   LYNUS TECH — Rastreamento (Meta Pixel + Google)
   Preencha os IDs abaixo. ID vazio = aquela ferramenta não carrega.
   ============================================================ */
(function () {
  var META_PIXEL_ID = "1128113676463020";   // Gerenciador de Eventos do Meta — "Lynus site"
  var GTM_ID        = "";   // ex.: "GTM-ABC1234"      (Google Tag Manager)
  var GA4_ID        = "G-MVW9EX1QEG";   // ex.: "G-ABC123XYZ"      (use só se NÃO usar o GTM)

  window.dataLayer = window.dataLayer || [];

  /* ---- Meta Pixel ---- */
  if (META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  /* ---- Google Tag Manager ---- */
  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(g);
  }

  /* ---- Google Analytics 4 direto (sem GTM) ---- */
  if (GA4_ID && !GTM_ID) {
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA4_ID);
    var a = document.createElement('script');
    a.async = true;
    a.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(a);
  }

  /* ---- Eventos de conversão ----
     lead    → formulário de contato enviado (Meta: Lead · Google: generate_lead)
     contact → clique em link de WhatsApp ou e-mail (Meta: Contact · Google: contact) */
  window.lynusTrack = function (kind, params) {
    params = params || {};
    var meta = kind === 'lead' ? 'Lead' : 'Contact';
    var ga   = kind === 'lead' ? 'generate_lead' : 'contact';
    if (window.fbq) fbq('track', meta, params);
    if (GTM_ID) window.dataLayer.push(Object.assign({ event: ga }, params));
    else if (window.gtag) gtag('event', ga, params);
  };

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf('wa.me/') !== -1)   window.lynusTrack('contact', { method: 'whatsapp' });
    else if (href.indexOf('mailto:') === 0) window.lynusTrack('contact', { method: 'email' });
  }, true);
})();
