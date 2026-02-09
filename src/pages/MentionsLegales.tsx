import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";

const MentionsLegales = () => {
  return (
    <Layout>
      <PageHero title="Mentions légales" />
      <section className="py-16">
        <div className="container max-w-3xl prose prose-sm">
          <h2 className="font-heading font-bold text-xl mb-4">Éditeur du site</h2>
          <p className="text-muted-foreground mb-6">
            Radio Taxi Le Havre<br />
            [Adresse À FOURNIR]<br />
            Téléphone : 02 35 25 01 01<br />
            [SIRET À FOURNIR]
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Hébergement</h2>
          <p className="text-muted-foreground mb-6">[Hébergeur À FOURNIR]</p>

          <h2 className="font-heading font-bold text-xl mb-4">Propriété intellectuelle</h2>
          <p className="text-muted-foreground mb-6">
            L'ensemble du contenu de ce site (textes, images, vidéos) est protégé par le droit d'auteur. 
            Toute reproduction est interdite sans autorisation préalable.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Données personnelles</h2>
          <p className="text-muted-foreground">
            Les informations recueillies via le formulaire de contact sont destinées exclusivement à Radio Taxi Le Havre 
            pour le traitement de votre demande. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification 
            et de suppression de vos données.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default MentionsLegales;
