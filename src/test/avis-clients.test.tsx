import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import AvisClients from "@/pages/AvisClients";

vi.mock("@/components/Layout", () => ({
  default: ({ children }: { children: any }) => <div>{children}</div>,
}));

vi.mock("@/components/PageHero", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("@/hooks/use-seo", () => ({
  useSEO: () => {},
}));

const jsonResponse = (payload: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: async () => payload,
  } as Response);

const memoryRouterFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe("AvisClients", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the live Google reviews payload from the API", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith("/api/reviews.php")) {
        return jsonResponse({
          success: true,
          provider: "google-places",
          live: true,
          minRating: 4,
          placeId: "place-123",
          placeName: "Taxi Le Havre",
          rating: 4.8,
          userRatingCount: 128,
          googleMapsUri: "https://maps.google.com/?cid=123",
          reviews: [
            {
              id: "review-1",
              source: "Avis Google",
              author: "Sophie Martin",
              quote: "Service impeccable et chauffeur ponctuel.",
              avatar: "https://example.com/avatar-1.jpg",
              rating: 5,
              publishedAt: "2026-03-01T10:00:00.000Z",
              publishedAtLabel: "il y a 5 jours",
              reviewUrl: "https://maps.google.com/?review=1",
              authorUrl: "https://maps.google.com/?author=1",
              reportUrl: "https://maps.google.com/?flag=1",
            },
            {
              id: "review-2",
              source: "Avis Google",
              author: "Marc Petit",
              quote: "Réservation simple et prise en charge rapide.",
              avatar: "https://example.com/avatar-2.jpg",
              rating: 4,
              publishedAt: "2026-02-27T08:30:00.000Z",
              publishedAtLabel: "il y a 1 semaine",
              reviewUrl: "https://maps.google.com/?review=2",
              authorUrl: null,
              reportUrl: null,
            },
          ],
        });
      }

      return jsonResponse({ success: false, error: "Unhandled route" }, false, 500);
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter future={memoryRouterFutureConfig}>
          <AvisClients />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Sophie Martin/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Camille Lucas/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("4.8/5")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voir la fiche Google/i })).toHaveAttribute(
      "href",
      "https://maps.google.com/?cid=123",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/reviews.php",
      expect.objectContaining({ credentials: "same-origin" }),
    );
  });
});
