import { useQuery } from "@tanstack/react-query";
import { REVIEWS_API_URL } from "@/config/site";
import { fallbackClientReviewsPayload, normalizeClientReviewsPayload } from "@/data/reviews";

const JSON_ACCEPT_HEADERS = { Accept: "application/json" } as const;

const fetchClientReviews = async () => {
  try {
    const response = await fetch(REVIEWS_API_URL, {
      headers: JSON_ACCEPT_HEADERS,
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`Unable to load reviews (${response.status})`);
    }

    const payload = await response.json();
    return normalizeClientReviewsPayload(payload);
  } catch {
    return fallbackClientReviewsPayload;
  }
};

export const useClientReviews = () =>
  useQuery({
    queryKey: ["client-reviews"],
    queryFn: fetchClientReviews,
    placeholderData: fallbackClientReviewsPayload,
    staleTime: 15 * 60 * 1000,
    retry: 1,
  });
