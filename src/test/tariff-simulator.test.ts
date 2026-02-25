import { describe, expect, it } from "vitest";
import {
  TAXI_DECREE_2026,
  calculateTariffEstimate,
} from "@/lib/tariff-simulator";

describe("calculateTariffEstimate", () => {
  it("uses decree hourly waiting rate for day waiting", () => {
    const estimate = calculateTariffEstimate({
      kind: "course",
      periodMode: "jour",
      basePrice: 70,
      stops: 0,
      waitingMinutes: 30,
      passengers: 2,
      luggageSupplementCount: 0,
    });

    expect(estimate.waitingRatePerHour).toBe(TAXI_DECREE_2026.attenteJourParHeure);
    expect(estimate.waitingFee).toBeCloseTo(12.225, 6);
  });

  it("uses decree hourly waiting rate for night waiting", () => {
    const estimate = calculateTariffEstimate({
      kind: "course",
      periodMode: "nuit",
      basePrice: 70,
      stops: 0,
      waitingMinutes: 30,
      passengers: 2,
      luggageSupplementCount: 0,
    });

    expect(estimate.waitingRatePerHour).toBe(TAXI_DECREE_2026.attenteNuitParHeure);
    expect(estimate.waitingFee).toBeCloseTo(15.76, 6);
  });

  it("applies passenger supplement only from the 5th passenger", () => {
    const fourPassengers = calculateTariffEstimate({
      kind: "course",
      periodMode: "jour",
      basePrice: 10,
      stops: 0,
      waitingMinutes: 0,
      passengers: 4,
      luggageSupplementCount: 0,
    });
    const fivePassengers = calculateTariffEstimate({
      kind: "course",
      periodMode: "jour",
      basePrice: 10,
      stops: 0,
      waitingMinutes: 0,
      passengers: 5,
      luggageSupplementCount: 0,
    });
    const eightPassengers = calculateTariffEstimate({
      kind: "course",
      periodMode: "jour",
      basePrice: 10,
      stops: 0,
      waitingMinutes: 0,
      passengers: 8,
      luggageSupplementCount: 0,
    });

    expect(fourPassengers.passengerFee).toBe(0);
    expect(fivePassengers.passengerFee).toBe(4);
    expect(eightPassengers.passengerFee).toBe(16);
  });

  it("uses decree bagage supplement increments", () => {
    const none = calculateTariffEstimate({
      kind: "course",
      periodMode: "jour",
      basePrice: 10,
      stops: 0,
      waitingMinutes: 0,
      passengers: 2,
      luggageSupplementCount: 0,
    });
    const one = calculateTariffEstimate({
      kind: "course",
      periodMode: "jour",
      basePrice: 10,
      stops: 0,
      waitingMinutes: 0,
      passengers: 2,
      luggageSupplementCount: 1,
    });
    const two = calculateTariffEstimate({
      kind: "course",
      periodMode: "jour",
      basePrice: 10,
      stops: 0,
      waitingMinutes: 0,
      passengers: 2,
      luggageSupplementCount: 2,
    });

    expect(none.luggageFee).toBe(0);
    expect(one.luggageFee).toBe(2);
    expect(two.luggageFee).toBe(4);
  });

  it("applies the legal minimum fare for low-value courses", () => {
    const estimate = calculateTariffEstimate({
      kind: "course",
      periodMode: "jour",
      basePrice: 6,
      stops: 0,
      waitingMinutes: 0,
      passengers: 1,
      luggageSupplementCount: 0,
    });

    expect(estimate.rawSubtotal).toBe(6);
    expect(estimate.subtotal).toBe(8);
    expect(estimate.minimumApplied).toBe(true);
    expect(estimate.min).toBe(8);
  });

  it("keeps circuit estimates on brochure base without course minimum floor", () => {
    const estimate = calculateTariffEstimate({
      kind: "circuit",
      periodMode: "jour",
      basePrice: 350,
      stops: 0,
      waitingMinutes: 0,
      passengers: 4,
      luggageSupplementCount: 0,
    });

    expect(estimate.minimumApplied).toBe(false);
    expect(estimate.subtotal).toBe(350);
    expect(estimate.min).toBe(350);
  });

  it("uses decree-derived night ratio instead of the old 1.2 multiplier", () => {
    const estimate = calculateTariffEstimate({
      kind: "course",
      periodMode: "nuit",
      basePrice: 10,
      stops: 0,
      waitingMinutes: 0,
      passengers: 2,
      luggageSupplementCount: 0,
    });

    expect(estimate.baseMultiplier).toBeCloseTo(1.275, 3);
    expect(estimate.base).toBeCloseTo(12.75, 6);
  });
});
