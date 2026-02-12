import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toursData } from "@/data/tours";
import { ArrowLeft, CheckCircle2, Clock, Euro, Expand, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { CONTACT_PHONE_LINK, PRIMARY_DOMAIN, SITE_NAME } from "@/config/site";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const TourDetail = () => {
  const { id } = useParams();
  const tour = toursData.find((t) => t.id === Number(id));
  const navigate = useNavigate();
  const [galleryApi, setGalleryApi] = useState<CarouselApi>();
  const [circuitApi, setCircuitApi] = useState<CarouselApi>();
  const [lightboxApi, setLightboxApi] = useState<CarouselApi>();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeCircuitIndex, setActiveCircuitIndex] = useState(0);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const currentTourIndex = toursData.findIndex((candidate) => candidate.id === tour?.id);

  useEffect(() => {
    if (!galleryApi) {
      return;
    }

    const updateActiveSlide = () => {
      setActiveSlideIndex(galleryApi.selectedScrollSnap());
    };

    updateActiveSlide();
    galleryApi.on("select", updateActiveSlide);
    galleryApi.on("reInit", updateActiveSlide);

    const autoplayInterval = window.setInterval(() => {
      galleryApi.scrollNext();
    }, 5200);

    return () => {
      window.clearInterval(autoplayInterval);
      galleryApi.off("select", updateActiveSlide);
      galleryApi.off("reInit", updateActiveSlide);
    };
  }, [galleryApi]);

  useEffect(() => {
    if (currentTourIndex >= 0) {
      setActiveCircuitIndex(currentTourIndex);
    }
  }, [currentTourIndex]);

  useEffect(() => {
    if (!circuitApi || currentTourIndex < 0) {
      return;
    }

    const onSelect = () => {
      const selectedIndex = circuitApi.selectedScrollSnap();
      setActiveCircuitIndex(selectedIndex);

      if (selectedIndex === currentTourIndex) {
        return;
      }

      const selectedTour = toursData[selectedIndex];
      if (!selectedTour) {
        return;
      }

      navigate(`/circuits-touristiques/${selectedTour.id}`);
    };

    circuitApi.on("select", onSelect);
    circuitApi.on("reInit", onSelect);

    return () => {
      circuitApi.off("select", onSelect);
      circuitApi.off("reInit", onSelect);
    };
  }, [circuitApi, currentTourIndex, navigate]);

  useEffect(() => {
    if (!lightboxApi) {
      return;
    }

    const onLightboxSelect = () => {
      setActiveLightboxIndex(lightboxApi.selectedScrollSnap());
    };

    onLightboxSelect();
    lightboxApi.on("select", onLightboxSelect);
    lightboxApi.on("reInit", onLightboxSelect);

    return () => {
      lightboxApi.off("select", onLightboxSelect);
      lightboxApi.off("reInit", onLightboxSelect);
    };
  }, [lightboxApi]);

  useEffect(() => {
    if (!isLightboxOpen || !lightboxApi) {
      return;
    }

    lightboxApi.scrollTo(lightboxStartIndex, true);
  }, [isLightboxOpen, lightboxApi, lightboxStartIndex]);

  useEffect(() => {
    if (isLightboxOpen) {
      return;
    }

    setActiveSlideIndex(activeLightboxIndex);
    galleryApi?.scrollTo(activeLightboxIndex, true);
  }, [activeLightboxIndex, galleryApi, isLightboxOpen]);

  const openGalleryFullscreen = (index: number) => {
    setLightboxStartIndex(index);
    setActiveLightboxIndex(index);
    galleryApi?.scrollTo(index, true);
    setIsLightboxOpen(true);
  };

  useSEO(
    tour
      ? {
          title: `Circuit ${tour.name}`,
          description: `Circuit N°${tour.id} ${tour.name}, durée ${tour.duration}, tarif ${tour.price} € (1 à 4 personnes).`,
          canonicalPath: `/circuits-touristiques/${tour.id}`,
          ogImage: tour.image,
          keywords: [
            "circuit touristique le havre",
            `${tour.name.toLowerCase()} taxi`,
            `excursion ${tour.name.toLowerCase()} depuis le havre`,
          ],
          breadcrumbs: [
            { name: "Accueil", path: "/" },
            { name: "Circuits touristiques", path: "/circuits-touristiques" },
            { name: tour.name, path: `/circuits-touristiques/${tour.id}` },
          ],
          structuredData: {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: `Circuit ${tour.id} ${tour.name}`,
            description: `Circuit touristique ${tour.name} depuis Le Havre`,
            touristType: "Tour privé en taxi",
            itinerary: {
              "@type": "Place",
              name: tour.name,
            },
            offers: {
              "@type": "Offer",
              price: tour.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: `${PRIMARY_DOMAIN}/circuits-touristiques/${tour.id}`,
            },
            image: `${PRIMARY_DOMAIN}${tour.image}`,
            provider: {
              "@type": "LocalBusiness",
              name: SITE_NAME,
              url: PRIMARY_DOMAIN,
            },
          },
        }
      : {
          title: "Circuit non trouvé",
          description: "Ce circuit touristique n'existe pas.",
          canonicalPath: "/circuits-touristiques",
          robots: "noindex, follow",
        },
  );

  if (!tour) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-heading font-bold text-2xl mb-4">Circuit non trouvé</h1>
          <Button asChild><Link to="/circuits-touristiques">Retour aux circuits</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative overflow-hidden text-primary-foreground">
        <img
          src={tour.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/86 to-primary/72" />
        <div className="tour-orb tour-orb--one" aria-hidden="true" />
        <div className="tour-orb tour-orb--two" aria-hidden="true" />

        <div className="container relative py-16 md:py-20">
          <Link to="/circuits-touristiques" className="mb-4 inline-flex items-center gap-1 text-sm opacity-85 transition hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> Tous les circuits
          </Link>
          <span className="inline-flex rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Circuit privé
          </span>
          <h1 className="mt-3 font-heading text-3xl font-extrabold md:text-4xl">
            N°{tour.id} — {tour.name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm md:text-base">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/20 px-3 py-1.5">
              <Clock className="h-4 w-4" />
              {tour.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/20 px-3 py-1.5">
              <Euro className="h-4 w-4" />
              {tour.price} €
            </span>
          </div>
        </div>
      </section>

      <section className="relative -mt-6 pb-6 md:-mt-8 md:pb-8">
        <div className="container relative">
          <div className="-mx-8 sm:mx-0">
            <div className="tour-card-enter border-y bg-card/95 p-4 shadow-[0_18px_36px_-26px_hsl(var(--primary)/0.45)] backdrop-blur-sm sm:rounded-2xl sm:border md:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="inline-flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                Swipez pour passer au circuit suivant
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {activeCircuitIndex + 1} / {toursData.length}
              </p>
            </div>

              <Carousel
                key={tour.id}
                setApi={setCircuitApi}
                opts={{
                  align: "center",
                loop: true,
                startIndex: currentTourIndex >= 0 ? currentTourIndex : 0,
                }}
                className="tour-route-carousel"
              >
                <CarouselContent className="ml-0 sm:-ml-2">
                {toursData.map((candidate, index) => (
                    <CarouselItem key={candidate.id} className="basis-full pl-0 sm:basis-[52%] sm:pl-2 md:basis-[42%] lg:basis-[34%]">
                    <Link
                      to={`/circuits-touristiques/${candidate.id}`}
                      aria-current={activeCircuitIndex === index ? "page" : undefined}
                      className={cn(
                        "group block overflow-hidden rounded-xl border bg-background transition-all duration-400",
                        activeCircuitIndex === index
                          ? "border-primary/65 shadow-[0_16px_32px_-24px_hsl(var(--primary)/0.9)]"
                          : "border-border/70 hover:border-primary/35 hover:shadow-[0_12px_26px_-20px_hsl(var(--primary)/0.55)]",
                      )}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={candidate.image}
                          alt={`Aperçu du circuit ${candidate.name}`}
                          className={cn(
                            "h-36 w-full object-cover transition-transform duration-500 ease-out",
                            activeCircuitIndex === index ? "scale-105" : "scale-100 group-hover:scale-105",
                          )}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
                        <span className="absolute bottom-2 left-2 rounded-full border border-white/35 bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                          Circuit {candidate.id}
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 text-sm font-semibold">{candidate.name}</p>
                        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{candidate.duration}</span>
                          <span className="font-semibold text-primary">{candidate.price} €</span>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 top-1/2 h-9 w-9 border-white/45 bg-black/30 text-white hover:bg-black/45 hover:text-white md:-left-4" />
                <CarouselNext className="right-2 top-1/2 h-9 w-9 border-white/45 bg-black/30 text-white hover:bg-black/45 hover:text-white md:-right-4" />
              </Carousel>

            <p className="mt-3 text-xs text-muted-foreground">
              Sur mobile, glissez horizontalement sur les cartes. Sur desktop, utilisez les flèches.
            </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="tour-section-bg" aria-hidden="true" />
        <div className="tour-orb tour-orb--three" aria-hidden="true" />

        <div className="container relative">
          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1.25fr] xl:gap-10">
            <article className="tour-card-enter rounded-2xl border bg-card/95 p-6 shadow-[0_18px_40px_-24px_hsl(var(--primary)/0.5)] backdrop-blur-sm md:p-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-4 w-4" />
                Escale signature
              </p>
              <h2 className="mt-4 font-heading text-2xl font-extrabold leading-tight md:text-3xl">
                {tour.story.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {tour.story.intro}
              </p>

              <ul className="mt-6 space-y-3">
                {tour.story.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-xl border bg-background/80 p-4">
                <p className="inline-flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-primary" />
                  Départ et retour au Havre
                </p>
                <p className="mt-2 text-xs text-muted-foreground md:text-sm">
                  Horaires souples, arrêts photo possibles et rythme adapté à votre journée.
                </p>
              </div>
            </article>

            <div className="-mx-8 sm:mx-0">
              <div
                className="tour-card-enter border-y bg-card/95 p-4 shadow-[0_22px_44px_-26px_hsl(var(--primary)/0.6)] backdrop-blur-sm sm:rounded-2xl sm:border md:p-5"
                style={{ animationDelay: "120ms" }}
              >
                <Carousel setApi={setGalleryApi} opts={{ loop: true }} className="tour-gallery-carousel">
                  <CarouselContent className="ml-0">
                    {tour.story.gallery.map((slide, index) => (
                      <CarouselItem key={`${slide.src}-${slide.caption}`} className="pl-0">
                        <button
                          type="button"
                          onClick={() => openGalleryFullscreen(index)}
                          className="group relative block w-full text-left"
                          aria-label={`Ouvrir la galerie en plein écran, image ${index + 1}`}
                        >
                          <figure className={cn("tour-gallery-slide", activeSlideIndex === index && "is-active")}>
                            <img
                              src={slide.src}
                              alt={slide.alt}
                              className={cn(
                                "tour-gallery-image",
                                activeSlideIndex === index ? "scale-110" : "scale-100",
                              )}
                              style={{ transitionDuration: "5200ms" }}
                              loading="lazy"
                            />
                            <div className="tour-gallery-light" aria-hidden="true" />
                            <figcaption className="tour-gallery-caption">{slide.caption}</figcaption>
                          </figure>
                          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/35 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition group-hover:bg-black/60">
                            <Expand className="h-3.5 w-3.5" />
                            Plein écran
                          </span>
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-3 top-auto bottom-3 h-9 w-9 border-white/45 bg-black/35 text-white hover:bg-black/50 hover:text-white" />
                  <CarouselNext className="right-3 top-auto bottom-3 h-9 w-9 border-white/45 bg-black/35 text-white hover:bg-black/50 hover:text-white" />
                </Carousel>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Galerie immersive</p>
                  <div className="flex items-center gap-2">
                    {tour.story.gallery.map((slide, index) => (
                      <button
                        key={`${slide.caption}-dot`}
                        type="button"
                        onClick={() => galleryApi?.scrollTo(index)}
                        aria-label={`Aller à l'image ${index + 1} : ${slide.caption}`}
                        className={cn(
                          "h-2.5 rounded-full transition-all",
                          activeSlideIndex === index ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/45",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Touchez une image pour ouvrir la galerie en plein écran.
                </p>
              </div>
            </div>
          </div>

          <div className="tour-card-enter mt-8 rounded-2xl border bg-card/95 p-5 shadow-[0_18px_40px_-26px_hsl(var(--primary)/0.45)] md:p-6" style={{ animationDelay: "140ms" }}>
            <div className="mb-5 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Durée : {tour.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                <span className="font-heading text-xl font-bold text-primary">{tour.price} €</span>
              </div>
            </div>

            <p className="mb-4 text-muted-foreground leading-relaxed">
              Profitez de {tour.name} avec un chauffeur qui connaît parfaitement la région. Vous avancez à votre rythme, sans contrainte de stationnement ni stress de circulation.
            </p>
            <p className="border-t pt-4 text-sm text-muted-foreground">
              Tarif valable pour 1 à 4 personnes, hors suppléments éventuels. Entrées de musées, repas et autres frais personnels non inclus.
            </p>
          </div>

          <div className="tour-card-enter text-center mt-8" style={{ animationDelay: "120ms" }}>
            <Button size="lg" asChild>
              <a href={`tel:${CONTACT_PHONE_LINK}`}>Réserver ce circuit</a>
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="left-0 top-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 border-0 bg-black/95 p-0 text-white sm:rounded-none">
          <DialogTitle className="sr-only">Galerie immersive du circuit {tour.name}</DialogTitle>

          <div className="relative h-full w-full">
            <Carousel
              key={`${tour.id}-${lightboxStartIndex}`}
              setApi={setLightboxApi}
              opts={{ loop: true, startIndex: lightboxStartIndex }}
              className="h-full w-full"
            >
              <CarouselContent className="ml-0 h-full">
                {tour.story.gallery.map((slide) => (
                  <CarouselItem key={`fullscreen-${slide.src}-${slide.caption}`} className="h-full pl-0">
                    <figure className="relative h-[100dvh] w-full overflow-hidden bg-black">
                      <img src={slide.src} alt={slide.alt} className="h-full w-full object-contain" loading="eager" />
                      <figcaption className="absolute bottom-6 left-1/2 w-[min(92vw,760px)] -translate-x-1/2 rounded-xl border border-white/30 bg-black/55 px-4 py-2 text-center text-sm font-medium text-white backdrop-blur-sm md:text-base">
                        {slide.caption}
                      </figcaption>
                    </figure>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 top-1/2 h-10 w-10 border-white/45 bg-black/40 text-white hover:bg-black/55 hover:text-white" />
              <CarouselNext className="right-4 top-1/2 h-10 w-10 border-white/45 bg-black/40 text-white hover:bg-black/55 hover:text-white" />
            </Carousel>

            <p className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-white/35 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {activeLightboxIndex + 1} / {tour.story.gallery.length}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TourDetail;
