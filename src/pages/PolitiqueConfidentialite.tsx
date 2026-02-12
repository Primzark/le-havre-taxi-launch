import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";

const PolitiqueConfidentialite = () => {
  useSEO({
    title: "Politique de confidentialité",
    description: "Politique de confidentialité et traitement des données personnelles de Radio Taxi Le Havre.",
    canonicalPath: "/politique-confidentialite",
    robots: "index, follow",
    ogImage: "/images/home-pont-normandie.webp",
    keywords: [
      "politique confidentialité taxi le havre",
      "rgpd taxi le havre",
      "données personnelles taxi le havre",
    ],
  });

  return (
    <Layout>
      <PageHero title="Politique de confidentialité" backgroundImage="/images/home-pont-normandie.webp" />
      <section className="py-16">
        <div className="container max-w-3xl prose prose-sm">
          <h2 className="font-heading font-bold text-xl mb-4">Collecte des données</h2>
          <p className="text-muted-foreground mb-6">
            Nous recueillons uniquement les informations que vous nous transmettez volontairement via le formulaire :
            nom, email, téléphone et message. Ces données servent exclusivement à répondre à votre demande.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Utilisation des données</h2>
          <p className="text-muted-foreground mb-6">
            Vos données personnelles ne sont ni vendues, ni louées, ni cédées à des tiers.
            Elles sont conservées le temps strictement nécessaire au suivi de votre demande.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Vos droits</h2>
          <p className="text-muted-foreground mb-6">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès,
            de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits,
            contactez-nous au 02 35 25 01 01 ou via notre formulaire de contact.
          </p>

          <h2 className="font-heading font-bold text-xl mb-4">Cookies</h2>
          <p className="text-muted-foreground">
            Ce site n'utilise pas de cookies publicitaires ou de suivi. Seuls des cookies techniques indispensables
            au bon fonctionnement peuvent être utilisés.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PolitiqueConfidentialite;
