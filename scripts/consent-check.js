import siteConfig from './site-config.js';

let consentedLoaded = false;

/**
 * Consent phase (dynamics pattern consent-gated-tags).
 *
 * By default consent is declined, so consented scripts (analytics, martech, etc.)
 * are not loaded. The source site's consent manager (Usercentrics) is recorded in
 * scripts/site-config.js and loaded here once the owner enables it; its consent
 * events then drive the consented phase.
 *
 * The default can be overridden with a query parameter for testing:
 *   ?consent=accept   grant consent (loads consented.js)
 *   ?consent=decline  decline consent (default behavior)
 *
 * @returns {boolean} true if the user has consented
 */
function hasConsent() {
  const consent = new URLSearchParams(window.location.search).get('consent');
  if (consent !== null) {
    return ['accept', 'true', '1', 'yes'].includes(consent.toLowerCase());
  }
  // default: decline
  return false;
}

/**
 * Loads consented scripts once consent is available.
 */
function loadConsented() {
  if (consentedLoaded) return;
  consentedLoaded = true;
  import('./consented.js');
}

/**
 * Notifies listeners of the current consent state and loads consented
 * scripts if consent has been granted.
 */
function onConsentUpdate() {
  const consented = hasConsent();
  window.dispatchEvent(new CustomEvent('consent.update', { detail: { consented } }));
  if (consented) {
    loadConsented();
  }
}

/**
 * Loads the consent manager recorded in site-config.js when the owner has enabled it.
 */
function loadConsentManager() {
  const cmp = siteConfig.consent.usercentrics;
  if (!cmp.enabled || !cmp.settingsId) return;
  const script = document.createElement('script');
  script.id = 'usercentrics-cmp';
  script.src = cmp.loader;
  script.async = true;
  script.setAttribute('data-settings-id', cmp.settingsId);
  document.head.append(script);
  window.addEventListener('UC_UI_INITIALIZED', onConsentUpdate);
}

loadConsentManager();
onConsentUpdate();
