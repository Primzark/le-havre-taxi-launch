import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";

const PolitiqueConfidentialite = () => {
  useSEO({
    title: "Politique de confidentialite",
    description: "Politique de confidentialite et traitement des donnees personnelles Taxi Le Havre.",
    canonicalPath: "/politique-confidentialite",
    robots: "index, follow",
  });

  return (
    <Layout>
      <PageHero title="Politique de confidentialite" />
      <section className="py-16">
        <div className="container max-w-3xl prose prose-sm">
          <h2 className="font-heading font-bold text-xl mb-4">Collecte des donnees</h2>
          <p className="text-muted-foreground mb-6">
            Nous collectons uniquement les donnees que vous nous fournissez volontairement via notre formulaire de contact :
            nom, email, telephone et message. Ces donnees sont utilisees exclusivement pour repondre a votre demande.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Utilisation des donnees</h2>
          <p className="text-muted-foreground mb-6">
            Vos donnees personnelles ne sont jamais vendues, echangees ou louees a des tiers.
            Elles sont conservees pour la duree necessaire au traitement de votre demande.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Vos droits</h2>
          <p className="text-muted-foreground mb-6">
            Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez d'un droit d'acces,
            de rectification, de suppression et de portabilite de vos donnees. Pour exercer ces droits,
            contactez-nous au 02 35 25 01 01 ou via notre formulaire de contact.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Cookies</h2>
          <p className="text-muted-foreground">
            Ce site n'utilise pas de cookies de suivi. Seuls des cookies techniques essentiels au fonctionnement
            du site peuvent etre utilises.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PolitiqueConfidentialite;
