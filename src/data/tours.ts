export type Tour = {
  id: number;
  name: string;
  duration: string;
  price: number;
  image: string;
};

export const toursData: Tour[] = [
  { id: 1, name: "Le Havre", duration: "1h30", price: 80, image: "/images/tour-01-le-havre.jpg" },
  { id: 2, name: "Étretat", duration: "3h00", price: 170, image: "/images/tour-02-etretat.jpg" },
  { id: 3, name: "Belle Normandie", duration: "8h00", price: 380, image: "/images/tour-03-normandie.jpg" },
  { id: 4, name: "Mont-Saint-Michel", duration: "10h00", price: 550, image: "/images/tour-04-mont-saint-michel.jpg" },
  { id: 5, name: "Honfleur", duration: "3h00", price: 140, image: "/images/tour-05-honfleur.jpg" },
  { id: 6, name: "Rouen", duration: "6h00", price: 360, image: "/images/tour-06-rouen.jpg" },
  { id: 7, name: "Giverny", duration: "6h00", price: 420, image: "/images/tour-07-giverny.jpg" },
  { id: 8, name: "Côte d'Albâtre et musée Bénédictine", duration: "4h00", price: 250, image: "/images/tour-08-cote-albatre.jpg" },
  { id: 9, name: "Côte Fleurie", duration: "5h00", price: 250, image: "/images/tour-09-cote-fleurie.jpg" },
  { id: 10, name: "Plages du Débarquement", duration: "8h00", price: 550, image: "/images/tour-10-landing-beaches.jpg" },
  { id: 11, name: 'Paris "Ville Lumière"', duration: "10h00", price: 580, image: "/images/tour-11-paris.jpg" },
  { id: 12, name: "Château de Versailles", duration: "8h00", price: 500, image: "/images/tour-12-versailles.jpg" },
  { id: 13, name: "Lisieux", duration: "6h00", price: 350, image: "/images/tour-13-lisieux.jpg" },
];
