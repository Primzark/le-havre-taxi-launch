import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { toursData } from "@/data/tours";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";

const quickPrices = [
  { from: "Le Havre", to: "City Centre", price: "10€" },
  { from: "Le Havre", to: "Train Station", price: "10€" },
  { from: "Honfleur", to: "One way", price: "70€" },
];

const Tarifs = () => {
  useSEO({
    title: "Tarifs",
    description: "Tarifs mis à jour au 01/01/2025, information rapide et 13 circuits touristiques avec durées et prix.",
    canonicalPath: "/tarifs",
  });

  return (
    <Layout>
      <PageHero title="Tarifs" subtitle="Tarifs indicatifs et circuits touristiques." />

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
              {quickPrices.map((p) => (
                <div key={p.to} className="bg-card border rounded-xl p-5 text-center shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">{p.from} — {p.to}</p>
                  <p className="font-heading font-extrabold text-2xl text-primary">{p.price}</p>
                </div>
              ))}
            </div>
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
            {toursData.map((tour) => (
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
