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
            touristType: "Tour privé en taxi",
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
          title: "Circuit non trouvé",
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
      <section className="relative overflow-hidden text-primary-foreground">
        <img
          src={tour.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/86 to-primary/72" />
        <div className="tour-orb tour-orb--one" aria-hidden="true" />
        <div className="tour-orb tour-orb--two" aria-hidden="true" />

        <div className="container relative py-16 md:py-20">
          <Link to="/circuits-touristiques" className="mb-4 inline-flex items-center gap-1 text-sm opacity-85 transition hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> Tous les circuits
          </Link>
          <span className="inline-flex rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Circuit privé
          </span>
          <h1 className="mt-3 font-heading text-3xl font-extrabold md:text-4xl">
            N°{tour.id} — {tour.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm md:text-base">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/20 px-3 py-1.5">
              <Clock className="h-4 w-4" />
              {tour.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/20 px-3 py-1.5">
              <Euro className="h-4 w-4" />
              {tour.price} €
            </span>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="tour-section-bg" aria-hidden="true" />
        <div className="tour-orb tour-orb--three" aria-hidden="true" />

        <div className="container relative max-w-3xl">
          <div className="tour-card-enter rounded-2xl border bg-card/95 p-6 shadow-[0_18px_40px_-22px_hsl(var(--primary)/0.55)] backdrop-blur-sm md:p-8">
            <div className="mb-8 overflow-hidden rounded-xl border">
              <img
                src={tour.image}
                alt={`Circuit ${tour.name}`}
                className="aspect-video w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="mb-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Durée : {tour.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                <span className="font-heading text-xl font-bold text-primary">{tour.price} €</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              Profitez de {tour.name} avec un chauffeur qui connaît parfaitement la région. Vous avancez à votre rythme, sans contrainte de stationnement ni stress de circulation.
            </p>

            <p className="text-sm text-muted-foreground border-t pt-4">
              Tarif valable pour 1 à 4 personnes, hors suppléments éventuels. Entrées de musées, repas et autres frais personnels non inclus.
            </p>
          </div>

          <div className="tour-card-enter text-center mt-8" style={{ animationDelay: "120ms" }}>
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
