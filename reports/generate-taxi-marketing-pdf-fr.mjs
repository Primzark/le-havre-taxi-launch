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
const htmlPath = path.join(outDir, "rapport-opportunites-marketing-radio-taxi-le-havre-2026-06-04.html");
const pdfPath = path.join(outDir, "rapport-opportunites-marketing-radio-taxi-le-havre-2026-06-04.pdf");
const reportDate = "4 juin 2026";

const sources = [
  ["Agenda Carré des Docks", "https://www.dockslehavre.com/"],
  ["Business Expo Le Havre", "https://www.dockslehavre.com/evenement/business-expo-le-havre/"],
  ["Un Été au Havre", "https://www.france.fr/fr/evenement/un-ete-au-havre/"],
  ["Normandie Impressionniste 2026", "https://en.normandie-tourisme.fr/programme/festival-normandie-impressionniste-2026/"],
  ["Perspectives croisières HAROPA 2026", "https://www.haropaport.com/en/news/sea-cruise-more-200-calls-expected-2026"],
  ["Nuits Suspendues au Havre", "https://lehavre.fr/actualites/toutes-les-actualites/la-billetterie-est-ouverte-pour-le-festival-nuits-suspendues-2026"],
  ["Tournée France Plastic Odyssey", "https://plasticodyssey.org/en/plastic-odyssey-france-tour/"],
  ["Agenda Campus Le Havre Normandie", "https://www.campus-lehavre-normandie.fr/fr/agenda"],
  ["Site officiel G7", "https://www.g7.fr/en/"],
  ["Services G7", "https://www.g7.fr/en/discover-our-services/g7"],
  ["Partenariats Addison Lee", "https://www.addisonlee.com/work-with-us-3/brand-partnerships/"],
  ["Central Taxis - tourisme Édimbourg", "https://edinburgh.org/point-of-interest/central-taxis/"],
  ["Programme fidélité Taxiblu", "https://taxiblu.it/en/servizi/loyalty-program/"],
  ["C Cabs - fidélité hôtels et entreprises", "https://www.ccabs.net/our-services/hotel-business-loyalty-scheme/"],
  ["United Taxi - comptes entreprises", "https://www.unitedtaxi.com/corporate-accounts"],
  ["Blue Top Cabs - comptes entreprises", "https://www.bluetop.com/corporate-accounts/"],
];

const events = [
  {
    name: "Business Expo Le Havre",
    date: "4 juin 2026",
    location: "Carré des Docks, Le Havre",
    attendance: "Repère: 150+ exposants et flux de visiteurs B2B",
    demand: "Moyenne à forte: arrivées du matin, déplacements de pause déjeuner et départs entre 16 h et 19 h.",
    actions: [
      "Avant: publier un post LinkedIn et Google Business Profile ciblant exposants, commerciaux et visiteurs venant de la gare ou de l'aéroport.",
      "Pendant: communiquer un point de prise en charge simple au Carré des Docks et proposer la réservation du retour par téléphone.",
      "Après: recontacter les exposants avec une offre compte entreprise, facture mensuelle et bons taxi événement.",
    ],
    priority: "Haute",
    source: "Business Expo Le Havre",
  },
  {
    name: "Salon de la Croisière et du Voyage",
    date: "6 juin 2026",
    location: "Carré des Docks, Le Havre",
    attendance: "Entrée libre, public local intéressé par le voyage et la croisière",
    demand: "Moyenne: trajets de journée, questions touristiques, gare, hôtels et terminal croisière.",
    actions: [
      "Avant: mettre en avant les transferts croisière, Étretat, Honfleur, gare et aéroport.",
      "Pendant: proposer des cartes QR de réservation aux exposants tourisme et voyage.",
      "Après: publier une offre saisonnière: terminal croisière, gare, hôtels, Étretat et Honfleur.",
    ],
    priority: "Moyenne",
    source: "Agenda Carré des Docks",
  },
  {
    name: "Tournée France Plastic Odyssey",
    date: "16-23 juin 2026",
    location: "Escale au Havre",
    attendance: "Public familial, scolaires, visiteurs du port et curieux du tourisme durable",
    demand: "Moyenne: trajets en journée vers le port, la gare, les hôtels et le centre-ville.",
    actions: [
      "Avant: publier des consignes pratiques de prise en charge ville-port en français et en anglais.",
      "Pendant: suivre les horaires de visite et adapter les messages autour de la gare, du port et des hôtels.",
      "Après: collecter des avis clients et les réutiliser dans les contenus tourisme.",
    ],
    priority: "Moyenne",
    source: "Tournée France Plastic Odyssey",
  },
  {
    name: "Fête de la Musique et Salvatore Adamo",
    date: "21 juin 2026",
    location: "Centre-ville; concert au Carré des Docks",
    attendance: "Animation urbaine + jauge de salle autour de 2 000 places",
    demand: "Forte: retours de soirée, sorties de concert, plage, centre, Docks et gare.",
    actions: [
      "Avant: publier un message 'réservez votre retour avant le concert' avec téléphone et lien de réservation.",
      "Pendant: diffuser des consignes de prise en charge par quartier et renforcer la disponibilité après 22 h 30.",
      "Après: envoyer une demande d'avis courte aux clients ayant réservé par téléphone ou formulaire.",
    ],
    priority: "Haute",
    source: "Agenda Carré des Docks",
  },
  {
    name: "Festival Pulaagu / Baaba Maal",
    date: "27 juin 2026",
    location: "Carré des Docks, Le Havre",
    attendance: "Grand public concert; repère de capacité autour de 2 000+ personnes",
    demand: "Forte: groupes, trajets de fin de soirée et retours vers hôtels, gare et domicile.",
    actions: [
      "Avant: promouvoir les taxis de groupe et les retours réservés, en français et en anglais.",
      "Pendant: publier un mini-plan de prise en charge près du lieu.",
      "Après: inviter les passagers à enregistrer le numéro pour les prochains concerts et soirées.",
    ],
    priority: "Haute",
    source: "Agenda Carré des Docks",
  },
  {
    name: "Un Été au Havre",
    date: "27 juin-20 septembre 2026",
    location: "Parcours artistique et touristique dans la ville",
    attendance: "Très forte saisonnalité touristique; les éditions passées ont attiré plusieurs centaines de milliers de visites",
    demand: "Très forte sur la durée: hôtels, croisières, gare, parcours d'oeuvres, plage, restaurants.",
    actions: [
      "Avant: créer une page 'Taxi Un Été au Havre' avec itinéraires, points de prise en charge et appel à réserver.",
      "Pendant: publier chaque semaine les trajets utiles et distribuer des QR codes aux hôtels.",
      "Après: transformer les meilleurs trajets en pages tourisme pérennes vers Étretat, Honfleur et les incontournables du Havre.",
    ],
    priority: "Haute",
    source: "Un Été au Havre",
  },
  {
    name: "Normandie Impressionniste 2026",
    date: "29 mai-27 septembre 2026",
    location: "Le Havre, Étretat et itinéraires culturels normands",
    attendance: "Festival régional à forte visibilité touristique",
    demand: "Forte: musées, hôtels, gare, aéroport et circuits côtiers.",
    actions: [
      "Avant: créer des pages bilingues pour les circuits taxi autour de l'impressionnisme.",
      "Pendant: proposer aux hôtels et guides des demi-journées Le Havre - Étretat - Honfleur.",
      "Après: demander des avis mentionnant Étretat, Honfleur, Le Havre et la qualité du chauffeur.",
    ],
    priority: "Haute",
    source: "Normandie Impressionniste 2026",
  },
  {
    name: "Escales croisières au Havre",
    date: "Toute l'année 2026",
    location: "Terminal croisière, centre-ville et destinations régionales",
    attendance: "137 escales prévues au Havre en 2026; certains navires transportent plusieurs milliers de passagers",
    demand: "Très forte les jours d'escale: port-centre, port-gare, Étretat, Honfleur, Paris, aéroports.",
    actions: [
      "Avant: tenir un calendrier croisières et publier les disponibilités avant les grosses escales.",
      "Pendant: afficher des consignes de prise en charge au port et des trajets types en anglais.",
      "Après: demander des avis aux croisiéristes et enrichir la FAQ avec les questions fréquentes.",
    ],
    priority: "Haute",
    source: "Perspectives croisières HAROPA 2026",
  },
  {
    name: "Fête nationale",
    date: "14 juillet 2026",
    location: "Plage, centre-ville et zones de feu d'artifice",
    attendance: "Grand rassemblement local de jour férié",
    demand: "Très forte après 23 h: retours groupés, circulation dense et stationnement difficile.",
    actions: [
      "Avant: encourager la réservation du retour et positionner le taxi comme solution de soirée sécurisée.",
      "Pendant: publier des points de prise en charge simples pour plage, gare et centre.",
      "Après: réutiliser le message de soirée sécurisée pour les week-ends d'été.",
    ],
    priority: "Haute",
    source: "Planification saisonnière; vérifier les détails officiels de la ville à l'approche de la date",
  },
  {
    name: "Nuits Suspendues",
    date: "16-19 juillet 2026",
    location: "Jardins suspendus, Le Havre",
    attendance: "Festival sur plusieurs soirées",
    demand: "Très forte: arrivées en soirée et retours tardifs depuis un site moins central.",
    actions: [
      "Avant: publier le point de prise en charge et un rappel de réservation une semaine puis un jour avant.",
      "Pendant: adapter le dispatch aux horaires de fin de concerts.",
      "Après: collecter les avis des festivaliers et transformer l'opération en modèle réutilisable.",
    ],
    priority: "Haute",
    source: "Nuits Suspendues au Havre",
  },
  {
    name: "Béton et spectacles de septembre",
    date: "18-20 septembre 2026 et week-ends de spectacles",
    location: "Lieux culturels du Havre, dont Carré des Docks",
    attendance: "Public festival et concerts",
    demand: "Forte: soirées et week-ends, avec pics en sortie de spectacle.",
    actions: [
      "Avant: publier un récapitulatif des événements de septembre.",
      "Pendant: diffuser des posts courts avec consignes de prise en charge par lieu.",
      "Après: proposer aux lieux d'ajouter un lien Radio Taxi aux confirmations de réservation.",
    ],
    priority: "Moyenne",
    source: "Agenda Carré des Docks",
  },
  {
    name: "Rentrée étudiante et Nuit des Étudiants du Monde",
    date: "Fin août-septembre; événement NEM annoncé le 5 novembre 2026",
    location: "Campus Le Havre Normandie, résidences, Magic Mirrors",
    attendance: "Étudiants, nouveaux arrivants et étudiants internationaux",
    demand: "Moyenne à forte: arrivées gare, emménagements, sorties de nuit et retours sécurisés.",
    actions: [
      "Avant: lancer une campagne 'retour de soirée en sécurité' avec QR cards en résidences et associations.",
      "Pendant: cibler les grandes soirées avec des messages pratiques et un numéro facile à enregistrer.",
      "Après: proposer un mécanisme de parrainage simple: enregistrer le numéro, le partager, laisser un avis.",
    ],
    priority: "Moyenne",
    source: "Agenda Campus Le Havre Normandie",
  },
];

const competitors = [
  {
    company: "G7 - Paris",
    channels: "Site, application, liens sociaux, visibilité Google",
    practices: [
      "Promesse de réservation orientée application: suivi, paiement, réservation programmée et catégories de service.",
      "Offres lisibles: taxi vert, van, VIP, famille, animaux, accessibilité et paiement par tiers.",
      "Discours de confiance fondé sur la taille de flotte, la fiabilité et la transition environnementale.",
    ],
    localIdea: "Reprendre la clarté des catégories localement: taxi croisière, taxi aéroport, taxi entreprise, taxi PMR, taxi groupe, taxi tourisme.",
    impact: "Fort",
    source: "Site officiel G7",
  },
  {
    company: "Addison Lee - Londres",
    channels: "Site, pages corporate, pages partenariats",
    practices: [
      "Modèle B2B avec outils de réservation co-marqués, incitations partenaires et transport pour lieux/clients.",
      "Positionnement fort sur les déplacements professionnels, la fiabilité et le pilotage de compte.",
      "Cibles partenaires claires: agences de voyage, lieux événementiels, affiliés et entreprises.",
    ],
    localIdea: "Créer un programme partenaires Le Havre pour hôtels, lieux, agences de voyage, croisières et restaurants avec QR codes suivis.",
    impact: "Fort",
    source: "Partenariats Addison Lee",
  },
  {
    company: "Central Taxis - Édimbourg",
    channels: "Référencement touristique, offres corporate et accessibilité",
    practices: [
      "Présence dans les canaux touristiques officiels, utile pour visiteurs et congrès.",
      "Mise en avant des transferts délégués, accueil aéroport et comptes entreprises.",
      "Utilisation de l'ancrage local comme avantage de confiance.",
    ],
    localIdea: "Obtenir des listings auprès des acteurs tourisme/congrès et proposer une solution de transfert aux événements du Carré des Docks.",
    impact: "Moyen à fort",
    source: "Central Taxis - tourisme Édimbourg",
  },
  {
    company: "Taxiblu - Milan",
    channels: "Site, app/WhatsApp, programme fidélité",
    practices: [
      "Mécanique fidélité via miles aériens.",
      "Accès de réservation simple par appTaxi et WhatsApp.",
      "Mise en avant des trajets aéroport et de la répétition d'usage.",
    ],
    localIdea: "Créer une fidélisation compatible avec le cadre local: priorité de réservation, avantages partenaires, suivi des recommandations et communication clients récurrents.",
    impact: "Moyen",
    source: "Programme fidélité Taxiblu",
  },
  {
    company: "C Cabs - Blackpool",
    channels: "Site, application, fidélité hôtels et entreprises",
    practices: [
      "Programme pour hôtels et entreprises avec priorité de réservation et logique de récompense.",
      "Ciblage des hébergements qui influencent souvent le choix du taxi.",
      "Relation partenaire suivie plutôt que simple dépôt de cartes.",
    ],
    localIdea: "Lancer un pilote concierge avec 10 hôtels/restaurants et mesurer les courses par code partenaire.",
    impact: "Fort",
    source: "C Cabs - fidélité hôtels et entreprises",
  },
  {
    company: "United Taxi / Blue Top Cabs - Amérique du Nord",
    channels: "Pages comptes entreprises",
    practices: [
      "Facturation mensuelle, prise en charge des trajets employés/clients, bons taxi et gestion de compte.",
      "Positionnement adapté aux employeurs, événements, cliniques, familles et clients réguliers.",
      "Explication B2B simple qui réduit la friction pour les acheteurs récurrents.",
    ],
    localIdea: "Créer des pages 'Compte entreprise taxi Le Havre' et 'Bons taxi événement' avec un formulaire court.",
    impact: "Fort",
    source: "United Taxi - comptes entreprises",
  },
];

const strategies = [
  ["Posts Google Business Profile liés aux événements", "Publier 2 à 3 fois par semaine autour des croisières, concerts, salons, étudiants et jours fériés.", "Fort", "Faible", "Fort", "Haute"],
  ["Pages dédiées événements et lieux", "Créer des pages pour Carré des Docks, terminal croisière, Magic Mirrors, Jardins suspendus, gare, aéroport, Étretat et Honfleur.", "Fort", "Moyen", "Fort", "Haute"],
  ["Programme QR hôtels et concierges", "Donner aux hôtels/restaurants un QR code, un code partenaire et une carte de réservation bilingue.", "Fort", "Moyen", "Fort", "Haute"],
  ["Comptes entreprises et bons taxi événement", "Proposer facture mensuelle, trajets employés/clients et bons prépayés ou autorisés pour événements.", "Fort", "Moyen", "Fort", "Haute"],
  ["Forfaits terminal croisière", "Packager port-centre, port-gare, Étretat, Honfleur, Paris et aéroport de Deauville.", "Fort", "Moyen", "Fort", "Haute"],
  ["Processus de collecte d'avis", "Après les courses, envoyer une demande d'avis courte et répondre aux avis Google sous 48 h.", "Moyen à fort", "Faible", "Fort", "Haute"],
  ["Campagne étudiants retour sécurisé", "QR cards campus, posts avant les grandes soirées, rappel de partage entre colocataires.", "Moyen", "Faible", "Moyen", "Moyenne"],
  ["Circuits taxi touristiques", "Commercialiser des trajets demi-journée/journée autour du Havre, Étretat, Honfleur, Deauville et des sites impressionnistes.", "Moyen à fort", "Moyen", "Moyen à fort", "Moyenne"],
  ["Micro-collaborations influence locale", "Faire appel à de petits créateurs locaux pour des conseils de prise en charge événement et des itinéraires touristiques.", "Moyen", "Faible à moyen", "Moyen", "Moyenne"],
  ["Sponsoring communautaire", "Soutenir des événements locaux avec un message de retour taxi visible.", "Moyen", "Moyen", "Moyen", "Faible à moyenne"],
];

const actionPlan = [
  {
    phase: "Semaine 1",
    items: [
      "Créer une veille événements: Carré des Docks, LeHavre.fr, office de tourisme, HAROPA, Campus Le Havre, Magic Mirrors et lieux culturels.",
      "Publier les premiers posts Google Business Profile sur les concerts de juin, les croisières et le tourisme d'été.",
      "Rédiger la carte partenaire pour hôtels, restaurants, bars, lieux événementiels et opérateurs touristiques.",
    ],
  },
  {
    phase: "Semaines 2 à 4",
    items: [
      "Lancer trois pages: taxi terminal croisière, taxi Carré des Docks, taxi tourisme Étretat/Honfleur.",
      "Contacter 10 hôtels, 5 restaurants/bars, 2 lieux événementiels et 2 acteurs touristiques avec une proposition QR partenaire.",
      "Mettre en place une demande d'avis après course pour les réservations téléphone et formulaire.",
    ],
  },
  {
    phase: "Jours 30 à 60",
    items: [
      "Ajouter les pages comptes entreprises et bons taxi événement; relancer exposants et employeurs locaux.",
      "Booster localement les posts pour Nuits Suspendues, Fête nationale et gros spectacles.",
      "Suivre codes partenaires, réservations événement, appels manqués, avis et conversions des pages.",
    ],
  },
  {
    phase: "Jours 60 à 90",
    items: [
      "Renforcer les catégories de partenaires qui apportent réellement des courses.",
      "Transformer les routes croisière et tourisme en contenus saisonniers et supports pour comptoirs d'hôtel.",
      "Installer la veille événements comme routine hebdomadaire commune marketing-dispatch.",
    ],
  },
];

const monitoringSources = [
  "Agenda Carré des Docks pour concerts, salons, conventions et spectacles.",
  "LeHavre.fr et Le Havre Seine Métropole pour célébrations, événements publics et informations saisonnières.",
  "Le Havre Étretat Tourisme et France.fr pour saisons touristiques, festivals et campagnes destination.",
  "HAROPA et sources terminal croisière pour escales et jours à fort volume passagers.",
  "Campus Le Havre Normandie pour rentrée, soirées étudiantes et événements internationaux.",
  "Magic Mirrors, Stade Océane, bars, restaurants, musées et lieux culturels pour les pics de demande plus courts.",
];

const kpis = [
  "Réservations taguées par événement, lieu, navire, partenaire ou campagne.",
  "Appels, demandes d'itinéraire, vues de photos et interactions des posts Google Business Profile.",
  "Visites et clics des pages port, gare, aéroport, lieux événementiels et tourisme.",
  "Scans QR partenaires et réservations avec code partenaire.",
  "Volume d'avis, note moyenne, délai de réponse et mots-clés cités dans les avis.",
  "Taux d'appels manqués et temps d'attente dispatch les soirs de forte demande.",
];

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sourceLink(label) {
  const source = sources.find(([name]) => name === label);
  if (!source) return esc(label);
  return `<a href="${esc(source[1])}">${esc(source[0])}</a>`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

const eventCards = events
  .map(
    (event) => `
      <article class="event-card">
        <div class="event-top">
          <div>
            <h3>${esc(event.name)}</h3>
            <p class="muted">${esc(event.date)} | ${esc(event.location)}</p>
          </div>
          <span class="badge ${event.priority === "Haute" ? "high" : "medium"}">${esc(event.priority)}</span>
        </div>
        <div class="facts">
          <div><strong>Repère de fréquentation</strong><span>${esc(event.attendance)}</span></div>
          <div><strong>Demande transport attendue</strong><span>${esc(event.demand)}</span></div>
        </div>
        <h4>Actions promotionnelles</h4>
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
            <h3>${esc(competitor.company)}</h3>
            <p class="muted">${esc(competitor.channels)}</p>
          </div>
          <span class="metric">Impact ${esc(competitor.impact.toLowerCase())}</span>
        </div>
        ${list(competitor.practices)}
        <div class="recommendation"><strong>Adaptation locale:</strong> ${esc(competitor.localIdea)}</div>
        <p class="source">Source: ${sourceLink(competitor.source)}</p>
      </article>
    `,
  )
  .join("");

const strategyRows = strategies
  .map(
    ([name, detail, impact, effort, roi, priority]) => `
      <tr>
        <td><strong>${esc(name)}</strong><span>${esc(detail)}</span></td>
        <td>${esc(impact)}</td>
        <td>${esc(effort)}</td>
        <td>${esc(roi)}</td>
        <td><span class="small-badge ${priority === "Haute" ? "high" : "med"}">${esc(priority)}</span></td>
      </tr>
    `,
  )
  .join("");

const actionBlocks = actionPlan
  .map(
    (phase) => `
      <div class="phase">
        <h3>${esc(phase.phase)}</h3>
        ${list(phase.items)}
      </div>
    `,
  )
  .join("");

const sourceList = sources
  .map(([name, url]) => `<li><a href="${esc(url)}">${esc(name)}</a></li>`)
  .join("");

const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Radio Taxi Le Havre - Rapport d'opportunités marketing</title>
  <style>
    @page { size: A4; margin: 14mm 12mm 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      color: #172033;
      background: #f6f4ef;
      font-size: 10.5pt;
      line-height: 1.42;
    }
    a { color: #116466; text-decoration: none; }
    .page { max-width: 1040px; margin: 0 auto; background: white; }
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
      max-width: 154mm;
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
      background: rgba(255, 255, 255, 0.82);
      border-radius: 6px;
    }
    .meta-box strong {
      display: block;
      text-transform: uppercase;
      font-size: 8.5pt;
      color: #116466;
      margin-bottom: 2mm;
    }
    .section { padding: 10mm 16mm; page-break-inside: avoid; }
    .section.break { page-break-before: always; }
    h2 { margin: 0 0 4mm; font-size: 18pt; line-height: 1.1; color: #172033; }
    h2::after {
      content: "";
      display: block;
      width: 34mm;
      height: 2px;
      margin-top: 3mm;
      background: #ffcb30;
    }
    h3 { margin: 0 0 1.5mm; font-size: 12.7pt; line-height: 1.18; color: #172033; }
    h4 {
      margin: 4mm 0 1mm;
      font-size: 9.3pt;
      text-transform: uppercase;
      color: #566074;
      letter-spacing: 0.04em;
    }
    p { margin: 0 0 3mm; }
    ul { margin: 1.5mm 0 0; padding-left: 5mm; }
    li { margin-bottom: 1.6mm; }
    .lead-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 6mm; align-items: start; }
    .callout {
      background: #f2fbf8;
      border: 1px solid #b8dad0;
      border-left: 4px solid #116466;
      padding: 5mm;
      border-radius: 6px;
    }
    .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 5mm; }
    .score {
      padding: 5mm;
      background: #172033;
      color: white;
      border-radius: 6px;
      min-height: 26mm;
    }
    .score strong { display: block; font-size: 18pt; color: #ffcb30; line-height: 1; margin-bottom: 2mm; }
    .event-card, .competitor-card, .phase {
      border: 1px solid #d7dce5;
      border-radius: 7px;
      padding: 5mm;
      margin: 4mm 0;
      page-break-inside: avoid;
      background: #fff;
    }
    .event-top { display: flex; justify-content: space-between; gap: 5mm; align-items: flex-start; }
    .muted { color: #687386; font-size: 9.6pt; margin: 0; }
    .badge, .metric, .small-badge {
      display: inline-block;
      border-radius: 999px;
      padding: 2mm 3.5mm;
      font-size: 8.6pt;
      font-weight: 700;
      white-space: nowrap;
    }
    .badge.high, .small-badge.high { background: #ffe9a1; color: #6c4d00; }
    .badge.medium, .small-badge.med { background: #e4f4ef; color: #116466; }
    .metric { background: #edf0f5; color: #172033; }
    .facts { display: grid; grid-template-columns: 0.95fr 1.25fr; gap: 3mm; margin: 3mm 0 2mm; }
    .facts div { background: #f8f9fb; border-radius: 5px; padding: 3.5mm; }
    .facts strong {
      display: block;
      color: #116466;
      font-size: 8.5pt;
      text-transform: uppercase;
      margin-bottom: 1mm;
      letter-spacing: 0.04em;
    }
    .facts span { display: block; font-size: 9.5pt; }
    .source { margin-top: 3mm; font-size: 8.8pt; color: #687386; }
    .recommendation { margin-top: 3mm; padding: 3mm; background: #fff8dd; border-radius: 5px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5mm;
      page-break-inside: auto;
      font-size: 8.6pt;
      line-height: 1.3;
    }
    thead { display: table-header-group; }
    th {
      background: #172033;
      color: white;
      text-align: left;
      padding: 2.2mm 3mm;
      font-size: 8.6pt;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    td { border-bottom: 1px solid #e2e6ec; padding: 2.1mm 3mm; vertical-align: top; }
    td span { display: block; margin-top: 0.8mm; color: #5c6678; font-size: 8.1pt; }
    .priority-table th:nth-child(1), .priority-table td:nth-child(1) { width: 47%; }
    .priority-table th:nth-child(n+2), .priority-table td:nth-child(n+2) { width: 13.25%; }
    .strategy-section { padding-top: 7mm; padding-bottom: 7mm; }
    .strategy-section h2 { font-size: 17pt; margin-bottom: 2mm; }
    .strategy-section h2::after { margin-top: 2mm; }
    .strategy-section table { margin-top: 3mm; font-size: 7.8pt; line-height: 1.22; }
    .strategy-section th { padding: 1.7mm 2.5mm; font-size: 7.8pt; }
    .strategy-section td { padding: 1.35mm 2.5mm; }
    .strategy-section td span { font-size: 7.4pt; margin-top: 0.45mm; }
    .strategy-section .small-badge { padding: 1.4mm 2.6mm; font-size: 7.6pt; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
    .checklist { background: #f8f9fb; border-radius: 7px; padding: 5mm; page-break-inside: avoid; }
    .checklist h3 { margin-bottom: 3mm; }
    .sources { columns: 2; column-gap: 10mm; font-size: 9pt; }
    .sources li { break-inside: avoid; margin-bottom: 2mm; }
    .footer-note { color: #687386; font-size: 8.8pt; margin-top: 5mm; }
    @media print { body { background: white; } .page { max-width: none; } }
  </style>
</head>
<body>
  <main class="page">
    <section class="cover">
      <span class="cover-kicker">Radio Taxi Le Havre</span>
      <h1>Rapport d'opportunités locales et marketing</h1>
      <p class="subtitle">Recommandations actionnables pour augmenter les réservations, améliorer la visibilité locale, créer des clients récurrents et renforcer la position concurrentielle.</p>
      <div class="cover-meta">
        <div class="meta-box"><strong>Préparé le</strong>${reportDate}</div>
        <div class="meta-box"><strong>Périmètre</strong>Le Havre et agglomération, terminal croisière, gare, transferts aéroport, Honfleur, Étretat, tourisme, médical et déplacements professionnels.</div>
      </div>
    </section>

    <section class="section">
      <h2>Résumé exécutif</h2>
      <div class="lead-grid">
        <div>
          <p>Radio Taxi Le Havre peut transformer les événements locaux en demande de réservation plus prévisible. Les meilleures opportunités à court terme sont les jours de croisière, la saison touristique estivale, les grands rendez-vous culturels, les spectacles du Carré des Docks, les arrivées étudiantes et les événements professionnels.</p>
          <p>L'approche la plus rentable consiste à installer une routine marketing événementielle: calendrier hebdomadaire, posts Google Business Profile, pages dédiées par lieu ou par usage, QR codes partenaires pour hôtels/restaurants/lieux, puis suivi des réservations par code source.</p>
        </div>
        <div class="callout">
          <strong>Principe opérationnel</strong>
          <p>Pour chaque grand événement, répondre avant le client à trois questions: où être pris en charge, comment réserver son retour et pourquoi choisir Radio Taxi ce soir-là.</p>
        </div>
      </div>
      <div class="score-grid">
        <div class="score"><strong>90 jours</strong>Pour lancer pages, QR partenaires et collecte d'avis.</div>
        <div class="score"><strong>Fort</strong>Impact attendu sur croisière, tourisme, lieux et comptes B2B.</div>
        <div class="score"><strong>Faible</strong>Dépense initiale si l'on démarre par posts, pages, outreach et QR cards.</div>
        <div class="score"><strong>Hebdo</strong>Cadence recommandée pour veille événements et visibilité locale.</div>
      </div>
    </section>

    <section class="section break">
      <h2>Événements locaux à surveiller</h2>
      <p>Les événements ci-dessous sont priorisés selon leur potentiel de demande taxi: festivals, concerts, tourisme, business, nightlife, croisière, jours fériés et vie étudiante. Les chiffres de fréquentation sont des repères prudents lorsque les données officielles ne sont pas publiées.</p>
      ${eventCards}
    </section>

    <section class="section break">
      <h2>Analyse concurrentielle</h2>
      <p>Les compagnies performantes dans d'autres villes gagnent en visibilité grâce à des offres lisibles, des comptes entreprises, des partenariats locaux, une réservation simple, des mécaniques de fidélisation et une gestion active des avis. Ces méthodes sont adaptables au Havre sans budget de grande métropole.</p>
      ${competitorCards}
    </section>

    <section class="section break strategy-section">
      <h2>Stratégies marketing efficaces</h2>
      <table class="priority-table">
        <thead>
          <tr>
            <th>Stratégie</th>
            <th>Impact</th>
            <th>Effort</th>
            <th>Retour</th>
            <th>Priorité</th>
          </tr>
        </thead>
        <tbody>${strategyRows}</tbody>
      </table>
    </section>

    <section class="section break">
      <h2>Opportunités de partenariats</h2>
      <div class="two-col">
        <div class="checklist">
          <h3>Partenaires à plus fort potentiel</h3>
          ${list([
            "Hôtels et concierges: QR cards, numéro direct, scripts port/gare/aéroport.",
            "Restaurants et bars: retours de soirée, points de prise en charge, rappels week-end.",
            "Lieux événementiels: plans de pickup, lien taxi dans les confirmations, bons taxi événement.",
            "Croisière et tourisme: Étretat, Honfleur, Le Havre, Deauville, transferts aéroport.",
            "Employeurs locaux: facture mensuelle, trajets visiteurs, retours tardifs salariés.",
            "Structures seniors et santé: transport récurrent planifié et réservation familiale simplifiée.",
          ])}
        </div>
        <div class="checklist">
          <h3>Offre partenaire proposée</h3>
          ${list([
            "QR code ou URL courte dédié à chaque partenaire.",
            "Carte bilingue: téléphone, réservation, zones de pickup et trajets principaux.",
            "Bilan mensuel: nombre de courses, horaires de pic, destinations fréquentes.",
            "Processus de réservation prioritaire pour hôtels, lieux et comptes entreprises.",
            "Demande d'avis après course, avec mention du contexte quand c'est pertinent.",
            "Option bons taxi événement pour employeurs, lieux et organisateurs.",
          ])}
        </div>
      </div>
    </section>

    <section class="section">
      <h2>Actions recommandées</h2>
      ${actionBlocks}
    </section>

    <section class="section break">
      <h2>Système de veille</h2>
      <div class="two-col">
        <div class="checklist">
          <h3>Sources à suivre chaque semaine</h3>
          ${list(monitoringSources)}
        </div>
        <div class="checklist">
          <h3>Indicateurs à suivre</h3>
          ${list(kpis)}
        </div>
      </div>
      <p class="footer-note">Rythme conseillé: mettre à jour la veille le lundi, choisir 3 à 5 événements à promouvoir, préparer les consignes dispatch le jeudi, puis analyser les réservations le lundi suivant.</p>
    </section>

    <section class="section">
      <h2>Impact business attendu</h2>
      <p>Sous 30 jours, l'entreprise doit gagner en visibilité Google, capter davantage d'appels liés aux événements et ouvrir les premières discussions partenaires. Sous 60 jours, elle doit mesurer des réservations codées partenaires, des pages croisière/lieux plus visibles et une progression régulière des avis. Sous 90 jours, l'objectif est de créer un flux mesurable de clients récurrents depuis hôtels, lieux, tourisme et comptes entreprises.</p>
      <div class="callout">
        <strong>Top 5 priorités</strong>
        ${list([
          "Lancer immédiatement les posts Google Business Profile liés aux événements et croisières.",
          "Créer les pages terminal croisière, Carré des Docks, gare/aéroport, Étretat et Honfleur.",
          "Démarrer un pilote QR partenaires avec 15 à 20 hôtels, restaurants et lieux.",
          "Mettre en place comptes entreprises et bons taxi événement.",
          "Collecter et répondre aux avis de façon systématique, surtout après les courses tourisme et événements.",
        ])}
      </div>
    </section>

    <section class="section break">
      <h2>Sources</h2>
      <ul class="sources">${sourceList}</ul>
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
  headerTemplate: `<div style="font-family: Arial, sans-serif; font-size: 7px; color: #687386; width: 100%; padding: 0 12mm;">Radio Taxi Le Havre - Rapport d'opportunités marketing</div>`,
  footerTemplate: `<div style="font-family: Arial, sans-serif; font-size: 7px; color: #687386; width: 100%; padding: 0 12mm; display: flex; justify-content: space-between;"><span>Préparé le ${reportDate}</span><span>Page <span class="pageNumber"></span> sur <span class="totalPages"></span></span></div>`,
  margin: { top: "14mm", right: "12mm", bottom: "16mm", left: "12mm" },
});
await browser.close();

console.log(pdfPath);
