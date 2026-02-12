import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  Briefcase,
  GraduationCap,
  Heart,
  Plane,
  Ship,
  Stethoscope,
  Users,
} from "lucide-react";

export type ServiceDefinition = {
  slug: string;
  title: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
  shortDescription: string;
  heroSubtitle: string;
  seoDescription: string;
  details: string[];
  highlights: string[];
  legacyPath?: `/${string}`;
};

export const servicesData: ServiceDefinition[] = [
  {
    slug: "navette-aeroport",
    title: "Navette Aéroport",
    icon: Plane,
    imageSrc: "/images/services/navette-aeroport.webp",
    imageAlt: "Passager avec ses bagages devant un taxi pour un transfert aéroport.",
    shortDescription: "Transferts vers les aéroports et gares, avec prise en charge ponctuelle au départ comme à l'arrivée.",
    heroSubtitle: "Départ ou arrivée, nous coordonnons vos transferts aéroport et gare 24h/24.",
    seoDescription: "Service de navette aéroport au Havre pour vos transferts vers gares, Deauville, Orly et CDG.",
    details: [
      "Nos chauffeurs suivent vos horaires de vol ou de train pour adapter la prise en charge en temps réel.",
      "Vous voyagez seul, en famille ou avec des bagages volumineux : nous attribuons le véhicule adapté à votre besoin.",
    ],
    highlights: [
      "Suivi des horaires de départ et d'arrivée",
      "Réservation anticipée ou immédiate selon disponibilité",
      "Prise en charge à domicile, à l'hôtel, en gare ou à l'aéroport",
    ],
    legacyPath: "/navette-aeroport",
  },
  {
    slug: "mariage",
    title: "Mariage",
    icon: Heart,
    imageSrc: "/images/services/mariage.webp",
    imageAlt: "Couple de mariés près d'un véhicule pour un transport mariage.",
    shortDescription: "Mise à disposition de taxis pour mariés, familles et invités, avec organisation des trajets de la journée.",
    heroSubtitle: "Un service mariage fiable pour sécuriser les déplacements de vos invités.",
    seoDescription: "Service taxi mariage au Havre pour mariés et invités, avec navettes planifiées.",
    details: [
      "Nous organisons les déplacements des mariés et des proches entre mairie, lieu de cérémonie, réception et hébergements.",
      "Le planning des courses est défini en amont afin de garantir ponctualité et fluidité sur toute la journée.",
    ],
    highlights: [
      "Organisation des allers-retours des invités",
      "Horaires de prise en charge définis à l'avance",
      "Disponibilité en journée et en soirée",
    ],
    legacyPath: "/mariage",
  },
  {
    slug: "navette-transport-sanitaire",
    title: "Transport Sanitaire",
    icon: Stethoscope,
    imageSrc: "/images/services/transport-sanitaire.webp",
    imageAlt: "Équipe médicale en intervention pour illustrer le transport sanitaire assis.",
    shortDescription: "Trajets assis vers consultations, examens ou hospitalisations, en toute sérénité.",
    heroSubtitle: "Un accompagnement fiable pour vos déplacements médicaux assis.",
    seoDescription: "Transport sanitaire assis au Havre pour rendez-vous médicaux, examens et retours à domicile.",
    details: [
      "Nous assurons vos trajets vers hôpitaux, cliniques et cabinets médicaux avec une conduite souple et ponctuelle.",
      "Les courses sont planifiées selon vos horaires de consultation pour limiter l'attente et simplifier l'organisation.",
    ],
    highlights: [
      "Prise en charge vers établissements de soins",
      "Confort et accompagnement de porte à porte",
      "Disponibilité 7j/7 selon vos rendez-vous",
    ],
    legacyPath: "/navette-transport-sanitaire",
  },
  {
    slug: "navette-classe-affaire",
    title: "Classe Affaire",
    icon: Briefcase,
    imageSrc: "/images/services/classe-affaire.webp",
    imageAlt: "Passager en tenue professionnelle lors d'un transfert classe affaire.",
    shortDescription: "Transport premium pour vos rendez-vous professionnels, avec discrétion et ponctualité.",
    heroSubtitle: "Un service professionnel pour vos déplacements business au Havre et en Normandie.",
    seoDescription: "Service taxi classe affaire au Havre pour clients business et transferts professionnels.",
    details: [
      "Ce service s'adresse aux dirigeants, collaborateurs et clients qui souhaitent un transport confortable et efficace.",
      "Nous proposons une prise en charge soignée pour les réunions, séminaires, congrès et transferts longue distance.",
    ],
    highlights: [
      "Ponctualité renforcée sur vos horaires professionnels",
      "Conduite discrète et véhicules confortables",
      "Facturation adaptée aux besoins des entreprises",
    ],
    legacyPath: "/navette-classe-affaire",
  },
  {
    slug: "navette-transport-scolaire",
    title: "Transport scolaire",
    icon: GraduationCap,
    imageSrc: "/images/services/transport-scolaire.webp",
    imageAlt: "Enfant en tenue scolaire pour illustrer les trajets d'école.",
    shortDescription: "Trajets réguliers pour élèves et étudiants, avec un service encadré et ponctuel.",
    heroSubtitle: "Des déplacements scolaires organisés et fiables au quotidien.",
    seoDescription: "Service taxi transport scolaire au Havre pour trajets réguliers et ponctuels.",
    details: [
      "Nous assurons des trajets scolaires planifiés vers établissements, internats et activités extra-scolaires.",
      "Les prises en charge sont organisées selon des horaires fixes pour garantir régularité et sérénité des familles.",
    ],
    highlights: [
      "Horaires réguliers matin, midi et soir",
      "Coordination avec les besoins des familles",
      "Service local sur Le Havre et ses alentours",
    ],
    legacyPath: "/navette-transport-scolaire",
  },
  {
    slug: "transport-professionnel-et-entreprise",
    title: "Transport professionnel et entreprise",
    icon: Briefcase,
    imageSrc: "/images/services/transport-entreprise.webp",
    imageAlt: "Professionnel au téléphone dans un taxi pour un déplacement d'entreprise.",
    shortDescription: "Service dédié aux entreprises pour déplacements collaborateurs, clients et partenaires.",
    heroSubtitle: "Une organisation transport pensée pour les besoins des entreprises.",
    seoDescription: "Transport professionnel et entreprise au Havre avec suivi, ponctualité et facturation dédiée.",
    details: [
      "Nous accompagnons les entreprises pour les trajets quotidiens, les rendez-vous clients et les événements corporate.",
      "Un interlocuteur unique permet de centraliser les demandes et de fluidifier l'organisation des courses.",
    ],
    highlights: [
      "Prise en charge des collaborateurs et visiteurs",
      "Facturation claire pour les comptes professionnels",
      "Disponibilité sur réservation ou à la demande",
    ],
    legacyPath: "/transport-professionnel-et-entreprise",
  },
  {
    slug: "personne-a-mobilite-reduite",
    title: "Personne à mobilité réduite",
    icon: Accessibility,
    imageSrc: "/images/services/pmr.webp",
    imageAlt: "Personne en fauteuil roulant attendant une prise en charge taxi PMR.",
    shortDescription: "Véhicules adaptés PMR et assistance pour des déplacements confortables et sécurisés.",
    heroSubtitle: "Un service PMR dédié avec véhicules adaptés et assistance.",
    seoDescription: "Service taxi PMR au Havre pour personnes à mobilité réduite avec véhicules adaptés.",
    details: [
      "Nous mettons à disposition des taxis adaptés pour faciliter les déplacements des personnes à mobilité réduite.",
      "Nos équipes veillent à proposer une prise en charge attentive, de la montée dans le véhicule à l'arrivée.",
    ],
    highlights: [
      "Véhicules adaptés PMR",
      "Accompagnement à la montée et à la descente",
      "Trajets médicaux, personnels ou administratifs",
    ],
    legacyPath: "/personne-a-mobilite-reduite",
  },
  {
    slug: "croisieres-port",
    title: "Croisières et port",
    icon: Ship,
    imageSrc: "/images/services/croisieres-port.webp",
    imageAlt: "Vue du port du Havre pour illustrer les transferts passagers croisière.",
    shortDescription: "Prise en charge des passagers croisière depuis et vers les terminaux du port du Havre.",
    heroSubtitle: "Transferts portuaires rapides pour les passagers en escale ou au départ.",
    seoDescription: "Service taxi port et croisières au Havre avec prise en charge aux terminaux.",
    details: [
      "Nos chauffeurs habilités interviennent directement aux terminaux pour vos embarquements et débarquements.",
      "Nous organisons vos trajets vers hôtels, gares, aéroports ou sites touristiques pendant votre escale.",
    ],
    highlights: [
      "Accès aux terminaux du port du Havre",
      "Prise en charge individuelle ou en petits groupes",
      "Coordination avec les horaires de navire",
    ],
  },
  {
    slug: "transport-groupes",
    title: "Transport de groupes",
    icon: Users,
    imageSrc: "/images/services/transport-groupes.webp",
    imageAlt: "Station de taxis pour les déplacements en groupe au Havre.",
    shortDescription: "Déplacements de familles, équipes et groupes avec véhicules spacieux jusqu'à 8 passagers.",
    heroSubtitle: "Voyagez ensemble dans des véhicules adaptés aux petits groupes.",
    seoDescription: "Service taxi pour transport de groupes au Havre avec véhicules 6 à 8 places.",
    details: [
      "Pour les déplacements en groupe, nous mobilisons des véhicules capables de transporter passagers et bagages.",
      "Ce service convient aux sorties familiales, déplacements d'équipe, événements et transferts collectifs.",
    ],
    highlights: [
      "Capacité jusqu'à 8 passagers",
      "Véhicules confortables pour bagages et équipements",
      "Trajets locaux, régionaux et longues distances",
    ],
  },
];

export const getServiceBySlug = (slug: string): ServiceDefinition | undefined =>
  servicesData.find((service) => service.slug === slug);

export const serviceLegacyRedirects = servicesData
  .filter((service) => service.legacyPath)
  .map((service) => ({
    from: service.legacyPath as string,
    to: `/services/${service.slug}`,
  }));
