import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";
import { toursData } from "@/data/tours";
import { PRIMARY_DOMAIN } from "@/config/site";

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
        subtitle="Treize idées de sorties pour visiter la Normandie et ses incontournables."
        backgroundImage="/images/tour-03-normandie.webp"
      />

      <section className="py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toursData.map((tour) => (
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
          <p className="text-muted-foreground text-sm text-center mt-10 max-w-2xl mx-auto">
            Tarif valable pour 1 à 4 personnes, hors suppléments éventuels. Les billets d'entrée, repas et dépenses personnelles restent à votre charge.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Tours;
