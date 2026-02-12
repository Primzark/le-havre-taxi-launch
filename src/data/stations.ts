export type Station = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export const stationsData: Station[] = [
  { id: 1, name: "Station Hotel de Ville", address: "Place de l'Hotel de Ville, Le Havre", latitude: 49.49437, longitude: 0.10793 },
  { id: 2, name: "Station Gare SNCF", address: "Cours de la Republique, Le Havre", latitude: 49.49295, longitude: 0.12454 },
  { id: 3, name: "Station Docks Vauban", address: "Quai Colbert, Le Havre", latitude: 49.49238, longitude: 0.1325 },
  { id: 4, name: "Station Universite", address: "Rue Philippe Lebon, Le Havre", latitude: 49.51195, longitude: 0.11815 },
  { id: 5, name: "Station Plage", address: "Boulevard Albert 1er, Le Havre", latitude: 49.50385, longitude: 0.08527 },
  { id: 6, name: "Station Sainte-Adresse", address: "Avenue Foch, Sainte-Adresse", latitude: 49.51118, longitude: 0.08839 },
  { id: 7, name: "Station Sanvic", address: "Place de l'Eglise, Le Havre", latitude: 49.50711, longitude: 0.09772 },
  { id: 8, name: "Station Graville", address: "Rue de Verdun, Le Havre", latitude: 49.50758, longitude: 0.14668 },
  { id: 9, name: "Station Harfleur", address: "Centre-ville, Harfleur", latitude: 49.50773, longitude: 0.19029 },
  { id: 10, name: "Station Montivilliers", address: "Place du General de Gaulle, Montivilliers", latitude: 49.54589, longitude: 0.18871 },
  { id: 11, name: "Station Caucriauville", address: "Place Jean-Paul Sartre, Le Havre", latitude: 49.52142, longitude: 0.15245 },
  { id: 12, name: "Station Mare Rouge", address: "Rue de la Bigne a Fosse, Le Havre", latitude: 49.52233, longitude: 0.12596 },
  { id: 13, name: "Station Rond-Point", address: "Rond-Point, Le Havre", latitude: 49.51889, longitude: 0.11753 },
  { id: 14, name: "Station Espace Coty", address: "Rue Casimir Delavigne, Le Havre", latitude: 49.49211, longitude: 0.10141 },
  { id: 15, name: "Station Saint-Francois", address: "Quai de l'Ile, Le Havre", latitude: 49.49367, longitude: 0.11132 },
  { id: 16, name: "Station Southampton", address: "Quai Southampton, Le Havre", latitude: 49.48267, longitude: 0.12404 },
  { id: 17, name: "Station Terminal Croisiere", address: "Terminal Croisiere, Le Havre", latitude: 49.47551, longitude: 0.10774 },
  { id: 18, name: "Station Port 2000", address: "Port 2000, Le Havre", latitude: 49.45024, longitude: 0.14486 },
  { id: 19, name: "Station Cap de la Heve", address: "Route du Cap, Sainte-Adresse", latitude: 49.52066, longitude: 0.08044 },
  { id: 20, name: "Station Les Ormeaux", address: "Avenue Rene Coty, Le Havre", latitude: 49.51738, longitude: 0.10574 },
  { id: 21, name: "Station Bleville", address: "Place de Bleville, Le Havre", latitude: 49.5258, longitude: 0.10397 },
  { id: 22, name: "Station Aplemont", address: "Place d'Aplemont, Le Havre", latitude: 49.50677, longitude: 0.15104 },
];
