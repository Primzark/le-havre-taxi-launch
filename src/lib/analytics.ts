type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __taxiAnalyticsInitialized?: boolean;
    __taxiAnalyticsClickListener?: boolean;
  }
}

const GTM_ID = String(import.meta.env.VITE_GTM_ID ?? "").trim();
const GA_MEASUREMENT_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
const SITE_GTM_ID = "GTM-KVP785FQ";
const SITE_GA_MEASUREMENT_ID = "G-LMVZ2BD576";
const activeGtmId = SITE_GTM_ID || GTM_ID;
const activeGaMeasurementId = SITE_GA_MEASUREMENT_ID || GA_MEASUREMENT_ID;

export const isAnalyticsConfigured = Boolean(activeGtmId || activeGaMeasurementId);

const canUseBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

const cleanParams = (params: AnalyticsParams = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  );

const injectScript = (id: string, src: string) => {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const hasGtmScript = (containerId: string) =>
  Boolean(
    document.querySelector(
      `script[src*="googletagmanager.com/gtm.js"][src*="${containerId}"]`,
    ),
  );

const getLinkLabel = (link: HTMLAnchorElement) =>
  link.getAttribute("aria-label")?.trim() ||
  link.textContent?.replace(/\s+/g, " ").trim() ||
  link.getAttribute("href") ||
  "Lien";

const bindJourneyClickTracking = () => {
  if (!canUseBrowser() || window.__taxiAnalyticsClickListener) {
    return;
  }

  window.__taxiAnalyticsClickListener = true;
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>("a[href]")
      : null;

    if (!target) {
      return;
    }

    const href = target.getAttribute("href") ?? "";
    const label = getLinkLabel(target);
    const pagePath = `${window.location.pathname}${window.location.search}`;
    const linkId = target.dataset.analyticsId;
    const linkLocation = target.dataset.analyticsLocation;
    const intent = target.dataset.analyticsIntent;

    if (href.startsWith("tel:")) {
      trackEvent("phone_click", {
        click_url: href,
        link_text: label,
        page_path: pagePath,
        link_id: linkId,
        link_location: linkLocation,
        intent,
      });
      return;
    }

    if (href.startsWith("mailto:")) {
      trackEvent("email_click", {
        click_url: href,
        link_text: label,
        page_path: pagePath,
      });
      return;
    }

    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (/itunes\.apple\.com|apps\.apple\.com/i.test(url.hostname)) {
      trackEvent("app_download_click", {
        app_store: "apple",
        click_url: url.toString(),
        link_text: label,
        page_path: pagePath,
      });
      return;
    }

    if (/play\.google\.com/i.test(url.hostname)) {
      trackEvent("app_download_click", {
        app_store: "google_play",
        click_url: url.toString(),
        link_text: label,
        page_path: pagePath,
      });
      return;
    }

    if (/google\./i.test(url.hostname) && /\/maps|maps\/search|maps\/dir/i.test(url.href)) {
      trackEvent("directions_click", {
        click_url: url.toString(),
        link_text: label,
        page_path: pagePath,
      });
      return;
    }

    if (/facebook\.com|instagram\.com/i.test(url.hostname)) {
      trackEvent("social_click", {
        channel: url.hostname.includes("instagram") ? "instagram" : "facebook",
        click_url: url.toString(),
        link_text: label,
        page_path: pagePath,
      });
    }
  });
};

export const initAnalytics = () => {
  if (!isAnalyticsConfigured || !canUseBrowser()) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  bindJourneyClickTracking();

  if (window.__taxiAnalyticsInitialized) {
    return;
  }

  window.__taxiAnalyticsInitialized = true;

  if (activeGaMeasurementId) {
    window.gtag = window.gtag ?? ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

    injectScript(
      "taxi-ga4",
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(activeGaMeasurementId)}`,
    );
    window.gtag("js", new Date());
    window.gtag("config", activeGaMeasurementId, {
      send_page_view: false,
    });
  }

  if (activeGtmId) {
    if (!hasGtmScript(activeGtmId)) {
      window.dataLayer.push({
        "gtm.start": Date.now(),
        event: "gtm.js",
      });
      injectScript("taxi-gtm", `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(activeGtmId)}`);
    }
    return;
  }

};

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (!isAnalyticsConfigured || !canUseBrowser()) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  const payload = cleanParams(params);
  window.dataLayer.push({
    event: eventName,
    ...payload,
  });

  const shouldSendViaGtag =
    activeGaMeasurementId &&
    typeof window.gtag === "function" &&
    (!activeGtmId || eventName !== "page_view");

  if (shouldSendViaGtag) {
    window.gtag("event", eventName, {
      ...payload,
      send_to: activeGaMeasurementId,
    });
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (!isAnalyticsConfigured || !canUseBrowser()) {
    return;
  }

  trackEvent("page_view", {
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
    page_title: pageTitle ?? document.title,
  });
};
