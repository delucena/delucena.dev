(function() {
  'use strict';

  const STORAGE_KEY = 'dlc_attribution_v1';
  const COOKIE_KEY = 'dlc_attribution_v1';
  const ENTRY_SESSION_KEY = 'dlc_traffic_entry_sent_v1';
  const ENGAGED_SESSION_KEY = 'dlc_portfolio_engaged_sent_v1';
  const ATTRIBUTION_TTL_DAYS = 30;

  const UTM_FIELDS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
  ];

  const BOT_UA_REGEX = /(bot|spider|crawler|headless|lighthouse|pagespeed|slurp|bingpreview|facebookexternalhit|googleweblight|apis-google|duckduckbot|yandex|baiduspider|semrush|ahrefs)/i;

  const state = {
    attribution: createEmptyAttribution(),
    ignored: false
  };

  function createEmptyAttribution() {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: ''
    };
  }

  function isKnownBot() {
    try {
      const ua = navigator.userAgent || '';
      return BOT_UA_REGEX.test(ua) || navigator.webdriver === true;
    } catch (_) {
      return false;
    }
  }

  function isLocalEnv() {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === '::1';
  }

  function readUtmFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const attribution = createEmptyAttribution();
    let hasAny = false;

    UTM_FIELDS.forEach((field) => {
      const value = (params.get(field) || '').trim();
      attribution[field] = value;
      if (value) {
        hasAny = true;
      }
    });

    return { attribution, hasAny };
  }

  function readCookie(name) {
    const encodedName = encodeURIComponent(name) + '=';
    const cookieParts = document.cookie ? document.cookie.split('; ') : [];

    for (let index = 0; index < cookieParts.length; index += 1) {
      if (cookieParts[index].startsWith(encodedName)) {
        return decodeURIComponent(cookieParts[index].slice(encodedName.length));
      }
    }

    return null;
  }

  function writeCookie(name, value, days) {
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    const encodedName = encodeURIComponent(name);
    const encodedValue = encodeURIComponent(value);
    const secureAttr = window.location.protocol === 'https:' ? '; Secure' : '';

    document.cookie = `${encodedName}=${encodedValue}; Expires=${expiresAt}; Path=/; SameSite=Lax${secureAttr}`;
  }

  function parseStoredPayload(raw) {
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      if (typeof parsed.expires_at !== 'number' || parsed.expires_at <= Date.now()) {
        return null;
      }

      const attribution = createEmptyAttribution();
      UTM_FIELDS.forEach((field) => {
        const value = parsed[field];
        attribution[field] = typeof value === 'string' ? value : '';
      });

      return attribution;
    } catch (_) {
      return null;
    }
  }

  function readPersistedAttribution() {
    const fromLocalStorage = parseStoredPayload(localStorage.getItem(STORAGE_KEY));
    if (fromLocalStorage) {
      return fromLocalStorage;
    }

    const fromCookie = parseStoredPayload(readCookie(COOKIE_KEY));
    if (fromCookie) {
      return fromCookie;
    }

    return createEmptyAttribution();
  }

  function persistAttribution(attribution) {
    const expiresAt = Date.now() + ATTRIBUTION_TTL_DAYS * 24 * 60 * 60 * 1000;
    const payload = {
      ...attribution,
      expires_at: expiresAt
    };
    const serialized = JSON.stringify(payload);

    localStorage.setItem(STORAGE_KEY, serialized);
    writeCookie(COOKIE_KEY, serialized, ATTRIBUTION_TTL_DAYS);
  }

  function resolveAttribution() {
    const fromUrl = readUtmFromUrl();

    if (fromUrl.hasAny) {
      persistAttribution(fromUrl.attribution);
      return fromUrl.attribution;
    }

    const persisted = readPersistedAttribution();
    persistAttribution(persisted);
    return persisted;
  }

  function buildBaseEventFields() {
    return {
      page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      referrer: document.referrer || '',
      timestamp: new Date().toISOString(),
      ...state.attribution
    };
  }

  function sendToGA4(eventName, payload) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
      return true;
    }
    return false;
  }

  function sendToPlausible(eventName, payload) {
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: payload });
      return true;
    }
    return false;
  }

  function sendEvent(eventName, extraFields) {
    if (state.ignored) {
      return;
    }

    const payload = {
      ...buildBaseEventFields(),
      ...(extraFields || {})
    };

    const sentToGa4 = sendToGA4(eventName, payload);
    const sentToPlausible = sendToPlausible(eventName, payload);

    if (isLocalEnv() && !sentToGa4 && !sentToPlausible) {
      console.info('[analytics:debug]', eventName, payload);
    }
  }

  function sendEntryAndPageView() {
    const hasSentEntry = sessionStorage.getItem(ENTRY_SESSION_KEY) === '1';

    if (!hasSentEntry) {
      sendEvent('traffic_entry');
      sessionStorage.setItem(ENTRY_SESSION_KEY, '1');
    }

    sendEvent('page_view');
  }

  function firePortfolioEngagedOnce(reason, ctaId) {
    if (sessionStorage.getItem(ENGAGED_SESSION_KEY) === '1') {
      return;
    }

    sendEvent('portfolio_engaged', {
      engagement_reason: reason,
      cta_id: ctaId || ''
    });
    sessionStorage.setItem(ENGAGED_SESSION_KEY, '1');
  }

  function setupEngagementByTime() {
    window.setTimeout(function() {
      firePortfolioEngagedOnce('time_on_page_30s', '');
    }, 30000);
  }

  function setupEngagementByCtaClick() {
    document.addEventListener('click', function(event) {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const ctaElement = target.closest('[data-analytics-cta], a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="whatsapp.com"], a[href^="mailto:"]');
      if (!ctaElement) {
        return;
      }

      const ctaId = ctaElement.getAttribute('data-analytics-cta') || ctaElement.getAttribute('href') || 'cta_click';
      firePortfolioEngagedOnce('cta_click', ctaId);
    }, { passive: true });
  }

  function init() {
    state.ignored = isKnownBot();
    if (state.ignored) {
      return;
    }

    state.attribution = resolveAttribution();

    sendEntryAndPageView();
    setupEngagementByTime();
    setupEngagementByCtaClick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
