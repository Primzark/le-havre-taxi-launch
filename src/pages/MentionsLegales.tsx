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
    title: "Mentions legales",
    description: "Mentions legales du site Taxi Le Havre.",
    canonicalPath: "/mentions-legales",
    robots: "index, follow",
  });

  return (
    <Layout>
      <PageHero title="Mentions legales" />
      <section className="py-16">
        <div className="container max-w-3xl prose prose-sm">
          <h2 className="font-heading font-bold text-xl mb-4">Editeur du site</h2>
          <p className="text-muted-foreground mb-6">
            {LEGAL_ENTITY_NAME}
            <br />
            {LEGAL_ADDRESS}
            <br />
            Telephone : {LEGAL_PHONE}
            <br />
            Email : {LEGAL_EMAIL}
            <br />
            SIRET : {LEGAL_SIRET}
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Hebergement</h2>
          <p className="text-muted-foreground mb-6">{LEGAL_HOSTING_PROVIDER}</p>

          <h2 className="font-heading font-bold text-xl mb-4">Propriete intellectuelle</h2>
          <p className="text-muted-foreground mb-6">
            L'ensemble du contenu de ce site (textes, images, videos) est protege par le droit d'auteur.
            Toute reproduction est interdite sans autorisation prealable.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Donnees personnelles</h2>
          <p className="text-muted-foreground">
            Les informations recueillies via le formulaire de contact sont destinees exclusivement a {LEGAL_ENTITY_NAME}
            pour le traitement de votre demande. Conformement au RGPD, vous disposez d'un droit d'acces,
            de rectification et de suppression de vos donnees.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default MentionsLegales;
