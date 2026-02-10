import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Clock, Users, Car, MapPin, Star, Download, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { APPLE_STORE_URL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_LINK, PLAY_STORE_URL } from "@/config/site";
import { useSEO } from "@/hooks/use-seo";
import { useToast } from "@/hooks/use-toast";
import {
  MenuSearchSuggestion,
  MENU_SEARCH_QUICK_LINKS,
  resolveMenuSearch,
} from "@/utils/menu-search";

const stats = [
  { icon: Clock, label: "Création", value: "1976" },
  { icon: Car, label: "Taxis dans le groupement", value: "115" },
  { icon: Clock, label: "Disponibilité", value: "24h/7j" },
  { icon: Users, label: "Courses distribuées en 2024", value: "101 000" },
];

const appFeatures = [
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

const homeSlides = [
  {
    title: "Mairie du Havre",
    image: "/images/home-mairie.jpg",
  },
  {
    title: "Bassin du Commerce",
    image: "/images/home-bassin-commerce.jpg",
  },
  {
    title: "Pont de Normandie",
    image: "/images/home-pont-normandie.jpg",
  },
  {
    title: "La Catène de containers",
    image: "/images/home-catene.jpg",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [searchFeedback, setSearchFeedback] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<MenuSearchSuggestion[]>(MENU_SEARCH_QUICK_LINKS);

  useSEO({
    title: "Accueil",
    description:
      "Taxi Le Havre: 115 taxis, 35 stations, service 24h/24 et 7j/7. Réservez votre course et consultez nos tarifs.",
    canonicalPath: "/",
  });

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const interval = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [carouselApi]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = resolveMenuSearch(query);

    if (!result.route || !result.autoNavigate) {
      setSearchFeedback(result.message);
      setSearchSuggestions(result.suggestions);
      toast({
        title: "Recherche a preciser",
        description: `${result.message} Suggestions: ${result.suggestions.map((item) => item.label).join(", ")}.`,
        variant: "destructive",
      });
      return;
    }

    setSearchFeedback("");
    setSearchSuggestions(MENU_SEARCH_QUICK_LINKS);
    navigate(result.destination ?? result.route);
  };

  const handleSuggestionClick = (suggestion: MenuSearchSuggestion) => {
    const resolvedSuggestion = resolveMenuSearch(suggestion.example);
    setSearchFeedback("");
    setSearchSuggestions(MENU_SEARCH_QUICK_LINKS);
    setQuery(suggestion.example);
    navigate(resolvedSuggestion.destination ?? suggestion.route);
  };

  return (
    <Layout>
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="container relative py-14 md:py-20">
          <div className="max-w-2xl">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-5 leading-tight">
              Votre taxi au Havre,{" "}
              <span className="text-secondary">24h/24</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-7 leading-relaxed">
              Radio Taxi Le Havre, votre partenaire transport depuis 1976. 115 taxis à votre service, 7 jours sur 7.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-heading font-semibold" asChild>
                <a href={`tel:${CONTACT_PHONE_LINK}`}>
                  <Phone className="h-5 w-5 mr-2" /> {CONTACT_PHONE_DISPLAY}
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

      <section className="bg-card border-b py-6">
        <div className="container">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
            <label htmlFor="home-search" className="sr-only">Rechercher</label>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full h-11 rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Rechercher un service, un tarif, une station ou un circuit"
              />
            </div>
            <Button type="submit" className="h-11 px-7">Rechercher</Button>
          </form>
          <p className="max-w-3xl mx-auto mt-2 text-xs text-muted-foreground">
            Exemples: service medical, tarif 2025, station proche, circuit etretat.
          </p>
          {searchFeedback && (
            <p className="max-w-3xl mx-auto mt-2 text-sm text-destructive" role="status" aria-live="polite">
              {searchFeedback}
            </p>
          )}
          <div className="max-w-3xl mx-auto mt-3 flex flex-wrap gap-2">
            {searchSuggestions.map((suggestion) => (
              <Button
                key={suggestion.route}
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary text-secondary-foreground py-3.5">
        <div className="container">
          <a
            href={`tel:${CONTACT_PHONE_LINK}`}
            className="flex items-center justify-center gap-2 text-sm md:text-base font-heading font-bold"
          >
            <Phone className="h-4 w-4" />
            Appelez-nous directement : {CONTACT_PHONE_DISPLAY}
          </a>
        </div>
      </section>

      <section className="py-6 bg-background">
        <div className="container">
          <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
            <CarouselContent className="ml-0">
              {homeSlides.map((slide) => (
                <CarouselItem key={slide.title} className="pl-0">
                  <div className="relative overflow-hidden rounded-xl border shadow-sm">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-[300px] sm:h-[380px] md:h-[480px] object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <p className="absolute bottom-4 left-4 text-white font-heading font-semibold text-base md:text-lg">
                      {slide.title}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">Fonctionnalités de l'application</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Commandez votre taxi en quelques secondes et trouvez rapidement la station la plus proche.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {appFeatures.map((f) => (
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

      <section className="bg-secondary text-secondary-foreground py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading font-extrabold text-2xl md:text-3xl">{stat.value}</p>
                <p className="text-sm font-medium opacity-85">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <img
                src="/images/service-station.jpg"
                alt="Station de taxi au Havre"
                className="w-full h-[340px] md:h-[420px] object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">Un service de qualité</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Une flotte de 115 taxis, 35 stations et un standard disponible 24h/24 pour assurer vos déplacements.
              </p>
              <Button size="lg" asChild>
                <Link to="/services">Découvrir nos services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="app-download" className="bg-muted py-16 md:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <Download className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">Téléchargez notre application</h2>
            <p className="text-muted-foreground mb-6">
              Commandez votre taxi en quelques clics depuis votre smartphone.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/google-play-badge.png"
                  alt="Télécharger sur Google Play"
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                />
              </a>
              <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/apple-store-badge.png"
                  alt="Télécharger sur l'App Store"
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

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
