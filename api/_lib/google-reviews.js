const GOOGLE_REVIEWS_SOURCE = "Avis Google";
const GOOGLE_REVIEW_SEARCH_URL = "https://www.google.com/search?q=Taxi+Le+Havre+avis+google";
const DEFAULT_PLACE_TEXT_QUERY = "Taxi Le Havre, Le Havre, France";
const DEFAULT_MIN_RATING = 4;
const DEFAULT_REVIEWS_LIMIT = 5;

const FALLBACK_REVIEWS = [
  {
    id: "camille-lucas",
    source: GOOGLE_REVIEWS_SOURCE,
    author: "Camille Lucas",
    quote:
      "Le chauffeur est arrivé à l'heure! Très agréable et polis à la discussion. Très serviable, j'étais en béquilles avec des difficultés à marcher et le chauffeur m'a aidé avec mes sacs. Je recommande là 100%.",
    avatar: "/images/reviews/camille-lucas.png",
    rating: 5,
    publishedAt: null,
    publishedAtLabel: null,
    reviewUrl: GOOGLE_REVIEW_SEARCH_URL,
    authorUrl: null,
    reportUrl: null,
  },
  {
    id: "niels",
    source: GOOGLE_REVIEWS_SOURCE,
    author: "Niels",
    quote:
      "Très bien, demande au dernier moment et pourtant ponctuel et efficace, prix raisonnable Merci",
    avatar: "/images/reviews/niels.png",
    rating: 5,
    publishedAt: null,
    publishedAtLabel: null,
    reviewUrl: GOOGLE_REVIEW_SEARCH_URL,
    authorUrl: null,
    reportUrl: null,
  },
  {
    id: "raph-lm",
    source: GOOGLE_REVIEWS_SOURCE,
    author: "Raph LM",
    quote:
      "J'ai appelé à minuit pour réserver un taxi à 6h15 le lendemain. Tout simplement parfait, à l'heure!",
    avatar: "/images/reviews/raph-lm.png",
    rating: 5,
    publishedAt: null,
    publishedAtLabel: null,
    reviewUrl: GOOGLE_REVIEW_SEARCH_URL,
    authorUrl: null,
    reportUrl: null,
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const parseNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getInitials = (value) =>
  String(value || "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase() || "TL";

const escapeSvgText = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const buildReviewAvatarDataUrl = (author) => {
  const initials = escapeSvgText(getInitials(author));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none"><rect width="96" height="96" rx="48" fill="#E2E8F0"/><circle cx="48" cy="48" r="38" fill="#0F172A"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="30" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const normalizePublishedAtLabel = (relativeLabel, publishedAt) => {
  const label = String(relativeLabel || "").trim();
  if (label) {
    return label;
  }

  const publishedAtValue = String(publishedAt || "").trim();
  if (!publishedAtValue) {
    return null;
  }

  const parsed = new Date(publishedAtValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const sortReviews = (left, right) => {
  if (right.rating !== left.rating) {
    return right.rating - left.rating;
  }

  const leftDate = left.publishedAt ? Date.parse(left.publishedAt) : 0;
  const rightDate = right.publishedAt ? Date.parse(right.publishedAt) : 0;
  return rightDate - leftDate;
};

export const getGoogleReviewsMinRating = () => {
  const parsed = parseNumber(process.env.GOOGLE_REVIEWS_MIN_RATING);
  return parsed === null ? DEFAULT_MIN_RATING : clamp(parsed, 1, 5);
};

export const getGoogleReviewsLimit = () => {
  const parsed = parseNumber(process.env.GOOGLE_REVIEWS_LIMIT);
  return parsed === null ? DEFAULT_REVIEWS_LIMIT : clamp(Math.round(parsed), 1, 5);
};

export const getGooglePlaceId = () => String(process.env.GOOGLE_PLACE_ID || "").trim();

export const getGooglePlaceTextQuery = () =>
  String(process.env.GOOGLE_PLACE_TEXT_QUERY || DEFAULT_PLACE_TEXT_QUERY).trim();

export const buildFallbackReviewsPayload = (overrides = {}) => ({
  success: true,
  provider: "fallback",
  live: false,
  minRating: getGoogleReviewsMinRating(),
  placeId: null,
  placeName: "Taxi Le Havre",
  rating: null,
  userRatingCount: null,
  googleMapsUri: GOOGLE_REVIEW_SEARCH_URL,
  reviews: FALLBACK_REVIEWS,
  ...overrides,
});

export const normalizeGooglePlacePayload = (place, options = {}) => {
  const minRating = options.minRating ?? getGoogleReviewsMinRating();
  const reviewsLimit = options.reviewsLimit ?? getGoogleReviewsLimit();

  const normalizedReviews = Array.isArray(place?.reviews)
    ? place.reviews
        .map((review, index) => {
          const rating = parseNumber(review?.rating);
          const quote = String(review?.originalText?.text || review?.text?.text || "").trim();
          const author = String(review?.authorAttribution?.displayName || "").trim() || `Client ${index + 1}`;

          if (rating === null || rating < minRating || !quote) {
            return null;
          }

          return {
            id: String(review?.name || `google-review-${index + 1}`),
            source: GOOGLE_REVIEWS_SOURCE,
            author,
            quote,
            avatar:
              String(review?.authorAttribution?.photoUri || "").trim() || buildReviewAvatarDataUrl(author),
            rating: clamp(rating, 0, 5),
            publishedAt: String(review?.publishTime || "").trim() || null,
            publishedAtLabel: normalizePublishedAtLabel(
              review?.relativePublishTimeDescription,
              review?.publishTime,
            ),
            reviewUrl: String(review?.googleMapsUri || place?.googleMapsUri || "").trim() || null,
            authorUrl: String(review?.authorAttribution?.uri || "").trim() || null,
            reportUrl: String(review?.flagContentUri || "").trim() || null,
          };
        })
        .filter(Boolean)
        .sort(sortReviews)
        .slice(0, reviewsLimit)
    : [];

  return {
    success: true,
    provider: "google-places",
    live: true,
    minRating,
    placeId: String(place?.id || "").trim() || null,
    placeName:
      String(place?.displayName?.text || place?.formattedAddress || "Taxi Le Havre").trim() ||
      "Taxi Le Havre",
    rating: parseNumber(place?.rating),
    userRatingCount: parseNumber(place?.userRatingCount),
    googleMapsUri: String(place?.googleMapsUri || "").trim() || GOOGLE_REVIEW_SEARCH_URL,
    reviews: normalizedReviews,
  };
};
