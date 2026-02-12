import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";
import {
  LEGAL_ADDRESS,
  LEGAL_EMAIL,
  LEGAL_ENTITY_NAME,
  LEGAL_HOSTING_PROVIDER,
  LEGAL_PHONE,
  LEGAL_SIRET,
} from "@/config/legal";

const MentionsLegales = () => {
  useSEO({
    title: "Mentions légales",
    description: "Mentions légales du site Radio Taxi Le Havre.",
    canonicalPath: "/mentions-legales",
    robots: "index, follow",
    ogImage: "/images/home-bassin-commerce.jpg",
    keywords: [
      "mentions légales taxi le havre",
      "éditeur site taxi le havre",
      "hébergement site taxi le havre",
    ],
  });

  return (
    <Layout>
      <PageHero title="Mentions légales" backgroundImage="/images/home-bassin-commerce.jpg" />
      <section className="py-16">
        <div className="container max-w-3xl prose prose-sm">
          <h2 className="font-heading font-bold text-xl mb-4">Éditeur du site</h2>
          <p className="text-muted-foreground mb-6">
            {LEGAL_ENTITY_NAME}
            <br />
            {LEGAL_ADDRESS}
            <br />
            Téléphone : {LEGAL_PHONE}
            <br />
            Email : {LEGAL_EMAIL}
            <br />
            SIRET : {LEGAL_SIRET}
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Hébergement</h2>
          <p className="text-muted-foreground mb-6">{LEGAL_HOSTING_PROVIDER}</p>

          <h2 className="font-heading font-bold text-xl mb-4">Propriété intellectuelle</h2>
          <p className="text-muted-foreground mb-6">
            Les textes, visuels et contenus publiés sur ce site sont protégés par le droit d'auteur.
            Toute réutilisation, totale ou partielle, nécessite un accord préalable.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Données personnelles</h2>
          <p className="text-muted-foreground">
            Les données recueillies via le formulaire de contact sont utilisées uniquement pour traiter votre demande.
            Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression de vos données
            en contactant {LEGAL_ENTITY_NAME}.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default MentionsLegales;
