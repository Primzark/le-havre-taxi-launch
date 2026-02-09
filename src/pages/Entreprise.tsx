import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Users, MapPin, Clock, Phone } from "lucide-react";

const Entreprise = () => {
  return (
    <Layout>
      <PageHero title="Notre entreprise" subtitle="Depuis 1976, au service des Havrais et des visiteurs." />

      {/* À propos */}
      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-6">À propos de nous</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Radio Taxi Le Havre est un groupement de taxis présent sur l'agglomération havraise. 
            Avec notre flotte de véhicules et nos <strong>35 stations</strong> réparties dans la ville, 
            nous assurons un service de proximité rapide et efficace.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Notre centrale de réservation est disponible 24h/24 et 7j/7 pour répondre à toutes vos demandes 
            de transport : déplacements quotidiens, transferts aéroport et gare, transport médical, 
            circuits touristiques et événements.
          </p>
        </div>
      </section>

      {/* Engagement */}
      <section className="bg-muted py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-6">Notre engagement</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Clock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">Depuis 1976</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Plus de 48 ans d'expérience dans le transport de personnes au Havre et ses environs.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">Notre équipe</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                115 taxis, 6 opératrices et 2 secrétaires assurent un service continu et de qualité.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <MapPin className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">35 stations</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Des stations réparties stratégiquement dans toute l'agglomération havraise.
              </p>
            </div>
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Phone className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-semibold mb-2">Disponibilité 24h/7j</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Notre centrale est ouverte jour et nuit, weekends et jours fériés compris.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Entreprise;
