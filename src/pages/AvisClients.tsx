import { Link } from "react-router-dom";
import { CheckCircle2, Phone, Star } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { clientReviews } from "@/data/reviews";
import { useSEO } from "@/hooks/use-seo";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
  PRIMARY_DOMAIN,
  SITE_NAME,
} from "@/config/site";

const AvisClients = () => {
  const sources = Array.from(new Set(clientReviews.map((review) => review.source)));

  useSEO({
    title: "Avis clients",
    description:
      "Consultez les avis clients Radio Taxi Le Havre : retours Google, Pages Jaunes et TripAdvisor.",
    canonicalPath: "/avis-clients",
    ogImage: "/images/services/transport-entreprise.webp",
    keywords: [
      "avis taxi le havre",
      "temoignages taxi le havre",
      "tripadvisor taxi le havre",
      "avis google taxi le havre",
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Avis clients ${SITE_NAME}`,
      itemListElement: clientReviews.map((review, index) => ({
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
        itemReviewed: {
          "@type": "LocalBusiness",
          name: SITE_NAME,
          url: `${PRIMARY_DOMAIN}/avis-clients`,
        },
      })),
    },
  });

  return (
    <Layout>
      <PageHero
        title="Avis clients"
        subtitle="Les retours publiés sur nos services, regroupés sur une page unique pour une lecture rapide."
        backgroundImage="/images/services/transport-entreprise.webp"
      />

      <section className="py-12">
        <div className="container max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Avis publiés</p>
              <p className="mt-2 text-2xl font-extrabold">{clientReviews.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Plateformes</p>
              <p className="mt-2 text-2xl font-extrabold">{sources.length}</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Service</p>
              <p className="mt-2 inline-flex items-center gap-2 text-2xl font-extrabold text-primary">
                <CheckCircle2 className="h-5 w-5" />
                24h/24
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {clientReviews.map((review) => (
              <article key={review.id} className="rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="h-14 w-14 rounded-full border object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{review.source}</p>
                    <p className="font-semibold">{review.author}</p>
                  </div>
                </div>

                <p className="mt-4 leading-relaxed text-muted-foreground">{review.quote}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  <Star className="h-4 w-4 fill-current" />
                  Avis publié
                </p>
              </article>
            ))}
          </div>

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
