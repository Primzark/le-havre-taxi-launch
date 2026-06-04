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
const htmlPath = path.join(outDir, "radio-taxi-le-havre-marketing-opportunities-2026-06-04.html");
const pdfPath = path.join(outDir, "radio-taxi-le-havre-marketing-opportunities-2026-06-04.pdf");

const reportDate = "4 June 2026";

const sources = [
  ["Carré des Docks agenda", "https://www.dockslehavre.com/"],
  ["Business Expo Le Havre", "https://www.dockslehavre.com/evenement/business-expo-le-havre/"],
  ["Un Été au Havre", "https://www.france.fr/fr/evenement/un-ete-au-havre/"],
  ["Normandie Impressionniste 2026", "https://en.normandie-tourisme.fr/programme/festival-normandie-impressionniste-2026/"],
  ["HAROPA 2026 cruise outlook", "https://www.haropaport.com/en/news/sea-cruise-more-200-calls-expected-2026"],
  ["Le Havre Nuits Suspendues", "https://lehavre.fr/actualites/toutes-les-actualites/la-billetterie-est-ouverte-pour-le-festival-nuits-suspendues-2026"],
  ["Plastic Odyssey France Tour", "https://plasticodyssey.org/en/plastic-odyssey-france-tour/"],
  ["Campus Le Havre Normandie agenda", "https://www.campus-lehavre-normandie.fr/fr/agenda"],
  ["G7 official site", "https://www.g7.fr/en/"],
  ["G7 services", "https://www.g7.fr/en/discover-our-services/g7"],
  ["Addison Lee partnerships", "https://www.addisonlee.com/work-with-us-3/brand-partnerships/"],
  ["Central Taxis tourism listing", "https://edinburgh.org/point-of-interest/central-taxis/"],
  ["Taxiblu loyalty program", "https://taxiblu.it/en/servizi/loyalty-program/"],
  ["C Cabs hotel and business loyalty", "https://www.ccabs.net/our-services/hotel-business-loyalty-scheme/"],
  ["United Taxi corporate accounts", "https://www.unitedtaxi.com/corporate-accounts"],
  ["Blue Top Cabs corporate accounts", "https://www.bluetop.com/corporate-accounts/"],
];

const events = [
  {
    name: "Business Expo Le Havre",
    date: "4 Jun 2026",
    location: "Carré des Docks, Le Havre",
    attendance: "150+ exhibitor proxy; B2B visitor flow",
    demand: "Medium-high: morning arrivals, lunch movements, and 16:00-19:00 departures.",
    actions: [
      "Before: publish a LinkedIn and Google Business Profile post aimed at exhibitors, sales teams, and visitors needing station/airport transfers.",
      "During: keep a visible pickup point message for Carré des Docks and offer phone-first booking for same-day returns.",
      "After: email or call exhibitors with a corporate monthly-invoice offer and event voucher option.",
    ],
    priority: "High",
    source: "Business Expo Le Havre",
  },
  {
    name: "Salon de la Croisière et du Voyage",
    date: "6 Jun 2026",
    location: "Carré des Docks, Le Havre",
    attendance: "Free-entry travel audience; local tourism intent",
    demand: "Medium: daytime trips, tourism questions, train station and hotel transfers.",
    actions: [
      "Before: promote cruise terminal, Étretat, Honfleur, and Deauville airport transfer pages.",
      "During: place QR booking cards with travel exhibitors where possible.",
      "After: retarget with a tourism package post: port, station, hotel, Étretat, Honfleur.",
    ],
    priority: "Medium",
    source: "Carré des Docks agenda",
  },
  {
    name: "Plastic Odyssey France Tour",
    date: "16-23 Jun 2026",
    location: "Le Havre stopover",
    attendance: "Public visits, education groups, port and tourism audience",
    demand: "Medium: family, school, port, and visitor trips concentrated in daytime slots.",
    actions: [
      "Before: publish practical city-to-port pickup instructions and bilingual tourism copy.",
      "During: monitor public tour times and position messaging around station, port, and hotels.",
      "After: collect reviews from visitor transfers and reuse positive comments in tourism pages.",
    ],
    priority: "Medium",
    source: "Plastic Odyssey France Tour",
  },
  {
    name: "Fête de la Musique and Salvatore Adamo",
    date: "21 Jun 2026",
    location: "Citywide; Carré des Docks concert",
    attendance: "Citywide nightlife plus up to roughly 2,000 venue seats",
    demand: "High: late evening and post-concert returns, especially around beach, centre, Docks, and station.",
    actions: [
      "Before: run a 'book your return before the concert' post with phone and app links.",
      "During: publish pickup guidance by district and keep dispatch capacity ready after 22:30.",
      "After: send a short review request to riders who booked by phone or form.",
    ],
    priority: "High",
    source: "Carré des Docks agenda",
  },
  {
    name: "Festival Pulaagu / Baaba Maal",
    date: "27 Jun 2026",
    location: "Carré des Docks, Le Havre",
    attendance: "Large concert audience; venue capacity proxy around 2,000+",
    demand: "High: group rides and post-show departures.",
    actions: [
      "Before: publish group taxi and return booking messages in French and English.",
      "During: use a simple pickup map showing safe collection points near the venue.",
      "After: invite riders to save the number for future concerts and late-night returns.",
    ],
    priority: "High",
    source: "Carré des Docks agenda",
  },
  {
    name: "Un Été au Havre",
    date: "27 Jun-20 Sep 2026",
    location: "Citywide Le Havre art and tourism season",
    attendance: "Large seasonal visitor base; previous editions have drawn hundreds of thousands of visits",
    demand: "Very high over time: hotel, cruise, station, art route, beach, and restaurant movements.",
    actions: [
      "Before: launch a dedicated 'Taxi Un Été au Havre' landing page with routes and booking CTA.",
      "During: post weekly art-route pickup tips and combine hotel QR cards with tourist-route offers.",
      "After: turn top routes into evergreen tourism pages for Étretat, Honfleur, and Le Havre highlights.",
    ],
    priority: "High",
    source: "Un Été au Havre",
  },
  {
    name: "Normandie Impressionniste 2026",
    date: "29 May-27 Sep 2026",
    location: "Le Havre, Étretat, Normandy cultural route",
    attendance: "Regional festival with high tourism visibility",
    demand: "High: museum, hotel, station, airport, and coastal-tour transfers.",
    actions: [
      "Before: create bilingual pages for museum and Normandy impressionist taxi circuits.",
      "During: partner with hotels and guides for half-day/private taxi tour bookings.",
      "After: request reviews mentioning Étretat, Honfleur, Le Havre, and guide quality.",
    ],
    priority: "High",
    source: "Normandie Impressionniste 2026",
  },
  {
    name: "Le Havre Cruise Calls",
    date: "Ongoing through 2026",
    location: "Le Havre cruise terminal and city centre",
    attendance: "137 calls forecast for Le Havre in 2026; some ships carry several thousand passengers",
    demand: "Very high on call days: port-to-city, port-to-station, Étretat, Honfleur, Paris, airport.",
    actions: [
      "Before: maintain a cruise-call calendar and publish transfer availability before major ships arrive.",
      "During: provide port pickup instructions, fixed example routes, and English-speaking booking prompts.",
      "After: follow up with cruise passenger reviews and update FAQs based on repeated questions.",
    ],
    priority: "High",
    source: "HAROPA 2026 cruise outlook",
  },
  {
    name: "Fête Nationale",
    date: "14 Jul 2026",
    location: "Le Havre beach, city centre, fireworks areas",
    attendance: "Large local public-holiday crowd",
    demand: "Very high after 23:00 with concentrated return demand and limited parking convenience.",
    actions: [
      "Before: promote advance return booking and safe late-night rides.",
      "During: keep pickup-zone messaging short and visual for beach, station, and centre.",
      "After: push a weekend-safe-ride reminder for following summer nightlife dates.",
    ],
    priority: "High",
    source: "Seasonal public-holiday planning; confirm official city details closer to date",
  },
  {
    name: "Nuits Suspendues",
    date: "16-19 Jul 2026",
    location: "Jardins suspendus, Le Havre",
    attendance: "Multi-night festival audience",
    demand: "Very high: evening arrivals and late-night returns from a less central venue.",
    actions: [
      "Before: publish pickup point visuals and a 'book your return' CTA one week and one day before.",
      "During: coordinate dispatch capacity around expected end times and monitor social posts for schedule changes.",
      "After: collect reviews from festival riders and convert the post into a reusable festival transport template.",
    ],
    priority: "High",
    source: "Le Havre Nuits Suspendues",
  },
  {
    name: "Béton and September Shows",
    date: "18-20 Sep 2026 and September show weekends",
    location: "Le Havre venues including Carré des Docks",
    attendance: "Festival and large concert audiences",
    demand: "High: evening and weekend transport, especially post-show.",
    actions: [
      "Before: publish a September event roundup covering concerts, festivals, and station transfers.",
      "During: use short-form social posts with pickup instructions per venue.",
      "After: invite venues to add a Radio Taxi booking link to confirmation emails or event pages.",
    ],
    priority: "Medium",
    source: "Carré des Docks agenda",
  },
  {
    name: "Student Rentrée and Nuit des Étudiants du Monde",
    date: "Late Aug-Sep rentrée; 5 Nov 2026 NEM listing",
    location: "Campus Le Havre Normandie, student residences, Magic Mirrors",
    attendance: "Student and international-student audience",
    demand: "Medium-high: station arrivals, housing moves, late-night safe rides.",
    actions: [
      "Before: launch student-safe-ride messaging with QR cards for residences and student associations.",
      "During: target key nights with practical ride-home posts and easy phone booking.",
      "After: create a referral mechanic: save the number, share with a roommate, review after first ride.",
    ],
    priority: "Medium",
    source: "Campus Le Havre Normandie agenda",
  },
];

const competitors = [
  {
    company: "G7 - Paris",
    channels: "Website, app, social links, Google visibility",
    practices: [
      "Clear app-first booking proposition with live tracking, in-app payment, scheduled rides, and service categories.",
      "Differentiated product lines: green taxi, van, VIP, family, pets, accessibility, and third-party payment.",
      "Trust language based on fleet scale, reliability, and greener vehicle share.",
    ],
    localIdea: "Mirror the category clarity locally: cruise taxi, airport taxi, business taxi, PMR taxi, group taxi, tourism taxi.",
    impact: "High",
    effort: "Medium",
    source: "G7 official site",
  },
  {
    company: "Addison Lee - London",
    channels: "Website, corporate pages, partnership pages",
    practices: [
      "B2B partner model with co-branded booking tools, affiliate incentives, and venue/customer travel support.",
      "Strong business travel positioning around reliability, account management, and transparent booking.",
      "Clear partner targets: travel agents, venues, affiliates, and corporates.",
    ],
    localIdea: "Create a Le Havre partner program for hotels, venues, travel agencies, cruise partners, and restaurants with tracked QR links.",
    impact: "High",
    effort: "Medium",
    source: "Addison Lee partnerships",
  },
  {
    company: "Central Taxis - Edinburgh",
    channels: "Tourism listing, corporate and accessibility positioning",
    practices: [
      "Visible in official tourism channels, including visitor and conference transport needs.",
      "Promotes delegate transfers, airport meet-and-greet, and corporate account support.",
      "Uses local identity and cooperative trust as brand advantages.",
    ],
    localIdea: "Get listed with Le Havre tourism and conference partners; pitch Carré des Docks delegate transfer support.",
    impact: "Medium-high",
    effort: "Medium",
    source: "Central Taxis tourism listing",
  },
  {
    company: "Taxiblu - Milan",
    channels: "Website, app/WhatsApp booking, loyalty offer",
    practices: [
      "Loyalty-style incentive through airline miles.",
      "Simple booking access via appTaxi and WhatsApp.",
      "Airport route positioning and easy repeat booking language.",
    ],
    localIdea: "Use a regulation-safe loyalty approach: priority booking recognition, partner benefits, referral tracking, and repeat-customer communication.",
    impact: "Medium",
    effort: "Low-medium",
    source: "Taxiblu loyalty program",
  },
  {
    company: "C Cabs - Blackpool",
    channels: "Website, app, hotel/business loyalty",
    practices: [
      "Hotel and business loyalty scheme with priority booking and rewards language.",
      "Targets local accommodation partners that repeatedly influence taxi choice.",
      "Turns partner referrals into an ongoing relationship, not one-off card drops.",
    ],
    localIdea: "Pilot a concierge QR scheme with 10 hotels and restaurants, tracking rides by partner code.",
    impact: "High",
    effort: "Low-medium",
    source: "C Cabs hotel and business loyalty",
  },
  {
    company: "United Taxi and Blue Top Cabs - North America",
    channels: "Corporate-account web pages",
    practices: [
      "Monthly invoices, client or employee ride billing, taxi vouchers, and account management.",
      "Positioning for employers, events, clinics, families, and regular riders.",
      "Simple B2B explanation that reduces friction for recurring transport buyers.",
    ],
    localIdea: "Create 'Compte entreprise taxi Le Havre' and 'bons taxi événement' pages with a short lead form.",
    impact: "High",
    effort: "Medium",
    source: "United Taxi corporate accounts",
  },
];

const strategies = [
  ["Event-led Google Business Profile posts", "Post 2-3 times weekly around cruise calls, concerts, fairs, student events, and public holidays.", "High", "Low", "High", "High"],
  ["Dedicated event and venue pages", "Build landing pages for Carré des Docks, cruise terminal, Magic Mirrors, Jardins suspendus, station, airport, Étretat, and Honfleur.", "High", "Medium", "High", "High"],
  ["Hotel and concierge QR program", "Give hotels/restaurants a QR code, partner code, and simple booking card in French/English.", "High", "Medium", "High", "High"],
  ["Corporate accounts and event vouchers", "Offer monthly invoicing, employee/client rides, and pre-arranged event taxi vouchers.", "High", "Medium", "High", "High"],
  ["Cruise terminal transport packages", "Package port-to-city, port-to-station, Étretat, Honfleur, Paris, and Deauville airport routes.", "High", "Medium", "High", "High"],
  ["Review capture workflow", "After completed rides, send a short review request and reply to Google reviews within 48 hours.", "Medium-high", "Low", "High", "High"],
  ["Student safe-ride campaign", "Campus QR cards, social posts before major student nights, roommate referral reminders.", "Medium", "Low", "Medium", "Medium"],
  ["Tourism-focused taxi circuits", "Market half-day or day routes around Le Havre, Étretat, Honfleur, Deauville, and Normandy Impressionist stops.", "Medium-high", "Medium", "Medium-high", "Medium"],
  ["Local influencer micro-collabs", "Use small local creators for event-night pickup tips and tourist-route content.", "Medium", "Low-medium", "Medium", "Medium"],
  ["Community sponsorships", "Support senior, student, sports, or cultural events with visible ride-home messaging.", "Medium", "Medium", "Medium", "Low-medium"],
];

const actionPlan = [
  {
    phase: "Week 1",
    items: [
      "Create a live event watchlist from Carré des Docks, LeHavre.fr, tourism office, HAROPA cruise updates, Campus Le Havre, Magic Mirrors, and local venue pages.",
      "Publish first Google Business Profile posts for June concerts, cruise calls, and summer tourism.",
      "Draft partner card copy for hotels, restaurants, bars, venues, and tourism operators.",
    ],
  },
  {
    phase: "Weeks 2-4",
    items: [
      "Launch three landing pages: cruise terminal taxi, Carré des Docks taxi, and taxi tourism Étretat/Honfleur.",
      "Contact 10 hotels, 5 restaurants/bars, 2 event venues, and 2 tourism operators with a QR partner proposal.",
      "Build a post-ride review request process for phone and form bookings.",
    ],
  },
  {
    phase: "Days 30-60",
    items: [
      "Add corporate account and event voucher pages; pitch Business Expo exhibitors and local employers.",
      "Run event-specific boosted posts for Nuits Suspendues, Fête Nationale, and major Carré des Docks shows.",
      "Track partner codes, event bookings, missed calls, review growth, and landing-page conversions.",
    ],
  },
  {
    phase: "Days 60-90",
    items: [
      "Double down on the best-performing partner categories and prune low-response outreach.",
      "Package cruise and tourism routes into seasonal web content and hotel desk material.",
      "Turn the monthly event watchlist into a repeating operating rhythm for dispatch and marketing.",
    ],
  },
];

const monitoringSources = [
  "Carré des Docks agenda for concerts, business shows, conventions, and performances.",
  "LeHavre.fr and Le Havre Seine Métropole for city celebrations, seasonal events, and public information.",
  "Le Havre Étretat tourism and France.fr for tourism seasons, festivals, and destination campaigns.",
  "HAROPA and cruise terminal sources for ship-call calendars and high-passenger days.",
  "Campus Le Havre Normandie for rentrée, student, international, and nightlife-related events.",
  "Magic Mirrors, Stade Océane, local bars, restaurants, museums, and cultural venues for shorter-notice demand spikes.",
];

const kpis = [
  "Bookings tagged by event, venue, cruise ship, partner, or campaign.",
  "Google Business Profile calls, direction requests, photo views, and post interactions.",
  "Landing-page visits and conversion clicks for port, station, airport, venue, and tourism pages.",
  "Partner QR scans and partner-coded bookings.",
  "Review volume, rating stability, review response time, and keywords mentioned in reviews.",
  "Missed-call rate and dispatch wait times on high-demand event nights.",
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sourceLink(label) {
  const source = sources.find(([name]) => name === label);
  if (!source) return escapeHtml(label);
  return `<a href="${escapeHtml(source[1])}">${escapeHtml(source[0])}</a>`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

const eventCards = events
  .map(
    (event) => `
      <article class="event-card">
        <div class="event-top">
          <div>
            <h3>${escapeHtml(event.name)}</h3>
            <p class="muted">${escapeHtml(event.date)} | ${escapeHtml(event.location)}</p>
          </div>
          <span class="badge ${event.priority.toLowerCase()}">${escapeHtml(event.priority)}</span>
        </div>
        <div class="facts">
          <div><strong>Attendance proxy</strong><span>${escapeHtml(event.attendance)}</span></div>
          <div><strong>Transport demand</strong><span>${escapeHtml(event.demand)}</span></div>
        </div>
        <h4>Promotional actions</h4>
        ${list(event.actions)}
        <p class="source">Source: ${sourceLink(event.source)}</p>
      </article>
    `,
  )
  .join("");

const competitorCards = competitors
  .map(
    (competitor) => `
      <article class="competitor-card">
        <div class="event-top">
          <div>
            <h3>${escapeHtml(competitor.company)}</h3>
            <p class="muted">${escapeHtml(competitor.channels)}</p>
          </div>
          <span class="metric">${escapeHtml(competitor.impact)} impact</span>
        </div>
        ${list(competitor.practices)}
        <div class="recommendation"><strong>Local adaptation:</strong> ${escapeHtml(competitor.localIdea)}</div>
        <p class="source">Source: ${sourceLink(competitor.source)}</p>
      </article>
    `,
  )
  .join("");

const strategyRows = strategies
  .map(
    ([name, detail, impact, effort, roi, priority]) => `
      <tr>
        <td><strong>${escapeHtml(name)}</strong><span>${escapeHtml(detail)}</span></td>
        <td>${escapeHtml(impact)}</td>
        <td>${escapeHtml(effort)}</td>
        <td>${escapeHtml(roi)}</td>
        <td><span class="small-badge ${priority.toLowerCase().replace("medium", "med")}">${escapeHtml(priority)}</span></td>
      </tr>
    `,
  )
  .join("");

const actionBlocks = actionPlan
  .map(
    (phase) => `
      <div class="phase">
        <h3>${escapeHtml(phase.phase)}</h3>
        ${list(phase.items)}
      </div>
    `,
  )
  .join("");

const sourceList = sources
  .map(([name, url]) => `<li><a href="${escapeHtml(url)}">${escapeHtml(name)}</a></li>`)
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Radio Taxi Le Havre - Marketing Opportunities Report</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 12mm 16mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #172033;
      background: #f6f4ef;
      font-size: 10.6pt;
      line-height: 1.42;
    }

    a {
      color: #116466;
      text-decoration: none;
    }

    .page {
      max-width: 1040px;
      margin: 0 auto;
      background: white;
    }

    .cover {
      min-height: 265mm;
      padding: 30mm 18mm 18mm;
      background:
        linear-gradient(135deg, rgba(255, 203, 48, 0.93), rgba(255, 203, 48, 0.6) 28%, rgba(255, 255, 255, 0.94) 28.2%),
        linear-gradient(160deg, rgba(23, 32, 51, 0.96), rgba(23, 32, 51, 0.76));
      color: #172033;
      position: relative;
      overflow: hidden;
      page-break-after: always;
    }

    .cover::after {
      content: "";
      position: absolute;
      right: -40mm;
      bottom: -35mm;
      width: 140mm;
      height: 90mm;
      background: repeating-linear-gradient(45deg, rgba(23, 32, 51, 0.18) 0 8px, transparent 8px 16px);
      transform: rotate(-8deg);
    }

    .cover-kicker {
      display: inline-block;
      padding: 7px 11px;
      border: 1.5px solid rgba(23, 32, 51, 0.45);
      border-radius: 999px;
      font-weight: 700;
      font-size: 9pt;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    h1 {
      margin: 22mm 0 5mm;
      font-size: 34pt;
      line-height: 0.98;
      letter-spacing: 0;
      max-width: 180mm;
    }

    .subtitle {
      max-width: 150mm;
      font-size: 13.5pt;
      color: #2c3448;
      margin-bottom: 18mm;
    }

    .cover-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
      max-width: 160mm;
      margin-top: 14mm;
      position: relative;
      z-index: 1;
    }

    .meta-box {
      border-left: 4px solid #116466;
      padding: 6mm;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 6px;
    }

    .meta-box strong {
      display: block;
      text-transform: uppercase;
      font-size: 8.5pt;
      color: #116466;
      margin-bottom: 2mm;
    }

    .section {
      padding: 10mm 16mm;
      page-break-inside: avoid;
    }

    .section.break {
      page-break-before: always;
    }

    h2 {
      margin: 0 0 4mm;
      font-size: 18pt;
      line-height: 1.1;
      color: #172033;
    }

    h2::after {
      content: "";
      display: block;
      width: 34mm;
      height: 2px;
      margin-top: 3mm;
      background: #ffcb30;
    }

    h3 {
      margin: 0 0 1.5mm;
      font-size: 12.7pt;
      line-height: 1.18;
      color: #172033;
    }

    h4 {
      margin: 4mm 0 1mm;
      font-size: 9.3pt;
      text-transform: uppercase;
      color: #566074;
      letter-spacing: 0.04em;
    }

    p {
      margin: 0 0 3mm;
    }

    ul {
      margin: 1.5mm 0 0;
      padding-left: 5mm;
    }

    li {
      margin-bottom: 1.6mm;
    }

    .lead-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 6mm;
      align-items: start;
    }

    .callout {
      background: #f2fbf8;
      border: 1px solid #b8dad0;
      border-left: 4px solid #116466;
      padding: 5mm;
      border-radius: 6px;
    }

    .score-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 4mm;
      margin-top: 5mm;
    }

    .score {
      padding: 5mm;
      background: #172033;
      color: white;
      border-radius: 6px;
      min-height: 26mm;
    }

    .score strong {
      display: block;
      font-size: 18pt;
      color: #ffcb30;
      line-height: 1;
      margin-bottom: 2mm;
    }

    .event-card,
    .competitor-card,
    .phase {
      border: 1px solid #d7dce5;
      border-radius: 7px;
      padding: 5mm;
      margin: 4mm 0;
      page-break-inside: avoid;
      background: #fff;
    }

    .event-top {
      display: flex;
      justify-content: space-between;
      gap: 5mm;
      align-items: flex-start;
    }

    .muted {
      color: #687386;
      font-size: 9.6pt;
      margin: 0;
    }

    .badge,
    .metric,
    .small-badge {
      display: inline-block;
      border-radius: 999px;
      padding: 2mm 3.5mm;
      font-size: 8.6pt;
      font-weight: 700;
      white-space: nowrap;
    }

    .badge.high,
    .small-badge.high {
      background: #ffe9a1;
      color: #6c4d00;
    }

    .badge.medium,
    .small-badge.med {
      background: #e4f4ef;
      color: #116466;
    }

    .metric {
      background: #edf0f5;
      color: #172033;
    }

    .facts {
      display: grid;
      grid-template-columns: 0.95fr 1.25fr;
      gap: 3mm;
      margin: 3mm 0 2mm;
    }

    .facts div {
      background: #f8f9fb;
      border-radius: 5px;
      padding: 3.5mm;
    }

    .facts strong {
      display: block;
      color: #116466;
      font-size: 8.5pt;
      text-transform: uppercase;
      margin-bottom: 1mm;
      letter-spacing: 0.04em;
    }

    .facts span {
      display: block;
      font-size: 9.5pt;
    }

    .source {
      margin-top: 3mm;
      font-size: 8.8pt;
      color: #687386;
    }

    .recommendation {
      margin-top: 3mm;
      padding: 3mm;
      background: #fff8dd;
      border-radius: 5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5mm;
      page-break-inside: auto;
      font-size: 9.2pt;
    }

    thead {
      display: table-header-group;
    }

    th {
      background: #172033;
      color: white;
      text-align: left;
      padding: 3mm;
      font-size: 8.7pt;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    td {
      border-bottom: 1px solid #e2e6ec;
      padding: 3mm;
      vertical-align: top;
    }

    td span {
      display: block;
      margin-top: 1.2mm;
      color: #5c6678;
      font-size: 8.8pt;
    }

    .priority-table th:nth-child(1),
    .priority-table td:nth-child(1) {
      width: 47%;
    }

    .priority-table {
      font-size: 8.6pt;
      line-height: 1.3;
    }

    .priority-table th {
      padding: 2.2mm 3mm;
    }

    .priority-table td {
      padding: 2.1mm 3mm;
    }

    .priority-table td span {
      font-size: 8.1pt;
      margin-top: 0.8mm;
    }

    .priority-table th:nth-child(n+2),
    .priority-table td:nth-child(n+2) {
      width: 13.25%;
    }

    .two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5mm;
    }

    .checklist {
      background: #f8f9fb;
      border-radius: 7px;
      padding: 5mm;
      page-break-inside: avoid;
    }

    .checklist h3 {
      margin-bottom: 3mm;
    }

    .sources {
      columns: 2;
      column-gap: 10mm;
      font-size: 9pt;
    }

    .sources li {
      break-inside: avoid;
      margin-bottom: 2mm;
    }

    .footer-note {
      color: #687386;
      font-size: 8.8pt;
      margin-top: 5mm;
    }

    @media print {
      body {
        background: white;
      }

      .page {
        max-width: none;
      }
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="cover">
      <span class="cover-kicker">Radio Taxi Le Havre</span>
      <h1>Local Event and Marketing Opportunity Report</h1>
      <p class="subtitle">Actionable recommendations to increase taxi bookings, improve local visibility, create recurring customers, and strengthen competitive positioning.</p>
      <div class="cover-meta">
        <div class="meta-box">
          <strong>Prepared</strong>
          ${reportDate}
        </div>
        <div class="meta-box">
          <strong>Service focus</strong>
          Le Havre and agglomeration, cruise terminal, station, airport transfers, Honfleur, Étretat, tourism, medical, and business trips.
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Executive Summary</h2>
      <div class="lead-grid">
        <div>
          <p>Radio Taxi Le Havre has a practical opportunity to convert local events into predictable booking demand. The strongest near-term opportunities are cruise days, summer tourism, major cultural nights, Carré des Docks shows, student arrivals, and business events. These audiences already need reliable transport; the main gap is making Radio Taxi visible at the exact moment they decide how to travel.</p>
          <p>The most cost-effective approach is an event-led marketing rhythm: maintain a weekly event calendar, publish Google Business Profile posts around high-demand dates, create venue and tourism landing pages, and use QR-coded partner cards for hotels, restaurants, venues, and travel operators. The same system can also feed dispatch planning so marketing and operations reinforce each other.</p>
        </div>
        <div class="callout">
          <strong>Recommended operating principle</strong>
          <p>For every major event, answer three questions before customers ask them: where can I be picked up, how do I reserve my return, and why should I trust this taxi company tonight?</p>
        </div>
      </div>
      <div class="score-grid">
        <div class="score"><strong>90 days</strong>Enough time to launch event pages, partner QR codes, and a review workflow.</div>
        <div class="score"><strong>High</strong>Impact expected from cruise, tourism, venue, and corporate accounts.</div>
        <div class="score"><strong>Low</strong>Initial spend required if starting with posts, pages, outreach, and QR cards.</div>
        <div class="score"><strong>Weekly</strong>Cadence needed for event monitoring and local visibility.</div>
      </div>
    </section>

    <section class="section break">
      <h2>Upcoming Local Events</h2>
      <p>Events are prioritized for likely taxi demand across festivals, concerts, tourism, business, nightlife, cruise activity, seasonal celebrations, and student activity. Attendance figures below are conservative proxies where official numbers are not published.</p>
      ${eventCards}
    </section>

    <section class="section break">
      <h2>Competitor Analysis</h2>
      <p>Taxi companies in larger or tourism-heavy cities tend to win visibility through clear service segmentation, corporate accounts, partner programs, app or quick-book convenience, loyalty mechanics, tourism listings, and active review management. Their tactics are adaptable without requiring a large-city budget.</p>
      ${competitorCards}
    </section>

    <section class="section break">
      <h2>Successful Marketing Strategies</h2>
      <table class="priority-table">
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Impact</th>
            <th>Effort</th>
            <th>ROI</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          ${strategyRows}
        </tbody>
      </table>
    </section>

    <section class="section break">
      <h2>Partnership Opportunities</h2>
      <div class="two-col">
        <div class="checklist">
          <h3>Highest-value partners</h3>
          ${list([
            "Hotels and concierges: QR cards, front-desk number, port/station/airport transfer scripts.",
            "Restaurants and bars: safe-return messaging, late-night pickup guidance, weekend reminder posts.",
            "Event venues: pickup maps, confirmation-email taxi link, event voucher option.",
            "Cruise and tourism operators: Étretat, Honfleur, Le Havre highlights, Deauville airport transfers.",
            "Local employers: monthly invoices, visitor pickup, employee late-night rides.",
            "Medical and senior organizations: recurring scheduled transport and family-friendly booking support.",
          ])}
        </div>
        <div class="checklist">
          <h3>Suggested partner offer</h3>
          ${list([
            "Dedicated QR code or short booking URL per partner.",
            "Simple bilingual card: phone, booking page, pickup guidance, and main routes.",
            "Monthly partner report: ride count, peak times, common destinations.",
            "Priority booking process for hotels, venues, and corporate accounts.",
            "Review request flow that mentions the partner when appropriate.",
            "Optional event taxi vouchers for employers, venues, and organizers.",
          ])}
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Recommended Actions</h2>
      ${actionBlocks}
    </section>

    <section class="section break">
      <h2>Monitoring System</h2>
      <div class="two-col">
        <div class="checklist">
          <h3>Sources to monitor weekly</h3>
          ${list(monitoringSources)}
        </div>
        <div class="checklist">
          <h3>KPIs to track</h3>
          ${list(kpis)}
        </div>
      </div>
      <p class="footer-note">Recommended cadence: update the event watchlist every Monday, choose 3-5 high-demand events for promotion, assign dispatch notes by Thursday, and review booking outcomes the following Monday.</p>
    </section>

    <section class="section">
      <h2>Expected Business Impact</h2>
      <p>Within 30 days, expect better Google visibility, more event-related calls, and early partner conversations. Within 60 days, the business should have partner-coded bookings, clearer cruise and venue search pages, and more consistent review growth. Within 90 days, the goal is a measurable pipeline of recurring customers from hotels, venues, tourism, and corporate accounts.</p>
      <div class="callout">
        <strong>Top five priorities</strong>
        ${list([
          "Launch event and cruise-focused Google Business Profile posts immediately.",
          "Create landing pages for cruise terminal, Carré des Docks, airport/station, Étretat, and Honfleur.",
          "Start a hotel/restaurant/venue QR partner pilot with 15-20 local businesses.",
          "Introduce corporate accounts and event vouchers for businesses and organizers.",
          "Capture and reply to reviews consistently, especially after tourism and event rides.",
        ])}
      </div>
    </section>

    <section class="section break">
      <h2>Source Links</h2>
      <ul class="sources">
        ${sourceList}
      </ul>
    </section>
  </main>
</body>
</html>`;

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

fs.mkdirSync(outDir, { recursive: true });
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
  headerTemplate: `<div style="font-family: Arial, sans-serif; font-size: 7px; color: #687386; width: 100%; padding: 0 12mm;">Radio Taxi Le Havre - Marketing Opportunities</div>`,
  footerTemplate: `<div style="font-family: Arial, sans-serif; font-size: 7px; color: #687386; width: 100%; padding: 0 12mm; display: flex; justify-content: space-between;"><span>Prepared ${reportDate}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
  margin: { top: "14mm", right: "12mm", bottom: "16mm", left: "12mm" },
});
await browser.close();

console.log(pdfPath);
