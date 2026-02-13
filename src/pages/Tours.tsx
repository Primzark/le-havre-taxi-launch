import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";
import { toursData } from "@/data/tours";
import { PRIMARY_DOMAIN } from "@/config/site";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";

const Tours = () => {
  useSEO({
    title: "Circuits touristiques",
    description: "13 circuits touristiques au départ du Havre : Étretat, Honfleur, Rouen, Giverny, Paris, Versailles et plus.",
    canonicalPath: "/circuits-touristiques",
    ogImage: "/images/tour-03-normandie.webp",
    keywords: [
      "circuit touristique le havre",
      "taxi tourisme normandie",
      "étretat taxi privé",
      "honfleur excursion taxi",
      "tour privé depuis le havre",
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Circuits touristiques Taxi Le Havre",
      itemListElement: toursData.map((tour, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${PRIMARY_DOMAIN}/circuits-touristiques/${tour.id}`,
        name: `Circuit ${tour.id} ${tour.name}`,
      })),
    },
  });

  return (
    <Layout>
      <PageHero
        title="Circuits touristiques"
        subtitle="Situé au cœur de la Normandie, Le Havre est idéalement placé pour découvrir les grands sites normands."
        backgroundImage="/images/tour-03-normandie.webp"
      />

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="tour-section-bg" aria-hidden="true" />
        <div className="tour-orb tour-orb--one" aria-hidden="true" />
        <div className="tour-orb tour-orb--two" aria-hidden="true" />
        <div className="tour-orb tour-orb--three" aria-hidden="true" />

        <div className="container relative">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-4 w-4" />
              Sélection de circuits privés
            </p>
            <h2 className="mt-4 font-heading text-2xl font-extrabold md:text-3xl">Choisissez votre itinéraire</h2>
            <p className="mt-3 text-muted-foreground">
              Du Havre jusqu'à Paris, nos taxis vous accompagnent sur des parcours touristiques proches du site historique.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {toursData.map((tour, index) => (
              <Link
                key={tour.id}
                to={`/circuits-touristiques/${tour.id}`}
                className="tour-card tour-card-enter group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_10px_28px_-18px_hsl(var(--primary)/0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_45px_-18px_hsl(var(--primary)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55"
                style={{ animationDelay: `${120 + index * 55}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={tour.image}
                    alt={`Circuit ${tour.name}`}
                    className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/45 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    Circuit {tour.id}
                  </span>
                </div>

                <div className="relative flex flex-1 flex-col p-5 md:p-6">
                  <h2 className="mb-1 font-heading text-lg font-semibold transition-colors group-hover:text-primary">
                    N°{tour.id} — {tour.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">Excursion privée au départ du Havre</p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4 text-primary" />
                      {tour.duration}
                    </p>
                    <p className="font-heading text-xl font-bold text-primary">{tour.price} €</p>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Découvrir le circuit
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-muted-foreground text-sm text-center mt-10 max-w-2xl mx-auto">
            Tarif valable pour 1 à 4 personnes, hors suppléments éventuels. Les billets d'entrée, repas et dépenses personnelles restent à votre charge.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Tours;
