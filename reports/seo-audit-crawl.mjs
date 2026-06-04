import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "/Users/primzark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright",
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspace = path.resolve(__dirname, "..");
const sitemapXml = fs.readFileSync(path.join(workspace, "public/sitemap.xml"), "utf8");
const sitemapPaths = Array.from(sitemapXml.matchAll(/<loc>https:\/\/www\.taxis-lehavre\.com([^<]+)<\/loc>/g)).map(
  ([, route]) => route,
);

const extraPaths = ["/avis-clients", "/liens", "/does-not-exist-seo-audit"];
const paths = Array.from(new Set([...sitemapPaths, ...extraPaths]));
const baseUrl = process.argv[2] || "http://127.0.0.1:4173";
const origin = new URL(baseUrl).origin;

function pickMeta(html, selector) {
  const [attribute, name] = selector.split("=");
  const safeName = name.replace(/['"]/g, "");
  const pattern = new RegExp(`<meta[^>]+${attribute}=["']${safeName}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i");
  return html.match(pattern)?.[1] ?? "";
}

function pickTitle(html) {
  return html.match(/<title>(.*?)<\/title>/is)?.[1]?.trim() ?? "";
}

async function collect(pathname, browser) {
  const url = `${origin}${pathname}`;
  const rawResponse = await fetch(url, { redirect: "manual" });
  const rawHtml = await rawResponse.text().catch(() => "");
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, deviceScaleFactor: 1 });
  const started = Date.now();
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1800);
  const loadedMs = Date.now() - started;

  const data = await page.evaluate(() => {
    const meta = (selector) => document.head.querySelector(selector)?.getAttribute("content") ?? "";
    const link = (selector) => document.head.querySelector(selector)?.getAttribute("href") ?? "";
    const headings = Array.from(document.querySelectorAll("h1,h2,h3")).map((node) => ({
      tag: node.tagName.toLowerCase(),
      text: node.textContent?.trim().replace(/\s+/g, " ") ?? "",
    }));
    const images = Array.from(document.images).map((img) => ({
      src: img.currentSrc || img.src || img.getAttribute("src") || "",
      alt: img.getAttribute("alt"),
      loading: img.getAttribute("loading"),
      width: img.naturalWidth,
      height: img.naturalHeight,
    }));
    const anchors = Array.from(document.querySelectorAll("a[href]")).map((a) => ({
      href: a.getAttribute("href") ?? "",
      text: a.textContent?.trim().replace(/\s+/g, " ") ?? "",
    }));
    const schemas = Array.from(document.querySelectorAll("script[type='application/ld+json']")).map((script) => {
      try {
        const value = JSON.parse(script.textContent ?? "{}");
        return Array.isArray(value) ? value.map((item) => item["@type"]).join(",") : value["@type"];
      } catch {
        return "invalid";
      }
    });
    const navigation = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource").map((resource) => ({
      name: resource.name,
      transferSize: resource.transferSize || 0,
      duration: Math.round(resource.duration || 0),
      initiatorType: resource.initiatorType,
    }));
    return {
      title: document.title,
      description: meta("meta[name='description']"),
      robots: meta("meta[name='robots']"),
      googlebot: meta("meta[name='googlebot']"),
      canonical: link("link[rel='canonical']"),
      ogTitle: meta("meta[property='og:title']"),
      ogDescription: meta("meta[property='og:description']"),
      h1: headings.filter((heading) => heading.tag === "h1").map((heading) => heading.text),
      headingCount: headings.length,
      firstHeadings: headings.slice(0, 12),
      schemaTypes: schemas,
      images,
      anchors,
      perf: navigation
        ? {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd),
            loadEventEnd: Math.round(navigation.loadEventEnd),
            transferSize: navigation.transferSize || 0,
          }
        : null,
      resources,
    };
  });

  const internalLinks = data.anchors
    .map((anchor) => anchor.href)
    .filter((href) => href.startsWith("/") && !href.startsWith("/api/") && !href.startsWith("/uploads/"));
  const missingAlt = data.images.filter((image) => image.alt === null);
  const emptyAlt = data.images.filter((image) => image.alt === "");
  const resourceBytes = data.resources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
  const largestResources = data.resources
    .filter((resource) => resource.transferSize > 0)
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 8);

  await page.close();

  return {
    path: pathname,
    rawStatus: rawResponse.status,
    renderedStatus: response?.status() ?? null,
    loadedMs,
    rawTitle: pickTitle(rawHtml),
    rawDescription: pickMeta(rawHtml, "name=description"),
    rawRobots: pickMeta(rawHtml, "name=robots"),
    rawHtmlBytes: rawHtml.length,
    ...data,
    internalLinkCount: internalLinks.length,
    uniqueInternalLinks: Array.from(new Set(internalLinks)).sort(),
    imageCount: data.images.length,
    imagesMissingAltCount: missingAlt.length,
    imagesEmptyAltCount: emptyAlt.length,
    resourceBytes,
    largestResources,
    issues: [
      data.h1.length !== 1 ? `Nombre de H1: ${data.h1.length}` : null,
      !data.description ? "Meta description absente après rendu JS" : null,
      data.description.length > 160 ? `Description longue: ${data.description.length} caractères` : null,
      !data.canonical ? "Canonical absente après rendu JS" : null,
      data.canonical && !data.canonical.endsWith(pathname === "/" ? "/" : pathname)
        ? `Canonical inattendue: ${data.canonical}`
        : null,
      data.schemaTypes.includes("invalid") ? "JSON-LD invalide" : null,
      missingAlt.length > 0 ? `${missingAlt.length} images sans attribut alt` : null,
      rawResponse.status === 200 && pathname.includes("does-not-exist") ? "404 renvoie HTTP 200 sur SPA" : null,
      pickTitle(rawHtml) === "Taxi Le Havre | Réservation 24h/24" && pathname !== "/"
        ? "HTML brut non différencié par route"
        : null,
    ].filter(Boolean),
  };
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    const fallbackPaths = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ];
    for (const executablePath of fallbackPaths) {
      if (fs.existsSync(executablePath)) {
        return await chromium.launch({ executablePath, headless: true });
      }
    }
    throw error;
  }
}

const browser = await launchBrowser();
const results = [];
for (const pathname of paths) {
  results.push(await collect(pathname, browser));
}
await browser.close();

const summary = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  crawled: results.length,
  pagesWithRawDuplicateHtml: results.filter(
    (result) => result.rawTitle === "Taxi Le Havre | Réservation 24h/24" && result.path !== "/",
  ).length,
  pagesWithOneH1: results.filter((result) => result.h1.length === 1).length,
  pagesWithMissingRenderedDescription: results.filter((result) => !result.description).length,
  pagesWithMissingAlt: results.filter((result) => result.imagesMissingAltCount > 0).length,
  totalRenderedIssues: results.reduce((total, result) => total + result.issues.length, 0),
  routesMissingFromSitemap: extraPaths.filter((route) => !sitemapPaths.includes(route) && route !== "/does-not-exist-seo-audit"),
};

const out = { summary, results };
const outPath = path.join(__dirname, "seo-audit-crawl-results.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify(summary, null, 2));
console.log(outPath);
