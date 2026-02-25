import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, Star, Users, type LucideIcon } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { clientReviews } from "@/data/reviews";
import { useSEO } from "@/hooks/use-seo";
import { PRIMARY_DOMAIN, SITE_NAME } from "@/config/site";

type EngagementPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const engagementPoints: EngagementPoint[] = [
  {
    icon: Clock,
    title: "Créée en 1976",
    description:
      "Une coopérative historique au Havre, en évolution continue pour garder un service rapide et fiable.",
  },
  {
    icon: Users,
    title: "115 artisans engagés",
    description:
      "Hommes et femmes de terrain, épaulés par une équipe de dispatch, pour une prise en charge fluide.",
  },
  {
    icon: MapPin,
    title: "35 stations dans l'agglomération",
    description:
      "Une couverture locale dense pour répondre dans les meilleurs délais, de jour comme de nuit.",
  },
  {
    icon: Phone,
    title: "12 500 appels par mois",
    description:
      "Un centre d'appel structuré, capable d'absorber des volumes élevés avec régularité.",
  },
];

const Entreprise = () => {
  const featuredReviews = clientReviews.slice(0, 3);

  useSEO({
    title: "Entreprise",
    description:
      "SCA Radio Taxi Le Havre : 112 véhicules, 35 stations et une organisation disponible 365 jours sur 365 pour vos trajets.",
    canonicalPath: "/entreprise",
    ogImage: "/images/services/transport-entreprise.webp",
    keywords: [
      "entreprise taxi le havre",
      "radio taxi le havre",
      "centrale taxi 24h 24",
      "taxi depuis 1976",
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: `Entreprise ${SITE_NAME}`,
      description: "Présentation de la coopérative Radio Taxi Le Havre",
      url: `${PRIMARY_DOMAIN}/entreprise`,
      inLanguage: "fr-FR",
    },
  });

  return (
    <Layout>
      <PageHero
        title="Notre entreprise"
        subtitle="Services personnalisés aux particuliers et aux entreprises, assistance aux personnes à mobilité réduite et circuits touristiques : une organisation réactive, 365 jours sur 365."
        backgroundImage="/images/services/transport-entreprise.webp"
      />

      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading mb-6 text-2xl font-bold">Qui nous sommes</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Services personnalisés aux particuliers et aux entreprises, services d'assistance aux
            personnes à mobilité réduite ou bien circuits touristiques, avec une flotte de{" "}
            <strong>112 véhicules de 4 à 8 places</strong> (berlines, break et monospaces), les
            Taxis du Havre répondent à vos nombreuses demandes 365 jours sur 365.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            La satisfaction de nos clients est une exigence constante. Avec <strong>35 stations</strong>{" "}
            et des chauffeurs parlant l'anglais, l'espagnol, l'allemand, le portugais, l'arabe, le
            russe et le japonais, nous restons précis, disponibles et efficaces sur chaque trajet.
          </p>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading font-bold text-2xl mb-6">Engagement global</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {engagementPoints.map((point) => (
              <div key={point.title} className="bg-card rounded-xl border p-6 shadow-sm">
                <point.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-heading font-semibold mb-2">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-muted-foreground leading-relaxed italic">
              «Parce que nous connaissons bien nos clients et leurs besoins spécifiques, que vous
              soyez un utilisateur occasionnel ou régulier du taxi, nous mettons tout en œuvre pour
              vous satisfaire.»
            </p>
            <p className="mt-4 text-sm font-semibold text-primary">
              Notre promesse : efficacité, disponibilité et réactivité.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t py-16">
        <div className="container max-w-5xl">
          <h2 className="font-heading text-center text-2xl font-bold">Quelques avis sur nos taxis</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredReviews.map((review) => (
              <article key={review.author} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="h-16 w-16 rounded-full border object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-semibold text-primary">{review.source}</p>
                    <p className="text-xs text-muted-foreground">Avis client</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.quote}</p>
                <p className="mt-4 font-semibold">{review.author}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link to="/avis-clients">
                <Star className="h-4 w-4" />
                Voir tous les avis
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Entreprise;
