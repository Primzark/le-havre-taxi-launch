import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { PRIMARY_DOMAIN } from "@/config/site";
import { buildLegacyDomainRedirectUrl } from "@/utils/redirect";

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

createRoot(document.getElementById("root")!).render(<App />);
