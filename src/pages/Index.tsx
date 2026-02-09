import { Link } from "react-router-dom";
import { Phone, Clock, Users, Car, MapPin, Star, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const stats = [
  { icon: Clock, label: "Création", value: "1976" },
  { icon: Car, label: "Taxis dans le groupement", value: "115" },
  { icon: Clock, label: "Disponibilité", value: "24h/7j" },
  { icon: Users, label: "Courses distribuées en 2024", value: "101 000" },
];

const features = [
  {
    icon: MapPin,
    title: "Station à proximité",
    description: "Localisez la station de taxi la plus proche de vous en un instant.",
  },
  {
    icon: Car,
    title: "Réservation facile",
    description: "Réservez un taxi rapidement par téléphone ou via notre application.",
  },
  {
    icon: Star,
    title: "Service de qualité",
    description: "Des chauffeurs professionnels pour un transport confortable et sûr.",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="container relative py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Votre taxi au Havre,{" "}
              <span className="text-secondary">24h/24</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
              Radio Taxi Le Havre, votre partenaire transport depuis 1976. 115 taxis à votre service, 7 jours sur 7.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-heading font-semibold" asChild>
                <a href="tel:+33235250101">
                  <Phone className="h-5 w-5 mr-2" /> 02 35 25 01 01
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-heading" asChild>
                <Link to="/contact">
                  <MapPin className="h-5 w-5 mr-2" /> Trouver une station
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-secondary text-secondary-foreground py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading font-extrabold text-2xl md:text-3xl">{stat.value}</p>
                <p className="text-sm font-medium opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">Un service de qualité</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Une flotte de 115 taxis, 35 stations et un standard disponible 24h/24.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-xl p-6 shadow-sm border hover:shadow-md transition">
                <div className="bg-accent rounded-lg p-3 w-fit mb-4">
                  <f.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App download CTA */}
      <section id="app-download" className="bg-muted py-16 md:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Download className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">Téléchargez notre application</h2>
            <p className="text-muted-foreground mb-6">
              Commandez votre taxi en quelques clics depuis votre smartphone.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <a href="#">[Apple App Store - URL À FOURNIR]</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#">[Google Play Store - URL À FOURNIR]</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/circuits-touristiques" className="group bg-card border rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                Circuits touristiques <ArrowRight className="inline h-4 w-4 ml-1" />
              </h3>
              <p className="text-muted-foreground text-sm">13 circuits découverte pour explorer la Normandie.</p>
            </Link>
            <Link to="/tarifs" className="group bg-card border rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                Nos tarifs <ArrowRight className="inline h-4 w-4 ml-1" />
              </h3>
              <p className="text-muted-foreground text-sm">Consultez nos tarifs et circuits touristiques.</p>
            </Link>
            <Link to="/services" className="group bg-card border rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                Nos services <ArrowRight className="inline h-4 w-4 ml-1" />
              </h3>
              <p className="text-muted-foreground text-sm">Transport médical, aéroport, maritime et plus.</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
