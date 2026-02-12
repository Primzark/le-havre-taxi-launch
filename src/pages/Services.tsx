import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Car, Plane, Ship, Stethoscope, GraduationCap, Users, Briefcase } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const vehicles = [
  "Flotte de 125 vehicules de 4 a 8 places",
  "Berlines, break et monospaces",
  "Vehicules discrets, confortables et entretenus",
  "6 taxis equipes pour la mobilite reduite",
];

const services = [
  {
    icon: Plane,
    title: "Navette aeroport",
    description:
      "Pour tous vos deplacements professionnels ou prives, nous assurons les transferts de/vers les aeroports (Paris, Le Havre, Deauville, Rouen). Reservation de 1 a 8 personnes.",
  },
  {
    icon: Car,
    title: "Mariage",
    description:
      "Location de voiture avec chauffeur pour vos grandes occasions. Vehicules de standing et prestation personnalisee pour vos evenements.",
  },
  {
    icon: Stethoscope,
    title: "Transport sanitaire",
    description:
      "Transport medical en taxi conventionne avec prise en charge ALD, carte vitale et prescription medicale. Vous ne faites pas l'avance des frais selon votre dossier.",
  },
  {
    icon: Briefcase,
    title: "Classe affaire",
    description:
      "Service VIP pour prestations evenementielles, voyages d'affaires et visites touristiques : chauffeurs selectionnes, vehicules haut de gamme et accueil personnalise.",
  },
  {
    icon: GraduationCap,
    title: "Transport scolaire",
    description:
      "Accompagnement sur mesure et securise des enfants, du domicile a leur destination, avec possibilite de retour et prise en charge des activites extrascolaires.",
  },
  {
    icon: Ship,
    title: "Transport professionnel et entreprise",
    description:
      "Facturation entreprise, transferts gares/aeroports, transport de groupes jusqu'a 8 personnes, transport de plis urgents et transport de personnel.",
  },
  {
    icon: Users,
    title: "Personne a mobilite reduite",
    description:
      "Taxis equipes de rampes manuelles, chauffeurs sensibilises et accompagnement jusqu'a la porte de votre domicile.",
  },
];

const Services = () => {
  useSEO({
    title: "Services",
    description: "Services historiques Taxi Le Havre : aeroport, mariage, sanitaire, classe affaire, scolaire, entreprise et PMR.",
    canonicalPath: "/services",
  });

  return (
    <Layout>
      <PageHero title="Nos services" subtitle="Services personnalises aux particuliers et aux entreprises, 365 jours sur 365." />

      {/* Services grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition">
                <div className="bg-accent rounded-lg p-3 w-fit mb-4">
                  <s.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h2 className="font-heading font-semibold text-lg mb-2">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm mt-8 max-w-3xl">
            Nos tarifs sont fixes et forfaitaires, convenus a l'avance et sans aucune surtaxe. En cas de bouchons ou
            d'evenements, les prix ne changent pas.
          </p>
        </div>
      </section>

      {/* Vehicles */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-center">Notre flotte</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {vehicles.map((v) => (
              <div key={v} className="bg-card rounded-xl p-5 border text-center shadow-sm">
                <Car className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="font-heading font-medium text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
