import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";
import { toursData } from "@/data/tours";

const Tours = () => {
  useSEO({
    title: "Circuits touristiques",
    description: "12 circuits touristiques historiques proposes au depart du Havre, avec duree et tarifs forfaitaires.",
    canonicalPath: "/circuits-touristiques",
  });

  return (
    <Layout>
      <PageHero title="Circuits touristiques" subtitle="Les circuits historiques de Taxi Le Havre, du n°1 au n°12." />

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
                  <p className="font-heading font-bold text-primary text-xl">{tour.price1To4} €</p>
                  <p className="text-xs text-muted-foreground">1 à 4 personnes</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground text-sm text-center mt-10 max-w-2xl mx-auto">
            Les tarifs sont forfaitaires et convenus a l'avance. Voir chaque circuit pour les prix 1 a 4 et 5 a 6 personnes.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Tours;
