import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/use-seo";
import { PRIMARY_DOMAIN, SITE_NAME } from "@/config/site";

type LegacyReview = {
  company: string;
  quote: string;
  author: string;
  avatar: string;
};

const tripAdvisorReviews: LegacyReview[] = [
  {
    company: "TripAdvisor",
    quote:
      "Excellent company, this company is very good service on time pickup and driver very professorial cab need and clean best price",
    author: "Jordanam227",
    avatar: "/images/review-tripadvisor-jordanam227.png",
  },
  {
    company: "TripAdVisor",
    quote: "Wonderful driver made a wonderful day !",
    author: "Jeani A",
    avatar: "/images/review-tripadvisor-jeania.png",
  },
];

const Entreprise = () => {
  useSEO({
    title: "Entreprise",
    description: "SCA Radio Taxi Le Havre : 112 véhicules, 35 stations et une centrale active 365 jours sur 365.",
    canonicalPath: "/entreprise",
    ogImage: "/images/entreprise-legacy-hero.png",
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
        title="À propos de nous"
        subtitle="Services personnalisés aux particuliers et aux entreprises, services d'assistance aux personnes à mobilité réduite ou bien circuits touristiques."
        backgroundImage="/images/entreprise-legacy-hero.png"
      />

      <section className="bg-neutral-900 py-16 text-white">
        <div className="container max-w-6xl grid gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-start">
          <div>
            <h2 className="font-heading mb-6 text-2xl font-bold">À propos de nous</h2>
            <p className="leading-relaxed text-white/90">
              Services personnalisés aux particuliers et aux entreprises, services d'assistance aux
              personnes à mobilité réduite ou bien circuits touristiques, avec une flotte de 112
              véhicules de 4 à 8 places (berlines, break et monospaces), les Taxis du Havre
              répondent à vos nombreuses demandes 365 jours sur 365. La satisfaction de nos clients
              est pour nous une exigence constante. Nos 35 stations nous permettent de répondre à
              votre demande dans les meilleurs délais. De plus, nous avons des des chauffeurs qui
              maîtrisent l'anglais, l'espagnol, l'allemand, le portugais, l'arabe, le russe et le
              japonais.
            </p>
          </div>
          <div className="space-y-4">
            <img
              src="/images/entreprise-circuit-lehavre-hdv.jpg"
              alt="Vue du Havre"
              className="w-full rounded-xl border border-white/20 object-cover shadow-sm"
            />
            <img
              src="/images/entreprise-ancien-logo.png"
              alt="Logo Taxi Le Havre"
              className="mx-auto w-full max-w-[220px] rounded-xl border border-white/20 bg-white p-3 shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-heading mb-6 text-2xl font-bold">Engagement global</h2>
          <p className="text-muted-foreground leading-relaxed">
            «Parce que nous connaissons bien nos clients et leurs besoins spécifiques que vous soyez
            un utilisateur occasionnel ou régulier du taxi, nous mettons tout en œuvre pour vous
            satisfaire.» Créée en 1960 la Société Coopérative des Artisans Radio-Taxis du Havre
            forte de ses 130 artisans hommes et femmes, assistés de quatre opératrices gérant le
            centre d'appel et une secrétaire, est en constante évolution. L'investissement dans les
            nouvelles technologies (centre d'appel avec 30000 appels pas mois), la formation
            continue des chauffeurs, la recherche et la mise en place de nouveaux services sont la
            preuve d'un dynamisme incontestable. Notre objectif constant est la réalisation de
            prestations de qualité malgré la variablilté fréquente de nos appels. Les Radio-Taxis
            du Havre, un groupement qui fonde ses relations commerciales sur l'efficacité, la
            disponibilité et la réactivité.
          </p>
        </div>
      </section>

      <section className="border-t py-16">
        <div className="container max-w-5xl">
          <h2 className="font-heading text-center text-2xl font-bold">Quelques avis sur nos taxis</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {tripAdvisorReviews.map((review) => (
              <article key={review.author} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="h-16 w-16 rounded-full border object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-semibold text-primary">{review.company}</p>
                    <p className="text-xs text-muted-foreground">Avis client</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{review.quote}</p>
                <p className="mt-4 font-semibold">{review.author}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://taxis-lehavre.com/testimonials-archive/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-md border border-primary/35 bg-primary px-5 py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Les voir tous
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Entreprise;
