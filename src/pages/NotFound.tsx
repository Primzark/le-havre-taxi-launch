import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";

const NotFound = () => {
  useSEO({
    title: "Page introuvable",
    description: "La page demandee est introuvable. Revenez a l'accueil Radio Taxi Le Havre.",
    canonicalPath: "/404",
    robots: "noindex, follow",
    breadcrumbs: false,
  });

  return (
    <Layout>
      <section className="py-24 bg-muted/50">
        <div className="container max-w-2xl text-center">
          <p className="text-primary font-heading font-bold text-lg mb-2">Erreur 404</p>
          <h1 className="font-heading font-extrabold text-4xl mb-3">Page introuvable</h1>
          <p className="text-muted-foreground mb-8">
            Le lien que vous avez ouvert n'est plus disponible ou a ete deplace.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild>
              <Link to="/">Retour a l'accueil</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
