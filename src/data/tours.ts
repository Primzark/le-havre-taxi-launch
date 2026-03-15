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

const slide = (
  src: string,
  alt: string,
  caption: string,
): TourGallerySlide => ({ src, alt, caption });

export const toursData: Tour[] = [
  {
    id: 1,
    name: "Le Havre",
    duration: "1h30",
    price: 80,
    image: "/images/tour-01-le-havre.webp",
    story: {
      title: "Le Havre, patrimoine mondial et ambiance maritime",
      intro:
        "Un circuit d'une heure et demie pour découvrir Le Havre, inscrit au patrimoine mondial : départ de l'Hôtel de Ville, centre reconstruit par Auguste Perret, front de mer, Sainte-Adresse et points de vue remarquables sur le port.",
      highlights: [
        "Centre reconstruit par Auguste Perret",
        "Front de mer et Sainte-Adresse",
        "Tour du port et panoramas sur l'estuaire",
        "Parcours idéal pour une première découverte",
      ],
      gallery: [
        slide(
          "/images/tour-01-le-havre.webp",
          "Le Havre et son architecture classée UNESCO.",
          "Le Havre, patrimoine UNESCO.",
        ),
        slide(
          "/images/circuits/tour-01-pole-croisiere.webp",
          "Pôle croisière et front maritime du Havre.",
          "Pôle croisière et vue sur le front de mer.",
        ),
        slide(
          "/images/circuits/tour-01-le-havre-02.jpg",
          "Église Saint-Joseph au Havre.",
          "Église Saint-Joseph.",
        ),
        slide(
          "/images/circuits/tour-01-le-havre-03.jpg",
          "Vue urbaine du Havre.",
          "Ville basse et axes emblématiques.",
        ),
        slide(
          "/images/home-mairie.webp",
          "Hôtel de Ville du Havre.",
          "Départ conseillé depuis l'Hôtel de Ville.",
        ),
        slide(
          "/images/home-bassin-commerce.webp",
          "Bassin du Commerce au Havre.",
          "Bassin du Commerce.",
        ),
      ],
    },
  },
  {
    id: 2,
    name: "Étretat",
    duration: "3h00",
    price: 170,
    image: "/images/circuits/tour-03-normandie-03.jpg",
    story: {
      title: "Étretat, les falaises et le circuit de l'aiguille",
      intro:
        "Découverte d'Étretat, célèbre dans le monde entier pour ses falaises (l'Aiguille, les Portes) et le charme de sa plage. Le parcours inclut la falaise d'amont, la chapelle des marins et les meilleurs points de vue.",
      highlights: [
        "Falaises d'Étretat et panoramas majeurs",
        "Chapelle Notre-Dame-de-la-Garde",
        "Plage et centre-bourg",
        "Circuit photo en bord de mer",
      ],
      gallery: [
        slide(
          "/images/circuits/tour-03-normandie-03.jpg",
          "Falaises d'Étretat et mer.",
          "Étretat, site emblématique.",
        ),
        slide(
          "/images/circuits/tour-02-etretat-01.jpg",
          "Pointe d'Étretat avec vue sur l'arche.",
          "Panorama sur les falaises.",
        ),
        slide(
          "/images/circuits/tour-02-etretat-02.jpg",
          "Monument et église à Étretat.",
          "Patrimoine d'Étretat.",
        ),
        slide(
          "/images/circuits/tour-02-etretat-03.jpg",
          "Chemin de falaise et horizon marin.",
          "Balade sur les hauteurs.",
        ),
        slide(
          "/images/tour-05-honfleur.webp",
          "Port normand typique.",
          "Prolongement vers Honfleur possible.",
        ),
      ],
    },
  },
  {
    id: 3,
    name: "Les charmes de la Normandie",
    duration: "8h00",
    price: 380,
    image: "/images/tour-03-normandie.webp",
    story: {
      title: "Les charmes de la Normandie en une journée",
      intro:
        "Le Havre, Sainte-Adresse, Étretat, Fécamp, Deauville, Honfleur, Pont de Normandie : ce taxi tour est le meilleur moyen de découvrir ces sites et paysages pittoresques en une seule journée.",
      highlights: [
        "Grand tour normand sur une journée",
        "Littoral, falaises, ports et stations balnéaires",
        "Arrêts flexibles selon vos envies",
        "Retour via le Pont de Normandie",
      ],
      gallery: [
        slide(
          "/images/tour-03-normandie.webp",
          "Paysage normand entre mer et campagne.",
          "Itinéraire complet en Normandie.",
        ),
        slide(
          "/images/circuits/tour-03-normandie-01.jpg",
          "Pont de Normandie sur l'estuaire.",
          "Passage par le Pont de Normandie.",
        ),
        slide(
          "/images/home-bassin-commerce.webp",
          "Vue du Havre et du Bassin du Commerce.",
          "Le Havre et le Bassin du Commerce.",
        ),
        slide(
          "/images/circuits/tour-03-normandie-03.jpg",
          "Plage normande et front de mer.",
          "Escales balnéaires.",
        ),
        slide(
          "/images/tour-05-honfleur.webp",
          "Vieux bassin d'Honfleur.",
          "Étape à Honfleur.",
        ),
        slide(
          "/images/tour-09-deauville-planches.webp",
          "Les Planches de Deauville en bord de mer.",
          "Deauville et ses Planches.",
        ),
      ],
    },
  },
  {
    id: 4,
    name: "Le Mont Saint-Michel",
    duration: "10h00",
    price: 550,
    image: "/images/tour-04-mont-saint-michel.webp",
    story: {
      title: "Le Mont Saint-Michel, abbaye et baie mythique",
      intro:
        "L'abbaye du Mont Saint-Michel, connue dans le monde entier, est le site le plus visité de France. Vous découvrez la rue principale, les remparts, les points de vue sur la baie et le spectacle saisissant des marées.",
      highlights: [
        "Abbaye et village historique",
        "Chemin de ronde et vue sur la baie",
        "Temps libre pour visite et déjeuner",
        "Excursion journée complète depuis Le Havre",
      ],
      gallery: [
        slide(
          "/images/tour-04-mont-saint-michel.webp",
          "Mont Saint-Michel et baie.",
          "Le Mont Saint-Michel.",
        ),
        slide(
          "/images/circuits/tour-04-mont-saint-michel-02.jpg",
          "Remparts du Mont Saint-Michel.",
          "Promenade sur les remparts.",
        ),
        slide(
          "/images/circuits/tour-04-mont-saint-michel-03.jpg",
          "Panorama sur la baie.",
          "Vue panoramique sur la baie.",
        ),
        slide(
          "/images/tour-10-landing-beaches.webp",
          "Plages historiques en Normandie.",
          "Combinez avec un itinéraire mémoire.",
        ),
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
      title: "Honfleur, cité médiévale et vieux bassin",
      intro:
        "Honfleur, petite cité médiévale, vous invite à la découverte de ses ruelles pittoresques et de son port. Ville de pêche, de commerce et de plaisance, elle a su préserver un riche patrimoine historique et artistique.",
      highlights: [
        "Vieux bassin et quais historiques",
        "Ruelles pavées et maisons à pans de bois",
        "Pont de Normandie sur l'aller ou le retour",
        "Circuit court et très demandé",
      ],
      gallery: [
        slide(
          "/images/tour-05-honfleur.webp",
          "Vieux bassin d'Honfleur.",
          "Honfleur et son port.",
        ),
        slide(
          "/images/circuits/tour-05-honfleur-01.jpg",
          "Vue panoramique d'Honfleur.",
          "Panorama sur la ville.",
        ),
        slide(
          "/images/circuits/tour-05-honfleur-02.jpg",
          "Le vieux bassin d'Honfleur.",
          "Le vieux bassin.",
        ),
        slide(
          "/images/circuits/tour-05-honfleur-03.jpg",
          "Chapelle Notre-Dame de Grâce.",
          "Hauteurs de Honfleur.",
        ),
        slide(
          "/images/home-pont-normandie.webp",
          "Pont de Normandie.",
          "Passage par le Pont de Normandie.",
        ),
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
      title: "Rouen, la ville aux cent clochers",
      intro:
        "'La ville aux cent clochers', chère à Victor Hugo, conserve un patrimoine exceptionnel : cathédrale Notre-Dame, Saint-Ouen, Saint-Maclou, Palais de Justice et le célèbre Gros-Horloge dans un centre historique piéton.",
      highlights: [
        "Cathédrale et monuments gothiques",
        "Centre ancien piéton",
        "Gros-Horloge et patrimoine Renaissance",
        "Sortie culturelle en demi-journée longue",
      ],
      gallery: [
        slide(
          "/images/tour-06-rouen.webp",
          "Centre historique de Rouen.",
          "Rouen historique.",
        ),
        slide(
          "/images/circuits/tour-06-rouen-02.jpg",
          "Abbaye Saint-Ouen à Rouen.",
          "Abbaye Saint-Ouen.",
        ),
        slide(
          "/images/circuits/tour-06-rouen-03.jpg",
          "Façade patrimoniale à Rouen.",
          "Patrimoine architectural.",
        ),
        slide(
          "/images/tour-07-giverny.webp",
          "Jardins de Giverny.",
          "Peut se combiner avec Giverny.",
        ),
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
      title: "Giverny, dans l'univers de Claude Monet",
      intro:
        "Entrez dans l'univers du maître de l'impressionnisme, Claude Monet. Maison, atelier, jardins et bassin des nymphéas composent une visite paisible et emblématique de l'art impressionniste.",
      highlights: [
        "Maison et jardins de Claude Monet",
        "Nymphéas et pont japonais",
        "Sortie culturelle et nature",
        "Transport aller-retour depuis Le Havre",
      ],
      gallery: [
        slide(
          "/images/tour-07-giverny.webp",
          "Jardins fleuris de Giverny.",
          "Giverny et Monet.",
        ),
        slide(
          "/images/circuits/tour-07-giverny-01.jpg",
          "Allées fleuries de Giverny.",
          "Jardins de Monet.",
        ),
        slide(
          "/images/circuits/tour-07-giverny-02.jpg",
          "Bassin aux nymphéas.",
          "Nymphéas et reflets.",
        ),
        slide(
          "/images/circuits/tour-07-giverny-03.jpg",
          "Parc et verdure à Giverny.",
          "Promenade dans les jardins.",
        ),
        slide(
          "/images/tour-06-rouen.webp",
          "Patrimoine de Rouen.",
          "Possible extension vers Rouen.",
        ),
      ],
    },
  },
  {
    id: 8,
    name: "La côte d'Albâtre, le musée de Bénédictine",
    duration: "4h00",
    price: 250,
    image: "/images/circuits/tour-08-cote-albatre-01.jpg",
    story: {
      title: "Côte d'Albâtre, valleuses et Fécamp",
      intro:
        "Parcours le long du littoral cauchois et de ses valleuses (Yport, Vaucottes), avec arrêts à Étretat puis Fécamp. Visite du musée de la Bénédictine, vieille ville et port de pêche avant retour par le Pays de Caux.",
      highlights: [
        "Valleuses et falaises du littoral cauchois",
        "Étretat et Fécamp dans la même sortie",
        "Musée de la Bénédictine",
        "Retour par les Clos-Masures du Pays de Caux",
      ],
      gallery: [
        slide(
          "/images/circuits/tour-08-cote-albatre-01.jpg",
          "Architecture patrimoniale sur la Côte d'Albâtre.",
          "Patrimoine côtier.",
        ),
        slide(
          "/images/tour-02-etretat.webp",
          "Falaises d'Étretat.",
          "Étape à Étretat.",
        ),
        slide(
          "/images/circuits/tour-02-etretat-01.jpg",
          "Falaises emblématiques de la Côte d'Albâtre.",
          "Panorama sur les falaises.",
        ),
      ],
    },
  },
  {
    id: 9,
    name: "La côte Fleurie",
    duration: "5h00",
    price: 250,
    image: "/images/tour-09-deauville-planches.webp",
    story: {
      title: "La côte Fleurie entre charme et élégance",
      intro:
        "Par une route dévoilant les charmes de la Normandie, arrivée à Honfleur puis poursuite vers Trouville et Deauville, célèbres pour leurs planches, leur casino et leurs courses hippiques. Retour par le Pont de Normandie.",
      highlights: [
        "Honfleur, Trouville et Deauville",
        "Planches et front de mer emblématique",
        "Architecture balnéaire normande",
        "Retour via le Pont de Normandie",
      ],
      gallery: [
        slide(
          "/images/tour-09-deauville-planches.webp",
          "Les Planches de Deauville en bord de mer.",
          "Deauville et les Planches.",
        ),
        slide(
          "/images/tour-05-honfleur.webp",
          "Vieux bassin de Honfleur.",
          "Départ de l'itinéraire par Honfleur.",
        ),
        slide(
          "/images/home-pont-normandie.webp",
          "Pont de Normandie.",
          "Retour par le Pont de Normandie.",
        ),
      ],
    },
  },
  {
    id: 10,
    name: "Les plages du débarquement",
    duration: "8h00",
    price: 550,
    image: "/images/tour-10-landing-beaches.webp",
    story: {
      title: "Les plages du débarquement, mémoire de 1944",
      intro:
        "Depuis le Pont de Normandie, l'itinéraire rejoint Arromanches, les batteries de Longues-sur-Mer, le cimetière américain et Omaha Beach, haut lieu du débarquement allié de 1944.",
      highlights: [
        "Arromanches et port artificiel",
        "Batteries de Longues-sur-Mer",
        "Cimetière américain et Omaha Beach",
        "Circuit historique sur la journée",
      ],
      gallery: [
        slide(
          "/images/tour-10-landing-beaches.webp",
          "Plages du débarquement en Normandie.",
          "Mémoire du débarquement.",
        ),
        slide(
          "/images/circuits/tour-10-debarquement-01.jpg",
          "Vestiges militaires sur les plages.",
          "Sites historiques majeurs.",
        ),
        slide(
          "/images/circuits/tour-10-debarquement-02.jpg",
          "Cimetière militaire américain.",
          "Lieux de recueillement.",
        ),
        slide(
          "/images/tour-04-mont-saint-michel.webp",
          "Mont Saint-Michel en Normandie.",
          "Autre grande excursion possible.",
        ),
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
      title: "Paris, grands monuments et sites incontournables",
      intro:
        "À la découverte des grands monuments de la capitale : Tour Eiffel, Arc de Triomphe, Montmartre, Invalides, Louvre, Champs-Élysées et Notre-Dame.",
      highlights: [
        "Parcours panoramique sur les monuments majeurs",
        "Arrêts ciblés selon vos préférences",
        "Sortie journée complète au départ du Havre",
        "Transport privé confortable",
      ],
      gallery: [
        slide(
          "/images/tour-11-paris.webp",
          "Panorama de Paris et monuments.",
          "Paris, Ville Lumière.",
        ),
        slide(
          "/images/circuits/tour-11-paris-02.jpg",
          "Pyramide du Louvre.",
          "Le Louvre.",
        ),
        slide(
          "/images/circuits/tour-11-paris-03.jpg",
          "Façade du Louvre à Paris.",
          "Louvre et centre historique.",
        ),
        slide(
          "/images/tour-12-versailles.webp",
          "Domaine de Versailles.",
          "Peut se combiner avec Versailles.",
        ),
      ],
    },
  },
  {
    id: 12,
    name: "Le château de Versailles",
    duration: "8h00",
    price: 500,
    image: "/images/tour-12-versailles.webp",
    story: {
      title: "Versailles, modèle des résidences royales",
      intro:
        "Lieu de résidence de la monarchie française de Louis XIV à Louis XVI, le château de Versailles demeure un symbole majeur du patrimoine européen, avec ses jardins et ses perspectives monumentales.",
      highlights: [
        "Château de Versailles et domaines extérieurs",
        "Jardins et perspectives à la française",
        "Parcours culturel premium",
        "Excursion journée depuis Le Havre",
      ],
      gallery: [
        slide(
          "/images/tour-12-versailles.webp",
          "Façade du château de Versailles.",
          "Versailles, résidence royale.",
        ),
        slide(
          "/images/circuits/tour-12-versailles-02.jpg",
          "Jardins du château de Versailles.",
          "Jardins à la française.",
        ),
        slide(
          "/images/circuits/tour-12-versailles-03.jpg",
          "Statuaire dans les jardins de Versailles.",
          "Statues et perspectives.",
        ),
        slide(
          "/images/tour-11-paris.webp",
          "Paris et ses monuments.",
          "Extension possible vers Paris.",
        ),
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
      title: "Lisieux, itinéraire gourmand et spirituel",
      intro:
        "Découverte du Pays d'Auge intérieur, de sa gastronomie et de Lisieux, deuxième sanctuaire catholique de France après Lourdes, avec possibilité d'arrêt à la distillerie Boulard au retour.",
      highlights: [
        "Village fromager Graindorge à Livarot",
        "Basilique et sites liés à Sainte Thérèse",
        "Pays d'Auge et patrimoine intérieur",
        "Option distillerie et dégustation au retour",
      ],
      gallery: [
        slide(
          "/images/tour-13-lisieux.webp",
          "Vue de Lisieux et patrimoine religieux.",
          "Lisieux et son patrimoine.",
        ),
        slide(
          "/images/circuits/tour-13-lisieux-01.jpg",
          "Panorama de Lisieux.",
          "Lisieux, ville étape.",
        ),
        slide(
          "/images/circuits/tour-13-lisieux-02.jpg",
          "Intérieur d'église à Lisieux.",
          "Patrimoine religieux.",
        ),
        slide(
          "/images/circuits/tour-13-lisieux-03.jpg",
          "Édifice religieux à Lisieux.",
          "Basilique et sanctuaire.",
        ),
        slide(
          "/images/tour-05-honfleur.webp",
          "Escales normandes complémentaires.",
          "Itinéraire normand élargi.",
        ),
      ],
    },
  },
];
