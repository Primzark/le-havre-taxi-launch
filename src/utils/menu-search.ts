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
  autoNavigate: boolean;
  confidence: "high" | "medium" | "low" | "none";
  intentLabel: string | null;
  matchedKeyword: string | null;
  message: string;
  suggestions: MenuSearchSuggestion[];
};

const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value: string): string[] => normalizeSearchText(value).split(" ").filter(Boolean);

const MENU_SEARCH_TARGETS: MenuSearchTarget[] = [
  {
    route: "/services",
    label: "Services",
    example: "service médical",
    keywords: [
      "service",
      "services",
      "médical",
      "sanitaire",
      "maritime",
      "croisière",
      "aéroport",
      "gare",
      "professionnel",
      "entreprise",
      "groupes",
      "mariage",
      "classe affaire",
      "scolaire",
      "pmr",
      "mobilité réduite",
      "ford tourneo",
    ],
  },
  {
    route: "/tarifs",
    label: "Tarifs",
    example: "tarif 2025",
    keywords: ["tarif", "tarifs", "tarif 2025", "prix", "coût", "décret", "arrêté", "préfectoral"],
  },
  {
    route: "/contact",
    label: "Stations et contact",
    example: "station proche",
    keywords: ["contact", "réservation", "appeler", "téléphone", "mail", "email", "station", "station proche"],
  },
  {
    route: "/circuits-touristiques",
    label: "Circuits touristiques",
    example: "circuit Étretat",
    keywords: [
      "circuit",
      "circuits",
      "tour",
      "touristique",
      "visite",
      "normandie",
      "étretat",
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
    example: "à propos",
    keywords: ["entreprise", "à propos", "histoire", "équipe", "opératrices", "secrétaires"],
  },
  {
    route: "/avis-clients",
    label: "Avis clients",
    example: "avis taxi",
    keywords: ["avis", "avis clients", "témoignages", "temoignages", "tripadvisor", "pages jaunes"],
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
    example: "actualités instagram",
    keywords: ["actus", "actualités", "instagram", "facebook", "capture", "news"],
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

const CIRCUIT_INTENT_WORDS = new Set(["circuit", "circuits", "tour", "tours", "touristique", "visite"]);
const NON_CIRCUIT_INTENT_WORDS = new Set([
  "tarif",
  "tarifs",
  "prix",
  "station",
  "stations",
  "contact",
  "reservation",
  "service",
  "services",
  "mail",
  "email",
  "telephone",
]);

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

  const queryWords = tokenize(normalizedQuery);
  const keywordWords = tokenize(normalizedKeyword);

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

  const queryWords = tokenize(normalizedQuery).filter((word) => word.length >= 3 && /[a-z]/.test(word));
  const keywordWords = tokenize(normalizedKeyword).filter((word) => word.length >= 3 && /[a-z]/.test(word));

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

type CircuitScore = {
  id: number;
  name: string;
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

const shouldTryDirectCircuitMatch = (normalizedQuery: string): boolean => {
  const queryWords = tokenize(normalizedQuery);
  if (queryWords.length === 0) {
    return false;
  }

  const hasCircuitIntent = queryWords.some((word) => CIRCUIT_INTENT_WORDS.has(word));
  const hasNonCircuitIntent = queryWords.some((word) => NON_CIRCUIT_INTENT_WORDS.has(word));

  return hasCircuitIntent || !hasNonCircuitIntent;
};

const findDirectCircuitMatch = (normalizedQuery: string): CircuitScore | null => {
  if (!shouldTryDirectCircuitMatch(normalizedQuery)) {
    return null;
  }

  let bestMatch: CircuitScore | null = null;

  for (const tour of toursData) {
    const normalizedName = normalizeSearchText(tour.name);
    const score = scoreKeyword(normalizedQuery, normalizedName);
    const strongMatch = isStrongMatch(normalizedQuery, normalizedName);

    if (!bestMatch || score > bestMatch.score || (score === bestMatch.score && strongMatch && !bestMatch.strongMatch)) {
      bestMatch = {
        id: tour.id,
        name: tour.name,
        score,
        strongMatch,
      };
    }
  }

  if (!bestMatch) {
    return null;
  }

  if (bestMatch.strongMatch && bestMatch.score >= 90) {
    return bestMatch;
  }

  if (bestMatch.score >= 140) {
    return bestMatch;
  }

  return null;
};

export const resolveMenuSearch = (query: string): MenuSearchResolution => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return {
      route: null,
      autoNavigate: false,
      confidence: "none",
      intentLabel: null,
      matchedKeyword: null,
      message: "Saisissez un mot-clé (service, tarif, station ou circuit).",
      suggestions: MENU_SEARCH_QUICK_LINKS,
    };
  }

  const circuitMatch = findDirectCircuitMatch(normalizedQuery);
  if (circuitMatch) {
    return {
      route: `/circuits-touristiques/${circuitMatch.id}`,
      autoNavigate: true,
      confidence: "high",
      intentLabel: "Circuits touristiques",
      matchedKeyword: normalizeSearchText(circuitMatch.name),
      message: `Résultat trouvé : circuit ${circuitMatch.name}.`,
      suggestions: MENU_SEARCH_QUICK_LINKS,
    };
  }

  const ranked = rankSearchTargets(normalizedQuery);
  const best = ranked[0];
  const second = ranked[1];

  if (!best || best.score < 45) {
    return {
      route: null,
      autoNavigate: false,
      confidence: "none",
      intentLabel: null,
      matchedKeyword: null,
      message: "Aucun résultat net. Essayez : transport médical, tarif 2025, station proche ou circuit Étretat.",
      suggestions: buildSuggestions(ranked),
    };
  }

  const scoreGap = best.score - (second?.score ?? 0);
  if (scoreGap < 6 && best.score < 95) {
    return {
      route: null,
      autoNavigate: false,
      confidence: "none",
      intentLabel: null,
      matchedKeyword: null,
      message: `Recherche ambiguë. Précisez votre demande (ex. ${best.target.example}).`,
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

  const message = autoNavigate
    ? `Résultat trouvé : ${best.target.label}.`
    : `Recherche proche de ${best.target.label}. Choisissez une suggestion pour continuer.`;

  return {
    route: best.target.route,
    autoNavigate,
    confidence,
    intentLabel: best.target.label,
    matchedKeyword: best.matchedKeyword,
    message,
    suggestions: buildSuggestions(ranked),
  };
};

export const resolveMenuSearchRoute = (query: string): string | null => resolveMenuSearch(query).route;
