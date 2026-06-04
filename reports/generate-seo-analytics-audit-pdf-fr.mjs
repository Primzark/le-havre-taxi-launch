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
const outDir = __dirname;
const pdfPath = path.join(outDir, "audit-seo-analytics-radio-taxi-le-havre-2026-06-04.pdf");
const htmlPath = path.join(outDir, "audit-seo-analytics-radio-taxi-le-havre-2026-06-04.html");
const crawl = JSON.parse(fs.readFileSync(path.join(outDir, "seo-audit-crawl-results.json"), "utf8"));
const reportDate = "4 juin 2026";

const sources = [
  ["Site live Radio Taxi Le Havre", "https://www.taxis-lehavre.com/"],
  ["Robots.txt live", "https://www.taxis-lehavre.com/robots.txt"],
  ["Sitemap live", "https://www.taxis-lehavre.com/sitemap.xml"],
  ["Google - principes SEO JavaScript", "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics"],
  ["Google - redirects et canonicalisation", "https://developers.google.com/search/docs/crawling-indexing/301-redirects"],
  ["Google - URL Inspection Search Console", "https://support.google.com/webmasters/answer/9012289?hl=en"],
  ["Google - créer et soumettre un sitemap", "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap"],
  ["Google - installer Google Tag Manager", "https://support.google.com/tagmanager/answer/14847097?hl=en"],
  ["Google - configurer GA4 pour un site", "https://support.google.com/analytics/answer/9304153?hl=en-EN"],
  ["Le Havre Étretat Tourisme - fiche SCA Radio Taxi", "https://www.lehavre-etretat-tourisme.com/fr/fiche/le-havre/sca-radio-taxi-le-havre_TFON0012NOR076V524ZML/"],
  ["Normandie Tourisme - fiche SCA Radio Taxi", "https://www.normandie-tourisme.fr/commerce/sca-radio-taxi-le-havre/"],
];

const rows = crawl.results;
const indexedRoutes = rows.filter((row) => row.path !== "/liens" && row.path !== "/does-not-exist-seo-audit");
const topPayload = rows
  .map((row) => ({
    path: row.path,
    kb: Math.round(row.resourceBytes / 1024),
    images: row.imageCount,
    issues: row.issues.length,
  }))
  .sort((a, b) => b.kb - a.kb)
  .slice(0, 10);

const pageTypeSummary = [
  ["Pages crawlées", crawl.summary.crawled],
  ["Pages avec 1 seul H1", crawl.summary.pagesWithOneH1],
  ["Meta descriptions rendues présentes", crawl.summary.crawled - crawl.summary.pagesWithMissingRenderedDescription],
  ["Routes HTML brut non différenciées", crawl.summary.pagesWithRawDuplicateHtml],
  ["Routes manquantes du sitemap", "/avis-clients"],
  ["Routes noindex à exclure du sitemap", "/liens"],
  ["404 SPA testée", "HTTP 200 en rendu local et live pour URL inconnue sans slash"],
  ["GA4/GTM", "Non détectés"],
];

const priorityFixes = [
  {
    priority: "Haute",
    theme: "Pré-rendu / SSR",
    issue: "34 routes sur 35 servent le même HTML initial: title, description, canonical et Open Graph de l'accueil.",
    impact: "Meilleure indexation, meilleur partage social, crawl plus fiable, moins de dépendance au rendu JavaScript.",
    effort: "Moyen à fort",
    action: "Pré-rendre les pages principales ou passer à SSR/SSG. Minimum: accueil, services, pages service, circuits, tarifs, entreprise, contact, avis.",
  },
  {
    priority: "Haute",
    theme: "Trailing slash et anciens chemins",
    issue: "Les URLs avec slash final comme /services/ et /contact/ retournent 404, alors que Google affiche encore des résultats avec slash et anciens chemins.",
    impact: "Réduction des 404, récupération d'autorité des anciennes URLs, meilleure expérience utilisateur.",
    effort: "Faible",
    action: "Ajouter redirections permanentes slash final -> version sans slash et mapper les anciens chemins WordPress vers les pages actuelles.",
  },
  {
    priority: "Haute",
    theme: "Analytics",
    issue: "Aucun GA4, GTM, dataLayer, gtag ou requête analytics détectés.",
    impact: "Mesure des appels, formulaires, téléchargements app, recherches stations, conversions et sources de trafic.",
    effort: "Faible à moyen",
    action: "Installer GTM, ajouter GA4 dans GTM, puis pousser les événements clés via dataLayer.",
  },
  {
    priority: "Haute",
    theme: "404 et indexation",
    issue: "Une URL inconnue sans slash sert index.html en HTTP 200 côté live.",
    impact: "Risque de soft 404 indexables et signaux de qualité affaiblis.",
    effort: "Moyen",
    action: "Définir une stratégie 404 serveur ou limiter les rewrites aux routes connues, avec noindex et statut 404 réel si possible.",
  },
  {
    priority: "Moyenne",
    theme: "Sitemap",
    issue: "/avis-clients est lié dans le footer et optimisé, mais absent du sitemap. Les lastmod sont datés du 12 février 2026.",
    impact: "Découverte plus complète et signaux de fraîcheur plus justes.",
    effort: "Faible",
    action: "Ajouter /avis-clients, retirer/noindex /liens du sitemap, automatiser les lastmod après build.",
  },
  {
    priority: "Moyenne",
    theme: "NAP et local SEO",
    issue: "Le site utilise une adresse légale générique, alors que les fiches tourisme indiquent 37 Rue Jules Lecesne, 76600 Le Havre. Email également à harmoniser.",
    impact: "Confiance locale, cohérence GBP/directories, meilleure compréhension locale par Google.",
    effort: "Faible",
    action: "Valider l'adresse officielle puis l'ajouter dans footer, mentions légales, schema LocalBusiness, GBP et annuaires.",
  },
  {
    priority: "Moyenne",
    theme: "Performance",
    issue: "Les pages circuits chargent 2,3 à 3,7 Mo en transfert local, surtout des images touristiques. Le favicon ICO fait ~130 Ko et le PNG ~207 Ko.",
    impact: "Meilleur LCP mobile, baisse du poids initial, meilleure conversion.",
    effort: "Moyen",
    action: "Créer miniatures/responsive images, lazy-load galeries, réduire favicon/logo, supprimer le preload global de home-pont-normandie.",
  },
  {
    priority: "Moyenne",
    theme: "Parcours client",
    issue: "Le fil d'Ariane visuel est souvent Accueil > Page courante, même pour les pages enfants.",
    impact: "Meilleure navigation, meilleure compréhension de l'architecture, liens internes plus utiles.",
    effort: "Faible à moyen",
    action: "Afficher les vrais chemins: Accueil > Services > Service; Accueil > Circuits touristiques > Destination; Accueil > Contact > Stations.",
  },
];

const recommendedLandingPages = [
  ["/taxi-gare-le-havre", "Demande locale forte: gare SNCF, arrivées, départs, correspondances."],
  ["/taxi-terminal-croisiere-le-havre", "Priorité croisière, escales, hôtels, Étretat, Honfleur."],
  ["/taxi-aeroport-deauville", "Transferts aéroport et longue distance, requêtes très transactionnelles."],
  ["/taxi-etretat-depuis-le-havre", "Tourisme et croisiéristes; capter une intention précise."],
  ["/taxi-honfleur-depuis-le-havre", "Tourisme régional et passagers croisière/hôtels."],
  ["/stations-taxi-le-havre", "Structurer les 35 stations avec recherche, carte, ancrages et données locales."],
  ["/taxi-entreprise-le-havre", "Comptes entreprises, facture mensuelle, salons et déplacements clients."],
  ["/agenda-taxi-le-havre", "Événements, concerts, croisières et demande saisonnière."],
];

const analyticsEvents = [
  ["phone_click", "Clic sur numéro de téléphone", "Emplacement: header, hero, footer, page service, contact"],
  ["contact_form_submit", "Soumission formulaire", "Statut: succès/erreur, type de besoin, page source"],
  ["generate_lead", "Conversion GA4 principale", "Déclenchée après succès formulaire ou demande qualifiée"],
  ["app_download_click", "Clic App Store / Google Play", "Store, emplacement, page"],
  ["station_search", "Recherche ou géolocalisation station", "Terme, station sélectionnée, distance approximative"],
  ["directions_click", "Clic itinéraire/station", "Nom station, page, destination"],
  ["service_cta_click", "Clic réserver/appeler sur service", "Slug service, type CTA"],
  ["tour_booking_click", "Clic réserver un circuit", "ID circuit, destination, prix affiché"],
  ["review_click", "Clic laisser/lire avis", "Source: Google, page avis, footer, accueil"],
  ["partner_qr_visit", "Arrivée depuis QR partenaire", "Paramètres UTM: partner, venue, event"],
];

const customerJourney = [
  {
    stage: "1. Besoin immédiat",
    pages: "Accueil -> Appeler; Contact -> Stations; Tarifs -> Estimation",
    goal: "Réduire le temps jusqu'à l'appel ou la réservation.",
    improvements: "CTA téléphone collant mobile, tracking phone_click, page stations plus directe.",
  },
  {
    stage: "2. Besoin planifié",
    pages: "Accueil -> Services -> Service -> Contact/Appeler",
    goal: "Faire comprendre le bon service puis convertir.",
    improvements: "Breadcrumb complet, liens vers tarifs, FAQ par service, CTA répété.",
  },
  {
    stage: "3. Tourisme / croisière",
    pages: "Accueil -> Circuits touristiques -> Destination -> Réserver",
    goal: "Convertir visiteurs, croisiéristes et hôtels.",
    improvements: "Pages croisière/Étretat/Honfleur, contenu bilingue, UTM partenaires.",
  },
  {
    stage: "4. Entreprise",
    pages: "Accueil -> Entreprise -> Compte entreprise -> Formulaire dédié",
    goal: "Créer des clients récurrents.",
    improvements: "Page compte entreprise, bons taxi événement, suivi generate_lead B2B.",
  },
  {
    stage: "5. Confiance",
    pages: "Accueil -> Avis clients -> Google Business Profile",
    goal: "Rassurer avant l'appel.",
    improvements: "Ajouter /avis-clients au sitemap, schema Review/LocalBusiness propre, CTA avis.",
  },
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function sourceList() {
  return sources.map(([label, url]) => `<li><a href="${esc(url)}">${esc(label)}</a></li>`).join("");
}

function priorityClass(priority) {
  if (priority === "Haute") return "high";
  if (priority === "Moyenne") return "medium";
  return "low";
}

const pageRows = indexedRoutes
  .slice(0, 34)
  .map(
    (row) => `
      <tr>
        <td>${esc(row.path)}</td>
        <td>${esc(row.title)}</td>
        <td>${row.description.length}</td>
        <td>${row.h1.length}</td>
        <td>${esc(row.schemaTypes.filter(Boolean).join(", "))}</td>
      </tr>
    `,
  )
  .join("");

const payloadRows = topPayload
  .map(
    (row) => `
      <tr>
        <td>${esc(row.path)}</td>
        <td>${row.kb} Ko</td>
        <td>${row.images}</td>
        <td>${row.issues}</td>
      </tr>
    `,
  )
  .join("");

const priorityCards = priorityFixes
  .map(
    (fix) => `
      <article class="fix-card">
        <div class="fix-head">
          <div>
            <h3>${esc(fix.theme)}</h3>
            <p class="muted">${esc(fix.issue)}</p>
          </div>
          <span class="badge ${priorityClass(fix.priority)}">${esc(fix.priority)}</span>
        </div>
        <div class="fix-grid">
          <div><strong>Impact</strong><span>${esc(fix.impact)}</span></div>
          <div><strong>Effort</strong><span>${esc(fix.effort)}</span></div>
        </div>
        <p><strong>Action recommandée:</strong> ${esc(fix.action)}</p>
      </article>
    `,
  )
  .join("");

const landingRows = recommendedLandingPages
  .map(([page, reason]) => `<tr><td><strong>${esc(page)}</strong></td><td>${esc(reason)}</td><td>Haute à moyenne</td></tr>`)
  .join("");

const eventRows = analyticsEvents
  .map(([event, definition, params]) => `<tr><td><strong>${esc(event)}</strong></td><td>${esc(definition)}</td><td>${esc(params)}</td></tr>`)
  .join("");

const journeyCards = customerJourney
  .map(
    (journey) => `
      <article class="journey-card">
        <h3>${esc(journey.stage)}</h3>
        <p><strong>Parcours:</strong> ${esc(journey.pages)}</p>
        <p><strong>Objectif:</strong> ${esc(journey.goal)}</p>
        <p><strong>À améliorer:</strong> ${esc(journey.improvements)}</p>
      </article>
    `,
  )
  .join("");

const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Audit SEO et Analytics - Radio Taxi Le Havre</title>
  <style>
    @page { size: A4; margin: 14mm 12mm 16mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #172033; background: #f6f4ef; font-size: 10.2pt; line-height: 1.42; }
    a { color: #116466; text-decoration: none; }
    .page { max-width: 1040px; margin: 0 auto; background: #fff; }
    .cover {
      min-height: 265mm;
      padding: 30mm 18mm 18mm;
      background:
        linear-gradient(135deg, rgba(255, 203, 48, 0.94), rgba(255, 203, 48, 0.58) 28%, rgba(255, 255, 255, 0.94) 28.2%),
        linear-gradient(160deg, rgba(23, 32, 51, 0.96), rgba(23, 32, 51, 0.76));
      position: relative;
      overflow: hidden;
      page-break-after: always;
    }
    .cover::after { content: ""; position: absolute; right: -40mm; bottom: -35mm; width: 140mm; height: 90mm; background: repeating-linear-gradient(45deg, rgba(23,32,51,.18) 0 8px, transparent 8px 16px); transform: rotate(-8deg); }
    .kicker { display: inline-block; padding: 7px 11px; border: 1.5px solid rgba(23,32,51,.45); border-radius: 999px; font-weight: 700; font-size: 9pt; text-transform: uppercase; letter-spacing: .03em; }
    h1 { margin: 22mm 0 5mm; font-size: 34pt; line-height: .98; max-width: 180mm; }
    .subtitle { max-width: 155mm; font-size: 13.5pt; color: #2c3448; margin-bottom: 18mm; }
    .cover-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; max-width: 160mm; margin-top: 14mm; position: relative; z-index: 1; }
    .meta-box { border-left: 4px solid #116466; padding: 6mm; background: rgba(255,255,255,.82); border-radius: 6px; }
    .meta-box strong { display: block; text-transform: uppercase; font-size: 8.4pt; color: #116466; margin-bottom: 2mm; }
    .section { padding: 9.5mm 16mm; page-break-inside: avoid; }
    .section.break { page-break-before: always; }
    h2 { margin: 0 0 4mm; font-size: 18pt; line-height: 1.1; }
    h2::after { content: ""; display: block; width: 34mm; height: 2px; margin-top: 3mm; background: #ffcb30; }
    h3 { margin: 0 0 1.8mm; font-size: 12.5pt; line-height: 1.18; }
    p { margin: 0 0 3mm; }
    ul { margin: 1.5mm 0 0; padding-left: 5mm; }
    li { margin-bottom: 1.5mm; }
    .lead-grid { display: grid; grid-template-columns: 1.12fr .88fr; gap: 6mm; align-items: start; }
    .callout { background: #f2fbf8; border: 1px solid #b8dad0; border-left: 4px solid #116466; padding: 5mm; border-radius: 6px; }
    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 5mm; }
    .score { padding: 5mm; background: #172033; color: #fff; border-radius: 6px; min-height: 26mm; }
    .score strong { display: block; color: #ffcb30; font-size: 17pt; line-height: 1; margin-bottom: 2mm; }
    .fix-card, .journey-card { border: 1px solid #d7dce5; border-radius: 7px; padding: 5mm; margin: 4mm 0; page-break-inside: avoid; background: #fff; }
    .fix-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 5mm; }
    .muted { color: #687386; font-size: 9.4pt; margin: 0; }
    .badge { display: inline-block; border-radius: 999px; padding: 2mm 3.5mm; font-size: 8.4pt; font-weight: 700; white-space: nowrap; }
    .badge.high { background: #ffe9a1; color: #6c4d00; }
    .badge.medium { background: #e4f4ef; color: #116466; }
    .badge.low { background: #edf0f5; color: #172033; }
    .fix-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 3mm 0; }
    .fix-grid div { background: #f8f9fb; border-radius: 5px; padding: 3mm; }
    .fix-grid strong { display: block; color: #116466; font-size: 8.4pt; text-transform: uppercase; margin-bottom: 1mm; }
    .fix-grid span { display: block; font-size: 9.2pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 4mm; font-size: 8.35pt; line-height: 1.3; page-break-inside: auto; }
    thead { display: table-header-group; }
    th { background: #172033; color: #fff; text-align: left; padding: 2.2mm 2.7mm; font-size: 8pt; text-transform: uppercase; letter-spacing: .03em; }
    td { border-bottom: 1px solid #e2e6ec; padding: 2.2mm 2.7mm; vertical-align: top; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
    .box { background: #f8f9fb; border-radius: 7px; padding: 5mm; page-break-inside: avoid; }
    .sources { columns: 2; column-gap: 10mm; font-size: 9pt; }
    .sources li { break-inside: avoid; margin-bottom: 2mm; }
    .small { font-size: 8.8pt; color: #687386; }
    @media print { body { background: #fff; } .page { max-width: none; } }
  </style>
</head>
<body>
  <main class="page">
    <section class="cover">
      <span class="kicker">Radio Taxi Le Havre</span>
      <h1>Audit SEO et Analytics du site web</h1>
      <p class="subtitle">Audit technique, on-page, local SEO, performance, indexation, tracking GA4/GTM et parcours client avec fil d'Ariane recommandé.</p>
      <div class="cover-meta">
        <div class="meta-box"><strong>Préparé le</strong>${reportDate}</div>
        <div class="meta-box"><strong>Périmètre</strong>Code local, build Vite, crawl rendu de 35 routes, headers live, sitemap/robots, recherche publique Google et vérification analytics.</div>
      </div>
    </section>

    <section class="section">
      <h2>Résumé exécutif</h2>
      <div class="lead-grid">
        <div>
          <p>Le site possède une base on-page correcte après rendu JavaScript: titres uniques, H1 unique sur les pages crawlées, meta descriptions présentes, JSON-LD sur les grands types de pages et liens internes principaux. Le problème le plus important est technique: hors rendu JavaScript, presque toutes les routes servent les mêmes métadonnées que l'accueil, avec canonical vers l'accueil.</p>
          <p>Les priorités sont donc de stabiliser l'indexation, récupérer les anciens chemins indexés, installer une mesure analytics complète et clarifier le parcours client. Les gains les plus rapides viennent des redirections, du sitemap, de GTM/GA4 et des pages locales très intentionnelles: gare, croisière, aéroport, Étretat, Honfleur, stations et comptes entreprises.</p>
        </div>
        <div class="callout">
          <strong>Diagnostic global</strong>
          <p>SEO on-page rendu: bon. SEO technique initial: à renforcer. Local SEO: fort potentiel, NAP à harmoniser. Analytics: absent. Conversion: visible mais non mesurée.</p>
        </div>
      </div>
      <div class="score-grid">
        <div class="score"><strong>35</strong>routes crawlées en rendu production local.</div>
        <div class="score"><strong>34</strong>routes avec HTML brut non différencié.</div>
        <div class="score"><strong>0</strong>tag GA4/GTM détecté sur le site live.</div>
        <div class="score"><strong>17+</strong>URLs historiques visibles dans les résultats publics.</div>
      </div>
    </section>

    <section class="section break">
      <h2>Méthodologie et données disponibles</h2>
      <div class="two-col">
        <div class="box">
          <h3>Contrôles réalisés</h3>
          ${list([
            "Lecture du code: routes, hook SEO, index.html, robots.txt, sitemap.xml, config site/légal.",
            "Build production Vite réussi et analyse des tailles de bundles.",
            "Crawl local rendu avec Chrome: titres, descriptions, H1, schema, images, liens, payload.",
            "Contrôle live des headers, slash final, anciens chemins, sitemap et robots.",
            "Recherche publique Google avec requêtes site: pour vérifier les surfaces indexées visibles.",
            "Vérification GA4/GTM côté source et réseau navigateur.",
          ])}
        </div>
        <div class="box">
          <h3>Limites</h3>
          ${list([
            "Aucun accès Google Analytics, Google Search Console ou Google Business Profile n'a été fourni.",
            "Les métriques trafic réel, acquisition, conversions, taux d'engagement et requêtes GSC ne sont donc pas disponibles.",
            "PageSpeed Insights était bloqué par quota; les recommandations performance reposent sur build, payload et crawl local.",
            "Le statut d'indexation définitif doit être confirmé dans Search Console avec l'outil d'inspection d'URL.",
          ])}
        </div>
      </div>
      <table>
        <thead><tr><th>Contrôle</th><th>Résultat</th></tr></thead>
        <tbody>
          ${pageTypeSummary.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}
        </tbody>
      </table>
    </section>

    <section class="section break">
      <h2>Priorités SEO</h2>
      ${priorityCards}
    </section>

    <section class="section break">
      <h2>Audit technique</h2>
      <p>Le site est une SPA React/Vite servie par Vercel avec réécriture vers index.html. C'est fonctionnel pour l'utilisateur, mais la surface HTML initiale n'est pas optimisée par route. Google peut exécuter JavaScript, mais Google rappelle aussi que les titres, descriptions et canonical doivent aider à identifier clairement la bonne page. Le pré-rendu rend ces signaux immédiats et plus robustes pour tous les crawlers.</p>
      <div class="two-col">
        <div class="box">
          <h3>Points positifs</h3>
          ${list([
            "HTTPS actif et domaine canonique configuré en www dans le code.",
            "robots.txt accessible, sitemap accessible, API disallow.",
            "Pages rendues avec un H1 unique et des meta descriptions.",
            "JSON-LD présent: LocalBusiness, WebPage, BreadcrumbList, Service, TouristTrip, ContactPage, OfferCatalog.",
          ])}
        </div>
        <div class="box">
          <h3>Risques</h3>
          ${list([
            "Canonical brut de toutes les routes vers l'accueil avant rendu JS.",
            "Slash final en 404 sur des URLs déjà visibles dans Google.",
            "Anciennes URLs WordPress non mappées vers les pages actuelles.",
            "URLs inconnues sans slash servies en HTTP 200, risque de soft 404.",
            "Noindex de l'admin géré uniquement côté JS; préférer une protection/entête serveur.",
          ])}
        </div>
      </div>
    </section>

    <section class="section break">
      <h2>Audit on-page</h2>
      <p>Les pages rendues ont une base propre. Les améliorations doivent surtout porter sur l'intention de recherche locale, la profondeur de contenu et les liens contextuels.</p>
      <table>
        <thead><tr><th>Page</th><th>Titre rendu</th><th>Desc.</th><th>H1</th><th>Schema</th></tr></thead>
        <tbody>${pageRows}</tbody>
      </table>
    </section>

    <section class="section break">
      <h2>Local SEO</h2>
      <div class="two-col">
        <div class="box">
          <h3>Forces locales</h3>
          ${list([
            "Marque locale identifiable: Radio Taxi Le Havre / Taxi Le Havre.",
            "Téléphone visible et appels directs présents sur le header, la home, les pages services et contact.",
            "35 stations listées avec coordonnées et carte.",
            "Présence dans des annuaires touristiques officiels, utile pour croisière et tourisme.",
          ])}
        </div>
        <div class="box">
          <h3>Améliorations locales</h3>
          ${list([
            "Harmoniser NAP: nom, adresse, téléphone, email dans site, schema, GBP et annuaires.",
            "Ajouter adresse, geo, hasMap, openingHoursSpecification, contactPoint et areaServed détaillé au schema LocalBusiness.",
            "Créer pages locales par intention: gare, terminal croisière, aéroport, Étretat, Honfleur, stations.",
            "Publier régulièrement sur Google Business Profile: événements, croisières, soirées, offres partenaires.",
            "Répondre aux avis et mesurer les clics vers l'avis Google.",
          ])}
        </div>
      </div>
      <table>
        <thead><tr><th>Page / contenu à créer</th><th>Raison</th><th>Priorité</th></tr></thead>
        <tbody>${landingRows}</tbody>
      </table>
    </section>

    <section class="section break">
      <h2>Performance</h2>
      <p>Le build production passe. Les principaux leviers de performance sont les images touristiques, les ressources chargées globalement et la taille des favicons/logos. Les mesures locales indiquent environ 1,49 Mo transférés sur l'accueil, 1,15 Mo sur contact et 2,31 Mo sur la page circuits touristiques en viewport mobile local.</p>
      <table>
        <thead><tr><th>Route la plus lourde</th><th>Transfert local estimé</th><th>Images</th><th>Issues crawl</th></tr></thead>
        <tbody>${payloadRows}</tbody>
      </table>
      <div class="callout">
        <strong>Actions performance recommandées</strong>
        ${list([
          "Créer des miniatures webp/avif dédiées aux cartes de circuits au lieu de charger de grandes images.",
          "Ajouter srcset/sizes et lazy loading cohérent pour les galeries et carrousels.",
          "Supprimer le preload global de /images/home-pont-normandie.webp sur les routes qui ne l'utilisent pas en hero.",
          "Réduire le favicon ICO et PNG; le favicon ne doit pas peser plus que nécessaire.",
          "Code-splitter les routes React et lazy-loader Leaflet/StationsMap uniquement sur /contact ou la page stations.",
          "Ajouter display=swap aux Google Fonts ou self-hoster une police sous-ensemble.",
        ])}
      </div>
    </section>

    <section class="section break">
      <h2>Indexation et visibilité</h2>
      <p>Les résultats publics Google montrent que le domaine et plusieurs pages sont indexés, mais aussi que des URLs anciennes et des versions avec slash final restent visibles. Certaines renvoient aujourd'hui 404 ou redirigent vers l'accueil, ce qui crée une rupture de parcours.</p>
      <div class="two-col">
        <div class="box">
          <h3>Constats live</h3>
          ${list([
            "https://taxis-lehavre.com/ redirige vers https://www.taxis-lehavre.com/.",
            "/services sans slash répond 200; /services/ répond 404.",
            "/contact sans slash répond 200; /contact/ répond 404.",
            "/projects-archive/etretat/ répond 404 alors que Google affiche encore ce type d'URL.",
            "/nous-contact/ redirige vers l'accueil au lieu de /contact.",
          ])}
        </div>
        <div class="box">
          <h3>Actions Search Console</h3>
          ${list([
            "Vérifier la propriété domaine et la propriété https://www.taxis-lehavre.com/.",
            "Soumettre /sitemap.xml après correction.",
            "Inspecter accueil, /services, /contact, /avis-clients, /services/croisieres-port et anciennes URLs.",
            "Contrôler les rapports Pages, Sitemaps, Améliorations, Core Web Vitals et Requêtes.",
            "Demander l'indexation des pages corrigées prioritaires.",
          ])}
        </div>
      </div>
    </section>

    <section class="section break">
      <h2>Analytics et conversions</h2>
      <p>Aucun GA4 ou GTM n'est installé. Il n'est donc pas possible de produire un rapport trafic réel depuis les données du site: sessions, utilisateurs, canaux, conversions, engagement et revenus ne sont pas collectés. Le site doit d'abord installer une base de mesure propre.</p>
      <div class="two-col">
        <div class="box">
          <h3>Installation recommandée</h3>
          ${list([
            "Créer un compte GTM web et un conteneur GTM-XXXX.",
            "Ajouter le snippet GTM haut dans head et le noscript juste après body.",
            "Créer une propriété GA4 et un flux web G-XXXX.",
            "Dans GTM, créer une balise Google tag/GA4 config déclenchée sur toutes les pages.",
            "Configurer les événements dataLayer côté React.",
            "Marquer generate_lead, phone_click et app_download_click comme événements clés dans GA4.",
          ])}
        </div>
        <div class="box">
          <h3>Rapport Analytics cible</h3>
          ${list([
            "Acquisition: organic search, direct, paid/social, referral, GBP, partenaires UTM.",
            "Comportement: pages vues, engagement, scroll, recherche menu/stations, navigation services -> contact.",
            "Conversion: appels, formulaires, téléchargements app, directions stations, clics avis.",
            "Local: pages gare/croisière/Étretat/Honfleur, partenaires hôtels, événements.",
            "Qualité: erreurs formulaire, temps avant conversion, pages de sortie.",
          ])}
        </div>
      </div>
      <table>
        <thead><tr><th>Événement GA4</th><th>Définition</th><th>Paramètres utiles</th></tr></thead>
        <tbody>${eventRows}</tbody>
      </table>
    </section>

    <section class="section break">
      <h2>Parcours client et fil d'Ariane</h2>
      <p>Le site doit guider l'utilisateur selon son intention: taxi immédiat, course planifiée, tourisme/croisière, compte entreprise ou preuve de confiance. Le fil d'Ariane doit reprendre la structure réelle, pas seulement Accueil / Page.</p>
      ${journeyCards}
      <div class="callout">
        <strong>Structure cible du fil d'Ariane</strong>
        ${list([
          "Accueil > Services > Navette aéroport",
          "Accueil > Services > Croisières et port",
          "Accueil > Circuits touristiques > Étretat",
          "Accueil > Tarifs > Estimation",
          "Accueil > Contact > Stations taxi Le Havre",
          "Accueil > Entreprise > Compte entreprise",
          "Accueil > Actus > Événement / conseil",
        ])}
      </div>
    </section>

    <section class="section break">
      <h2>Plan d'action 90 jours</h2>
      <div class="two-col">
        <div class="box">
          <h3>0 à 30 jours</h3>
          ${list([
            "Installer GTM + GA4 et événements clés.",
            "Corriger redirections /nous-contact -> /contact et trailing slash.",
            "Ajouter /avis-clients au sitemap; retirer les URLs noindex du sitemap.",
            "Valider NAP officiel et enrichir LocalBusiness schema.",
            "Compresser favicon/logo et retirer le preload global inadapté.",
          ])}
        </div>
        <div class="box">
          <h3>30 à 60 jours</h3>
          ${list([
            "Pré-rendre/SSG les pages les plus importantes.",
            "Créer pages gare, croisière, aéroport, Étretat, Honfleur.",
            "Mapper les anciennes URLs indexées vers les nouvelles pages.",
            "Mettre en place des UTM pour hôtels, événements et QR partenaires.",
            "Créer un rapport mensuel GA4 + GSC.",
          ])}
        </div>
      </div>
      <div class="box" style="margin-top:5mm">
        <h3>60 à 90 jours</h3>
        ${list([
          "Optimiser les galeries/circuits avec miniatures et responsive images.",
          "Déployer le vrai fil d'Ariane visuel et schema sur les pages enfants.",
          "Créer page stations taxi Le Havre avec ancres par zone et station.",
          "Publier une routine Google Business Profile liée aux événements locaux.",
          "Analyser conversions par canal, page et partenaire; prioriser les contenus qui génèrent appels et leads.",
        ])}
      </div>
    </section>

    <section class="section break">
      <h2>Sources</h2>
      <ul class="sources">${sourceList()}</ul>
      <p class="small">Les données locales de crawl sont disponibles dans reports/seo-audit-crawl-results.json.</p>
    </section>
  </main>
</body>
</html>`;

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    for (const executablePath of [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ]) {
      if (fs.existsSync(executablePath)) {
        return chromium.launch({ executablePath, headless: true });
      }
    }
    throw error;
  }
}

fs.writeFileSync(htmlPath, html, "utf8");
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-family: Arial, sans-serif; font-size: 7px; color: #687386; width: 100%; padding: 0 12mm;">Radio Taxi Le Havre - Audit SEO et Analytics</div>`,
  footerTemplate: `<div style="font-family: Arial, sans-serif; font-size: 7px; color: #687386; width: 100%; padding: 0 12mm; display: flex; justify-content: space-between;"><span>Préparé le ${reportDate}</span><span>Page <span class="pageNumber"></span> sur <span class="totalPages"></span></span></div>`,
  margin: { top: "14mm", right: "12mm", bottom: "16mm", left: "12mm" },
});
await browser.close();

console.log(pdfPath);
