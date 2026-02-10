import { stationsData } from "@/data/stations";
import { toursData } from "@/data/tours";

export type MenuSearchTarget = {
  route: string;
  label: string;
  keywords: string[];
  example: string;
};

export type MenuSearchSuggestion = {
  route: string;
  label: string;
  example: string;
};

export type MenuSearchResolution = {
  route: string | null;
  destination: string | null;
  autoNavigate: boolean;
  confidence: "high" | "medium" | "low" | "none";
  intentLabel: string | null;
  matchedKeyword: string | null;
  filterTerm: string | null;
  message: string;
  suggestions: MenuSearchSuggestion[];
};

const ROUTE_QUERY_PARAM: Record<string, string> = {
  "/services": "q",
  "/tarifs": "q",
  "/circuits-touristiques": "q",
  "/contact": "station",
};

const GLOBAL_STOP_WORDS = new Set([
  "a",
  "au",
  "aux",
  "d",
  "de",
  "des",
  "du",
  "en",
  "et",
  "for",
  "in",
  "l",
  "la",
  "le",
  "les",
  "of",
  "ou",
  "par",
  "pour",
  "the",
  "to",
  "un",
  "une",
  "vers",
]);

const ROUTE_INTENT_TERMS: Record<string, string[]> = {
  "/services": [
    "service",
    "services",
    "transport",
    "transfert",
    "transferts",
  ],
  "/tarifs": [
    "tarif",
    "tarifs",
    "prix",
    "cout",
    "decret",
    "arrete",
    "prefectoral",
    "prefectoraux",
    "2025",
  ],
  "/contact": [
    "contact",
    "station",
    "stations",
    "reservation",
    "telephone",
    "mail",
    "email",
    "proche",
  ],
  "/circuits-touristiques": [
    "circuit",
    "circuits",
    "tour",
    "tours",
    "touristique",
    "touristiques",
    "visite",
    "decouverte",
    "round",
    "trip",
  ],
};

const TARIFF_ENTITY_TERMS = [
  "le havre",
  "city centre",
  "train station",
  "honfleur",
  "one way",
  ...toursData.map((tour) => tour.name),
];

const CIRCUIT_ENTITY_TERMS = [
  ...toursData.map((tour) => tour.name),
  ...toursData.map((tour) => `n ${tour.id}`),
];

const STATION_ENTITY_TERMS = stationsData.flatMap((station) => [station.name, station.address]);

const SERVICE_ENTITY_TERMS = [
  "medical",
  "transport medical",
  "aeroport",
  "gare",
  "maritime",
  "croisiere",
  "professionnel",
  "groupes",
  "pmr",
  "ford tourneo",
  "berline",
  "monospace",
  "van",
];

const ENTITY_TERMS_BY_ROUTE: Record<string, string[]> = {
  "/services": SERVICE_ENTITY_TERMS,
  "/tarifs": TARIFF_ENTITY_TERMS,
  "/contact": STATION_ENTITY_TERMS,
  "/circuits-touristiques": CIRCUIT_ENTITY_TERMS,
};

const ROUTE_INTENT_WORDS: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(ROUTE_INTENT_TERMS).map(([route, values]) => {
    const words = values.flatMap((value) => value.split(/\s+/g)).map((value) => value.trim()).filter(Boolean);
    return [route, new Set(words)];
  }),
) as Record<string, Set<string>>;

export const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const tokenizeSearchText = (value: string): string[] => normalizeSearchText(value).split(" ").filter(Boolean);

const normalizeEntityTerms = (values: string[]): string[] =>
  Array.from(new Set(values.map((value) => normalizeSearchText(value)).filter(Boolean)));

const NORMALIZED_ENTITY_TERMS_BY_ROUTE: Record<string, string[]> = Object.fromEntries(
  Object.entries(ENTITY_TERMS_BY_ROUTE).map(([route, values]) => [route, normalizeEntityTerms(values)]),
) as Record<string, string[]>;

const MENU_SEARCH_TARGETS: MenuSearchTarget[] = [
  {
    route: "/services",
    label: "Services",
    example: "service medical",
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
    route: "/tarifs",
    label: "Tarifs",
    example: "tarif honfleur",
    keywords: [
      "tarif",
      "tarifs",
      "tarif 2025",
      "prix",
      "cout",
      "decret",
      "arrete",
      "prefectoral",
      "prefectoraux",
      "for your information",
      "discovery tours",
    ],
  },
  {
    route: "/contact",
    label: "Stations et contact",
    example: "station gare",
    keywords: [
      "contact",
      "reservation",
      "appeler",
      "telephone",
      "mail",
      "email",
      "station",
      "station proche",
      "google maps",
    ],
  },
  {
    route: "/circuits-touristiques",
    label: "Circuits touristiques",
    example: "circuit etretat",
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
    route: "/entreprise",
    label: "Entreprise",
    example: "a propos",
    keywords: ["entreprise", "a propos", "histoire", "equipe", "operatrices", "secretaires"],
  },
  {
    route: "/devenir-taxi",
    label: "Devenir taxi",
    example: "devenir taxi",
    keywords: ["devenir taxi", "recrutement", "chauffeur", "licence", "carte professionnelle"],
  },
  {
    route: "/actus",
    label: "Actus",
    example: "actualites instagram",
    keywords: ["actus", "actualites", "instagram", "facebook", "capture", "news"],
  },
  {
    route: "/liens",
    label: "Liens utiles",
    example: "liens rapides",
    keywords: ["liens", "linktree", "raccourcis"],
  },
  {
    route: "/",
    label: "Accueil",
    example: "accueil",
    keywords: ["accueil", "home", "homepage"],
  },
];

export const MENU_SEARCH_QUICK_LINKS: MenuSearchSuggestion[] = MENU_SEARCH_TARGETS.slice(0, 4).map((target) => ({
  route: target.route,
  label: target.label,
  example: target.example,
}));

const levenshteinDistance = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i += 1) {
    matrix[i][0] = i;
  }

  for (let j = 0; j < cols; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[rows - 1][cols - 1];
};

const scoreWordMatch = (queryWord: string, keywordWord: string): number => {
  if (!queryWord || !keywordWord) {
    return 0;
  }

  if (queryWord === keywordWord) {
    return 36;
  }

  if (queryWord.length >= 3 && keywordWord.startsWith(queryWord)) {
    return 28;
  }

  if (keywordWord.length >= 3 && queryWord.startsWith(keywordWord)) {
    return 26;
  }

  const distance = levenshteinDistance(queryWord, keywordWord);
  if (distance === 1) {
    return 24;
  }

  if (distance === 2 && Math.max(queryWord.length, keywordWord.length) >= 5) {
    return 14;
  }

  if (queryWord.length >= 4 && keywordWord.includes(queryWord)) {
    return 14;
  }

  if (keywordWord.length >= 4 && queryWord.includes(keywordWord)) {
    return 12;
  }

  return 0;
};

const scoreKeyword = (normalizedQuery: string, normalizedKeyword: string): number => {
  if (!normalizedQuery || !normalizedKeyword) {
    return 0;
  }

  let score = 0;

  if (normalizedQuery === normalizedKeyword) {
    return 180;
  }

  if (normalizedQuery.includes(normalizedKeyword) && normalizedKeyword.length >= 4) {
    score += 95;
  }

  if (normalizedKeyword.includes(normalizedQuery) && normalizedQuery.length >= 4) {
    score += 82;
  }

  if (normalizedQuery.startsWith(normalizedKeyword) || normalizedKeyword.startsWith(normalizedQuery)) {
    score += 55;
  }

  if (Math.max(normalizedQuery.length, normalizedKeyword.length) <= 24) {
    const phraseDistance = levenshteinDistance(normalizedQuery, normalizedKeyword);
    if (phraseDistance === 1) {
      score += 70;
    } else if (phraseDistance === 2) {
      score += 50;
    } else if (phraseDistance === 3 && normalizedQuery.length >= 8) {
      score += 34;
    }
  }

  const queryWords = tokenizeSearchText(normalizedQuery);
  const keywordWords = tokenizeSearchText(normalizedKeyword);

  for (const queryWord of queryWords) {
    let bestWordScore = 0;
    for (const keywordWord of keywordWords) {
      bestWordScore = Math.max(bestWordScore, scoreWordMatch(queryWord, keywordWord));
    }
    score += bestWordScore;
  }

  return score;
};

const isStrongMatch = (normalizedQuery: string, normalizedKeyword: string): boolean => {
  if (!normalizedQuery || !normalizedKeyword) {
    return false;
  }

  if (normalizedQuery === normalizedKeyword) {
    return true;
  }

  if (normalizedKeyword.length >= 4 && normalizedQuery.includes(normalizedKeyword)) {
    return true;
  }

  if (normalizedQuery.length >= 4 && normalizedKeyword.includes(normalizedQuery)) {
    return true;
  }

  const queryWords = tokenizeSearchText(normalizedQuery).filter((word) => word.length >= 3 && /[a-z]/.test(word));
  const keywordWords = tokenizeSearchText(normalizedKeyword).filter((word) => word.length >= 3 && /[a-z]/.test(word));

  if (queryWords.length === 0 || keywordWords.length === 0) {
    return false;
  }

  const exactMatches = queryWords.filter((word) => keywordWords.includes(word)).length;
  if (exactMatches === queryWords.length) {
    return true;
  }

  return queryWords.length >= 2 && exactMatches >= 2;
};

type TargetScore = {
  target: MenuSearchTarget;
  score: number;
  matchedKeyword: string;
  strongMatch: boolean;
};

type EntityMatch = {
  term: string;
  score: number;
  strongMatch: boolean;
};

const rankSearchTargets = (query: string): TargetScore[] => {
  const normalizedQuery = normalizeSearchText(query);

  const scored = MENU_SEARCH_TARGETS.map((target): TargetScore => {
    const normalizedLabel = normalizeSearchText(target.label);
    let bestScore = scoreKeyword(normalizedQuery, normalizedLabel);
    let bestKeyword = normalizedLabel;
    let bestStrongMatch = isStrongMatch(normalizedQuery, normalizedLabel);

    for (const keyword of target.keywords) {
      const normalizedKeyword = normalizeSearchText(keyword);
      const keywordScore = scoreKeyword(normalizedQuery, normalizedKeyword);
      const keywordStrongMatch = isStrongMatch(normalizedQuery, normalizedKeyword);

      if (
        keywordScore > bestScore
        || (keywordScore === bestScore && keywordStrongMatch && !bestStrongMatch)
      ) {
        bestScore = keywordScore;
        bestKeyword = normalizedKeyword;
        bestStrongMatch = keywordStrongMatch;
      }
    }

    return {
      target,
      score: bestScore,
      matchedKeyword: bestKeyword,
      strongMatch: bestStrongMatch,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
};

const buildSuggestions = (scores: TargetScore[]): MenuSearchSuggestion[] => {
  const source = scores.filter((item) => item.score > 0).slice(0, 4);
  if (source.length === 0) {
    return MENU_SEARCH_QUICK_LINKS;
  }

  return source.map(({ target }) => ({
    route: target.route,
    label: target.label,
    example: target.example,
  }));
};

const isGenericFilterTerm = (route: string, term: string): boolean => {
  const tokens = tokenizeSearchText(term);
  if (tokens.length === 0) {
    return true;
  }

  const routeWords = ROUTE_INTENT_WORDS[route] ?? new Set<string>();
  return tokens.every((token) => GLOBAL_STOP_WORDS.has(token) || routeWords.has(token));
};

const stripIntentWords = (route: string, normalizedQuery: string): string => {
  const routeWords = ROUTE_INTENT_WORDS[route] ?? new Set<string>();
  const tokens = tokenizeSearchText(normalizedQuery).filter((token) => {
    if (GLOBAL_STOP_WORDS.has(token)) {
      return false;
    }

    if (routeWords.has(token)) {
      return false;
    }

    if (route === "/tarifs" && /^20\d{2}$/.test(token)) {
      return false;
    }

    return token.length >= 2;
  });

  return tokens.join(" ");
};

const findBestEntityForRoute = (route: string, normalizedQuery: string): EntityMatch | null => {
  const candidates = NORMALIZED_ENTITY_TERMS_BY_ROUTE[route];
  if (!candidates || candidates.length === 0 || !normalizedQuery) {
    return null;
  }

  let bestCandidate: EntityMatch | null = null;

  for (const candidate of candidates) {
    const candidateScore = scoreKeyword(normalizedQuery, candidate);
    const candidateStrongMatch = isStrongMatch(normalizedQuery, candidate);

    if (!bestCandidate) {
      bestCandidate = { term: candidate, score: candidateScore, strongMatch: candidateStrongMatch };
      continue;
    }

    if (
      candidateScore > bestCandidate.score
      || (candidateScore === bestCandidate.score && candidateStrongMatch && !bestCandidate.strongMatch)
    ) {
      bestCandidate = { term: candidate, score: candidateScore, strongMatch: candidateStrongMatch };
    }
  }

  if (!bestCandidate || bestCandidate.score < 45) {
    return null;
  }

  if (!bestCandidate.strongMatch && bestCandidate.score < 95) {
    return null;
  }

  return bestCandidate;
};

const resolveFilterTerm = (route: string, normalizedQuery: string, matchedKeyword: string): string | null => {
  const entityMatch = findBestEntityForRoute(route, normalizedQuery);
  if (entityMatch && !isGenericFilterTerm(route, entityMatch.term)) {
    return entityMatch.term;
  }

  const stripped = stripIntentWords(route, normalizedQuery);
  if (stripped && !isGenericFilterTerm(route, stripped)) {
    return stripped;
  }

  const safeKeyword = normalizeSearchText(matchedKeyword);
  if (safeKeyword && !isGenericFilterTerm(route, safeKeyword)) {
    return safeKeyword;
  }

  return null;
};

const buildDestination = (route: string, filterTerm: string | null): string => {
  const paramKey = ROUTE_QUERY_PARAM[route];
  if (!paramKey || !filterTerm) {
    return route;
  }

  const params = new URLSearchParams();
  params.set(paramKey, filterTerm);
  return `${route}?${params.toString()}`;
};

export const resolveMenuSearch = (query: string): MenuSearchResolution => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return {
      route: null,
      destination: null,
      autoNavigate: false,
      confidence: "none",
      intentLabel: null,
      matchedKeyword: null,
      filterTerm: null,
      message: "Saisissez un mot-clé (service, tarif, station ou circuit).",
      suggestions: MENU_SEARCH_QUICK_LINKS,
    };
  }

  const ranked = rankSearchTargets(normalizedQuery);
  const best = ranked[0];
  const second = ranked[1];

  if (!best || best.score < 45) {
    return {
      route: null,
      destination: null,
      autoNavigate: false,
      confidence: "none",
      intentLabel: null,
      matchedKeyword: null,
      filterTerm: null,
      message: "Aucun resultat clair. Essayez: service medical, tarif honfleur, station gare ou circuit etretat.",
      suggestions: buildSuggestions(ranked),
    };
  }

  const scoreGap = best.score - (second?.score ?? 0);
  if (scoreGap < 6 && best.score < 95) {
    return {
      route: null,
      destination: null,
      autoNavigate: false,
      confidence: "none",
      intentLabel: null,
      matchedKeyword: null,
      filterTerm: null,
      message: `Recherche ambigue. Precisez votre demande (ex: ${best.target.example}).`,
      suggestions: buildSuggestions(ranked),
    };
  }

  let confidence: MenuSearchResolution["confidence"] = "low";
  if (best.score >= 140) {
    confidence = "high";
  } else if (best.score >= 90) {
    confidence = "medium";
  }

  const autoNavigate = best.strongMatch && (confidence === "high" || confidence === "medium");
  const filterTerm = resolveFilterTerm(best.target.route, normalizedQuery, best.matchedKeyword);
  const destination = buildDestination(best.target.route, filterTerm);

  const message = autoNavigate
    ? `Resultat trouve: ${best.target.label}.`
    : `Recherche approximative. Voulez-vous dire ${best.target.label} ? Choisissez une suggestion.`;

  return {
    route: best.target.route,
    destination,
    autoNavigate,
    confidence,
    intentLabel: best.target.label,
    matchedKeyword: best.matchedKeyword,
    filterTerm,
    message,
    suggestions: buildSuggestions(ranked),
  };
};

export const resolveMenuSearchRoute = (query: string): string | null => resolveMenuSearch(query).route;
export const resolveMenuSearchDestination = (query: string): string | null => resolveMenuSearch(query).destination;
