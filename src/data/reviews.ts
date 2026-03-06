export type ClientReview = {
  id: string;
  source: string;
  author: string;
  quote: string;
  avatar: string;
  rating: number;
  publishedAt: string | null;
  publishedAtLabel: string | null;
  reviewUrl: string | null;
  authorUrl: string | null;
  reportUrl: string | null;
};

export type ClientReviewsPayload = {
  success: boolean;
  provider: "google-places" | "fallback";
  live: boolean;
  minRating: number;
  placeId: string | null;
  placeName: string | null;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  reviews: ClientReview[];
};

const GOOGLE_REVIEW_SEARCH_URL = "https://www.google.com/search?q=Taxi+Le+Havre+avis+google";

export const fallbackClientReviews: ClientReview[] = [
  {
    id: "camille-lucas",
    source: "Avis Google",
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
    source: "Avis Google",
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
    source: "Avis Google",
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

export const fallbackClientReviewsPayload: ClientReviewsPayload = {
  success: true,
  provider: "fallback",
  live: false,
  minRating: 4,
  placeId: null,
  placeName: "Taxi Le Havre",
  rating: null,
  userRatingCount: null,
  googleMapsUri: GOOGLE_REVIEW_SEARCH_URL,
  reviews: fallbackClientReviews,
};

const normalizeReview = (review: unknown, index: number): ClientReview | null => {
  if (!review || typeof review !== "object") {
    return null;
  }

  const item = review as Record<string, unknown>;
  const author = String(item.author ?? "").trim();
  const quote = String(item.quote ?? "").trim();
  const avatar = String(item.avatar ?? "").trim();
  const ratingValue = Number(item.rating ?? 0);

  if (!author || !quote || !avatar || !Number.isFinite(ratingValue)) {
    return null;
  }

  return {
    id: String(item.id ?? `review-${index + 1}`),
    source: String(item.source ?? "Avis Google") || "Avis Google",
    author,
    quote,
    avatar,
    rating: Math.max(0, Math.min(5, ratingValue)),
    publishedAt: item.publishedAt ? String(item.publishedAt) : null,
    publishedAtLabel: item.publishedAtLabel ? String(item.publishedAtLabel) : null,
    reviewUrl: item.reviewUrl ? String(item.reviewUrl) : null,
    authorUrl: item.authorUrl ? String(item.authorUrl) : null,
    reportUrl: item.reportUrl ? String(item.reportUrl) : null,
  };
};

export const normalizeClientReviewsPayload = (payload: unknown): ClientReviewsPayload => {
  if (!payload || typeof payload !== "object") {
    return fallbackClientReviewsPayload;
  }

  const item = payload as Record<string, unknown>;
  const reviews = Array.isArray(item.reviews)
    ? item.reviews.map(normalizeReview).filter((review): review is ClientReview => review !== null)
    : fallbackClientReviewsPayload.reviews;

  return {
    success: item.success !== false,
    provider: item.provider === "google-places" ? "google-places" : "fallback",
    live: item.live === true,
    minRating: Number.isFinite(Number(item.minRating)) ? Number(item.minRating) : fallbackClientReviewsPayload.minRating,
    placeId: item.placeId ? String(item.placeId) : null,
    placeName: item.placeName ? String(item.placeName) : fallbackClientReviewsPayload.placeName,
    rating: Number.isFinite(Number(item.rating)) ? Number(item.rating) : null,
    userRatingCount: Number.isFinite(Number(item.userRatingCount)) ? Number(item.userRatingCount) : null,
    googleMapsUri: item.googleMapsUri ? String(item.googleMapsUri) : fallbackClientReviewsPayload.googleMapsUri,
    reviews: reviews.length > 0 ? reviews : fallbackClientReviewsPayload.reviews,
  };
};
