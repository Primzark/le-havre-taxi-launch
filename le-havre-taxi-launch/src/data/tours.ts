export type Tour = {
  id: number;
  name: string;
  duration: string;
  price: number;
  image: string;
  story: {
    title: string;
    intro: string;
    highlights: string[];
    gallery: TourGallerySlide[];
  };
};

export type TourGallerySlide = {
  src: string;
  alt: string;
  caption: string;
};

const galleryAssets: Record<string, TourGallerySlide> = {
  lehavrePanorama: {
    src: "/images/tour-01-le-havre.webp",
    alt: "Vue générale du centre reconstruit du Havre et de son architecture moderne.",
    caption: "Centre-ville UNESCO et architecture Perret.",
  },
  etretatFalaises: {
    src: "/images/tour-02-etretat.webp",
    alt: "Falaises blanches d'Étretat au-dessus de la mer.",
    caption: "Les falaises d'Étretat et l'Aiguille.",
  },
  normandieGrandTour: {
    src: "/images/tour-03-normandie.webp",
    alt: "Paysage de campagne normande et littoral.",
    caption: "La Normandie entre mer, campagne et villages.",
  },
  montSaintMichel: {
    src: "/images/tour-04-mont-saint-michel.webp",
    alt: "Mont-Saint-Michel entouré de sa baie.",
    caption: "Le Mont-Saint-Michel et sa baie mythique.",
  },
  honfleurPort: {
    src: "/images/tour-05-honfleur.webp",
    alt: "Maisons colorées autour du vieux bassin d'Honfleur.",
    caption: "Le vieux bassin et les ruelles d'Honfleur.",
  },
  rouenPatrimoine: {
    src: "/images/tour-06-rouen.webp",
    alt: "Centre historique de Rouen avec ses monuments.",
    caption: "Rouen, la ville aux cent clochers.",
  },
  givernyJardins: {
    src: "/images/tour-07-giverny.webp",
    alt: "Jardin fleuri inspiré de l'univers de Claude Monet.",
    caption: "Giverny et les jardins de Monet.",
  },
  coteAlbatre: {
    src: "/images/tour-08-cote-albatre.webp",
    alt: "Paysage de la Côte d'Albâtre avec falaises et mer.",
    caption: "Littoral cauchois et Côte d'Albâtre.",
  },
  coteFleurie: {
    src: "/images/tour-09-cote-fleurie.webp",
    alt: "Front de mer de la Côte Fleurie en Normandie.",
    caption: "Côte Fleurie, élégance balnéaire normande.",
  },
  debarquement: {
    src: "/images/tour-10-landing-beaches.webp",
    alt: "Plages du Débarquement et mémoriaux historiques.",
    caption: "Les plages du Débarquement et lieux de mémoire.",
  },
  parisMonuments: {
    src: "/images/tour-11-paris.webp",
    alt: "Panorama urbain de Paris avec ses monuments emblématiques.",
    caption: "Paris et ses grands monuments.",
  },
  versaillesChateau: {
    src: "/images/tour-12-versailles.webp",
    alt: "Façade du château de Versailles et perspective royale.",
    caption: "Le château de Versailles et ses jardins.",
  },
  lisieuxSanctuaire: {
    src: "/images/tour-13-lisieux.webp",
    alt: "Architecture religieuse à Lisieux.",
    caption: "Lisieux, patrimoine spirituel et normand.",
  },
  havreMairie: {
    src: "/images/home-mairie.webp",
    alt: "Hôtel de Ville du Havre en lumière.",
    caption: "Hôtel de Ville et places emblématiques.",
  },
  havreCatene: {
    src: "/images/home-catene.webp",
    alt: "La Catène de containers au Havre.",
    caption: "La Catène, signature contemporaine du Havre.",
  },
  bassinCommerce: {
    src: "/images/home-bassin-commerce.webp",
    alt: "Bassin du Commerce et promenade au Havre.",
    caption: "Balade autour du Bassin du Commerce.",
  },
  pontNormandie: {
    src: "/images/home-pont-normandie.webp",
    alt: "Pont de Normandie au-dessus de l'estuaire.",
    caption: "Passage par le Pont de Normandie.",
  },
};

export const toursData: Tour[] = [
  {
    id: 1,
    name: "Le Havre",
    duration: "1h30",
    price: 80,
    image: "/images/tour-01-le-havre.webp",
    story: {
      title: "Le Havre, entre patrimoine UNESCO et ambiance maritime",
      intro:
        "Ce circuit vous fait découvrir les grands repères du Havre : le centre reconstruit d'Auguste Perret, la façade maritime, les bassins et les points de vue emblématiques de la ville.",
      highlights: [
        "Architecture classée UNESCO",
        "Panoramas sur le port et l'estuaire",
        "Arrêts photo sur les lieux emblématiques",
        "Parcours idéal pour une première visite",
      ],
      gallery: [
        galleryAssets.lehavrePanorama,
        galleryAssets.havreMairie,
        galleryAssets.havreCatene,
        galleryAssets.bassinCommerce,
      ],
    },
  },
  {
    id: 2,
    name: "Étretat",
    duration: "3h00",
    price: 170,
    image: "/images/tour-02-etretat.webp",
    story: {
      title: "Étretat, falaises mythiques et horizon grand large",
      intro:
        "Découverte d'Étretat, célèbre dans le monde entier pour ses falaises, l'Aiguille et les Portes. Le circuit combine front de mer, belvédères et ambiance de village côtier normand.",
      highlights: [
        "Falaises d'Aval et d'Amont",
        "Chapelle Notre-Dame-de-la-Garde",
        "Promenade sur la plage et en centre-bourg",
        "Points de vue naturels spectaculaires",
      ],
      gallery: [
        galleryAssets.etretatFalaises,
        galleryAssets.coteAlbatre,
        galleryAssets.normandieGrandTour,
        galleryAssets.honfleurPort,
      ],
    },
  },
  {
    id: 3,
    name: "Belle Normandie",
    duration: "8h00",
    price: 380,
    image: "/images/tour-03-normandie.webp",
    story: {
      title: "Belle Normandie, l'itinéraire signature en une journée",
      intro:
        "Le Havre, Sainte-Adresse, Étretat, Fécamp, Deauville, Honfleur et Pont de Normandie : un grand tour complet pour découvrir la diversité des paysages normands sans contrainte.",
      highlights: [
        "Circuit panoramique sur une journée",
        "Littoral, ports et villages de caractère",
        "Ambiance maritime et patrimoine local",
        "Programme modulable selon vos envies",
      ],
      gallery: [
        galleryAssets.normandieGrandTour,
        galleryAssets.etretatFalaises,
        galleryAssets.honfleurPort,
        galleryAssets.coteFleurie,
      ],
    },
  },
  {
    id: 4,
    name: "Mont-Saint-Michel",
    duration: "10h00",
    price: 550,
    image: "/images/tour-04-mont-saint-michel.webp",
    story: {
      title: "Mont-Saint-Michel, abbaye légendaire et baie unique",
      intro:
        "Le site le plus visité de France vous ouvre ses ruelles, ses remparts et son abbaye emblématique. Une excursion idéale pour vivre une journée de patrimoine exceptionnel.",
      highlights: [
        "Abbaye et village médiéval",
        "Promenade dans les ruelles historiques",
        "Points de vue sur la baie",
        "Temps libre pour visites et pause déjeuner",
      ],
      gallery: [
        galleryAssets.montSaintMichel,
        galleryAssets.debarquement,
        galleryAssets.normandieGrandTour,
        galleryAssets.honfleurPort,
      ],
    },
  },
  {
    id: 5,
    name: "Honfleur",
    duration: "3h00",
    price: 140,
    image: "/images/tour-05-honfleur.webp",
    story: {
      title: "Honfleur, charme du vieux bassin et ruelles d'artistes",
      intro:
        "De son vieux port aux maisons à pans de bois, Honfleur reste une escale incontournable de la côte normande. Le circuit met en avant son patrimoine, son ambiance et ses points photo.",
      highlights: [
        "Vieux bassin et quais animés",
        "Quartier historique et galeries",
        "Église Sainte-Catherine",
        "Ambiance authentique de port normand",
      ],
      gallery: [
        galleryAssets.honfleurPort,
        galleryAssets.coteFleurie,
        galleryAssets.normandieGrandTour,
        galleryAssets.coteAlbatre,
      ],
    },
  },
  {
    id: 6,
    name: "Rouen",
    duration: "6h00",
    price: 360,
    image: "/images/tour-06-rouen.webp",
    story: {
      title: "Rouen, cœur historique et patrimoine gothique",
      intro:
        "La ville aux cent clochers offre un centre piéton exceptionnel : cathédrale, place du Vieux-Marché, rues anciennes et maisons à colombages rythment cette journée culturelle.",
      highlights: [
        "Cathédrale Notre-Dame de Rouen",
        "Centre historique piéton",
        "Patrimoine médiéval remarquable",
        "Arrêts ajustés selon vos priorités",
      ],
      gallery: [
        galleryAssets.rouenPatrimoine,
        galleryAssets.givernyJardins,
        galleryAssets.normandieGrandTour,
        galleryAssets.honfleurPort,
      ],
    },
  },
  {
    id: 7,
    name: "Giverny",
    duration: "6h00",
    price: 420,
    image: "/images/tour-07-giverny.webp",
    story: {
      title: "Giverny, immersion dans l'univers de Claude Monet",
      intro:
        "Direction Giverny pour découvrir les jardins qui ont inspiré les plus célèbres toiles impressionnistes. Une excursion paisible mêlant culture, nature et patrimoine artistique.",
      highlights: [
        "Maison et jardins de Claude Monet",
        "Pont japonais et bassins aux nymphéas",
        "Atmosphère impressionniste unique",
        "Parcours confortable au départ du Havre",
      ],
      gallery: [
        galleryAssets.givernyJardins,
        galleryAssets.rouenPatrimoine,
        galleryAssets.normandieGrandTour,
        galleryAssets.etretatFalaises,
      ],
    },
  },
  {
    id: 8,
    name: "Côte d'Albâtre et musée Bénédictine",
    duration: "4h00",
    price: 250,
    image: "/images/tour-08-cote-albatre.webp",
    story: {
      title: "Côte d'Albâtre, valleuses sauvages et Fécamp",
      intro:
        "Parcours le long du littoral cauchois avec arrêts à Étretat puis Fécamp. Le circuit inclut les panoramas marins, la vieille ville et le musée de la Bénédictine.",
      highlights: [
        "Valleuses de Yport et Vaucottes",
        "Étretat et Fécamp dans la même sortie",
        "Musée de la Bénédictine",
        "Retour par les paysages du Pays de Caux",
      ],
      gallery: [
        galleryAssets.coteAlbatre,
        galleryAssets.etretatFalaises,
        galleryAssets.normandieGrandTour,
        galleryAssets.lehavrePanorama,
      ],
    },
  },
  {
    id: 9,
    name: "Côte Fleurie",
    duration: "5h00",
    price: 250,
    image: "/images/tour-09-cote-fleurie.webp",
    story: {
      title: "Côte Fleurie, élégance balnéaire et villages de charme",
      intro:
        "Par une route normande ponctuée de demeures traditionnelles, vous rejoignez Honfleur puis les stations emblématiques de la Côte Fleurie pour une sortie entre mer et patrimoine.",
      highlights: [
        "Escales balnéaires iconiques",
        "Ports et ruelles typiques normandes",
        "Parcours photo entre littoral et architecture",
        "Sortie idéale en demi-journée longue",
      ],
      gallery: [
        galleryAssets.coteFleurie,
        galleryAssets.honfleurPort,
        galleryAssets.normandieGrandTour,
        galleryAssets.versaillesChateau,
      ],
    },
  },
  {
    id: 10,
    name: "Plages du Débarquement",
    duration: "8h00",
    price: 550,
    image: "/images/tour-10-landing-beaches.webp",
    story: {
      title: "Plages du Débarquement, mémoire et grands espaces",
      intro:
        "Depuis le Pont de Normandie, l'itinéraire rejoint Arromanches, Longues-sur-Mer, le cimetière américain et Omaha Beach. Une journée forte en histoire et en émotions.",
      highlights: [
        "Arromanches et son port artificiel",
        "Batteries de Longues-sur-Mer",
        "Omaha Beach et lieux de mémoire",
        "Parcours historique accompagné",
      ],
      gallery: [
        galleryAssets.debarquement,
        galleryAssets.montSaintMichel,
        galleryAssets.normandieGrandTour,
        galleryAssets.honfleurPort,
      ],
    },
  },
  {
    id: 11,
    name: 'Paris "Ville Lumière"',
    duration: "10h00",
    price: 580,
    image: "/images/tour-11-paris.webp",
    story: {
      title: "Paris, monuments iconiques et art de vivre",
      intro:
        "Tour Eiffel, Arc de Triomphe, Montmartre, Invalides, Louvre, Champs-Élysées, Notre-Dame : un itinéraire dense pour vivre l'essentiel de la capitale sur la journée.",
      highlights: [
        "Les monuments majeurs de Paris",
        "Parcours panoramique intra-muros",
        "Arrêts ciblés selon vos priorités",
        "Accompagnement confortable depuis Le Havre",
      ],
      gallery: [
        galleryAssets.parisMonuments,
        galleryAssets.versaillesChateau,
        galleryAssets.normandieGrandTour,
        galleryAssets.rouenPatrimoine,
      ],
    },
  },
  {
    id: 12,
    name: "Château de Versailles",
    duration: "8h00",
    price: 500,
    image: "/images/tour-12-versailles.webp",
    story: {
      title: "Versailles, grandeur royale et jardins spectaculaires",
      intro:
        "Une excursion consacrée au domaine de Versailles : château, perspectives majestueuses, jardins à la française et patrimoine royal exceptionnel.",
      highlights: [
        "Château de Versailles et Galerie des Glaces",
        "Jardins dessinés par Le Nôtre",
        "Temps de visite adaptable",
        "Sortie culturelle premium sur la journée",
      ],
      gallery: [
        galleryAssets.versaillesChateau,
        galleryAssets.parisMonuments,
        galleryAssets.normandieGrandTour,
        galleryAssets.coteFleurie,
      ],
    },
  },
  {
    id: 13,
    name: "Lisieux",
    duration: "6h00",
    price: 350,
    image: "/images/tour-13-lisieux.webp",
    story: {
      title: "Lisieux, patrimoine spirituel au cœur du Pays d'Auge",
      intro:
        "Lisieux conjugue architecture religieuse, mémoire de Sainte Thérèse et ambiance normande. Une journée propice à la découverte culturelle et au calme des paysages intérieurs.",
      highlights: [
        "Basilique Sainte-Thérèse",
        "Centre ancien et patrimoine local",
        "Parcours paisible en Normandie intérieure",
        "Circuit idéal en sortie culturelle",
      ],
      gallery: [
        galleryAssets.lisieuxSanctuaire,
        galleryAssets.honfleurPort,
        galleryAssets.coteFleurie,
        galleryAssets.normandieGrandTour,
      ],
    },
  },
];
