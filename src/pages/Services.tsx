import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Car, Plane, Ship, Stethoscope, GraduationCap, Users, Briefcase } from "lucide-react";

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

const Services = () => {
  return (
    <Layout>
      <PageHero title="Nos services" subtitle="Une gamme complète de services de transport adaptés à tous vos besoins." />

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
          <h2 className="font-heading font-bold text-2xl md:text-3xl mb-8 text-center">Notre flotte de véhicules</h2>
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
