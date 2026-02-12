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
    shortDescription: "Transferts vers les aeroports et gares, avec prise en charge ponctuelle au depart comme a l'arrivee.",
    heroSubtitle: "Depart ou arrivee, nous coordonnons vos transferts aeroport et gare 24h/24.",
    seoDescription: "Service de navette aeroport au Havre pour vos transferts vers gares, Deauville, Orly et CDG.",
    details: [
      "Nos chauffeurs suivent vos horaires de vol ou de train pour adapter la prise en charge en temps reel.",
      "Vous voyagez seul, en famille ou avec des bagages volumineux : nous attribuons le vehicule adapte a votre besoin.",
    ],
    highlights: [
      "Suivi des horaires de depart et d'arrivee",
      "Reservation anticipee ou immediate selon disponibilite",
      "Prise en charge a domicile, a l'hotel, en gare ou a l'aeroport",
    ],
    legacyPath: "/navette-aeroport",
  },
  {
    slug: "mariage",
    title: "Mariage",
    icon: Heart,
    shortDescription: "Mise a disposition de taxis pour maries, familles et invites, avec organisation des trajets de la journee.",
    heroSubtitle: "Un service mariage fiable pour securiser les deplacements de vos invites.",
    seoDescription: "Service taxi mariage au Havre pour maries et invites, avec navettes planifiees.",
    details: [
      "Nous organisons les deplacements des maries et des proches entre mairie, lieu de ceremonie, reception et hebergements.",
      "Le planning des courses est defini en amont afin de garantir ponctualite et fluidite sur toute la journee.",
    ],
    highlights: [
      "Organisation des allers-retours des invites",
      "Horaires de prise en charge definis a l'avance",
      "Disponibilite en journee et en soiree",
    ],
    legacyPath: "/mariage",
  },
  {
    slug: "navette-transport-sanitaire",
    title: "Transport Sanitaire",
    icon: Stethoscope,
    shortDescription: "Trajets assis vers consultations, examens ou hospitalisations, en toute serenite.",
    heroSubtitle: "Un accompagnement fiable pour vos deplacements medicaux assis.",
    seoDescription: "Transport sanitaire assis au Havre pour rendez-vous medicaux, examens et retours a domicile.",
    details: [
      "Nous assurons vos trajets vers hopitaux, cliniques et cabinets medicaux avec une conduite souple et ponctuelle.",
      "Les courses sont planifiees selon vos horaires de consultation pour limiter l'attente et simplifier l'organisation.",
    ],
    highlights: [
      "Prise en charge vers etablissements de soins",
      "Confort et accompagnement de porte a porte",
      "Disponibilite 7j/7 selon vos rendez-vous",
    ],
    legacyPath: "/navette-transport-sanitaire",
  },
  {
    slug: "navette-classe-affaire",
    title: "Classe Affaire",
    icon: Briefcase,
    shortDescription: "Transport premium pour vos rendez-vous professionnels, avec discretion et ponctualite.",
    heroSubtitle: "Un service professionnel pour vos deplacements business au Havre et en Normandie.",
    seoDescription: "Service taxi classe affaire au Havre pour clients business et transferts professionnels.",
    details: [
      "Ce service s'adresse aux dirigeants, collaborateurs et clients qui souhaitent un transport confortable et efficace.",
      "Nous proposons une prise en charge soignee pour les reunions, seminars, congres et transferts longue distance.",
    ],
    highlights: [
      "Ponctualite renforcee sur vos horaires professionnels",
      "Conduite discreete et vehicules confortables",
      "Facturation adaptee aux besoins des entreprises",
    ],
    legacyPath: "/navette-classe-affaire",
  },
  {
    slug: "navette-transport-scolaire",
    title: "Transport scolaire",
    icon: GraduationCap,
    shortDescription: "Trajets reguliers pour eleves et etudiants, avec un service encadre et ponctuel.",
    heroSubtitle: "Des deplacements scolaires organises et fiables au quotidien.",
    seoDescription: "Service taxi transport scolaire au Havre pour trajets reguliers et ponctuels.",
    details: [
      "Nous assurons des trajets scolaires planifies vers etablissements, internats et activites extra-scolaires.",
      "Les prises en charge sont organisees selon des horaires fixes pour garantir regularite et serenite des familles.",
    ],
    highlights: [
      "Horaires reguliers matin, midi et soir",
      "Coordination avec les besoins des familles",
      "Service local sur Le Havre et ses alentours",
    ],
    legacyPath: "/navette-transport-scolaire",
  },
  {
    slug: "transport-professionnel-et-entreprise",
    title: "Transport professionnel et entreprise",
    icon: Briefcase,
    shortDescription: "Service dedie aux entreprises pour deplacements collaborateurs, clients et partenaires.",
    heroSubtitle: "Une organisation transport pensee pour les besoins des entreprises.",
    seoDescription: "Transport professionnel et entreprise au Havre avec suivi, ponctualite et facturation dediee.",
    details: [
      "Nous accompagnons les entreprises pour les trajets quotidiens, les rendez-vous clients et les evenements corporate.",
      "Un interlocuteur unique permet de centraliser les demandes et de fluidifier l'organisation des courses.",
    ],
    highlights: [
      "Prise en charge des collaborateurs et visiteurs",
      "Facturation claire pour les comptes professionnels",
      "Disponibilite sur reservation ou a la demande",
    ],
    legacyPath: "/transport-professionnel-et-entreprise",
  },
  {
    slug: "personne-a-mobilite-reduite",
    title: "Personne à mobilité réduite",
    icon: Accessibility,
    shortDescription: "Vehicules adaptes PMR et assistance pour des deplacements confortables et securises.",
    heroSubtitle: "Un service PMR dedie avec vehicules adaptes et assistance.",
    seoDescription: "Service taxi PMR au Havre pour personnes a mobilite reduite avec vehicules adaptes.",
    details: [
      "Nous mettons a disposition des taxis adaptes pour faciliter les deplacements des personnes a mobilite reduite.",
      "Nos equipes veillent a proposer une prise en charge attentive, de la montee dans le vehicule a l'arrivee.",
    ],
    highlights: [
      "Vehicules adaptes PMR",
      "Accompagnement a la montee et a la descente",
      "Trajets medicaux, personnels ou administratifs",
    ],
    legacyPath: "/personne-a-mobilite-reduite",
  },
  {
    slug: "croisieres-port",
    title: "Croisieres et port",
    icon: Ship,
    shortDescription: "Prise en charge des passagers croisiere depuis et vers les terminaux du port du Havre.",
    heroSubtitle: "Transferts portuaires rapides pour les passagers en escale ou au depart.",
    seoDescription: "Service taxi port et croisieres au Havre avec prise en charge aux terminaux.",
    details: [
      "Nos chauffeurs habilites interviennent directement aux terminaux pour vos embarquements et debarquements.",
      "Nous organisons vos trajets vers hotels, gares, aeroports ou sites touristiques pendant votre escale.",
    ],
    highlights: [
      "Acces aux terminaux du port du Havre",
      "Prise en charge individuelle ou en petits groupes",
      "Coordination avec les horaires de navire",
    ],
  },
  {
    slug: "transport-groupes",
    title: "Transport de groupes",
    icon: Users,
    shortDescription: "Deplacements de familles, equipes et groupes avec vehicules spacieux jusqu'a 8 passagers.",
    heroSubtitle: "Voyagez ensemble dans des vehicules adaptes aux petits groupes.",
    seoDescription: "Service taxi pour transport de groupes au Havre avec vehicules 6 a 8 places.",
    details: [
      "Pour les deplacements en groupe, nous mobilisons des vehicules capables de transporter passagers et bagages.",
      "Ce service convient aux sorties familiales, deplacements d'equipe, evenements et transferts collectifs.",
    ],
    highlights: [
      "Capacite jusqu'a 8 passagers",
      "Vehicules confortables pour bagages et equipements",
      "Trajets locaux, regionaux et longues distances",
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
