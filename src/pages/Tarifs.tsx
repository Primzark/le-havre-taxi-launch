import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { toursData } from "@/data/tours";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";

const quickPrices = [
  { from: "Circuit n°1", to: "Le Havre", price: "60 €" },
  { from: "Circuit n°2", to: "Étretat", price: "125 €" },
  { from: "Circuit n°4", to: "Mont St Michel", price: "460 €" },
];

const Tarifs = () => {
  useSEO({
    title: "Tarifs",
    description: "Tarifs forfaitaires historiques des circuits touristiques Taxi Le Havre.",
    canonicalPath: "/tarifs",
  });

  return (
    <Layout>
      <PageHero title="Tarifs" subtitle="Tarifs forfaitaires et circuits touristiques historiques." />

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
          <h2 className="font-heading font-bold text-2xl mb-2">12 circuits touristiques (aller-retour)</h2>
          <p className="text-muted-foreground text-sm mb-8">Prix forfaitaires 1 a 4 et 5 a 6 personnes</p>

          <div className="overflow-hidden rounded-xl border bg-card shadow-sm mb-8">
            <img
              src="/images/tarifs-page-3.jpg"
              alt="Liste des circuits touristiques"
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
                <div className="text-right">
                  <p className="font-heading font-bold text-primary text-lg">{tour.price1To4} €</p>
                  <p className="text-xs text-muted-foreground">1 a 4 pers.</p>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-muted-foreground text-sm mt-8">
            Les tarifs sont fixes et forfaitaires, convenus a l'avance et sans surtaxe. Les prix peuvent varier selon le nombre de passagers.
          </p>

          <p className="text-sm mt-4 font-medium">Tarifs historiques Taxi Le Havre</p>
        </div>
      </section>
    </Layout>
  );
};

export default Tarifs;
