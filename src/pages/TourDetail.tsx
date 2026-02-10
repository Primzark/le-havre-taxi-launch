import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { toursData } from "@/data/tours";
import { ArrowLeft, Clock, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";

const TourDetail = () => {
  const { id } = useParams();
  const tour = toursData.find((t) => t.id === Number(id));

  useSEO({
    title: tour ? `Circuit ${tour.name}` : "Circuit non trouvé",
    description: tour
      ? `Circuit N°${tour.id} ${tour.name}, durée ${tour.duration}, tarif ${tour.price} € (1 à 4 personnes).`
      : "Ce circuit touristique n'existe pas.",
    canonicalPath: tour ? `/circuits-touristiques/${tour.id}` : "/circuits-touristiques",
  });

  if (!tour) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading font-bold text-2xl mb-4">Circuit non trouvé</h1>
          <Button asChild><Link to="/circuits-touristiques">Retour aux circuits</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <Link to="/circuits-touristiques" className="inline-flex items-center gap-1 text-sm opacity-80 hover:opacity-100 mb-4 transition">
            <ArrowLeft className="h-4 w-4" /> Tous les circuits
          </Link>
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl">
            N°{tour.id} — {tour.name}
          </h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="bg-card rounded-xl border p-8 shadow-sm">
            <img
              src={tour.image}
              alt={`Circuit ${tour.name}`}
              className="aspect-video w-full object-cover rounded-lg mb-8"
              loading="lazy"
            />

            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Durée : {tour.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                <span className="font-heading font-bold text-xl text-primary">{tour.price} €</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              Découvrez {tour.name} avec nos chauffeurs professionnels. Un circuit confortable et enrichissant pour découvrir les trésors de la Normandie.
            </p>

            <p className="text-sm text-muted-foreground border-t pt-4">
              Price for 1 to 4 people, excluding additional costs (additional passengers and luggage). Museum entrance fees, meals, etc. are not included in the price.
            </p>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <a href="tel:+33235250101">Réserver ce circuit</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TourDetail;
