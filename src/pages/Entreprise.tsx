import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Users, MapPin, Clock, Phone } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { PRIMARY_DOMAIN, SITE_NAME } from "@/config/site";

const Entreprise = () => {
  useSEO({
    title: "Entreprise",
    description: "Radio Taxi Le Havre : 115 véhicules, 35 stations et une centrale active depuis 1976.",
    canonicalPath: "/entreprise",
    ogImage: "/images/services/transport-entreprise.jpg",
    keywords: [
      "entreprise taxi le havre",
      "radio taxi le havre",
      "centrale taxi 24h 24",
      "taxi depuis 1976",
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: `Entreprise ${SITE_NAME}`,
      description: "Présentation de la coopérative Radio Taxi Le Havre",
      url: `${PRIMARY_DOMAIN}/entreprise`,
      inLanguage: "fr-FR",
    },
  });

  return (
    <Layout>
      <PageHero
        title="Notre entreprise"
        subtitle="Un groupement local, au service des Havrais comme des visiteurs depuis 1976."
        backgroundImage="/images/services/transport-entreprise.jpg"
      />

      {/* À propos */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-6">Qui nous sommes</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Radio Taxi Le Havre rassemble des chauffeurs indépendants sur toute l'agglomération.
            Avec <strong>115 véhicules</strong> et <strong>35 stations</strong>, nous couvrons les besoins du quotidien comme les trajets plus spécifiques.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            La centrale de réservation fonctionne 24h/24 et 7j/7 pour vos déplacements personnels, professionnels,
            médicaux ou touristiques, au Havre et autour.
          </p>
        </div>
      </section>

      {/* Engagement */}
      <section className="bg-muted py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-6">Ce qui nous guide</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">Depuis 1976</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Une présence continue au Havre, avec la même exigence de fiabilité sur la route.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">Une équipe organisée</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Chauffeurs, opératrices et personnel administratif travaillent ensemble pour une prise en charge rapide.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <MapPin className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">35 stations</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Des points de présence répartis dans l'agglomération pour rester proches de vous.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Phone className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">Disponibilité 24h/7j</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Une centrale joignable jour et nuit, week-ends et jours fériés inclus.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Entreprise;
