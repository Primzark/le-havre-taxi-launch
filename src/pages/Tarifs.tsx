import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Clock3,
  Euro,
  MapPin,
  Phone,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toursData } from "@/data/tours";
import { useSEO } from "@/hooks/use-seo";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
  PRIMARY_DOMAIN,
} from "@/config/site";

type QuickFare = {
  id: string;
  from: string;
  to: string;
  basePrice: number;
  eta: string;
  note: string;
};

type FareVisual = {
  id: string;
  fareId: QuickFare["id"];
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
};

type SimulatorRoute = {
  id: string;
  from: string;
  to: string;
  basePrice: number;
  eta: string;
  note: string;
  kind: "course" | "circuit";
};

type PeriodMode = "jour" | "nuit";
type TourSortMode = "price-asc" | "price-desc" | "duration-asc";

const quickFares: QuickFare[] = [
  {
    id: "centre-ville",
    from: "Le Havre",
    to: "Centre-ville",
    basePrice: 10,
    eta: "8 à 12 min",
    note: "Course urbaine courte, idéale pour vos déplacements quotidiens.",
  },
  {
    id: "gare",
    from: "Le Havre",
    to: "Gare SNCF",
    basePrice: 10,
    eta: "10 à 15 min",
    note: "Accès direct gare, pratique avec bagages légers.",
  },
  {
    id: "honfleur",
    from: "Le Havre",
    to: "Honfleur (aller simple)",
    basePrice: 70,
    eta: "35 à 45 min",
    note: "Trajet inter-ville confortable, sans stress de stationnement.",
  },
];

const fareVisuals: FareVisual[] = [
  {
    id: "visual-centre-ville",
    fareId: "centre-ville",
    title: "Le Havre centre-ville",
    subtitle: "Forfait urbain à partir de 10 €",
    image: "/images/home-mairie.webp",
    imageAlt: "Vue du centre-ville du Havre.",
  },
  {
    id: "visual-gare",
    fareId: "gare",
    title: "Le Havre gare SNCF",
    subtitle: "Accès direct gare à partir de 10 €",
    image: "/images/service-station.webp",
    imageAlt: "Station taxi pour la gare du Havre.",
  },
  {
    id: "visual-honfleur",
    fareId: "honfleur",
    title: "Honfleur aller simple",
    subtitle: "Trajet inter-ville à partir de 70 €",
    image: "/images/tour-05-honfleur.webp",
    imageAlt: "Port d'Honfleur.",
  },
];

const periodConfig: Record<
  PeriodMode,
  { label: string; multiplier: number; helper: string }
> = {
  jour: {
    label: "Jour",
    multiplier: 1,
    helper: "Tarif de base",
  },
  nuit: {
    label: "Nuit",
    multiplier: 1.2,
    helper: "Majoration indicative",
  },
};

const luggageOptions = [
  { id: "light", label: "0 à 1 bagage", fee: 0 },
  { id: "standard", label: "2 bagages", fee: 3 },
  { id: "large", label: "3 bagages ou plus", fee: 7 },
];

const tourSortOptions: Array<{ id: TourSortMode; label: string }> = [
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "duration-asc", label: "Durée la plus courte" },
];

const simulatorRoutes: SimulatorRoute[] = [
  ...quickFares.map((fare) => ({
    id: fare.id,
    from: fare.from,
    to: fare.to,
    basePrice: fare.basePrice,
    eta: fare.eta,
    note: fare.note,
    kind: "course" as const,
  })),
  ...toursData.map((tour) => ({
    id: `tour-${tour.id}`,
    from: "Le Havre",
    to: `Circuit N°${tour.id} - ${tour.name}`,
    basePrice: tour.price,
    eta: tour.duration,
    note: "Circuit touristique aller-retour (base brochure).",
    kind: "circuit" as const,
  })),
];

const lastTariffUpdateDate = "01/01/2025";
const minTourPrice = Math.min(...toursData.map((tour) => tour.price));
const maxTourPrice = Math.max(...toursData.map((tour) => tour.price));
const avgTourPrice =
  toursData.reduce((total, tour) => total + tour.price, 0) / toursData.length;

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const formatEuro = (amount: number) =>
  currencyFormatter.format(Math.round(amount));

const parseDurationHours = (duration: string) => {
  const [hoursPart, minutesPart = "0"] = duration.split("h");
  const hours = Number.parseInt(hoursPart, 10);
  const minutes = Number.parseInt(minutesPart, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 0;
  }

  return hours + minutes / 60;
};

const Tarifs = () => {
  const [selectedRouteId, setSelectedRouteId] = useState(simulatorRoutes[0].id);
  const [periodMode, setPeriodMode] = useState<PeriodMode>("jour");
  const [luggageId, setLuggageId] = useState(luggageOptions[0].id);
  const [stops, setStops] = useState<number[]>([0]);
  const [waitingMinutes, setWaitingMinutes] = useState<number[]>([0]);
  const [passengers, setPassengers] = useState<number[]>([2]);

  const [tourQuery, setTourQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState<number[]>([maxTourPrice]);
  const [tourSortMode, setTourSortMode] = useState<TourSortMode>("price-asc");

  const selectedRoute = useMemo(
    () =>
      simulatorRoutes.find((route) => route.id === selectedRouteId) ??
      simulatorRoutes[0],
    [selectedRouteId],
  );

  const selectedLuggage =
    luggageOptions.find((option) => option.id === luggageId) ??
    luggageOptions[0];

  const focusSimulatorWithRoute = (routeId: string) => {
    setSelectedRouteId(routeId);

    if (typeof window === "undefined") {
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById("simulateur")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const focusSimulatorWithFare = (fareId: QuickFare["id"]) => {
    focusSimulatorWithRoute(fareId);
  };

  const focusSimulatorWithTour = (tourId: number) => {
    focusSimulatorWithRoute(`tour-${tourId}`);
  };

  const estimate = useMemo(() => {
    const periodMultiplier = periodConfig[periodMode].multiplier;
    const base = selectedRoute.basePrice * periodMultiplier;
    const stopFee = stops[0] * 4;
    const waitingFee = Math.ceil(waitingMinutes[0] / 5) * 2;
    const luggageFee = selectedLuggage.fee;
    const subtotal = base + stopFee + waitingFee + luggageFee;
    const min = Math.max(selectedRoute.basePrice, subtotal - 4);
    const max = subtotal + (periodMode === "nuit" ? 10 : 7);

    return {
      base,
      stopFee,
      waitingFee,
      luggageFee,
      subtotal,
      min,
      max,
    };
  }, [
    selectedLuggage.fee,
    selectedRoute.basePrice,
    periodMode,
    stops,
    waitingMinutes,
  ]);

  const filteredTours = useMemo(() => {
    const normalizedQuery = tourQuery.trim().toLowerCase();

    const tours = toursData
      .filter((tour) => tour.price <= maxBudget[0])
      .filter((tour) =>
        normalizedQuery
          ? `n°${tour.id} ${tour.name}`.toLowerCase().includes(normalizedQuery)
          : true,
      );

    return tours.sort((a, b) => {
      if (tourSortMode === "price-desc") {
        return b.price - a.price;
      }

      if (tourSortMode === "duration-asc") {
        return parseDurationHours(a.duration) - parseDurationHours(b.duration);
      }

      return a.price - b.price;
    });
  }, [maxBudget, tourQuery, tourSortMode]);

  const filteredAveragePrice =
    filteredTours.length > 0
      ? filteredTours.reduce((total, tour) => total + tour.price, 0) /
        filteredTours.length
      : 0;

  const cheapestFilteredTour =
    filteredTours.length > 0
      ? [...filteredTours].sort((a, b) => a.price - b.price)[0]
      : null;

  useSEO({
    title: "Tarifs et estimation",
    description:
      "Trouvez rapidement le tarif taxi au Havre : forfaits essentiels, simulateur clair et grille complète des 13 circuits touristiques.",
    canonicalPath: "/tarifs",
    ogImage: "/images/logo-taxi-le-havre.webp",
    keywords: [
      "tarif taxi le havre",
      "prix taxi le havre",
      "estimateur taxi havre",
      "circuit touristique taxi prix",
      "arrêté préfectoral taxi 2025",
    ],
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        name: "Tarifs indicatifs Taxi Le Havre",
        itemListElement: quickFares.map((fare, index) => ({
          "@type": "Offer",
          sku: `quick-fare-${index + 1}`,
          name: `${fare.from} - ${fare.to}`,
          price: fare.basePrice,
          priceCurrency: "EUR",
          url: `${PRIMARY_DOMAIN}/tarifs`,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Circuits touristiques avec tarifs",
        itemListElement: toursData.map((tour, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `Circuit ${tour.id} ${tour.name}`,
          url: `${PRIMARY_DOMAIN}/circuits-touristiques/${tour.id}`,
        })),
      },
    ],
  });

  return (
    <Layout>
      <section className="relative overflow-hidden border-b bg-[linear-gradient(150deg,hsl(207_74%_96%)_0%,hsl(0_0%_100%)_48%,hsl(48_95%_92%)_100%)] py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <nav
            aria-label="Fil d'Ariane"
            className="mb-4 text-sm text-foreground/70"
          >
            <Link
              to="/"
              className="underline-offset-2 transition hover:underline"
            >
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Tarifs</span>
          </nav>

          <Badge className="border-primary/25 bg-white/85 text-primary hover:bg-white">
            Tarifs mis à jour le {lastTariffUpdateDate}
          </Badge>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <h1 className="max-w-2xl font-heading text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                Tarifs clairs, estimation rapide
              </h1>
              <p className="mt-4 max-w-2xl text-base text-foreground/75 md:text-lg">
                Trouvez un prix en quelques secondes : forfaits immédiats,
                simulateur simplifié et grille complète des circuits
                touristiques.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="#forfaits">
                    Voir les forfaits
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-primary/30 bg-white/80 sm:w-auto"
                >
                  <a href="#simulateur">Estimer ma course</a>
                </Button>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-white/80 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Forfait minimum
                  </p>
                  <p className="mt-1 font-heading text-2xl font-extrabold text-primary">
                    10 €
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-white/80 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Circuits officiels
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 font-heading text-2xl font-extrabold text-foreground">
                    <MapPin className="h-4 w-4" />
                    {toursData.length}
                  </p>
                </div>
                <div className="rounded-xl border border-border/70 bg-white/80 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Prix moyen circuit
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 font-heading text-2xl font-extrabold text-foreground">
                    <Sparkles className="h-4 w-4" />
                    {formatEuro(avgTourPrice)}
                  </p>
                </div>
              </div>
            </div>

            <figure className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[0_28px_58px_-34px_hsl(var(--primary)/0.5)]">
              <img
                src="/images/tarifs-hero-meter.jpg"
                alt="Taximètre affichant le prix d'une course en temps réel."
                className="h-[320px] w-full object-cover md:h-[420px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/30 bg-black/45 px-3 py-2 text-white backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-white/80">
                  Référence tarif
                </p>
                <p className="text-sm font-semibold md:text-base">
                  Une lecture immédiate des prix, avec confirmation par la
                  centrale au {CONTACT_PHONE_DISPLAY}
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="forfaits" className="py-12 md:py-14">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Car className="h-3.5 w-3.5" />
                Forfaits essentiels
              </p>
              <h2 className="mt-3 font-heading text-2xl font-extrabold md:text-3xl">
                Les prix les plus recherchés
              </h2>
            </div>
            <Button asChild variant="outline" className="border-primary/30">
              <a href={`tel:${CONTACT_PHONE_LINK}`}>
                <Phone className="h-4 w-4" />
                Appeler la centrale
              </a>
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {fareVisuals.map((visual) => {
              const linkedFare =
                quickFares.find((fare) => fare.id === visual.fareId) ??
                quickFares[0];

              return (
                <article
                  key={visual.id}
                  className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_16px_34px_-24px_hsl(var(--primary)/0.5)]"
                >
                  <div className="relative h-48">
                    <img
                      src={visual.image}
                      alt={visual.imageAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <p className="absolute left-3 top-3 rounded-full border border-white/35 bg-black/45 px-3 py-1 text-sm font-bold text-white">
                      {formatEuro(linkedFare.basePrice)}
                    </p>
                    <p className="absolute bottom-3 left-3 right-3 font-heading text-lg font-semibold text-white">
                      {visual.title}
                    </p>
                  </div>

                  <div className="space-y-2 p-4">
                    <p className="text-sm text-muted-foreground">
                      {visual.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Durée moyenne : {linkedFare.eta}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => focusSimulatorWithFare(visual.fareId)}
                    >
                      Estimer ce trajet
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="simulateur" className="relative py-12 md:py-14">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(30rem_18rem_at_90%_6%,hsl(var(--secondary)/0.12),transparent_65%),radial-gradient(24rem_16rem_at_8%_8%,hsl(var(--primary)/0.1),transparent_64%)]" />
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-3xl border border-border/70 bg-white/90 p-5 shadow-[0_24px_50px_-34px_hsl(var(--primary)/0.5)] md:p-6">
              <h2 className="font-heading text-2xl font-extrabold">
                Simulateur de course
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Renseignez les options utiles pour obtenir une estimation
                claire.
              </p>

              <div className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Trajet
                  </label>
                  <Select
                    value={selectedRouteId}
                    onValueChange={setSelectedRouteId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un trajet" />
                    </SelectTrigger>
                    <SelectContent>
                      {simulatorRoutes.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.kind === "circuit"
                            ? `${route.to} (${formatEuro(route.basePrice)})`
                            : `${route.from} → ${route.to}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Inclut les courses essentielles et tous les circuits
                    touristiques.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Période
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(periodConfig) as PeriodMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPeriodMode(mode)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                          periodMode === mode
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background hover:border-primary/40"
                        }`}
                      >
                        <p className="font-semibold">
                          {periodConfig[mode].label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {periodConfig[mode].helper}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Bagages
                  </label>
                  <Select value={luggageId} onValueChange={setLuggageId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir le volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {luggageOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <span>Arrêts intermédiaires</span>
                    <span>{stops[0]}</span>
                  </div>
                  <Slider
                    value={stops}
                    onValueChange={setStops}
                    min={0}
                    max={4}
                    step={1}
                    aria-label="Nombre d'arrêts intermédiaires"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <span>Temps d'attente</span>
                    <span>{waitingMinutes[0]} min</span>
                  </div>
                  <Slider
                    value={waitingMinutes}
                    onValueChange={setWaitingMinutes}
                    min={0}
                    max={30}
                    step={5}
                    aria-label="Temps d'attente"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-primary/15 bg-card p-5 shadow-[0_24px_58px_-34px_hsl(var(--primary)/0.55)] md:p-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Euro className="h-3.5 w-3.5" />
                Estimation indicative
              </p>

              <p className="mt-4 font-heading text-4xl font-extrabold text-primary md:text-5xl">
                {formatEuro(estimate.subtotal)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Fourchette conseillée : {formatEuro(estimate.min)} à{" "}
                {formatEuro(estimate.max)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedRoute.from} → {selectedRoute.to} • Durée{" "}
                {selectedRoute.eta}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedRoute.note}
              </p>

              <div className="mt-5 space-y-2 rounded-xl border border-border/70 bg-background/70 p-4 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>
                    {selectedRoute.kind === "circuit"
                      ? "Base circuit"
                      : "Base trajet"}
                  </span>
                  <span>{formatEuro(estimate.base)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Arrêts intermédiaires</span>
                  <span>+ {formatEuro(estimate.stopFee)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Attente</span>
                  <span>+ {formatEuro(estimate.waitingFee)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Bagages</span>
                  <span>+ {formatEuro(estimate.luggageFee)}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-2 font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    {passengers[0]} passager{passengers[0] > 1 ? "s" : ""}
                  </span>
                  <span>1 à 4 inclus</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>Passagers</span>
                  <span>{passengers[0]} / 4</span>
                </div>
                <Slider
                  value={passengers}
                  onValueChange={setPassengers}
                  min={1}
                  max={4}
                  step={1}
                  aria-label="Nombre de passagers"
                />
              </div>

              <Button asChild className="mt-6 h-auto w-full py-3 text-center">
                <a href={`tel:${CONTACT_PHONE_LINK}`}>
                  <Phone className="h-4 w-4" />
                  Confirmer ce prix avec la centrale
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_20px_44px_-32px_hsl(var(--primary)/0.45)] md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-2xl font-extrabold md:text-3xl">
                  Grille des circuits touristiques
                </h2>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                  Tous les prix officiels en une vue, avec recherche rapide.
                </p>
              </div>
              <p className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                13 tours aller-retour
              </p>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[1.05fr_0.55fr_0.4fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={tourQuery}
                  onChange={(event) => setTourQuery(event.target.value)}
                  placeholder="Rechercher un circuit (ex: Étretat, Rouen, Paris...)"
                  className="pl-9"
                />
              </div>

              <Select
                value={tourSortMode}
                onValueChange={(value) =>
                  setTourSortMode(value as TourSortMode)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trier les circuits" />
                </SelectTrigger>
                <SelectContent>
                  {tourSortOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="rounded-xl border border-border/70 bg-background/70 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Budget max
                </p>
                <p className="font-heading text-lg font-bold text-primary">
                  {formatEuro(maxBudget[0])}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border/70 bg-background/70 p-3">
              <Slider
                value={maxBudget}
                onValueChange={setMaxBudget}
                min={minTourPrice}
                max={maxTourPrice}
                step={10}
                aria-label="Budget maximum pour les circuits"
              />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-primary/10 bg-background/75 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Circuits affichés
                </p>
                <p className="mt-1 text-2xl font-extrabold">
                  {filteredTours.length}
                </p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-background/75 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Prix moyen filtré
                </p>
                <p className="mt-1 text-2xl font-extrabold text-primary">
                  {filteredTours.length > 0
                    ? formatEuro(filteredAveragePrice)
                    : "--"}
                </p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-background/75 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Prix le plus bas
                </p>
                <p className="mt-1 text-2xl font-extrabold">
                  {cheapestFilteredTour
                    ? formatEuro(cheapestFilteredTour.price)
                    : "--"}
                </p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-border/70">
              <div className="hidden grid-cols-[0.12fr_1fr_0.24fr_0.24fr_0.4fr] gap-2 bg-muted/65 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                <p>N°</p>
                <p>Circuit</p>
                <p>Durée</p>
                <p>Prix</p>
                <p>Actions</p>
              </div>

              {filteredTours.length > 0 ? (
                <div className="divide-y divide-border/70 bg-background">
                  {filteredTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="grid gap-3 px-4 py-4 md:grid-cols-[0.12fr_1fr_0.24fr_0.24fr_0.4fr] md:items-center"
                    >
                      <p className="text-sm font-semibold text-muted-foreground">
                        {tour.id}
                      </p>
                      <p className="font-semibold leading-snug">{tour.name}</p>
                      <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5 text-primary" />
                        {tour.duration}
                      </p>
                      <p className="font-heading text-xl font-extrabold text-primary">
                        {formatEuro(tour.price)}
                      </p>
                      <div className="flex items-center gap-2 md:justify-end">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => focusSimulatorWithTour(tour.id)}
                        >
                          Estimer
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/circuits-touristiques/${tour.id}`}>
                            Voir
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="font-heading text-xl font-bold">
                    Aucun circuit ne correspond à ce filtre.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ajustez la recherche ou le budget maximum.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setTourQuery("");
                      setMaxBudget([maxTourPrice]);
                      setTourSortMode("price-asc");
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(36rem_22rem_at_78%_12%,hsl(var(--secondary)/0.12),transparent_65%)]" />
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="rounded-3xl border border-primary/15 bg-card/95 p-5 shadow-[0_22px_46px_-30px_hsl(var(--primary)/0.55)] md:p-7">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-4 w-4" />
              Transparence tarifaire
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold md:text-3xl">
              Ce que comprend le tarif affiché
            </h2>

            <Accordion type="single" collapsible className="mt-5">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Les montants sont-ils fixes ?
                </AccordionTrigger>
                <AccordionContent>
                  Les montants affichés sont des tarifs indicatifs. Le prix
                  final dépend du trajet réel, des conditions de circulation,
                  des arrêts demandés et des éventuels suppléments.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Que couvre le tarif des circuits touristiques ?
                </AccordionTrigger>
                <AccordionContent>
                  Le tarif couvre le transport pour 1 à 4 personnes. Les entrées
                  de musées, repas, frais personnels et extras éventuels ne sont
                  pas inclus.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Comment confirmer un prix exact ?
                </AccordionTrigger>
                <AccordionContent>
                  L'option la plus fiable est une confirmation directe auprès de
                  la centrale. Une estimation personnalisée vous est donnée
                  immédiatement selon votre point de départ, horaire et
                  contraintes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-6 rounded-xl border bg-background/75 p-4 text-sm text-muted-foreground">
              <p>
                Tarifs indicatifs mis à jour le{" "}
                <strong>{lastTariffUpdateDate}</strong>, selon la brochure
                circuits 2025 et l'arrêté préfectoral 2025.
              </p>
              <p className="mt-2">
                Pour un chiffrage précis, appelez le{" "}
                <a
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                  href={`tel:${CONTACT_PHONE_LINK}`}
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tarifs;
