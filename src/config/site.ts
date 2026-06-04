export const SITE_NAME = "Taxi Le Havre";
export const PRIMARY_DOMAIN = "https://www.taxis-lehavre.com";
export const ACTUS_ADMIN_PATH = "/atelier-rth-1976-contenu";

export const CONTACT_PHONE_NUMBER = "0235258181";
export const CONTACT_PHONE_DISPLAY = "02 35 25 81 81";
export const CONTACT_PHONE_LINK = "+33235258181";
export const CONTACT_EMAIL =
  (import.meta.env.VITE_CONTACT_EMAIL ?? "bureautaxi@gmail.com").trim();

export const LOCAL_BUSINESS_STREET_ADDRESS = "37 Rue Jules Lecesne";
export const LOCAL_BUSINESS_POSTAL_CODE = "76600";
export const LOCAL_BUSINESS_CITY = "Le Havre";
export const LOCAL_BUSINESS_COUNTRY = "FR";
export const LOCAL_BUSINESS_ADDRESS = `${LOCAL_BUSINESS_STREET_ADDRESS}, ${LOCAL_BUSINESS_POSTAL_CODE} ${LOCAL_BUSINESS_CITY}`;
export const LOCAL_BUSINESS_AREAS = [
  "Le Havre",
  "Sainte-Adresse",
  "Harfleur",
  "Montivilliers",
  "Octeville-sur-Mer",
  "Gonfreville-l'Orcher",
  "Étretat",
  "Honfleur",
  "Deauville",
  "Normandie",
];

export const INSTAGRAM_URL = "https://www.instagram.com/lehavretaxi";
export const FACEBOOK_URL = "https://www.facebook.com/TaxiLeHavre";

export const APPLE_STORE_URL =
  "https://itunes.apple.com/fr/app/taxi-le-havre/id1129251535?mt=8";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.lanoosphere.tessa.taxi_havre&hl=fr";

export const CONTACT_API_URL = "/api/contact.php";
export const ACTUS_API_URL = "/api/news.php";
export const ADMIN_API_URL = "/api/admin.php";
export const ACTUS_UPLOAD_API_URL = "/api/upload.php";
export const REVIEWS_API_URL = "/api/reviews.php";
