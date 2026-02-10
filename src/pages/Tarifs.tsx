import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { toursData } from "@/data/tours";
import { Link, useSearchParams } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";
import { useMemo } from "react";
import { normalizeSearchText, tokenizeSearchText } from "@/utils/menu-search";

const quickPrices = [
  { from: "Le Havre", to: "City Centre", price: "10€" },
  { from: "Le Havre", to: "Train Station", price: "10€" },
  { from: "Honfleur", to: "One way", price: "70€" },
];

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

const Tarifs = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const tokens = useMemo(() => tokenizeSearchText(query), [query]);
  const hasFilter = tokens.length > 0;

  const filteredQuickPrices = useMemo(() => {
    if (!hasFilter) {
      return quickPrices;
    }

    return quickPrices.filter((priceRow) => {
      const indexText = `${priceRow.from} ${priceRow.to} ${priceRow.price}`;
      return tokens.every((token) => normalizeSearchText(indexText).includes(token));
    });
  }, [hasFilter, tokens]);

  const filteredTours = useMemo(() => {
    if (!hasFilter) {
      return toursData;
    }

    return toursData.filter((tour) => {
      const indexText = `${tour.id} ${tour.name} ${tour.duration} ${tour.price}`;
      return tokens.every((token) => normalizeSearchText(indexText).includes(token));
    });
  }, [hasFilter, tokens]);

  const tariffSuggestions = useMemo(() => {
    if (!hasFilter || filteredQuickPrices.length > 0 || filteredTours.length > 0) {
      return [];
    }

    const priceSuggestions = quickPrices.map((row) => ({
      label: `${row.from} — ${row.to}`,
      score: scoreTokens(`${row.from} ${row.to}`, tokens),
    }));
    const tourSuggestions = toursData.map((tour) => ({
      label: `N°${tour.id} — ${tour.name}`,
      score: scoreTokens(`${tour.name} ${tour.duration}`, tokens),
    }));

    return [...priceSuggestions, ...tourSuggestions]
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.label);
  }, [filteredQuickPrices.length, filteredTours.length, hasFilter, tokens]);

  useSEO({
    title: "Tarifs",
    description: "Tarifs mis à jour au 01/01/2025, information rapide et 13 circuits touristiques avec durées et prix.",
    canonicalPath: "/tarifs",
  });

  return (
    <Layout>
      <PageHero title="Tarifs" subtitle="Tarifs indicatifs et circuits touristiques." />

      {hasFilter && (
        <section className="bg-muted/40 border-b py-5">
          <div className="container max-w-4xl flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              Filtre actif sur les tarifs: <span className="font-medium">&quot;{query}&quot;</span>
            </p>
            <Link to="/tarifs" className="text-sm text-primary hover:underline">
              Effacer le filtre
            </Link>
          </div>
        </section>
      )}

      {/* Quick prices */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-6">For your information</h2>
          <div className="grid gap-6 mb-6">
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <img
                src="/images/tarifs-page-2.jpg"
                alt="Grille tarifs For your information"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {filteredQuickPrices.map((p) => (
                <div key={p.to} className="bg-card border rounded-xl p-5 text-center shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">{p.from} — {p.to}</p>
                  <p className="font-heading font-extrabold text-2xl text-primary">{p.price}</p>
                </div>
              ))}
            </div>
            {hasFilter && filteredQuickPrices.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun tarif rapide ne correspond a ce filtre.</p>
            )}
          </div>
        </div>
      </section>

      {/* Discovery tours */}
      <section className="bg-muted py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-2">13 Discovery tours (Round trip)</h2>
          <p className="text-muted-foreground text-sm mb-8">Prices updated on 01/01/2025</p>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm mb-8">
            <img
              src="/images/tarifs-page-3.jpg"
              alt="Liste des 13 Discovery tours"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>

          <div className="space-y-3">
            {filteredTours.map((tour) => (
              <Link
                key={tour.id}
                to={`/circuits-touristiques/${tour.id}`}
                className="flex items-center justify-between bg-card border rounded-lg px-5 py-4 hover:shadow-sm transition group"
              >
                <div>
                  <span className="font-heading font-semibold group-hover:text-primary transition-colors">
                    N°{tour.id} — {tour.name}
                  </span>
                  <span className="text-muted-foreground text-sm ml-2">({tour.duration})</span>
                </div>
                <span className="font-heading font-bold text-primary text-lg">{tour.price} €</span>
              </Link>
            ))}
          </div>
          {hasFilter && filteredTours.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">Aucun circuit tarifaire ne correspond a ce filtre.</p>
          )}

          {hasFilter && filteredQuickPrices.length === 0 && filteredTours.length === 0 && (
            <div className="rounded-xl border bg-card p-5 mt-5">
              <p className="font-heading font-semibold">Aucun resultat sur les tarifs.</p>
              {tariffSuggestions.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Suggestions proches: {tariffSuggestions.join(", ")}.
                </p>
              )}
              <Link to="/tarifs" className="inline-block mt-3 text-sm text-primary hover:underline">
                Afficher tous les tarifs
              </Link>
            </div>
          )}

          <p className="text-muted-foreground text-sm mt-8">
            Price for 1 to 4 people, excluding additional costs (additional passengers and luggage). Museum entrance fees, meals, etc. are not included in the price.
          </p>

          <p className="text-sm mt-4 font-medium">Arrêté préfectoral 2025</p>
        </div>
      </section>
    </Layout>
  );
};

export default Tarifs;
