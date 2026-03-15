import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Phone, Clock, Users, Car, MapPin, Star, Download, ArrowRight, Search, Mail } from "lucide-react";
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

type StatDefinition = {
  icon: LucideIcon;
  label: string;
  target: number;
  suffix?: string;
  groupDigits?: boolean;
};

type HomeSlide = {
  title: string;
  image: string;
  renderMode?: "cover" | "framed";
  objectPosition?: string;
};

const stats: StatDefinition[] = [
  { icon: Clock, label: "Depuis", target: 1976 },
  { icon: Car, label: "Taxis dans le réseau", target: 115 },
  { icon: Clock, label: "Service continu", target: 24, suffix: "h/7j" },
  { icon: Users, label: "Stations et agglomération", target: 30, suffix: "+" },
  { icon: Users, label: "Courses attribuées en 2025", target: 150000, groupDigits: true },
];

const statNumberFormatter = new Intl.NumberFormat("fr-FR");
const APP_VIDEO_URL = "https://player.vimeo.com/video/340638002?dnt=1&title=0&byline=0&portrait=0";

const AnimatedStatValue = ({
  stat,
  animate,
  delayMs,
}: {
  stat: StatDefinition;
  animate: boolean;
  delayMs: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!animate) {
      return;
    }

    if (typeof window === "undefined") {
      setDisplayValue(stat.target);
      setIsVisible(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(stat.target);
      setIsVisible(true);
      return;
    }

    let frameId = 0;
    let timeoutId = 0;
    const duration = 1650;
    const easeOutQuint = (progress: number) => 1 - Math.pow(1 - progress, 5);

    const startAnimation = () => {
      setIsVisible(true);
      const startedAt = performance.now();

      const frame = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const nextValue = Math.round(stat.target * easeOutQuint(progress));
        setDisplayValue(nextValue);

        if (progress < 1) {
          frameId = window.requestAnimationFrame(frame);
          return;
        }

        setDisplayValue(stat.target);
      };

      frameId = window.requestAnimationFrame(frame);
    };

    timeoutId = window.setTimeout(startAnimation, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [animate, delayMs, stat.target]);

  const renderedValue = stat.groupDigits
    ? statNumberFormatter.format(displayValue).replace(/\u202f/g, " ")
    : String(displayValue);

  return (
    <span
      className={`inline-block tabular-nums font-heading font-extrabold text-2xl md:text-3xl transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100 blur-0" : "translate-y-1.5 opacity-0 blur-[2px]"
      }`}
    >
      {renderedValue}
      {stat.suffix ?? ""}
    </span>
  );
};

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

const homeSlides: HomeSlide[] = [
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
    image: "/images/home-catene-wide.webp",
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
  const statsSectionRef = useRef<HTMLElement | null>(null);
  const [shouldAnimateStats, setShouldAnimateStats] = useState(false);

  const homeSEO = useMemo(
    () => ({
      title: "Accueil",
      description:
        "Taxi Le Havre : appelez, voyagez, profitez. Centrale 24h/24 et 7j/7, flotte locale et circuits touristiques depuis Le Havre.",
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

  useEffect(() => {
    if (shouldAnimateStats) {
      return;
    }

    if (typeof window === "undefined") {
      setShouldAnimateStats(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShouldAnimateStats(true);
      return;
    }

    const target = statsSectionRef.current;

    if (!target || typeof IntersectionObserver === "undefined") {
      setShouldAnimateStats(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setShouldAnimateStats(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [shouldAnimateStats]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = resolveMenuSearch(query);

    if (!result.route || !result.autoNavigate) {
      setSearchFeedback(result.message);
      setSearchSuggestions(result.suggestions);
      toast({
        title: "Recherche à préciser",
        description: `${result.message} Suggestions : ${result.suggestions.map((item) => item.label).join(", ")}.`,
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
            <div className="mx-auto w-full min-w-0 max-w-2xl rounded-2xl border border-white/20 bg-black/20 p-6 md:p-8 shadow-2xl backdrop-blur-sm lg:mx-0">
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-5 leading-tight">
                Appelez, voyagez,{" "}
                <span className="text-secondary">profitez...</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-7 leading-relaxed">
                Depuis 1976, SCA Radio Taxi Le Havre vous accompagne avec une centrale joignable 24h/24 et 7j/7.
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
                  className="w-full min-[390px]:w-auto px-4 min-[390px]:px-8 border-primary-foreground/70 bg-transparent text-primary-foreground hover:border-secondary hover:bg-secondary hover:text-secondary-foreground focus-visible:ring-primary-foreground font-heading transition-colors"
                  asChild
                >
                  <Link to="/liens">
                    <ArrowRight className="h-5 w-5 mr-2" /> Liens utiles
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-[390px]:w-auto px-4 min-[390px]:px-8 border-primary-foreground/70 bg-transparent text-primary-foreground hover:border-secondary hover:bg-secondary hover:text-secondary-foreground focus-visible:ring-primary-foreground font-heading transition-colors"
                  asChild
                >
                  <Link to="/contact">
                    <Mail className="h-5 w-5 mr-2" /> Envoyer un message
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
                <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-2">Disponibilité</p>
                <p className="font-heading text-2xl leading-tight mb-4">Course directe et réservation 24h/24, 7j/7</p>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>Géolocalisation des stations de taxi</li>
                  <li>Réservation immédiate ou programmée</li>
                  <li>Flotte de 4 à 8 places</li>
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
            Exemples : transport médical, tarif 2026, station gare, circuit Étretat.
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
                    {slide.renderMode === "framed" ? (
                      <div className="relative h-[300px] sm:h-[380px] md:h-[480px] bg-slate-950">
                        <img
                          src={slide.image}
                          alt=""
                          aria-hidden="true"
                          className={`absolute inset-0 h-full w-full object-cover blur-xl transition-transform ease-linear ${
                            activeSlideIndex === index ? "scale-[1.22]" : "scale-[1.1]"
                          }`}
                          style={{
                            transitionDuration: "5000ms",
                            objectPosition: slide.objectPosition,
                          }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.34)_0%,rgba(2,6,23,0.08)_35%,rgba(2,6,23,0.32)_100%)]" />
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className={`relative h-full w-full object-cover transition-transform duration-700 ease-out md:object-contain md:px-10 md:py-8 lg:px-16 ${
                            activeSlideIndex === index ? "scale-[1.03]" : "scale-100"
                          }`}
                          style={{ objectPosition: slide.objectPosition }}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className={`w-full h-[300px] sm:h-[380px] md:h-[480px] object-cover transform-gpu transition-transform ease-linear ${
                          activeSlideIndex === index ? "scale-110" : "scale-100"
                        }`}
                        style={{ transitionDuration: "5000ms" }}
                        loading="lazy"
                      />
                    )}
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

      <section ref={statsSectionRef} className="bg-secondary text-secondary-foreground py-6">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-3 xl:grid-cols-5">
            {stats.map((stat, index) => (
              <div key={stat.label}>
                <p>
                  <AnimatedStatValue stat={stat} animate={shouldAnimateStats} delayMs={index * 140} />
                </p>
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
                Une flotte de 115 taxis et une trentaine de stations pour vous prendre en charge rapidement au Havre et sa périphérie.
              </p>
              <Button size="lg" asChild>
                <Link to="/services">Découvrir nos services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-16 md:py-20">
        <div className="container">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <p className="mb-3 inline-flex rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-foreground">
                Video officielle
              </p>
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">L'application Taxi Le Havre en images</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Retrouvez la meme video que sur l'ancien site pour decouvrir rapidement l'experience de reservation et les fonctions clefs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/contact">Reserver une course</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#app-download">Telecharger l'application</a>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-[0_24px_44px_-28px_hsl(var(--primary)/0.75)]">
              <div className="relative aspect-video">
                <iframe
                  title="Application Taxi Le Havre"
                  src={APP_VIDEO_URL}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
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
            <Link to="/contact" className="group bg-card border rounded-xl p-6 hover:shadow-md transition">
              <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                Contact <ArrowRight className="inline h-4 w-4 ml-1" />
              </h3>
              <p className="text-muted-foreground text-sm">Écrivez-nous pour une réservation, un devis ou une demande spécifique.</p>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
