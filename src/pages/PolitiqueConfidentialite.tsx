import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";

const PolitiqueConfidentialite = () => {
  useSEO({
    title: "Politique de confidentialite",
    description: "Politique de confidentialite et traitement des donnees personnelles de Radio Taxi Le Havre.",
    canonicalPath: "/politique-confidentialite",
    robots: "index, follow",
    ogImage: "/images/home-pont-normandie.jpg",
    keywords: [
      "politique confidentialite taxi le havre",
      "rgpd taxi le havre",
      "donnees personnelles taxi le havre",
    ],
  });

  return (
    <Layout>
      <PageHero title="Politique de confidentialite" backgroundImage="/images/home-pont-normandie.jpg" />
      <section className="py-16">
        <div className="container max-w-3xl prose prose-sm">
          <h2 className="font-heading font-bold text-xl mb-4">Collecte des donnees</h2>
          <p className="text-muted-foreground mb-6">
            Nous recueillons uniquement les informations que vous nous transmettez volontairement via le formulaire :
            nom, email, telephone et message. Ces donnees servent exclusivement a repondre a votre demande.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Utilisation des donnees</h2>
          <p className="text-muted-foreground mb-6">
            Vos donnees personnelles ne sont ni vendues, ni louees, ni cedees a des tiers.
            Elles sont conservees le temps strictement necessaire au suivi de votre demande.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Vos droits</h2>
          <p className="text-muted-foreground mb-6">
            Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez d'un droit d'acces,
            de rectification, de suppression et de portabilite de vos donnees. Pour exercer ces droits,
            contactez-nous au 02 35 25 01 01 ou via notre formulaire de contact.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Cookies</h2>
          <p className="text-muted-foreground">
            Ce site n'utilise pas de cookies publicitaires ou de suivi. Seuls des cookies techniques indispensables
            au bon fonctionnement peuvent etre utilises.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PolitiqueConfidentialite;
