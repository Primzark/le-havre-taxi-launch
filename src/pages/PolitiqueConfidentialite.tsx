import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";

const PolitiqueConfidentialite = () => {
  return (
    <Layout>
      <PageHero title="Politique de confidentialité" />
      <section className="py-16">
        <div className="container max-w-3xl prose prose-sm">
          <h2 className="font-heading font-bold text-xl mb-4">Collecte des données</h2>
          <p className="text-muted-foreground mb-6">
            Nous collectons uniquement les données que vous nous fournissez volontairement via notre formulaire de contact : 
            nom, email, téléphone et message. Ces données sont utilisées exclusivement pour répondre à votre demande.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Utilisation des données</h2>
          <p className="text-muted-foreground mb-6">
            Vos données personnelles ne sont jamais vendues, échangées ou louées à des tiers. 
            Elles sont conservées pour la durée nécessaire au traitement de votre demande.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Vos droits</h2>
          <p className="text-muted-foreground mb-6">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, 
            de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, 
            contactez-nous au 02 35 25 01 01 ou via notre formulaire de contact.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Cookies</h2>
          <p className="text-muted-foreground">
            Ce site n'utilise pas de cookies de suivi. Seuls des cookies techniques essentiels au fonctionnement 
            du site peuvent être utilisés.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PolitiqueConfidentialite;
