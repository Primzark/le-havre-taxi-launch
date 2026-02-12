import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { toursData } from "@/data/tours";
import { ArrowLeft, Clock, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { PRIMARY_DOMAIN, SITE_NAME } from "@/config/site";

const TourDetail = () => {
  const { id } = useParams();
  const tour = toursData.find((t) => t.id === Number(id));

  useSEO(
    tour
      ? {
          title: `Circuit ${tour.name}`,
          description: `Circuit N°${tour.id} ${tour.name}, durée ${tour.duration}, tarif ${tour.price} € (1 à 4 personnes).`,
          canonicalPath: `/circuits-touristiques/${tour.id}`,
          ogImage: tour.image,
          keywords: [
            "circuit touristique le havre",
            `${tour.name.toLowerCase()} taxi`,
            `excursion ${tour.name.toLowerCase()} depuis le havre`,
          ],
          breadcrumbs: [
            { name: "Accueil", path: "/" },
            { name: "Circuits touristiques", path: "/circuits-touristiques" },
            { name: tour.name, path: `/circuits-touristiques/${tour.id}` },
          ],
          structuredData: {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: `Circuit ${tour.id} ${tour.name}`,
            description: `Circuit touristique ${tour.name} depuis Le Havre`,
            touristType: "Tour prive en taxi",
            itinerary: {
              "@type": "Place",
              name: tour.name,
            },
            offers: {
              "@type": "Offer",
              price: tour.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: `${PRIMARY_DOMAIN}/circuits-touristiques/${tour.id}`,
            },
            image: `${PRIMARY_DOMAIN}${tour.image}`,
            provider: {
              "@type": "LocalBusiness",
              name: SITE_NAME,
              url: PRIMARY_DOMAIN,
            },
          },
        }
      : {
          title: "Circuit non trouve",
          description: "Ce circuit touristique n'existe pas.",
          canonicalPath: "/circuits-touristiques",
          robots: "noindex, follow",
        },
  );

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
              Profitez de {tour.name} avec un chauffeur qui connait parfaitement la region. Vous avancez a votre rythme, sans contrainte de stationnement ni stress de circulation.
            </p>

            <p className="text-sm text-muted-foreground border-t pt-4">
              Tarif valable pour 1 a 4 personnes, hors supplements eventuels. Entrees de musees, repas et autres frais personnels non inclus.
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
