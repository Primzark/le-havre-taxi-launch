import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Users, MapPin, Clock, Phone } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const Entreprise = () => {
  useSEO({
    title: "Entreprise",
    description: "Radio Taxi Le Havre : 115 vehicules, 35 stations et une centrale active depuis 1976.",
    canonicalPath: "/entreprise",
  });

  return (
    <Layout>
      <PageHero title="Notre entreprise" subtitle="Un groupement local, au service des Havrais comme des visiteurs depuis 1976." />

      {/* À propos */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-6">Qui nous sommes</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Radio Taxi Le Havre rassemble des chauffeurs independants sur toute l'agglomeration.
            Avec <strong>115 vehicules</strong> et <strong>35 stations</strong>, nous couvrons les besoins du quotidien comme les trajets plus specifiques.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            La centrale de reservation fonctionne 24h/24 et 7j/7 pour vos deplacements personnels, professionnels,
            medicaux ou touristiques, au Havre et autour.
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
                Une presence continue au Havre, avec la meme exigence de fiabilite sur la route.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">Une equipe organisee</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Chauffeurs, operatrices et administratif travaillent ensemble pour une prise en charge rapide.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <MapPin className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">35 stations</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Des points de presence repartis dans l'agglomeration pour rester proches de vous.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Phone className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">Disponibilité 24h/7j</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Une centrale joignable jour et nuit, week-ends et jours feries inclus.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Entreprise;
