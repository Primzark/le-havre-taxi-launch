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
    description: "Mentions legales du site Radio Taxi Le Havre.",
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
            Les textes, visuels et contenus publies sur ce site sont proteges par le droit d'auteur.
            Toute reutilisation, totale ou partielle, necessite un accord prealable.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Donnees personnelles</h2>
          <p className="text-muted-foreground">
            Les donnees recueillies via le formulaire de contact sont utilisees uniquement pour traiter votre demande.
            Conformement au RGPD, vous pouvez demander l'acces, la rectification ou la suppression de vos donnees
            en contactant {LEGAL_ENTITY_NAME}.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default MentionsLegales;
