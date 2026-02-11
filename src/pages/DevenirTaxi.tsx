import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";

const requirements = [
  "Etre titulaire du permis B depuis plus de 3 ans",
  "Obtenir la carte professionnelle de taxi (examen prefectoral)",
  "Disposer d'un vehicule conforme a la reglementation",
  "Posseder une autorisation de stationnement (licence)",
  "Etre inscrit au registre des metiers ou du commerce",
];

const advantages = [
  "Integrer un groupement reconnu depuis 1976",
  "Profiter d'une centrale de reservation active 24h/24",
  "Acceder a une clientele variee (particuliers, entreprises, tourisme, medical)",
  "S'appuyer sur 35 stations dans l'agglomeration",
  "Rejoindre un reseau de 115 taxis",
];

const DevenirTaxi = () => {
  useSEO({
    title: "Devenir taxi",
    description: "Conditions pour devenir chauffeur de taxi et rejoindre Radio Taxi Le Havre.",
    canonicalPath: "/devenir-taxi",
  });

  return (
    <Layout>
      <PageHero title="Devenir taxi" subtitle="Vous souhaitez exercer au Havre ? Voici les bases pour rejoindre le groupement." />

      <section className="py-16">
        <div className="container max-w-4xl">
          {/* Qui est le chauffeur */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-2xl mb-4">Qui est le chauffeur de taxi ?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le chauffeur de taxi accompagne ses passagers sur des trajets tres varies : domicile, travail, gare,
              rendez-vous medical, aeroport ou sortie. C'est un metier de terrain qui demande ponctualite, sens du service
              et bonne connaissance du secteur havrais.
            </p>
          </div>

          {/* Conditions */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-2xl mb-4">Conditions requises</h2>
            <ul className="space-y-3">
              {requirements.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Avantages */}
          <div className="bg-muted rounded-xl p-8 mb-12">
            <h2 className="font-heading font-bold text-2xl mb-4">Pourquoi rejoindre Radio Taxi Le Havre ?</h2>
            <ul className="space-y-3">
              {advantages.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DevenirTaxi;
