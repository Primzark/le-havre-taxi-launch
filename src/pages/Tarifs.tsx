import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { toursData } from "@/data/tours";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";

const quickPrices = [
  { from: "Le Havre", to: "Centre-ville", price: "10 €" },
  { from: "Le Havre", to: "Gare", price: "10 €" },
  { from: "Honfleur", to: "Aller simple", price: "70 €" },
];

const Tarifs = () => {
  useSEO({
    title: "Tarifs",
    description: "Tarifs indicatifs mis a jour au 1er janvier 2025, plus 13 circuits touristiques avec durees et prix.",
    canonicalPath: "/tarifs",
  });

  return (
    <Layout>
      <PageHero title="Tarifs" subtitle="Reperez rapidement les prix indicatifs et les circuits proposes." />

      {/* Quick prices */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-6">Informations utiles</h2>
          <div className="grid gap-6 mb-6">
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <img
                src="/images/tarifs-page-2.jpg"
                alt="Grille tarifaire"
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
          <h2 className="font-heading font-bold text-2xl mb-2">13 circuits touristiques (aller-retour)</h2>
          <p className="text-muted-foreground text-sm mb-8">Tarifs mis a jour le 01/01/2025</p>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm mb-8">
            <img
              src="/images/tarifs-page-3.jpg"
              alt="Liste des 13 circuits touristiques"
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
            Tarif valable pour 1 a 4 personnes, hors supplements eventuels (passagers ou bagages supplementaires). Les entrees de sites, repas et depenses personnelles ne sont pas inclus.
          </p>

          <p className="text-sm mt-4 font-medium">Arrete prefectoral 2025</p>
        </div>
      </section>
    </Layout>
  );
};

export default Tarifs;
