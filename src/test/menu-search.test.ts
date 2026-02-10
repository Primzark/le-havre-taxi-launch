import { describe, expect, it } from "vitest";
import { resolveMenuSearch, resolveMenuSearchRoute } from "@/utils/menu-search";

const getParam = (destination: string | null, key: string): string | null => {
  if (!destination) {
    return null;
  }

  return new URL(destination, "https://taxi.local").searchParams.get(key);
};

describe("menu search resolution", () => {
  it("navigates directly for clear correct inputs", () => {
    const service = resolveMenuSearch("service medical");
    const tarif = resolveMenuSearch("tarif 2025");
    const station = resolveMenuSearch("station proche");
    const circuit = resolveMenuSearch("circuit etretat");

    expect(service.route).toBe("/services");
    expect(service.autoNavigate).toBe(true);
    expect(service.destination).toContain("/services");
    expect(getParam(service.destination, "q")).toContain("medical");

    expect(tarif.route).toBe("/tarifs");
    expect(tarif.autoNavigate).toBe(true);
    expect(tarif.destination).toBe("/tarifs");

    expect(station.route).toBe("/contact");
    expect(station.autoNavigate).toBe(true);
    expect(station.destination).toBe("/contact");

    expect(circuit.route).toBe("/circuits-touristiques");
    expect(circuit.autoNavigate).toBe(true);
    expect(circuit.destination).toContain("/circuits-touristiques");
    expect(getParam(circuit.destination, "q")).toBe("etretat");
  });

  it("detects typo queries but requires suggestion selection", () => {
    const serviceTypo = resolveMenuSearch("servics");
    const tarifTypo = resolveMenuSearch("tarf 2025");
    const stationTypo = resolveMenuSearch("stasion proche");
    const circuitTypo = resolveMenuSearch("cirkuit etreta");

    expect(serviceTypo.route).toBe("/services");
    expect(serviceTypo.autoNavigate).toBe(false);
    expect(serviceTypo.destination).toContain("/services");

    expect(tarifTypo.route).toBe("/tarifs");
    expect(tarifTypo.autoNavigate).toBe(false);
    expect(tarifTypo.destination).toContain("/tarifs");

    expect(stationTypo.route).toBe("/contact");
    expect(stationTypo.autoNavigate).toBe(false);
    expect(stationTypo.destination).toContain("/contact");

    expect(circuitTypo.autoNavigate).toBe(false);
    expect(circuitTypo.suggestions.some((item) => item.route === "/circuits-touristiques")).toBe(true);
  });

  it("returns null for unknown query and provides suggestions", () => {
    const resolution = resolveMenuSearch("motcle-introuvable");
    expect(resolveMenuSearchRoute("motcle-introuvable")).toBeNull();
    expect(resolution.route).toBeNull();
    expect(resolution.destination).toBeNull();
    expect(resolution.confidence).toBe("none");
    expect(resolution.autoNavigate).toBe(false);
    expect(resolution.suggestions.length).toBeGreaterThan(0);
  });

  it("supports accents and case-insensitive matching", () => {
    expect(resolveMenuSearchRoute("Étretat")).toBe("/circuits-touristiques");
    expect(resolveMenuSearchRoute("RÉSERVATION")).toBe("/contact");
  });

  it("creates URL filters for circuits, tarifs, and stations", () => {
    const circuit = resolveMenuSearch("touristic circuit of le havre");
    const tarif = resolveMenuSearch("tarif honfleur");
    const station = resolveMenuSearch("station gare sncf");

    expect(circuit.route).toBe("/circuits-touristiques");
    expect(circuit.autoNavigate).toBe(true);
    expect(getParam(circuit.destination, "q")).toBe("le havre");

    expect(tarif.route).toBe("/tarifs");
    expect(tarif.autoNavigate).toBe(true);
    expect(getParam(tarif.destination, "q")).toBe("honfleur");

    expect(station.route).toBe("/contact");
    expect(station.autoNavigate).toBe(true);
    expect(getParam(station.destination, "station")).toContain("gare");
  });
});
