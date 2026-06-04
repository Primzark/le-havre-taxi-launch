import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initAnalytics } from "@/lib/analytics";
import "./index.css";
import "leaflet/dist/leaflet.css";

const removeLovableBadge = () => {
  const selectors = [
    'a[href*="lovable"]',
    'iframe[src*="lovable"]',
    '[data-lovable]',
    '[id*="lovable"]',
    '[class*="lovable"]',
  ];

  document.querySelectorAll<HTMLElement>(selectors.join(",")).forEach((node) => {
    node.remove();
  });

  document.querySelectorAll<HTMLElement>("a,button,div,span").forEach((node) => {
    const text = node.textContent?.trim().toLowerCase();
    if (!text || !text.includes("edit with lovable")) {
      return;
    }

    const style = window.getComputedStyle(node);
    const left = Number.parseFloat(style.left || "");
    const bottom = Number.parseFloat(style.bottom || "");

    if (style.position !== "fixed" || Number.isNaN(left) || Number.isNaN(bottom)) {
      return;
    }

    if (left <= 48 && bottom <= 48) {
      (node.closest("a,button,div") ?? node).remove();
    }
  });
};

const startLovableBadgeCleanup = () => {
  if (typeof window === "undefined" || typeof MutationObserver === "undefined") {
    return;
  }

  removeLovableBadge();

  const observer = new MutationObserver(() => {
    removeLovableBadge();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("beforeunload", () => observer.disconnect(), { once: true });
};

const clearStaleBrowserCaches = () => {
  if (typeof window === "undefined") {
    return;
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }

  if ("caches" in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key);
      });
    });
  }
};

const forceTaxiFavicon = () => {
  if (typeof document === "undefined") {
    return;
  }

  const iconVersion = "20260218-new-logo";
  const pngHref = `./favicon.png?v=${iconVersion}`;
  const icoHref = `./favicon.ico?v=${iconVersion}`;

  document
    .querySelectorAll<HTMLLinkElement>('link[rel~="icon"],link[rel="shortcut icon"],link[rel="apple-touch-icon"]')
    .forEach((link) => link.remove());

  const pngIcon = document.createElement("link");
  pngIcon.rel = "icon";
  pngIcon.type = "image/png";
  pngIcon.sizes = "64x64";
  pngIcon.href = pngHref;
  document.head.appendChild(pngIcon);

  const icoIcon = document.createElement("link");
  icoIcon.rel = "icon";
  icoIcon.type = "image/x-icon";
  icoIcon.href = icoHref;
  document.head.appendChild(icoIcon);

  const shortcut = document.createElement("link");
  shortcut.rel = "shortcut icon";
  shortcut.href = icoHref;
  document.head.appendChild(shortcut);

  const appleTouch = document.createElement("link");
  appleTouch.rel = "apple-touch-icon";
  appleTouch.href = pngHref;
  document.head.appendChild(appleTouch);
};

clearStaleBrowserCaches();
forceTaxiFavicon();
startLovableBadgeCleanup();
initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
