import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { PRIMARY_DOMAIN } from "@/config/site";
import { buildLegacyDomainRedirectUrl } from "@/utils/redirect";

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

const targetUrl = buildLegacyDomainRedirectUrl(
  window.location.hostname,
  window.location.pathname,
  window.location.search,
  window.location.hash,
  PRIMARY_DOMAIN,
);
if (targetUrl) {
  window.location.replace(targetUrl);
}

startLovableBadgeCleanup();

createRoot(document.getElementById("root")!).render(<App />);
