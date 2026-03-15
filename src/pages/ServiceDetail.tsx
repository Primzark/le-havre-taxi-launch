import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Clock, MapPin, Phone, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_LINK, PRIMARY_DOMAIN, SITE_NAME } from "@/config/site";
import type { ServiceDefinition } from "@/data/services";
import { getServiceBySlug } from "@/data/services";
import { useSEO } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import NotFound from "./NotFound";

type ServiceGalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

type ServiceScenario = {
  label: string;
  detail: string;
};

type ServiceFaq = {
  question: string;
  answer: string;
};

type ServiceStory = {
  lead: string;
  extraDetails: string[];
  commitments: string[];
  badges: string[];
  gallery: ServiceGalleryItem[];
  scenarios: ServiceScenario[];
  faqs: ServiceFaq[];
};

const SECTION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const GRID_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.06,
    },
  },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const SERVICE_STORIES: Record<string, ServiceStory> = {
  "navette-aeroport": {
    lead: "Un transfert fluide entre Le Havre, les gares et les aéroports, même quand les horaires évoluent.",
    extraDetails: [
      "Nous anticipons les heures de pointe, les contraintes de terminal et le volume de bagages pour que votre départ reste simple. Vous montez, nous gérons le rythme et l'itinéraire.",
      "Pour les retours, la prise en charge est coordonnée avec l'heure réelle d'arrivée. Vous retrouvez rapidement un chauffeur prêt à vous déposer à domicile, à l'hôtel ou au bureau.",
    ],
    commitments: [
      "Coordination des prises en charge aller/retour",
      "Confort renforcé pour bagages et matériel",
      "Suivi des horaires en temps réel",
    ],
    badges: ["Suivi de vol", "Trajets gare et aéroport", "Disponibilité étendue"],
    gallery: [
      {
        src: "/images/services/navette-aeroport.webp",
        alt: "Passager avec ses bagages en montée dans un taxi pour un transfert aéroport.",
        caption: "Prise en charge bagages et départ sans stress",
      },
      {
        src: "/images/home-pont-normandie.webp",
        alt: "Vue du Pont de Normandie sur le trajet depuis Le Havre.",
        caption: "Itinéraires optimisés depuis Le Havre",
      },
      {
        src: "/images/tour-11-paris.webp",
        alt: "Vue urbaine illustrant les longues distances vers Paris et grands hubs.",
        caption: "Longues distances et connexions nationales",
      },
    ],
    scenarios: [
      {
        label: "Départ tôt matin",
        detail:
          "Planification la veille, point de rendez-vous confirmé et marge de sécurité pour arriver sereinement au terminal.",
      },
      {
        label: "Arrivée tardive",
        detail:
          "Nous restons synchronisés avec l'heure d'arrivée réelle afin d'assurer votre retour, même en cas de retard.",
      },
      {
        label: "Famille + bagages",
        detail:
          "Véhicule adapté au volume, chargement facilité et trajet direct vers votre destination finale.",
      },
    ],
    faqs: [
      {
        question: "Que se passe-t-il si mon vol est retardé ?",
        answer:
          "La prise en charge est ajustée à l'heure d'arrivée effective pour limiter l'attente et garantir un retour fluide.",
      },
      {
        question: "Puis-je réserver un aller-retour à l'avance ?",
        answer:
          "Oui, vous pouvez prévoir les deux trajets avec un seul brief, horaires et points de rendez-vous inclus.",
      },
      {
        question: "Acceptez-vous les bagages volumineux ?",
        answer:
          "Oui, nous adaptons le véhicule selon votre besoin pour transporter valises, poussettes ou matériel spécifique.",
      },
    ],
  },
  mariage: {
    lead: "Un service discret et ponctuel pour accompagner les mariés, les proches et les invités toute la journée.",
    extraDetails: [
      "Le déroulé est préparé en amont: horaires clés, adresses de prise en charge, temps de trajet et rotations d'invités. Cela évite les imprévus de dernière minute.",
      "Chaque course s'intègre au planning global du mariage pour garder la fluidité entre mairie, cérémonie, séance photo, réception et retours de soirée.",
    ],
    commitments: [
      "Plan de circulation défini avant l'événement",
      "Navettes invités selon vos créneaux",
      "Discrétion et ponctualité sur toute la journée",
    ],
    badges: ["Mariés et invités", "Journée et soirée", "Organisation en amont"],
    gallery: [
      {
        src: "/images/services/mariage.webp",
        alt: "Couple de mariés à côté d'un taxi décoré pour un événement.",
        caption: "Déplacements élégants pour les mariés",
      },
      {
        src: "/images/home-mairie.webp",
        alt: "Vue de la mairie du Havre pour illustrer les trajets cérémonie.",
        caption: "Liaisons mairie, cérémonie et réception",
      },
      {
        src: "/images/home-catene.webp",
        alt: "Promenade au Havre illustrant les trajets photo et soirée.",
        caption: "Rythme souple pour la journée complète",
      },
    ],
    scenarios: [
      {
        label: "Mairie + réception",
        detail:
          "Nous coordonnons les départs successifs entre lieux clés pour garder votre timing intact.",
      },
      {
        label: "Invités à l'hôtel",
        detail:
          "Mise en place de navettes aller/retour pour simplifier l'arrivée et les retours en fin de soirée.",
      },
      {
        label: "Soirée prolongée",
        detail:
          "Des trajets retour sont anticipés pour éviter l'attente et sécuriser la fin d'événement.",
      },
    ],
    faqs: [
      {
        question: "Peut-on organiser plusieurs points de prise en charge ?",
        answer:
          "Oui, nous préparons un plan multi-adresses avec horaires associés pour les mariés et les invités.",
      },
      {
        question: "Le service couvre-t-il la soirée ?",
        answer:
          "Oui, les retours tardifs peuvent être prévus afin d'assurer la continuité jusqu'à la fin de la réception.",
      },
      {
        question: "Faut-il réserver longtemps à l'avance ?",
        answer:
          "Pour les mariages, une réservation anticipée est recommandée afin de verrouiller les créneaux souhaités.",
      },
    ],
  },
  "navette-transport-sanitaire": {
    lead: "Un accompagnement régulier et rassurant pour les déplacements médicaux assis.",
    extraDetails: [
      "Nous adaptons l'heure de départ à votre rendez-vous et au temps d'accès de l'établissement, pour réduire le stress avant consultation.",
      "Notre priorité est le confort du trajet: conduite souple, aide à l'installation et suivi du parcours jusqu'à votre arrivée.",
    ],
    commitments: [
      "Ponctualité sur créneaux médicaux",
      "Conduite souple et assistance personnalisée",
      "Coordination aller-retour selon vos besoins",
    ],
    badges: ["Trajets médicaux", "Confort assis", "Accompagnement attentif"],
    gallery: [
      {
        src: "/images/services/transport-sanitaire.webp",
        alt: "Illustration d'un transport sanitaire assis vers un établissement de santé.",
        caption: "Déplacements médicaux assis en sérénité",
      },
      {
        src: "/images/service-station.webp",
        alt: "Station de taxi prête pour une prise en charge rapide.",
        caption: "Départs ponctuels depuis Le Havre",
      },
      {
        src: "/images/home-mairie.webp",
        alt: "Vue urbaine du Havre illustrant les trajets locaux réguliers.",
        caption: "Réseau local et trajets planifiés",
      },
    ],
    scenarios: [
      {
        label: "Consultation ponctuelle",
        detail:
          "Course simple avec marge de sécurité pour arriver à l'heure du rendez-vous.",
      },
      {
        label: "Série de soins",
        detail:
          "Organisation de trajets récurrents sur plusieurs jours avec horaires harmonisés.",
      },
      {
        label: "Retour à domicile",
        detail:
          "Prise en charge à la sortie de l'établissement avec arrivée directe à votre adresse.",
      },
    ],
    faqs: [
      {
        question: "Pouvez-vous attendre pendant un rendez-vous court ?",
        answer:
          "Selon la disponibilité et la durée prévue, une attente peut être organisée lors de la réservation.",
      },
      {
        question: "Le trajet est-il adapté aux personnes fatiguées ?",
        answer:
          "Oui, la conduite est volontairement progressive pour garantir un déplacement confortable.",
      },
      {
        question: "Puis-je planifier plusieurs courses à l'avance ?",
        answer:
          "Oui, nous pouvons planifier une série de trajets sur une période définie.",
      },
    ],
  },
  "navette-classe-affaire": {
    lead: "Une expérience professionnelle pensée pour vos rendez-vous business et vos clients stratégiques.",
    extraDetails: [
      "Le service classe affaire met l'accent sur la ponctualité, la discrétion et la qualité de prise en charge. Vous disposez d'un transport fiable, sans friction logistique.",
      "Idéal pour réunions, séminaires, dîners professionnels ou transferts inter-sites, avec une image cohérente de votre entreprise.",
    ],
    commitments: [
      "Accueil soigné pour collaborateurs et invités",
      "Départs ajustés à vos contraintes de planning",
      "Confort premium sur trajets courts ou longs",
    ],
    badges: ["Business", "Discrétion", "Ponctualité renforcée"],
    gallery: [
      {
        src: "/images/services/classe-affaire.webp",
        alt: "Passager professionnel en déplacement classe affaire.",
        caption: "Image soignée pour vos rendez-vous clés",
      },
      {
        src: "/images/services/transport-entreprise.webp",
        alt: "Transport d'entreprise pour collaborateurs et visiteurs.",
        caption: "Solution dédiée aux environnements pro",
      },
      {
        src: "/images/home-bassin-commerce.webp",
        alt: "Bassin du Commerce au Havre, secteur d'activité et d'affaires.",
        caption: "Déplacements efficaces en zone urbaine",
      },
    ],
    scenarios: [
      {
        label: "Rendez-vous client",
        detail:
          "Trajet direct avec arrivée anticipée pour débuter vos échanges sans stress.",
      },
      {
        label: "Journée multi-sites",
        detail:
          "Enchaînement optimisé de plusieurs adresses professionnelles sur un même créneau.",
      },
      {
        label: "Accueil VIP",
        detail:
          "Prise en charge premium de vos invités depuis gare, hôtel ou terminal.",
      },
    ],
    faqs: [
      {
        question: "Le service convient-il à une clientèle entreprise régulière ?",
        answer:
          "Oui, il est conçu pour des besoins récurrents avec un niveau de service constant.",
      },
      {
        question: "Pouvez-vous gérer plusieurs arrêts sur une même course ?",
        answer:
          "Oui, les itinéraires multi-étapes sont possibles selon votre planning de la journée.",
      },
      {
        question: "Ce service est-il disponible en dehors des horaires classiques ?",
        answer:
          "Oui, les départs tôt le matin ou en soirée peuvent être organisés sur réservation.",
      },
    ],
  },
  "navette-transport-scolaire": {
    lead: "Des trajets scolaires réguliers, fiables et clairs pour les familles comme pour les élèves.",
    extraDetails: [
      "Le service scolaire repose sur des horaires stables et une organisation prévisible. Objectif: réduire la charge logistique quotidienne des parents.",
      "Pour les besoins ponctuels (activité, examen, internat), la course est adaptée au créneau et au lieu exact de prise en charge.",
    ],
    commitments: [
      "Régularité des horaires sur la semaine",
      "Points de prise en charge précis et confirmés",
      "Communication claire en cas d'ajustement",
    ],
    badges: ["Trajets quotidiens", "Élèves et étudiants", "Organisation fiable"],
    gallery: [
      {
        src: "/images/services/transport-scolaire.webp",
        alt: "Élève prêt pour un trajet scolaire en taxi.",
        caption: "Routines scolaires mieux organisées",
      },
      {
        src: "/images/home-mairie.webp",
        alt: "Centre-ville du Havre illustrant les déplacements vers établissements.",
        caption: "Liaisons locales vers les établissements",
      },
      {
        src: "/images/service-station.webp",
        alt: "Station de taxis pour départs réguliers au Havre.",
        caption: "Disponibilité planifiée chaque semaine",
      },
    ],
    scenarios: [
      {
        label: "Trajet récurrent",
        detail:
          "Organisation d'horaires fixes matin/soir pour un fonctionnement régulier sur la semaine.",
      },
      {
        label: "Activité extra-scolaire",
        detail:
          "Course ponctuelle vers entraînement, cours ou activité en dehors des trajets habituels.",
      },
      {
        label: "Examens et concours",
        detail:
          "Départ ajusté pour arriver en avance le jour J, avec confirmation des horaires la veille.",
      },
    ],
    faqs: [
      {
        question: "Le service peut-il être hebdomadaire ?",
        answer:
          "Oui, nous pouvons organiser un rythme récurrent avec horaires définis à l'avance.",
      },
      {
        question: "Peut-on modifier un horaire ponctuellement ?",
        answer:
          "Oui, les ajustements ponctuels sont possibles selon disponibilité et anticipation.",
      },
      {
        question: "Le service couvre-t-il aussi les trajets étudiants ?",
        answer:
          "Oui, il est adapté aux besoins des lycéens, étudiants et déplacements de campus.",
      },
    ],
  },
  "transport-professionnel-et-entreprise": {
    lead: "Une solution de mobilité souple pour vos équipes, vos visiteurs et vos événements d'entreprise.",
    extraDetails: [
      "Nous structurons vos déplacements en fonction de vos contraintes opérationnelles: trajets collaborateurs, accueil visiteurs, réunions externes ou événements.",
      "Le service peut être ponctuel ou récurrent, avec un cadre clair pour garder la visibilité sur les prises en charge.",
    ],
    commitments: [
      "Pilotage des courses depuis un interlocuteur dédié",
      "Trajets collaborateurs, clients et partenaires",
      "Simplicité administrative et suivi des demandes",
    ],
    badges: ["Comptes pro", "Visiteurs et équipes", "Service modulable"],
    gallery: [
      {
        src: "/images/services/transport-entreprise.webp",
        alt: "Professionnel en déplacement avec un service taxi entreprise.",
        caption: "Mobilité entreprise pilotée simplement",
      },
      {
        src: "/images/services/classe-affaire.webp",
        alt: "Transfert professionnel classe affaire.",
        caption: "Accueil premium pour clients stratégiques",
      },
      {
        src: "/images/home-pont-normandie.webp",
        alt: "Axe de circulation normand pour déplacements business.",
        caption: "Trajets urbains et régionaux optimisés",
      },
    ],
    scenarios: [
      {
        label: "Navette collaborateurs",
        detail:
          "Gestion de trajets réguliers entre gare, bureau, zones d'activité et hôtels partenaires.",
      },
      {
        label: "Accueil client",
        detail:
          "Prise en charge professionnelle de vos visiteurs avec arrivée cadrée sur vos horaires de réunion.",
      },
      {
        label: "Événement pro",
        detail:
          "Organisation de plusieurs rotations pour salons, séminaires ou événements internes.",
      },
    ],
    faqs: [
      {
        question: "Ce service convient-il aux besoins ponctuels ?",
        answer:
          "Oui, il fonctionne aussi bien pour une demande unique que pour un besoin récurrent.",
      },
      {
        question: "Peut-on centraliser les demandes d'une équipe ?",
        answer:
          "Oui, un canal de demande unique peut être mis en place pour simplifier la coordination.",
      },
      {
        question: "Gérez-vous les trajets vers zones d'activité autour du Havre ?",
        answer:
          "Oui, les déplacements locaux et périphériques sont pris en charge selon votre planning.",
      },
    ],
  },
  "personne-a-mobilite-reduite": {
    lead: "Un service PMR attentif, conçu pour préserver confort, autonomie et tranquillité d'esprit.",
    extraDetails: [
      "Chaque déplacement est préparé avec soin: accès au point de prise en charge, aide à l'installation et trajet adapté au rythme de la personne.",
      "Le service convient aux rendez-vous médicaux, aux démarches administratives ou aux trajets personnels du quotidien.",
    ],
    commitments: [
      "Assistance de la montée à l'arrivée",
      "Trajet adapté aux besoins de mobilité",
      "Communication claire avec l'accompagnant si nécessaire",
    ],
    badges: ["Accessibilité PMR", "Aide personnalisée", "Confort prioritaire"],
    gallery: [
      {
        src: "/images/services/pmr.webp",
        alt: "Personne à mobilité réduite en attente d'un taxi adapté.",
        caption: "Prise en charge adaptée et rassurante",
      },
      {
        src: "/images/service-station.webp",
        alt: "Station de taxi facilitant la prise en charge PMR.",
        caption: "Organisation claire au départ comme à l'arrivée",
      },
      {
        src: "/images/home-mairie.webp",
        alt: "Centre-ville du Havre pour trajets administratifs et personnels.",
        caption: "Trajets médicaux, personnels et administratifs",
      },
    ],
    scenarios: [
      {
        label: "Rendez-vous médical",
        detail:
          "Départ anticipé, assistance à l'installation et arrivée au plus près de l'entrée de l'établissement.",
      },
      {
        label: "Course administrative",
        detail:
          "Trajet adapté vers administrations, services publics ou structures d'accompagnement.",
      },
      {
        label: "Sortie personnelle",
        detail:
          "Déplacements loisirs ou visites familiales avec le même niveau d'attention.",
      },
    ],
    faqs: [
      {
        question: "L'accompagnement est-il assuré au départ et à l'arrivée ?",
        answer:
          "Oui, l'aide à l'installation et à la descente fait partie de la prise en charge.",
      },
      {
        question: "Le service PMR est-il réservé aux trajets médicaux ?",
        answer:
          "Non, il est aussi disponible pour des déplacements personnels et administratifs.",
      },
      {
        question: "Peut-on réserver pour une personne accompagnée ?",
        answer:
          "Oui, vous pouvez réserver pour un proche et préciser les informations utiles en amont.",
      },
    ],
  },
  "croisieres-port": {
    lead: "Des transferts portuaires rapides pour vos passagers croisière, en escale ou au départ du Havre.",
    extraDetails: [
      "Nous coordonnons la prise en charge avec les contraintes des terminaux portuaires afin de fluidifier vos déplacements dès la descente du navire.",
      "Que vous partiez vers un hôtel, une gare, un aéroport ou une visite locale, le trajet est cadré pour optimiser votre temps à terre.",
    ],
    commitments: [
      "Prise en charge au plus près des terminaux",
      "Coordination avec les horaires d'escale",
      "Trajets directs vers points clés de la région",
    ],
    badges: ["Terminaux portuaires", "Escale optimisée", "Transferts directs"],
    gallery: [
      {
        src: "/images/services/croisieres-port.webp",
        alt: "Zone portuaire du Havre pour transferts passagers croisière.",
        caption: "Liaisons rapides depuis les terminaux",
      },
      {
        src: "/images/home-catene.webp",
        alt: "Vue du front de mer du Havre, idéale pour une escale.",
        caption: "Escale courte ou journée complète",
      },
      {
        src: "/images/home-bassin-commerce.webp",
        alt: "Bassin du Commerce au Havre, proche du circuit portuaire.",
        caption: "Départs vers gare, hôtel, aéroport ou visites",
      },
    ],
    scenarios: [
      {
        label: "Arrivée paquebot",
        detail:
          "Accueil à la descente et transfert immédiat vers votre destination selon votre timing d'escale.",
      },
      {
        label: "Retour terminal",
        detail:
          "Trajet retour planifié avec marge pour sécuriser l'embarquement sans précipitation.",
      },
      {
        label: "Tour privé escale",
        detail:
          "Organisation d'un parcours local avant retour au port à l'horaire convenu.",
      },
    ],
    faqs: [
      {
        question: "Intervenez-vous directement au terminal croisière ?",
        answer:
          "Oui, la prise en charge est coordonnée selon les accès autorisés et le point de rendez-vous défini.",
      },
      {
        question: "Peut-on prévoir un aller-retour durant l'escale ?",
        answer:
          "Oui, l'aller et le retour peuvent être organisés avec un horaire de reprise clair.",
      },
      {
        question: "Le service convient-il aux petits groupes ?",
        answer:
          "Oui, nous pouvons adapter la course pour plusieurs passagers selon le volume à transporter.",
      },
    ],
  },
  "transport-groupes": {
    lead: "Un service pratique pour déplacer familles, équipes et petits groupes en restant ensemble.",
    extraDetails: [
      "Nous dimensionnons la solution selon le nombre de passagers, les bagages et le type de trajet afin d'assurer un départ fluide.",
      "Pour les sorties, événements ou transferts collectifs, le planning est structuré pour limiter les attentes et simplifier l'organisation.",
    ],
    commitments: [
      "Capacité adaptée aux groupes et bagages",
      "Coordination des horaires et points de rendez-vous",
      "Confort homogène pour tous les passagers",
    ],
    badges: ["Groupes 6 à 8", "Événements", "Trajets personnalisés"],
    gallery: [
      {
        src: "/images/services/transport-groupes.webp",
        alt: "Groupe de passagers pris en charge par un taxi spacieux.",
        caption: "Voyager ensemble sans dispersion",
      },
      {
        src: "/images/tour-03-normandie.webp",
        alt: "Circuit normand illustrant les déplacements collectifs.",
        caption: "Sorties groupe et excursions",
      },
      {
        src: "/images/tour-09-cote-fleurie.webp",
        alt: "Paysage côtier pour trajets collectifs touristiques.",
        caption: "Trajets locaux, régionaux et longue distance",
      },
    ],
    scenarios: [
      {
        label: "Famille avec bagages",
        detail:
          "Véhicule spacieux et itinéraire direct pour éviter les changements de transport.",
      },
      {
        label: "Sortie d'équipe",
        detail:
          "Organisation d'un départ commun pour réunions externes, restauration ou séminaire.",
      },
      {
        label: "Événement privé",
        detail:
          "Allers-retours planifiés pour maintenir la fluidité avant et après l'événement.",
      },
    ],
    faqs: [
      {
        question: "Combien de passagers peuvent voyager ensemble ?",
        answer:
          "Le service est pensé pour les petits groupes avec capacité adaptée selon la configuration.",
      },
      {
        question: "Peut-on prévoir plusieurs arrêts ?",
        answer:
          "Oui, les points d'arrêt peuvent être anticipés lors de la réservation.",
      },
      {
        question: "Le service est-il possible pour une journée entière ?",
        answer:
          "Oui, une mise à disposition sur créneau étendu peut être préparée selon votre programme.",
      },
    ],
  },
};

const buildFallbackStory = (service: ServiceDefinition): ServiceStory => ({
  lead: service.heroSubtitle,
  extraDetails: [
    "Chaque course est organisée autour de votre contexte réel: horaires, destination, volume à transporter et niveau d'assistance attendu.",
    "Nous gardons une approche simple et claire pour vous permettre de réserver rapidement tout en conservant un service fiable.",
  ],
  commitments: [
    "Organisation claire avant le départ",
    "Prise en charge ponctuelle",
    "Suivi jusqu'à votre destination",
  ],
  badges: ["Service local", "Réservation simple", "Accompagnement fiable"],
  gallery: [
    {
      src: service.imageSrc,
      alt: service.imageAlt,
      caption: `Service ${service.title}`,
    },
    {
      src: "/images/service-station.webp",
      alt: "Station de taxis au Havre.",
      caption: "Présence locale sur Le Havre",
    },
    {
      src: "/images/home-mairie.webp",
      alt: "Vue urbaine du Havre.",
      caption: "Trajets urbains et périphériques",
    },
  ],
  scenarios: [
    {
      label: "Besoin immédiat",
      detail: "Course ponctuelle avec confirmation rapide selon disponibilité.",
    },
    {
      label: "Trajet planifié",
      detail: "Réservation anticipée avec horaire et point de rendez-vous validés.",
    },
    {
      label: "Demande spécifique",
      detail: "Adaptation du service selon vos contraintes de trajet et d'organisation.",
    },
  ],
  faqs: [
    {
      question: "Comment réserver ce service ?",
      answer: "Vous pouvez réserver par téléphone ou via le formulaire de contact en détaillant votre besoin.",
    },
    {
      question: "Intervenez-vous uniquement au Havre ?",
      answer: "Le Havre est le point central, avec des déplacements possibles vers l'agglomération et au-delà.",
    },
    {
      question: "Puis-je réserver pour un tiers ?",
      answer: "Oui, précisez simplement les coordonnées de la personne et l'adresse de prise en charge.",
    },
  ],
});

const processSteps = [
  {
    title: "Brief de votre besoin",
    description: "Vous indiquez votre trajet, vos horaires et les informations utiles pour préparer la course.",
    icon: Phone,
  },
  {
    title: "Confirmation rapide",
    description: "Le créneau est validé et le départ est ajusté pour garantir ponctualité et sérénité.",
    icon: Clock,
  },
  {
    title: "Prise en charge précise",
    description: "Le rendez-vous se fait au point convenu, avec assistance selon votre situation.",
    icon: MapPin,
  },
  {
    title: "Trajet suivi jusqu'à l'arrivée",
    description: "Conduite fluide, informations claires et dépose au plus près de votre destination.",
    icon: CheckCircle2,
  },
];

const SERVICE_GALLERY_FALLBACKS: Record<string, ServiceGalleryItem[]> = {
  "navette-aeroport": [
    {
      src: "/images/home-pont-normandie.webp",
      alt: "Pont de Normandie sur un itinéraire de transfert depuis Le Havre.",
      caption: "Trajets fluides vers les axes principaux",
    },
    {
      src: "/images/tour-11-paris.webp",
      alt: "Vue urbaine illustrant les correspondances longue distance.",
      caption: "Connexion vers gares et hubs nationaux",
    },
    {
      src: "/images/service-station.webp",
      alt: "Station de taxis prête pour un départ planifié.",
      caption: "Départ confirmé et ponctuel",
    },
  ],
  mariage: [
    {
      src: "/images/home-mairie.webp",
      alt: "Mairie du Havre pour les déplacements cérémonie.",
      caption: "Liaisons mairie et réception",
    },
    {
      src: "/images/home-catene.webp",
      alt: "Vue de la Catène au Havre pour illustrer les trajets de la journée.",
      caption: "Accompagnement sur toute la journée",
    },
    {
      src: "/images/home-bassin-commerce.webp",
      alt: "Bassin du Commerce au Havre pour trajets invités.",
      caption: "Rotations invitées organisées",
    },
  ],
  "navette-transport-sanitaire": [
    {
      src: "/images/service-station.webp",
      alt: "Station de taxis pour prise en charge médicale planifiée.",
      caption: "Prises en charge régulières",
    },
    {
      src: "/images/home-mairie.webp",
      alt: "Vue urbaine du Havre pour trajets médicaux locaux.",
      caption: "Trajets médicaux locaux",
    },
    {
      src: "/images/home-bassin-commerce.webp",
      alt: "Vue du Havre pour illustrer les retours à domicile.",
      caption: "Aller-retour coordonné selon vos soins",
    },
  ],
  "navette-classe-affaire": [
    {
      src: "/images/services/transport-entreprise.webp",
      alt: "Passager professionnel lors d'un transfert entreprise.",
      caption: "Prise en charge business structurée",
    },
    {
      src: "/images/home-bassin-commerce.webp",
      alt: "Quartier d'affaires au Havre.",
      caption: "Efficacité sur vos déplacements urbains",
    },
    {
      src: "/images/home-pont-normandie.webp",
      alt: "Axe régional pour déplacements professionnels.",
      caption: "Longues liaisons professionnelles",
    },
  ],
  "navette-transport-scolaire": [
    {
      src: "/images/service-station.webp",
      alt: "Station de taxis prête pour des départs scolaires.",
      caption: "Routines quotidiennes fiabilisées",
    },
    {
      src: "/images/home-mairie.webp",
      alt: "Centre-ville du Havre pour déplacements vers établissements.",
      caption: "Liaisons école et activités",
    },
    {
      src: "/images/home-catene.webp",
      alt: "Vue urbaine pour trajets élèves et étudiants.",
      caption: "Organisation souple sur la semaine",
    },
  ],
  "transport-professionnel-et-entreprise": [
    {
      src: "/images/services/classe-affaire.webp",
      alt: "Transfert premium pour un environnement entreprise.",
      caption: "Accueil client et collaborateurs",
    },
    {
      src: "/images/home-pont-normandie.webp",
      alt: "Axe de circulation normand pour déplacements entreprise.",
      caption: "Déplacements régionaux optimisés",
    },
    {
      src: "/images/home-bassin-commerce.webp",
      alt: "Zone centrale du Havre pour rendez-vous professionnels.",
      caption: "Trajets inter-sites planifiés",
    },
  ],
  "personne-a-mobilite-reduite": [
    {
      src: "/images/service-station.webp",
      alt: "Zone de prise en charge adaptée au Havre.",
      caption: "Accompagnement dès le départ",
    },
    {
      src: "/images/home-mairie.webp",
      alt: "Centre-ville pour déplacements administratifs PMR.",
      caption: "Trajets personnels et administratifs",
    },
    {
      src: "/images/home-bassin-commerce.webp",
      alt: "Vue urbaine pour déplacements PMR planifiés.",
      caption: "Confort et attention continue",
    },
  ],
  "croisieres-port": [
    {
      src: "/images/home-catene.webp",
      alt: "Front de mer au Havre, proche des flux portuaires.",
      caption: "Transferts en rythme d'escale",
    },
    {
      src: "/images/home-bassin-commerce.webp",
      alt: "Bassin du Commerce pour déplacements passagers.",
      caption: "Liaisons rapides vers points clés",
    },
    {
      src: "/images/tour-01-le-havre.webp",
      alt: "Vue du Havre pour prolonger une escale croisière.",
      caption: "Escale courte ou tour local",
    },
  ],
  "transport-groupes": [
    {
      src: "/images/tour-03-normandie.webp",
      alt: "Circuit normand adapté aux déplacements collectifs.",
      caption: "Sorties groupe et excursions",
    },
    {
      src: "/images/tour-09-cote-fleurie.webp",
      alt: "Paysage côtier pour trajets collectifs longue distance.",
      caption: "Confort groupe sur trajets étendus",
    },
    {
      src: "/images/service-station.webp",
      alt: "Point de rendez-vous collectif au Havre.",
      caption: "Départ commun, organisation simple",
    },
  ],
};

const GENERIC_GALLERY_FALLBACKS: ServiceGalleryItem[] = [
  {
    src: "/images/service-station.webp",
    alt: "Station de taxis au Havre.",
    caption: "Service local disponible",
  },
  {
    src: "/images/home-mairie.webp",
    alt: "Vue de la mairie du Havre.",
    caption: "Déplacements urbains facilités",
  },
  {
    src: "/images/home-catene.webp",
    alt: "Vue de la Catène au Havre.",
    caption: "Trajets adaptés à votre contexte",
  },
  {
    src: "/images/home-bassin-commerce.webp",
    alt: "Bassin du Commerce au Havre.",
    caption: "Coordination claire avant départ",
  },
];

const buildUniqueGallery = (service: ServiceDefinition, story: ServiceStory): ServiceGalleryItem[] => {
  const seen = new Set<string>([service.imageSrc]);
  const unique: ServiceGalleryItem[] = [];

  const tryAdd = (item: ServiceGalleryItem) => {
    if (!item.src || seen.has(item.src)) {
      return;
    }
    seen.add(item.src);
    unique.push(item);
  };

  story.gallery.forEach(tryAdd);
  (SERVICE_GALLERY_FALLBACKS[service.slug] ?? []).forEach(tryAdd);
  GENERIC_GALLERY_FALLBACKS.forEach(tryAdd);

  return unique.slice(0, 4);
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;
  const story = service ? SERVICE_STORIES[service.slug] ?? buildFallbackStory(service) : null;
  const prefersReducedMotion = useReducedMotion();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const galleryItems = useMemo(
    () => (service && story ? buildUniqueGallery(service, story) : []),
    [service, story],
  );

  useEffect(() => {
    setActiveGalleryIndex(0);
  }, [service?.slug]);

  useEffect(() => {
    if (prefersReducedMotion || galleryItems.length <= 1) {
      return;
    }

    const autoplay = window.setInterval(() => {
      setActiveGalleryIndex((prev) => (prev + 1) % galleryItems.length);
    }, 4800);

    return () => {
      window.clearInterval(autoplay);
    };
  }, [galleryItems.length, prefersReducedMotion]);

  useSEO(
    service
      ? {
          title: service.title,
          description: service.seoDescription,
          canonicalPath: `/services/${service.slug}`,
          ogImage: service.imageSrc,
          keywords: [
            "taxi le havre",
            service.title.toLowerCase(),
            `service taxi ${service.title.toLowerCase()} le havre`,
          ],
          breadcrumbs: [
            { name: "Accueil", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ],
          structuredData: {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.seoDescription,
            serviceType: service.title,
            url: `${PRIMARY_DOMAIN}/services/${service.slug}`,
            areaServed: "Le Havre et agglomération",
            inLanguage: "fr-FR",
            image: `${PRIMARY_DOMAIN}${service.imageSrc}`,
            provider: {
              "@type": "LocalBusiness",
              name: SITE_NAME,
              url: PRIMARY_DOMAIN,
            },
          },
        }
      : {
          title: "Service introuvable",
          description: "Le service demandé est introuvable.",
          canonicalPath: "/services",
          robots: "noindex, follow",
        },
  );

  if (!service || !story) {
    return <NotFound />;
  }

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.18 },
      };
  const activeGalleryItem = galleryItems[Math.min(activeGalleryIndex, galleryItems.length - 1)] ?? galleryItems[0];

  return (
    <Layout>
      <PageHero title={service.title} subtitle={service.heroSubtitle} backgroundImage={service.imageSrc} />

      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-[10%] h-60 w-60 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 right-[8%] h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="container relative grid gap-8 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <motion.article
              variants={SECTION_VARIANTS}
              {...revealProps}
              className="rounded-3xl border bg-card/95 p-6 shadow-[0_18px_40px_-30px_hsl(var(--primary)/0.6)] backdrop-blur-sm md:p-8"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                  <service.icon className="h-4 w-4" />
                  Service expert
                </span>
                {story.badges.map((badge) => (
                  <span key={badge} className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {badge}
                  </span>
                ))}
              </div>

              <h2 className="font-heading text-2xl font-bold md:text-3xl">Un service plus précis, pensé pour le terrain</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{story.lead}</p>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {service.details.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {story.extraDetails.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <motion.ul
                variants={GRID_VARIANTS}
                {...revealProps}
                className="mt-6 grid gap-3 sm:grid-cols-2"
              >
                {[...service.highlights, ...story.commitments].map((item) => (
                  <motion.li
                    key={item}
                    variants={ITEM_VARIANTS}
                    className="flex items-start gap-2 rounded-xl border bg-background/80 px-3 py-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.article>

            <motion.section variants={SECTION_VARIANTS} {...revealProps} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-xl font-semibold md:text-2xl">Ambiance du service</h3>
                <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Expérience visuelle
                </span>
              </div>

              <div className="rounded-3xl border bg-card/95 p-3 shadow-sm md:p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {galleryItems.map((image, index) => (
                    <button
                      key={`progress-${image.src}`}
                      type="button"
                      aria-label={`Voir l'image ${index + 1}`}
                      onClick={() => setActiveGalleryIndex(index)}
                      className="group rounded-full p-0.5"
                    >
                      <span
                        className={cn(
                          "block h-1.5 rounded-full transition-all duration-400",
                          index === activeGalleryIndex ? "w-11 bg-primary" : "w-5 bg-border group-hover:bg-primary/50",
                        )}
                      />
                    </button>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-2xl border bg-black/10">
                  <AnimatePresence mode="wait">
                    {activeGalleryItem && (
                      <motion.img
                        key={`${activeGalleryItem.src}-${activeGalleryIndex}`}
                        src={activeGalleryItem.src}
                        alt={activeGalleryItem.alt}
                        loading="lazy"
                        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.06 }}
                        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                        className="h-[340px] w-full object-cover md:h-[420px]"
                      />
                    )}
                  </AnimatePresence>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {activeGalleryItem && (
                    <figcaption className="absolute bottom-3 left-3 right-3 rounded-lg border border-white/25 bg-black/45 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm md:text-sm">
                      <div className="mb-1 inline-flex rounded-full border border-white/35 bg-black/25 px-2 py-0.5 text-[11px] font-semibold">
                        {String(activeGalleryIndex + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
                      </div>
                      <p>{activeGalleryItem.caption}</p>
                    </figcaption>
                  )}

                  {galleryItems.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Image précédente"
                        onClick={() =>
                          setActiveGalleryIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
                        }
                        className="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:bg-black/60"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Image suivante"
                        onClick={() => setActiveGalleryIndex((prev) => (prev + 1) % galleryItems.length)}
                        className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:bg-black/60"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {galleryItems.map((image, index) => (
                    <button
                      key={`thumb-${image.src}`}
                      type="button"
                      onClick={() => setActiveGalleryIndex(index)}
                      className={cn(
                        "group relative overflow-hidden rounded-xl border text-left transition",
                        index === activeGalleryIndex ? "border-primary shadow-sm" : "border-border hover:border-primary/45",
                      )}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className={cn(
                          "h-20 w-full object-cover transition-transform duration-500",
                          index === activeGalleryIndex ? "scale-105" : "group-hover:scale-105",
                        )}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-1.5 left-1.5 right-1.5 line-clamp-2 text-[10px] font-semibold text-white">
                        {image.caption}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={SECTION_VARIANTS}
              {...revealProps}
              className="rounded-3xl border bg-card/95 p-6 shadow-sm md:p-8"
            >
              <h3 className="font-heading text-xl font-semibold md:text-2xl">Comment se déroule la course</h3>
              <ol className="mt-5 space-y-4">
                {processSteps.map((step, index) => (
                  <motion.li key={step.title} variants={ITEM_VARIANTS} className="relative pl-12">
                    {index < processSteps.length - 1 && (
                      <span className="absolute left-[18px] top-8 h-[calc(100%-1rem)] w-px bg-border" aria-hidden="true" />
                    )}
                    <span className="absolute left-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="h-4 w-4" />
                    </span>
                    <h4 className="font-heading text-base font-semibold">{step.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </motion.li>
                ))}
              </ol>
            </motion.section>

            <motion.section
              variants={SECTION_VARIANTS}
              {...revealProps}
              className="rounded-3xl border bg-card/95 p-6 shadow-sm md:p-8"
            >
              <h3 className="font-heading text-xl font-semibold md:text-2xl">Questions fréquentes</h3>
              <Accordion type="single" collapsible className="mt-4">
                {story.faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="text-left font-heading text-base hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.section>
          </div>

          <motion.aside
            variants={SECTION_VARIANTS}
            {...revealProps}
            className="h-fit space-y-5 xl:sticky xl:top-24"
          >
            <div className="rounded-3xl border bg-card/95 p-6 shadow-[0_20px_44px_-30px_hsl(var(--secondary)/0.7)] backdrop-blur-sm">
              <h3 className="font-heading text-xl font-semibold">Réserver ce service</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Décrivez rapidement votre besoin: horaire, adresse de départ, destination et contraintes éventuelles.
              </p>

              <div className="mt-5 space-y-3">
                <Button className="w-full" asChild>
                  <a href={`tel:${CONTACT_PHONE_LINK}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">Envoyer une demande</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/services">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour aux services
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-secondary/15 p-6 shadow-sm">
              <h3 className="font-heading text-lg font-semibold">Préparer votre demande</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Pour une confirmation plus rapide, partagez ces informations dès le premier message.
              </p>

              <ul className="mt-4 space-y-2">
                {[
                  "Date et heure souhaitées",
                  "Adresse de départ et destination",
                  "Nombre de passagers, bagages et contraintes spécifiques",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 rounded-lg border bg-card/85 px-3 py-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-2.5">
                {story.scenarios.map((scenario) => (
                  <div key={scenario.label} className="rounded-xl border bg-card/95 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{scenario.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{scenario.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
