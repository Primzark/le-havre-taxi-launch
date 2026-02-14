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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type PeriodMode = "jour" | "nuit";
type DurationFilter =
  | "all"
  | "express"
  | "demi-journee"
  | "journee"
  | "grand-format";
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

const periodConfig: Record<
  PeriodMode,
  { label: string; multiplier: number; helper: string }
> = {
  jour: {
    label: "Jour",
    multiplier: 1,
    helper: "Base standard",
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

const durationFilters: Array<{ id: DurationFilter; label: string }> = [
  { id: "all", label: "Tous" },
  { id: "express", label: "Express (≤ 3h)" },
  { id: "demi-journee", label: "Demi-journée" },
  { id: "journee", label: "Journée" },
  { id: "grand-format", label: "Grand format" },
];

const tourSortOptions: Array<{ id: TourSortMode; label: string }> = [
  { id: "price-asc", label: "Prix croissant" },
  { id: "price-desc", label: "Prix décroissant" },
  { id: "duration-asc", label: "Durée la plus courte" },
];

const lastTariffUpdateDate = "01/01/2025";
const routeScaleMax = Math.max(...quickFares.map((route) => route.basePrice));
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
  const [selectedRouteId, setSelectedRouteId] = useState(quickFares[0].id);
  const [periodMode, setPeriodMode] = useState<PeriodMode>("jour");
  const [luggageId, setLuggageId] = useState(luggageOptions[0].id);
  const [stops, setStops] = useState<number[]>([0]);
  const [waitingMinutes, setWaitingMinutes] = useState<number[]>([0]);
  const [passengers, setPassengers] = useState<number[]>([2]);

  const [tourQuery, setTourQuery] = useState("");
  const [maxBudget, setMaxBudget] = useState<number[]>([maxTourPrice]);
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("all");
  const [tourSortMode, setTourSortMode] = useState<TourSortMode>("price-asc");

  const selectedRoute = useMemo(
    () =>
      quickFares.find((route) => route.id === selectedRouteId) ?? quickFares[0],
    [selectedRouteId],
  );

  const selectedLuggage =
    luggageOptions.find((option) => option.id === luggageId) ??
    luggageOptions[0];

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

    const matchesDuration = (duration: string) => {
      const hours = parseDurationHours(duration);

      switch (durationFilter) {
        case "express":
          return hours <= 3;
        case "demi-journee":
          return hours > 3 && hours <= 6;
        case "journee":
          return hours > 6 && hours <= 8;
        case "grand-format":
          return hours > 8;
        case "all":
        default:
          return true;
      }
    };

    const tours = toursData
      .filter((tour) => tour.price <= maxBudget[0])
      .filter((tour) => matchesDuration(tour.duration))
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
  }, [durationFilter, maxBudget, tourQuery, tourSortMode]);

  const filteredAveragePrice =
    filteredTours.length > 0
      ? filteredTours.reduce((total, tour) => total + tour.price, 0) /
        filteredTours.length
      : 0;

  const shortestFilteredTour =
    filteredTours.length > 0
      ? [...filteredTours].sort(
          (a, b) =>
            parseDurationHours(a.duration) - parseDurationHours(b.duration),
        )[0]
      : null;

  useSEO({
    title: "Tarifs et estimation",
    description:
      "Consultez les tarifs indicatifs taxi au Havre, simulez votre estimation en direct et filtrez les 13 circuits touristiques par budget, durée et prix.",
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
      <section className="relative overflow-hidden text-primary-foreground">
        <img
          src="/images/tarifs-page-3.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/96 via-primary/90 to-primary/78" />
        <div className="absolute inset-0 bg-[radial-gradient(34rem_22rem_at_14%_16%,hsl(var(--secondary)/0.38),transparent_62%),radial-gradient(30rem_20rem_at_86%_20%,hsl(0_0%_100%/0.15),transparent_65%)]" />
        <div className="absolute -left-16 top-10 h-52 w-52 rounded-full bg-secondary/45 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="tour-orb tour-orb--one" aria-hidden="true" />
        <div className="tour-orb tour-orb--two" aria-hidden="true" />

        <div className="relative w-full px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:px-10">
          <nav aria-label="Fil d'Ariane" className="mb-4 text-sm opacity-90">
            <Link
              to="/"
              className="underline-offset-2 transition hover:underline"
            >
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <span aria-current="page">Tarifs</span>
          </nav>

          <Badge className="border-white/35 bg-black/25 text-white hover:bg-black/35">
            Mise à jour {lastTariffUpdateDate}
          </Badge>

          <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight md:text-5xl">
            Tarifs et estimations
          </h1>
          <p className="mt-4 max-w-3xl text-base text-white/90 md:text-lg">
            Consultez les prix de référence 2025, estimez une course en direct
            et comparez les circuits touristiques en toute transparence avant
            réservation.
          </p>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-white/25 bg-black/25 p-5 shadow-[0_18px_42px_-28px_hsl(0_0%_0%/0.8)] backdrop-blur-sm md:p-6">
              <p className="text-xs uppercase tracking-widest text-white/80">
                Forfaits brochure 2025
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {quickFares.map((fare) => (
                  <div
                    key={fare.id}
                    className="rounded-xl border border-white/20 bg-white/10 p-4 transition hover:bg-white/15"
                  >
                    <p className="text-xs uppercase tracking-wide text-white/75">
                      {fare.from}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{fare.to}</p>
                    <p className="mt-3 font-heading text-2xl font-extrabold text-secondary">
                      {formatEuro(fare.basePrice)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-xl border border-white/20 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">
                <p className="text-xs uppercase tracking-wide text-white/75">
                  Tarif urbain express
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-2xl font-extrabold">
                  <Euro className="h-5 w-5" />
                  10 €
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">
                <p className="text-xs uppercase tracking-wide text-white/75">
                  Circuits disponibles
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-2xl font-extrabold">
                  <MapPin className="h-5 w-5" />
                  {toursData.length}
                </p>
              </div>
              <div className="rounded-xl border border-white/20 bg-black/25 p-4 backdrop-blur-sm transition hover:bg-black/35">
                <p className="text-xs uppercase tracking-wide text-white/75">
                  Prix moyen circuit
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-2xl font-extrabold">
                  <Sparkles className="h-5 w-5" />
                  {formatEuro(avgTourPrice)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              asChild
              size="lg"
              className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
            >
              <a href={`tel:${CONTACT_PHONE_LINK}`}>
                <Phone className="h-4 w-4" />
                Réserver immédiatement
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/45 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
            >
              <a href="#simulateur">
                Lancer l'estimation
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="simulateur"
        className="relative -mt-10 pb-16 md:-mt-12 md:pb-20"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,hsl(var(--primary)/0.08)_0%,hsl(var(--secondary)/0.08)_36%,transparent_100%)]" />
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="rounded-[1.75rem] border border-primary/15 bg-card/95 p-5 shadow-[0_24px_48px_-26px_hsl(var(--primary)/0.45)] backdrop-blur-sm md:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="font-heading text-lg font-bold md:text-xl">
                Comparez rapidement vos tarifs de course et vos circuits
              </p>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Référence 2025
              </span>
            </div>

            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-xl border bg-muted/80 p-1 sm:grid-cols-2">
                <TabsTrigger
                  value="courses"
                  className="w-full rounded-lg py-2 text-xs leading-tight whitespace-normal sm:py-2.5 sm:text-sm md:text-base"
                >
                  Courses & transferts
                </TabsTrigger>
                <TabsTrigger
                  value="circuits"
                  className="w-full rounded-lg py-2 text-xs leading-tight whitespace-normal sm:py-2.5 sm:text-sm md:text-base"
                >
                  Circuits touristiques
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="courses"
                className="mt-6 space-y-6 overflow-x-hidden"
              >
                <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="inline-flex items-center gap-2 text-sm font-semibold">
                        <Car className="h-4 w-4 text-primary" />
                        Forfaits rapides
                      </p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        indicatifs
                      </p>
                    </div>

                    {quickFares.map((fare) => {
                      const isActive = selectedRoute.id === fare.id;
                      const progress = (fare.basePrice / routeScaleMax) * 100;

                      return (
                        <button
                          key={fare.id}
                          type="button"
                          onClick={() => setSelectedRouteId(fare.id)}
                          className={`w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                            isActive
                              ? "border-primary/55 bg-[linear-gradient(135deg,hsl(var(--primary)/0.14),hsl(var(--secondary)/0.18))] shadow-[0_14px_26px_-20px_hsl(var(--primary)/0.75)]"
                              : "border-border/80 bg-background/85 hover:border-primary/35 hover:bg-primary/[0.03]"
                          }`}
                        >
                          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                            <div className="min-w-0">
                              <p className="break-words text-sm font-semibold">
                                {fare.from}{" "}
                                <span className="text-muted-foreground">→</span>{" "}
                                {fare.to}
                              </p>
                              <p className="mt-1 break-words text-xs text-muted-foreground">
                                {fare.note}
                              </p>
                            </div>
                            <p className="font-heading text-lg font-bold text-primary sm:text-xl">
                              {formatEuro(fare.basePrice)}
                            </p>
                          </div>

                          <div className="mt-3">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/35">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock3 className="h-3.5 w-3.5" />
                              {fare.eta}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl border border-primary/15 bg-background/80 p-4 shadow-[0_18px_34px_-24px_hsl(var(--primary)/0.35)] md:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="inline-flex items-center gap-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Estimateur en direct
                      </p>
                      <Badge variant="outline" className="text-xs">
                        Temps réel
                      </Badge>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Itinéraire
                        </label>
                        <Select
                          value={selectedRouteId}
                          onValueChange={setSelectedRouteId}
                        >
                          <SelectTrigger className="max-w-full">
                            <SelectValue placeholder="Choisir un trajet" />
                          </SelectTrigger>
                          <SelectContent>
                            {quickFares.map((fare) => (
                              <SelectItem key={fare.id} value={fare.id}>
                                {fare.from} → {fare.to}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Bagages
                        </label>
                        <Select value={luggageId} onValueChange={setLuggageId}>
                          <SelectTrigger className="max-w-full">
                            <SelectValue placeholder="Volume bagages" />
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
                    </div>

                    <div className="mt-4 rounded-lg border bg-card p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Période de course
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {(Object.keys(periodConfig) as PeriodMode[]).map(
                          (mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setPeriodMode(mode)}
                              className={`rounded-md border px-3 py-2 text-left text-sm transition ${
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
                          ),
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
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

                      <div>
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
                    </div>

                    <div className="mt-5 rounded-xl border border-primary/15 bg-card p-4 shadow-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Estimation indicative
                      </p>
                      <p className="mt-2 font-heading text-3xl font-extrabold text-primary">
                        {formatEuro(estimate.subtotal)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Fourchette conseillée : {formatEuro(estimate.min)} à{" "}
                        {formatEuro(estimate.max)}
                      </p>

                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Base trajet</span>
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
                            {passengers[0]} passager
                            {passengers[0] > 1 ? "s" : ""}
                          </span>
                          <span>1 à 4 inclus</span>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="mt-4 h-auto w-full whitespace-normal py-3 text-center leading-snug"
                      >
                        <a href={`tel:${CONTACT_PHONE_LINK}`}>
                          Valider cette estimation par téléphone
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="circuits" className="mt-6 space-y-6">
                <div className="grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
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
                </div>

                <div className="rounded-2xl border border-primary/15 bg-background/80 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold">
                      <Euro className="h-4 w-4 text-primary" />
                      Budget maximum
                    </p>
                    <p className="font-heading text-lg font-bold text-primary">
                      {formatEuro(maxBudget[0])}
                    </p>
                  </div>
                  <Slider
                    value={maxBudget}
                    onValueChange={setMaxBudget}
                    min={minTourPrice}
                    max={maxTourPrice}
                    step={10}
                    aria-label="Budget maximum pour les circuits"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {durationFilters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setDurationFilter(filter.id)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                        durationFilter === filter.id
                          ? "border-primary/55 bg-primary text-primary-foreground"
                          : "border-border bg-background hover:border-primary/45"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-primary/10 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Circuits affichés
                    </p>
                    <p className="mt-2 text-2xl font-extrabold">
                      {filteredTours.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/10 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Prix moyen filtré
                    </p>
                    <p className="mt-2 text-2xl font-extrabold text-primary">
                      {filteredTours.length > 0
                        ? formatEuro(filteredAveragePrice)
                        : "--"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/10 bg-background/80 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Circuit le plus court
                    </p>
                    <p className="mt-2 text-2xl font-extrabold">
                      {shortestFilteredTour
                        ? shortestFilteredTour.duration
                        : "--"}
                    </p>
                  </div>
                </div>

                {filteredTours.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredTours.map((tour, index) => (
                      <Link
                        key={tour.id}
                        to={`/circuits-touristiques/${tour.id}`}
                        className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-[0_14px_30px_-24px_hsl(var(--primary)/0.6)] transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_28px_52px_-24px_hsl(var(--primary)/0.55)]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-secondary via-primary to-secondary opacity-75" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Circuit N°{tour.id}
                        </p>
                        <h3 className="mt-1 font-heading text-lg font-bold leading-snug sm:text-xl">
                          {tour.name}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock3 className="h-4 w-4 text-primary" />
                          <span>{tour.duration}</span>
                        </div>

                        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              Tarif
                            </p>
                            <p className="font-heading text-xl font-extrabold text-primary sm:text-2xl">
                              {formatEuro(tour.price)}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                            Voir le circuit
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed bg-background/60 p-8 text-center">
                    <p className="font-heading text-xl font-bold">
                      Aucun circuit ne correspond à ce filtre.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ajustez le budget, la durée ou la recherche pour afficher
                      davantage d'options.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setTourQuery("");
                        setMaxBudget([maxTourPrice]);
                        setDurationFilter("all");
                        setTourSortMode("price-asc");
                      }}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(36rem_22rem_at_78%_12%,hsl(var(--secondary)/0.12),transparent_65%)]" />
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="rounded-[1.75rem] border border-primary/15 bg-card/95 p-5 shadow-[0_22px_46px_-30px_hsl(var(--primary)/0.55)] md:p-7">
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
