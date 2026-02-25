export type TariffPeriodMode = "jour" | "nuit";
export type SimulatorRouteKind = "course" | "circuit";
export type TariffClass = "A" | "B" | "C" | "D";

export type TaxiDecree2026 = {
  decreeDateIso: string;
  priseEnCharge: number;
  tarifA: number;
  tarifB: number;
  tarifC: number;
  tarifD: number;
  attenteJourParHeure: number;
  attenteNuitParHeure: number;
  courseMinimale: number;
  supplementPassager5Plus: number;
  supplementBagage: number;
};

export const TAXI_DECREE_2026: TaxiDecree2026 = {
  decreeDateIso: "2026-02-09",
  priseEnCharge: 2.33,
  tarifA: 1.2,
  tarifB: 1.53,
  tarifC: 2.4,
  tarifD: 3.06,
  attenteJourParHeure: 24.45,
  attenteNuitParHeure: 31.52,
  courseMinimale: 8,
  supplementPassager5Plus: 4,
  supplementBagage: 2,
};

export const STOP_WAITING_EQUIVALENT_MINUTES = 5;

export type TariffSimulatorInput = {
  decree?: TaxiDecree2026;
  kind: SimulatorRouteKind;
  periodMode: TariffPeriodMode;
  basePrice: number;
  stops: number;
  waitingMinutes: number;
  passengers: number;
  luggageSupplementCount: number;
};

export type SimulatorEstimateBreakdown = {
  appliedTariffClass: TariffClass;
  baseMultiplier: number;
  waitingRatePerHour: number;
  base: number;
  stopFee: number;
  waitingFee: number;
  luggageFee: number;
  passengerFee: number;
  rawSubtotal: number;
  subtotal: number;
  minimumApplied: boolean;
  min: number;
  max: number;
};

export const getTariffClass = (
  kind: SimulatorRouteKind,
  periodMode: TariffPeriodMode,
): TariffClass => {
  if (kind === "course") {
    return periodMode === "jour" ? "A" : "B";
  }

  return periodMode === "jour" ? "C" : "D";
};

const getNightMultiplier = (kind: SimulatorRouteKind, decree: TaxiDecree2026): number => {
  if (kind === "course") {
    return decree.tarifB / decree.tarifA;
  }

  return decree.tarifD / decree.tarifC;
};

export const calculateTariffEstimate = ({
  decree = TAXI_DECREE_2026,
  kind,
  periodMode,
  basePrice,
  stops,
  waitingMinutes,
  passengers,
  luggageSupplementCount,
}: TariffSimulatorInput): SimulatorEstimateBreakdown => {
  const normalizedStops = Math.max(0, Math.round(stops));
  const normalizedWaitingMinutes = Math.max(0, waitingMinutes);
  const normalizedPassengers = Math.max(1, Math.round(passengers));
  const normalizedLuggageSupplementCount = Math.max(0, Math.round(luggageSupplementCount));

  const waitingRatePerHour =
    periodMode === "jour" ? decree.attenteJourParHeure : decree.attenteNuitParHeure;
  const baseMultiplier = periodMode === "jour" ? 1 : getNightMultiplier(kind, decree);
  const base = basePrice * baseMultiplier;
  const stopFee =
    (normalizedStops * STOP_WAITING_EQUIVALENT_MINUTES * waitingRatePerHour) / 60;
  const waitingFee = (normalizedWaitingMinutes * waitingRatePerHour) / 60;
  const luggageFee = normalizedLuggageSupplementCount * decree.supplementBagage;
  const passengerFee =
    Math.max(0, normalizedPassengers - 4) * decree.supplementPassager5Plus;

  const rawSubtotal = base + stopFee + waitingFee + luggageFee + passengerFee;
  const minimumFloor = kind === "course" ? decree.courseMinimale : 0;
  const subtotal = kind === "course" ? Math.max(decree.courseMinimale, rawSubtotal) : rawSubtotal;
  const minimumApplied = kind === "course" && subtotal > rawSubtotal;

  // Keep the existing indicative range behavior but prevent the lower bound from dipping
  // under the displayed reference base price (or legal minimum for low-value courses).
  const lowerBoundFloor = kind === "course"
    ? Math.max(minimumFloor, basePrice)
    : basePrice;
  const min = Math.max(lowerBoundFloor, subtotal - 4);
  const max = subtotal + (periodMode === "nuit" ? 10 : 7);

  return {
    appliedTariffClass: getTariffClass(kind, periodMode),
    baseMultiplier,
    waitingRatePerHour,
    base,
    stopFee,
    waitingFee,
    luggageFee,
    passengerFee,
    rawSubtotal,
    subtotal,
    minimumApplied,
    min,
    max,
  };
};
