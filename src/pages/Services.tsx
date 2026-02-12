import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Link } from "react-router-dom";
import { ArrowRight, Car } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { servicesData } from "@/data/services";

const vehicles = [
  "Berline (Peugeot 508, etc.)",
  "Monospace",
  "Van (Ford Tourneo Custom)",
  "Vehicule adapte PMR",
];

const Services = () => {
  useSEO({
    title: "Services",
    description:
      "Services taxi au Havre : navette aeroport, transport sanitaire, classe affaire, scolaire, PMR, mariage et entreprise.",
    canonicalPath: "/services",
  });

  return (
    <Layout>
      <PageHero
        title="Nos services"
        subtitle="Retrouvez tous les services de Taxi Le Havre, avec une page detaillee pour chaque besoin."
        backgroundImage="/images/services/navette-aeroport.jpg"
      />

      {/* Services grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="group overflow-hidden bg-card rounded-2xl border shadow-sm hover:shadow-lg transition"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 bg-background/90 rounded-full p-2 shadow">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="font-heading font-semibold text-lg mb-2">{service.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.shortDescription}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                    Voir le service
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-center">Notre flotte</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {vehicles.map((v) => (
              <div key={v} className="bg-card rounded-xl p-5 border text-center shadow-sm">
                <Car className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-heading font-medium text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
