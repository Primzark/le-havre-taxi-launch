import { Link } from "react-router-dom";
import { CheckCircle2, MessageSquareQuote, Phone, Star } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import ClientReviewCard from "@/components/ClientReviewCard";
import { Button } from "@/components/ui/button";
import { useClientReviews } from "@/hooks/use-client-reviews";
import { useSEO } from "@/hooks/use-seo";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
  PRIMARY_DOMAIN,
  SITE_NAME,
} from "@/config/site";

const formatRatingValue = (value: number | null) => {
  if (value === null) {
    return "4+/5";
  }

  return `${value.toFixed(1)}/5`;
};

const formatCount = (value: number | null, fallback: number) => {
  if (value === null) {
    return fallback.toString();
  }

  return value.toLocaleString("fr-FR");
};

const AvisClients = () => {
  const { data: reviewsData } = useClientReviews();
  const reviews = reviewsData.reviews;

  useSEO({
    title: "Avis clients",
    description:
      "Consultez les avis Google de Radio Taxi Le Havre et retrouvez les retours publiés sur notre fiche établissement.",
    canonicalPath: "/avis-clients",
    ogImage: "/images/services/transport-entreprise.webp",
    keywords: [
      "avis taxi le havre",
      "avis google taxi le havre",
      "google reviews taxi le havre",
      "temoignages taxi le havre",
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Avis clients ${SITE_NAME}`,
      itemListElement: reviews.map((review, index) => ({
        "@type": "Review",
        position: index + 1,
        author: {
          "@type": "Person",
          name: review.author,
        },
        reviewBody: review.quote,
        publisher: {
          "@type": "Organization",
          name: review.source,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.rating,
          bestRating: 5,
        },
        itemReviewed: {
          "@type": "LocalBusiness",
          name: reviewsData.placeName || SITE_NAME,
          url: reviewsData.googleMapsUri || `${PRIMARY_DOMAIN}/avis-clients`,
        },
      })),
    },
  });

  return (
    <Layout>
      <PageHero
        title="Avis clients"
        subtitle="Retrouvez une sélection d'avis Google récents publiés sur la fiche Radio Taxi Le Havre."
        backgroundImage="/images/services/transport-entreprise.webp"
      />

      <section className="py-12">
        <div className="container max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Note Google</p>
              <p className="mt-2 inline-flex items-center gap-2 text-2xl font-extrabold text-primary">
                <Star className="h-5 w-5 fill-current" />
                {formatRatingValue(reviewsData.rating)}
              </p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Avis affichés</p>
              <p className="mt-2 text-2xl font-extrabold">{reviews.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Avis Google</p>
              <p className="mt-2 inline-flex items-center gap-2 text-2xl font-extrabold">
                <MessageSquareQuote className="h-5 w-5 text-primary" />
                {formatCount(reviewsData.userRatingCount, reviews.length)}
              </p>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {reviews.map((review) => (
                <ClientReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-heading text-2xl font-bold">Aucun avis à afficher pour le moment</h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground leading-relaxed">
                La fiche Google est prête à être consultée dès qu'un nouvel avis correspond aux critères d'affichage du site.
              </p>
            </div>
          )}

          <div className="mt-10 rounded-xl border bg-muted/45 p-5">
            <p className="text-sm text-muted-foreground">
              Vous souhaitez un chiffrage précis pour votre trajet ? Notre centrale vous répond
              immédiatement selon votre départ, votre horaire et vos contraintes.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`tel:${CONTACT_PHONE_LINK}`}>
                  <Phone className="h-4 w-4" />
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </Button>
              {reviewsData.googleMapsUri && (
                <Button asChild variant="outline">
                  <a href={reviewsData.googleMapsUri} target="_blank" rel="noopener noreferrer">
                    <Star className="h-4 w-4" />
                    Voir la fiche Google
                  </a>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link to="/entreprise">Retour à la page entreprise</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AvisClients;
