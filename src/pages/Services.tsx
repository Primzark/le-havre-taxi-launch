import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Car, Plane, Ship, Stethoscope, GraduationCap, Users, Briefcase } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { normalizeSearchText, tokenizeSearchText } from "@/utils/menu-search";

const vehicles = [
  "Berline (Peugeot 508, etc.)",
  "Monospace",
  "Van (Ford Tourneo Custom)",
  "Véhicule adapté PMR",
];

const services = [
  {
    icon: Stethoscope,
    title: "Transport médical",
    description: "Prise en charge pour vos rendez-vous médicaux, hospitalisations et transports assis professionnalisés.",
  },
  {
    icon: Plane,
    title: "Transferts aéroport & gare",
    description: "Transferts vers et depuis les aéroports de Paris (CDG, Orly), Deauville, ainsi que la gare du Havre.",
  },
  {
    icon: Ship,
    title: "Transport Maritimes et croisières",
    description:
      "Un service exclusif pour les voyageurs en escale maritime dans notre belle ville ! Grâce à nos badges spécifiques, nous avons accès à l'ensemble des terminaux notre vaste zone portuaire jusqu'au nouveau terminal croisière. Nos taxis assurent votre prise en charge sur le quai, garantissant un service de proximité, rapide et sans contrainte pour vos transferts.",
  },
  {
    icon: Briefcase,
    title: "Transport professionnel",
    description: "Déplacements professionnels, conventions et séminaires. Facturation entreprise disponible.",
  },
  {
    icon: Users,
    title: "Transport de groupes",
    description: "Véhicules spacieux pour vos déplacements en famille ou entre amis, jusqu'à 8 passagers.",
  },
  {
    icon: GraduationCap,
    title: "Événements & loisirs",
    description: "Mariages, soirées, événements sportifs : nous assurons votre transport en toute sérénité.",
  },
];

const scoreTokens = (value: string, tokens: string[]): number => {
  const normalizedValue = normalizeSearchText(value);

  return tokens.reduce((score, token) => {
    if (normalizedValue.includes(token)) {
      return score + 2;
    }

    const hasPrefixMatch = normalizedValue.split(" ").some((word) => word.startsWith(token) || token.startsWith(word));
    return hasPrefixMatch ? score + 1 : score;
  }, 0);
};

const matchesSearch = (value: string, tokens: string[]): boolean => tokens.every((token) => normalizeSearchText(value).includes(token));

const Services = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const tokens = useMemo(() => tokenizeSearchText(query), [query]);
  const hasFilter = tokens.length > 0;

  const filteredServices = useMemo(() => {
    if (!hasFilter) {
      return services;
    }

    return services.filter((service) => matchesSearch(`${service.title} ${service.description}`, tokens));
  }, [hasFilter, tokens]);

  const filteredVehicles = useMemo(() => {
    if (!hasFilter) {
      return vehicles;
    }

    return vehicles.filter((vehicle) => matchesSearch(vehicle, tokens));
  }, [hasFilter, tokens]);

  const serviceSuggestions = useMemo(() => {
    if (!hasFilter || filteredServices.length > 0) {
      return [];
    }

    return services
      .map((service) => ({
        title: service.title,
        score: scoreTokens(`${service.title} ${service.description}`, tokens),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.title);
  }, [filteredServices.length, hasFilter, tokens]);

  useSEO({
    title: "Services",
    description: "Transport médical, transferts gare et aéroport, transport maritimes et croisières, déplacements professionnels et groupes.",
    canonicalPath: "/services",
  });

  return (
    <Layout>
      <PageHero title="Nos services" subtitle="Une gamme complète de services de transport adaptés à tous vos besoins." />

      {hasFilter && (
        <section className="bg-muted/40 border-b py-5">
          <div className="container flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              Filtre actif sur les services: <span className="font-medium">&quot;{query}&quot;</span>
            </p>
            <Link to="/services" className="text-sm text-primary hover:underline">
              Effacer le filtre
            </Link>
          </div>
        </section>
      )}

      {/* Services grid */}
      <section className="py-16">
        <div className="container">
          {filteredServices.length === 0 ? (
            <div className="rounded-xl border bg-card p-6">
              <p className="font-heading font-semibold">Aucun service ne correspond a votre recherche.</p>
              {serviceSuggestions.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Suggestions proches: {serviceSuggestions.join(", ")}.
                </p>
              )}
              <Link to="/services" className="inline-block mt-3 text-sm text-primary hover:underline">
                Afficher tous les services
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((s) => (
                <div key={s.title} className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition">
                  <div className="bg-accent rounded-lg p-3 w-fit mb-4">
                    <s.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h2 className="font-heading font-semibold text-lg mb-2">{s.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Vehicles */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-center">Notre flotte de véhicules</h2>
          {filteredVehicles.length === 0 ? (
            <p className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
              Aucun vehicule ne correspond a votre filtre actuel.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {filteredVehicles.map((v) => (
                <div key={v} className="bg-card rounded-xl p-5 border text-center shadow-sm">
                  <Car className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <p className="font-heading font-medium text-sm">{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
