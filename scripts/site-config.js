/**
 * Owner-facing tag and vendor configuration (dynamics pattern consent-gated-tags).
 * Every vendor observed on the source site is recorded with its public ids and endpoints,
 * all `enabled: false`: nothing fires on the new host until the site owner flips a switch
 * (stardust/dynamic-features.md rows D-06 … D-09). Loader order: the consent manager first
 * (scripts/consent-check.js), then the consent-gated tags (scripts/consented.js).
 * Google Ads and the Facebook pixel ran inside the GTM container on the source; they are
 * not loaded separately here.
 */
const siteConfig = {
  consent: {
    usercentrics: {
      enabled: false,
      settingsId: 'qE6MEj9eWPQ8Dz',
      loader: 'https://web.cmp.usercentrics.eu/ui/loader.js',
      autoblocker: 'https://web.cmp.usercentrics.eu/modules/autoblocker.js',
      owner: 'confirm the settings id is allowed on the new domain',
    },
  },
  tags: {
    gtm: {
      enabled: false,
      containerId: 'GTM-T2V7DDC',
      serverHost: 'sgtm.thueringerenergie.de',
      owner: 'decide which tags run on the new host; map the sGTM domain',
    },
    etracker: {
      enabled: false,
      secureCode: 'JoEOKb',
      loader: 'https://code.etracker.com/code/e.js',
      owner: 'etracker account for the new host',
    },
  },
  chat: {
    moinAi: {
      enabled: false,
      widgetId: 'Ho8evAJs',
      loader: 'https://widget.moin.ai/moin-loader.js',
      owner: 'allow the widget key on the new domain (the key is domain-bound)',
    },
  },
};

export default siteConfig;
