import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Clock, Users, Car, MapPin, Star, Download, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import {
  APPLE_STORE_URL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
  PLAY_STORE_URL,
  PRIMARY_DOMAIN,
  SITE_NAME,
} from "@/config/site";
import { useSEO } from "@/hooks/use-seo";
import { useToast } from "@/hooks/use-toast";
import {
  MenuSearchSuggestion,
  MENU_SEARCH_QUICK_LINKS,
  resolveMenuSearch,
} from "@/utils/menu-search";

const stats = [
  { icon: Clock, label: "Depuis", value: "1976" },
  { icon: Car, label: "Taxis dans le réseau", value: "115" },
  { icon: Clock, label: "Service continu", value: "24h/7j" },
  { icon: Users, label: "Courses traitées en 2024", value: "101 000" },
];

const appFeatures = [
  {
    icon: MapPin,
    title: "Une station près de vous",
    description: "Repérez en quelques secondes la station la plus pratique autour de vous.",
  },
  {
    icon: Car,
    title: "Réserver sans attendre",
    description: "Une course se commande rapidement, par téléphone ou depuis l'application.",
  },
  {
    icon: Star,
    title: "Des chauffeurs expérimentés",
    description: "Ponctualité, courtoisie et conduite sereine, au quotidien comme pour les longs trajets.",
  },
];

const homeSlides = [
  {
    title: "Mairie du Havre",
    image: "/images/home-mairie.webp",
  },
  {
    title: "Bassin du Commerce",
    image: "/images/home-bassin-commerce.webp",
  },
  {
    title: "Pont de Normandie",
    image: "/images/home-pont-normandie.webp",
  },
  {
    title: "La Catène de containers",
    image: "/images/home-catene.webp",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [searchFeedback, setSearchFeedback] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<MenuSearchSuggestion[]>(MENU_SEARCH_QUICK_LINKS);

  const homeSEO = useMemo(
    () => ({
      title: "Accueil",
      description:
        "Radio Taxi Le Havre : 115 taxis, 35 stations, service 24h/24 et 7j/7. Réservation immédiate et tarifs clairs.",
      canonicalPath: "/",
      ogImage: "/images/home-pont-normandie.webp",
      keywords: [
        "taxi le havre",
        "radio taxi le havre",
        "taxi 24h 24 le havre",
        "centrale taxi le havre",
        "réservation taxi le havre",
      ],
      breadcrumbs: false as const,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: PRIMARY_DOMAIN,
        inLanguage: "fr-FR",
      },
    }),
    [],
  );

  useSEO(homeSEO);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateActiveSlide = () => {
      setActiveSlideIndex(carouselApi.selectedScrollSnap());
    };

    updateActiveSlide();
    carouselApi.on("select", updateActiveSlide);
    carouselApi.on("reInit", updateActiveSlide);

    const interval = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => {
      window.clearInterval(interval);
      carouselApi.off("select", updateActiveSlide);
      carouselApi.off("reInit", updateActiveSlide);
    };
  }, [carouselApi]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = resolveMenuSearch(query);

    if (!result.route || !result.autoNavigate) {
      setSearchFeedback(result.message);
      setSearchSuggestions(result.suggestions);
      toast({
        title: "Recherche à préciser",
        description: `${result.message} Suggestions: ${result.suggestions.map((item) => item.label).join(", ")}.`,
        variant: "destructive",
      });
      return;
    }

    setSearchFeedback("");
    setSearchSuggestions(MENU_SEARCH_QUICK_LINKS);
    navigate(result.route);
  };

  const handleSuggestionClick = (suggestion: MenuSearchSuggestion) => {
    setSearchFeedback("");
    setSearchSuggestions(MENU_SEARCH_QUICK_LINKS);
    setQuery(suggestion.example);
    navigate(suggestion.route);
  };

  return (
    <Layout>
      <section className="relative overflow-hidden text-primary-foreground">
        <img
          src="/images/home-pont-normandie.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        <div className="absolute -top-24 left-[6%] h-64 w-64 rounded-full bg-secondary/35 blur-3xl" />
        <div className="absolute -bottom-20 right-[12%] h-72 w-72 rounded-full bg-primary-foreground/15 blur-3xl" />

        <div className="container relative py-14 md:py-20">
          <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-2xl rounded-2xl border border-white/20 bg-black/20 p-6 md:p-8 shadow-2xl backdrop-blur-sm">
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-5 leading-tight">
                Votre taxi au Havre,{" "}
                <span className="text-secondary">24h/24</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-7 leading-relaxed">
                Depuis 1976, Radio Taxi Le Havre accompagne les Havrais et les visiteurs, avec une centrale joignable jour et nuit.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-heading font-semibold" asChild>
                  <a href={`tel:${CONTACT_PHONE_LINK}`}>
                    <Phone className="h-5 w-5 mr-2" /> {CONTACT_PHONE_DISPLAY}
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/70 bg-transparent text-primary-foreground hover:border-secondary hover:bg-secondary hover:text-secondary-foreground focus-visible:ring-primary-foreground font-heading transition-colors"
                  asChild
                >
                  <Link to="/contact">
                    <MapPin className="h-5 w-5 mr-2" /> Voir les stations
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">Disponibilité</p>
                <p className="font-heading text-2xl leading-tight mb-4">Courses locales, aéroport, gare et services dédiés</p>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>Réservation immédiate ou planifiée</li>
                  <li>Prise en charge 7j/7, de jour comme de nuit</li>
                  <li>Flotte adaptée de 4 à 8 places</li>
                </ul>
              </div>
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
            Exemples : transport médical, tarif 2025, station gare, circuit Étretat.
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
            Appelez la centrale : {CONTACT_PHONE_DISPLAY}
          </a>
        </div>
      </section>

      <section className="py-6 bg-background">
        <div className="container">
          <Carousel setApi={setCarouselApi} opts={{ loop: true }}>
            <CarouselContent className="ml-0">
              {homeSlides.map((slide, index) => (
                <CarouselItem key={slide.title} className="pl-0">
                  <div className="relative overflow-hidden rounded-xl border shadow-sm">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={`w-full h-[300px] sm:h-[380px] md:h-[480px] object-cover transform-gpu transition-transform ease-linear ${
                        activeSlideIndex === index ? "scale-110" : "scale-100"
                      }`}
                      style={{ transitionDuration: "5000ms" }}
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
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">L'application au quotidien</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Pour réserver vite, retrouver une station et garder vos repères où que vous soyez au Havre.
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
                src="/images/service-station.webp"
                alt="Station de taxi au Havre"
                className="w-full h-[340px] md:h-[420px] object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">Une équipe locale et réactive</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                115 taxis, 35 stations et une centrale disponible 24h/24 pour organiser vos déplacements sans attente inutile.
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
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">L'app officielle sur iPhone et Android</h2>
            <p className="text-muted-foreground mb-6">
              Réservez en quelques clics, puis suivez les infos pratiques directement depuis votre téléphone.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/google-play-badge.webp"
                  alt="Télécharger sur Google Play"
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                />
              </a>
              <a href={APPLE_STORE_URL} target="_blank" rel="noopener noreferrer">
                <img
                  src="/images/apple-store-badge.webp"
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
              <p className="text-muted-foreground text-sm">13 idées de sorties pour découvrir la Normandie en taxi.</p>
            </Link>
            <Link to="/tarifs" className="group bg-card border rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                Nos tarifs <ArrowRight className="inline h-4 w-4 ml-1" />
              </h3>
              <p className="text-muted-foreground text-sm">Consultez les prix indicatifs, simples et transparents.</p>
            </Link>
            <Link to="/services" className="group bg-card border rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                Nos services <ArrowRight className="inline h-4 w-4 ml-1" />
              </h3>
              <p className="text-muted-foreground text-sm">Médical, gare, aéroport, croisière, groupes et trajets pros.</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
