import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";
import { toursData } from "@/data/tours";
import { useMemo } from "react";
import { normalizeSearchText, tokenizeSearchText } from "@/utils/menu-search";

const scoreTokens = (value: string, tokens: string[]): number => {
  const normalizedValue = normalizeSearchText(value);

  return tokens.reduce((score, token) => {
    if (normalizedValue.includes(token)) {
      return score + 2;
    }

    const hasPrefixMatch = normalizedValue.split(" ").some((word) => word.startsWith(token) || token.startsWith(word));
    return hasPrefixMatch ? score + 1 : score;
  }, 0);
};

const Tours = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const tokens = useMemo(() => tokenizeSearchText(query), [query]);
  const hasFilter = tokens.length > 0;

  const filteredTours = useMemo(() => {
    if (!hasFilter) {
      return toursData;
    }

    return toursData.filter((tour) => {
      const indexText = `${tour.id} ${tour.name} ${tour.duration}`;
      return tokens.every((token) => normalizeSearchText(indexText).includes(token));
    });
  }, [hasFilter, tokens]);

  const tourSuggestions = useMemo(() => {
    if (!hasFilter || filteredTours.length > 0) {
      return [];
    }

    return toursData
      .map((tour) => ({
        label: `N°${tour.id} — ${tour.name}`,
        score: scoreTokens(`${tour.id} ${tour.name} ${tour.duration}`, tokens),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.label);
  }, [filteredTours.length, hasFilter, tokens]);

  useSEO({
    title: "Circuits touristiques",
    description: "13 circuits découverte avec tarifs 2025: Le Havre, Étretat, Honfleur, Rouen, Giverny, Paris, Versailles et plus.",
    canonicalPath: "/circuits-touristiques",
  });

  return (
    <Layout>
      <PageHero title="Circuits touristiques" subtitle="13 circuits découverte pour explorer la Normandie et au-delà." />

      {hasFilter && (
        <section className="bg-muted/40 border-b py-5">
          <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              Filtre actif sur les circuits: <span className="font-medium">&quot;{query}&quot;</span>
            </p>
            <Link to="/circuits-touristiques" className="text-sm text-primary hover:underline">
              Effacer le filtre
            </Link>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container">
          {filteredTours.length === 0 ? (
            <div className="rounded-xl border bg-card p-6">
              <p className="font-heading font-semibold">Aucun circuit ne correspond a votre recherche.</p>
              {tourSuggestions.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Suggestions proches: {tourSuggestions.join(", ")}.
                </p>
              )}
              <Link to="/circuits-touristiques" className="inline-block mt-3 text-sm text-primary hover:underline">
                Afficher tous les circuits
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Link
                  key={tour.id}
                  to={`/circuits-touristiques/${tour.id}`}
                  className="group bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={tour.image}
                    alt={`Circuit ${tour.name}`}
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h2 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors mb-1">
                      N°{tour.id} — {tour.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-3">Durée : {tour.duration}</p>
                    <p className="font-heading font-bold text-primary text-xl">{tour.price} €</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <p className="text-muted-foreground text-sm text-center mt-10 max-w-2xl mx-auto">
            Price for 1 to 4 people, excluding additional costs (additional passengers and luggage). Museum entrance fees, meals, etc. are not included in the price.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Tours;
