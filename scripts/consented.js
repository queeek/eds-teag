import siteConfig from './site-config.js';

/**
 * Consent-gated vendors (dynamics pattern consent-gated-tags). Loaded by consent-check.js once
 * consent is granted; every vendor stays off until the owner enables it in site-config.js.
 */
function loadScript(src, attrs = {}) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.append(script);
  return script;
}

const { gtm, etracker } = siteConfig.tags;
if (gtm.enabled && gtm.containerId) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm.containerId)}`);
}
if (etracker.enabled && etracker.secureCode) {
  loadScript(etracker.loader, { id: '_etLoader', 'data-secure-code': etracker.secureCode });
}

const { moinAi } = siteConfig.chat;
if (moinAi.enabled && moinAi.widgetId) {
  const id = encodeURIComponent(moinAi.widgetId);
  loadScript(`${moinAi.loader}?id=${id}&channelid=${id}`);
}
