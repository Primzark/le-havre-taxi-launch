export type Tour = {
  id: number;
  slug: string;
  name: string;
  duration: string;
  price1To4: number;
  price5To6: number;
  image: string;
  description: string;
};

export const toursData: Tour[] = [
  {
    id: 1,
    slug: "circuits-touristique",
    name: "Le Havre",
    duration: "1h30",
    price1To4: 60,
    price5To6: 70,
    image: "/images/tour-01-le-havre.jpg",
    description:
      "Un circuit d’une heure et demie pour découvrir Le Havre, inscrit au patrimoine mondial, berceau de l’impressionnisme, station balnéaire, station nautique et port de croisières. Départ de l’Hôtel de Ville, visite du centre reconstruit par Auguste Perret et du patrimoine ancien de la ville. Découverte du front de mer et de Sainte-Adresse avec ses villas balnéaires. Tour du port et points de vue remarquables.",
  },
  {
    id: 2,
    slug: "circuits-touristique-etretat-circuit-de-laiguille",
    name: "Étretat, circuit de l’aiguille",
    duration: "3h00",
    price1To4: 125,
    price5To6: 150,
    image: "/images/tour-02-etretat.jpg",
    description:
      "Découverte d’Étretat, célèbre dans le monde entier pour ses falaises (l’Aiguille, les Portes) et le charme de sa plage connue dès le XIXe siècle. Sur la falaise d’amont, la chapelle en l’honneur des marins côtoie le musée dédié à Charles Nungesser, François Coli et leur avion l’Oiseau Blanc.",
  },
  {
    id: 3,
    slug: "circuits-touristique-la-normandie",
    name: "La Normandie",
    duration: "8h00",
    price1To4: 125,
    price5To6: 150,
    image: "/images/tour-03-normandie.jpg",
    description:
      "Le Havre, Sainte-Adresse, Étretat, Fécamp, Deauville, Honfleur, Pont de Normandie, Le Havre. Ce taxi tour est un moyen efficace de découvrir ces sites et paysages pittoresques en une journée.",
  },
  {
    id: 4,
    slug: "circuits-touristique-mont-st-michel",
    name: "Mont St Michel",
    duration: "10h00",
    price1To4: 460,
    price5To6: 550,
    image: "/images/tour-04-mont-saint-michel.jpg",
    description:
      "L’abbaye du Mont Saint-Michel, connue dans le monde entier, est l’un des sites majeurs de France. Vous profitez de la rue principale, des musées, du chemin de ronde des remparts, des points de vue sur la baie et du spectacle des marées.",
  },
  {
    id: 5,
    slug: "circuits-touristiques-honfleur",
    name: "Honfleur",
    duration: "3h00",
    price1To4: 125,
    price5To6: 150,
    image: "/images/tour-05-honfleur.jpg",
    description:
      "Par le Pont de Normandie, découvrez Honfleur et son patrimoine historique : vieux bassin, ruelles et maisons à pans de bois. Une sortie courte et emblématique de la côte normande.",
  },
  {
    id: 6,
    slug: "circuits-touristique-rouen",
    name: "Rouen",
    duration: "6h00",
    price1To4: 280,
    price5To6: 340,
    image: "/images/tour-06-rouen.jpg",
    description:
      "La ville aux cent clochers, chère à Victor Hugo, conserve un patrimoine exceptionnel. Découverte du centre historique piétonnier, de la cathédrale Notre-Dame, de l’abbatiale Saint-Ouen, de l’église Saint-Maclou, du Palais de Justice et du Gros-Horloge.",
  },
  {
    id: 7,
    slug: "giverny",
    name: "Giverny",
    duration: "6h00",
    price1To4: 340,
    price5To6: 410,
    image: "/images/tour-07-giverny.jpg",
    description:
      "Entrez dans l’univers de Claude Monet : maison au crépi rose, atelier des Nymphéas et jardins reconstitués à l’identique. Une immersion dans l’impressionnisme et l’histoire de l’artiste.",
  },
  {
    id: 8,
    slug: "circuits-touristique-la-cote-dalbatre",
    name: "La côte d’albâtre",
    duration: "4h00",
    price1To4: 175,
    price5To6: 210,
    image: "/images/tour-08-cote-albatre.jpg",
    description:
      "Parcours du littoral cauchois et de ses valleuses (Yport, Vaucottes), avec arrêts à Étretat puis Fécamp, capitale des Terre-Neuvas. Promenade dans la vieille ville, sur le port de pêche, et retour par le Pays de Caux.",
  },
  {
    id: 9,
    slug: "circuits-touristique-la-cote-fleurie",
    name: "La côte fleurie",
    duration: "5h00",
    price1To4: 195,
    price5To6: 235,
    image: "/images/tour-09-cote-fleurie.jpg",
    description:
      "Route normande vers Honfleur, puis continuation par Trouville et Deauville, célèbres pour leurs planches, leur casino et leurs courses hippiques. Retour par le Pont de Normandie.",
  },
  {
    id: 10,
    slug: "les-plages-du-debarquement",
    name: "Les plages du débarquement",
    duration: "8h00",
    price1To4: 450,
    price5To6: 540,
    image: "/images/tour-10-landing-beaches.jpg",
    description:
      "À partir du Pont de Normandie, direction Arromanches, Longues-sur-Mer, cimetière américain et Omaha Beach, hauts lieux du débarquement allié de 1944.",
  },
  {
    id: 11,
    slug: "circuits-touristique-paris-ville-lumiere",
    name: "Paris, ville lumière",
    duration: "10h00",
    price1To4: 460,
    price5To6: 570,
    image: "/images/tour-11-paris.jpg",
    description:
      "À la découverte des grands monuments de la capitale : tour Eiffel, Arc de Triomphe, Montmartre, Invalides, Louvre, Champs-Élysées et cathédrale Notre-Dame.",
  },
  {
    id: 12,
    slug: "circuits-touristique-le-chateau-de-versailles",
    name: "Le château de Versailles",
    duration: "8h00",
    price1To4: 395,
    price5To6: 465,
    image: "/images/tour-12-versailles.jpg",
    description:
      "Excursion vers Versailles pour visiter le château et ses extérieurs, dans une formule aller-retour en taxi depuis Le Havre.",
  },
];
