export type MenuSearchTarget = {
  route: string;
  keywords: string[];
};

const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const MENU_SEARCH_TARGETS: MenuSearchTarget[] = [
  {
    route: "/services",
    keywords: [
      "service",
      "services",
      "medical",
      "maritime",
      "croisiere",
      "aeroport",
      "gare",
      "professionnel",
      "groupes",
      "pmr",
      "ford tourneo",
    ],
  },
  {
    route: "/circuits-touristiques",
    keywords: [
      "circuit",
      "circuits",
      "tour",
      "touristique",
      "visite",
      "normandie",
      "etretat",
      "honfleur",
      "rouen",
      "giverny",
      "paris",
      "versailles",
      "lisieux",
      "mont saint michel",
      "landing beaches",
    ],
  },
  {
    route: "/tarifs",
    keywords: ["tarif", "tarifs", "prix", "cout", "decret", "arrete", "prefectoral"],
  },
  {
    route: "/entreprise",
    keywords: ["entreprise", "a propos", "histoire", "equipe", "operatrices", "secretaires"],
  },
  {
    route: "/devenir-taxi",
    keywords: ["devenir taxi", "recrutement", "chauffeur", "licence", "carte professionnelle"],
  },
  {
    route: "/actus",
    keywords: ["actus", "actualites", "instagram", "facebook", "capture", "news"],
  },
  {
    route: "/contact",
    keywords: ["contact", "reservation", "appeler", "telephone", "mail", "email", "station"],
  },
  {
    route: "/liens",
    keywords: ["liens", "linktree", "raccourcis"],
  },
  {
    route: "/",
    keywords: ["accueil", "home", "homepage"],
  },
];

const getKeywordScore = (normalizedQuery: string, keyword: string): number => {
  if (normalizedQuery === keyword) {
    return 100;
  }

  if (normalizedQuery.startsWith(`${keyword} `) || normalizedQuery.endsWith(` ${keyword}`)) {
    return 80;
  }

  if (normalizedQuery.includes(keyword)) {
    return 60;
  }

  return 0;
};

export const resolveMenuSearchRoute = (query: string): string | null => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return null;
  }

  let bestRoute: string | null = null;
  let bestScore = 0;

  for (const target of MENU_SEARCH_TARGETS) {
    for (const rawKeyword of target.keywords) {
      const keyword = normalizeSearchText(rawKeyword);
      if (!keyword) {
        continue;
      }

      const score = getKeywordScore(normalizedQuery, keyword);
      if (score > bestScore) {
        bestScore = score;
        bestRoute = target.route;
      }
    }
  }

  return bestRoute;
};
