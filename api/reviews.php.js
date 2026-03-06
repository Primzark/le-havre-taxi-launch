import {
  apiLog,
  handleOptions,
  methodNotAllowed,
  withApiHandler,
} from "./_lib/core.js";
import {
  buildFallbackReviewsPayload,
  getGooglePlaceId,
  getGooglePlaceTextQuery,
  getGoogleReviewsLimit,
  getGoogleReviewsMinRating,
  normalizeGooglePlacePayload,
} from "./_lib/google-reviews.js";

const GOOGLE_PLACE_DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "googleMapsUri",
  "rating",
  "userRatingCount",
  "reviews",
].join(",");

const GOOGLE_PLACE_SEARCH_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.googleMapsUri",
].join(",");

const GOOGLE_PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";
const GOOGLE_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const GOOGLE_REQUEST_TIMEOUT_MS = 10_000;
const REVIEWS_CACHE_TTL_MS = 15 * 60 * 1000;

let cachedPayload = null;
let cachedAt = 0;
let inflightRequest = null;

const sendReviewsJson = (res, payload) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=86400");
  res.end(JSON.stringify(payload));
};

const fetchGoogleJson = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GOOGLE_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = payload?.error?.message || response.statusText || "Google request failed";
      throw new Error(`${message} (${response.status})`);
    }

    return payload;
  } finally {
    clearTimeout(timeoutId);
  }
};

const resolvePlaceId = async (apiKey) => {
  const explicitPlaceId = getGooglePlaceId();
  if (explicitPlaceId) {
    return explicitPlaceId;
  }

  const payload = await fetchGoogleJson(GOOGLE_TEXT_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": GOOGLE_PLACE_SEARCH_FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: getGooglePlaceTextQuery(),
      languageCode: "fr",
      regionCode: "FR",
    }),
  });

  const placeId = payload?.places?.[0]?.id;
  if (!placeId) {
    throw new Error(`No Google Place found for query "${getGooglePlaceTextQuery()}"`);
  }

  return placeId;
};

const fetchLiveReviewsPayload = async () => {
  const apiKey = String(process.env.GOOGLE_PLACES_API_KEY || "").trim();
  const minRating = getGoogleReviewsMinRating();
  const reviewsLimit = getGoogleReviewsLimit();

  if (!apiKey) {
    return buildFallbackReviewsPayload({
      minRating,
      warning: "GOOGLE_PLACES_API_KEY is not configured",
    });
  }

  const placeId = await resolvePlaceId(apiKey);
  const detailsUrl = new URL(`${GOOGLE_PLACE_DETAILS_URL}/${encodeURIComponent(placeId)}`);
  detailsUrl.searchParams.set("languageCode", "fr");
  detailsUrl.searchParams.set("regionCode", "FR");

  const place = await fetchGoogleJson(detailsUrl.toString(), {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": GOOGLE_PLACE_DETAILS_FIELD_MASK,
    },
  });

  return normalizeGooglePlacePayload(place, {
    minRating,
    reviewsLimit,
  });
};

const loadReviewsPayload = async () => {
  const now = Date.now();
  if (cachedPayload && now - cachedAt < REVIEWS_CACHE_TTL_MS) {
    return cachedPayload;
  }

  if (!inflightRequest) {
    inflightRequest = (async () => {
      try {
        const payload = await fetchLiveReviewsPayload();
        cachedPayload = payload;
        cachedAt = Date.now();
        return payload;
      } catch (error) {
        const fallbackPayload = buildFallbackReviewsPayload({
          warning: error instanceof Error ? error.message : "Unable to load Google reviews",
        });

        await apiLog("warning", "google_reviews_fetch_failed", {
          message: error instanceof Error ? error.message : "Unknown error",
        });

        cachedPayload = fallbackPayload;
        cachedAt = Date.now();
        return fallbackPayload;
      } finally {
        inflightRequest = null;
      }
    })();
  }

  return inflightRequest;
};

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  await withApiHandler(req, res, async () => {
    const method = (req.method || "GET").toUpperCase();

    if (method !== "GET") {
      methodNotAllowed();
    }

    const payload = await loadReviewsPayload();
    sendReviewsJson(res, payload);
  });
}
