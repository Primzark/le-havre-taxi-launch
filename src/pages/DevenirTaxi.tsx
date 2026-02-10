import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";

const requirements = [
  "Être titulaire du permis B depuis plus de 3 ans",
  "Obtenir la carte professionnelle de taxi (examen préfectoral)",
  "Disposer d'un véhicule conforme aux normes en vigueur",
  "Posséder une autorisation de stationnement (licence)",
  "Être inscrit au registre des métiers ou au registre du commerce",
];

const advantages = [
  "Intégrer un groupement reconnu depuis 1976",
  "Bénéficier d'une centrale de réservation performante 24h/24",
  "Accéder à une clientèle diversifiée (particuliers, entreprises, tourisme, médical)",
  "Profiter de 35 stations réparties dans l'agglomération",
  "Rejoindre un réseau solidaire de 115 taxis",
];

const DevenirTaxi = () => {
  useSEO({
    title: "Devenir taxi",
    description: "Conditions pour devenir chauffeur de taxi et rejoindre Radio Taxi Le Havre.",
    canonicalPath: "/devenir-taxi",
  });

  return (
    <Layout>
      <PageHero title="Devenir taxi" subtitle="Rejoignez le groupement Radio Taxi Le Havre." />

      <section className="py-16">
        <div className="container max-w-4xl">
          {/* Qui est le chauffeur */}
          <div className="mb-12">
            <h2 className="font-heading font-bold text-2xl mb-4">Qui est le chauffeur de taxi ?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le chauffeur de taxi est un professionnel du transport de personnes. 
              Il assure des courses à la demande sur l'ensemble de l'agglomération havraise et au-delà. 
              Polyvalent, il maîtrise la géographie locale, les réglementations en vigueur et offre un service 
              courtois et sécurisé à chaque client.
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
