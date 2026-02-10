import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PRIMARY_DOMAIN } from "@/config/site";

const currentHost = window.location.hostname.toLowerCase();
if (currentHost === "taxihavre.com" || currentHost === "www.taxihavre.com") {
  const targetUrl = `${PRIMARY_DOMAIN}${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.replace(targetUrl);
}

createRoot(document.getElementById("root")!).render(<App />);
