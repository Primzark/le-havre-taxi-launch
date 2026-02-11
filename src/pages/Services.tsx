import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Car, Plane, Ship, Stethoscope, GraduationCap, Users, Briefcase } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const vehicles = [
  "Berline (Peugeot 508, etc.)",
  "Monospace",
  "Van (Ford Tourneo Custom)",
  "Vehicule adapte PMR",
];

const services = [
  {
    icon: Stethoscope,
    title: "Transport médical",
    description: "Rendez-vous, hospitalisations ou retour a domicile : nous organisons vos trajets assis en toute tranquillite.",
  },
  {
    icon: Plane,
    title: "Transferts aéroport & gare",
    description: "Depart ou arrivee : gares locales, aeroport de Deauville, Paris CDG et Orly.",
  },
  {
    icon: Ship,
    title: "Croisieres et port",
    description:
      "Nos chauffeurs habilites accedent aux terminaux du port du Havre pour une prise en charge directe au quai.",
  },
  {
    icon: Briefcase,
    title: "Transport professionnel",
    description: "Rendez-vous clients, conventions, seminaires : un service fiable avec facturation entreprise.",
  },
  {
    icon: Users,
    title: "Transport de groupes",
    description: "Famille, amis, equipes : des vehicules spacieux pour voyager ensemble, jusqu'a 8 passagers.",
  },
  {
    icon: GraduationCap,
    title: "Événements & loisirs",
    description: "Mariage, concert, match ou soiree : on vous depose et on vous recupere au bon moment.",
  },
];

const Services = () => {
  useSEO({
    title: "Services",
    description: "Transport medical, transferts gare et aeroport, prises en charge croisiere, trajets pros et transport de groupes.",
    canonicalPath: "/services",
  });

  return (
    <Layout>
      <PageHero title="Nos services" subtitle="Des solutions concretes pour vos trajets du quotidien comme pour les deplacements exceptionnels." />

      {/* Services grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
