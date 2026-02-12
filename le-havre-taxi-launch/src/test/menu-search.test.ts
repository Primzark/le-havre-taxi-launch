import { describe, expect, it } from "vitest";
import { resolveMenuSearch, resolveMenuSearchRoute } from "@/utils/menu-search";

describe("menu search resolution", () => {
  it("navigates directly for clear correct inputs", () => {
    const service = resolveMenuSearch("service medical");
    const tarif = resolveMenuSearch("tarif 2025");
    const station = resolveMenuSearch("station proche");
    const circuit = resolveMenuSearch("circuit etretat");

    expect(service.route).toBe("/services");
    expect(service.autoNavigate).toBe(true);

    expect(tarif.route).toBe("/tarifs");
    expect(tarif.autoNavigate).toBe(true);

    expect(station.route).toBe("/contact");
    expect(station.autoNavigate).toBe(true);

    expect(circuit.route).toBe("/circuits-touristiques/2");
    expect(circuit.autoNavigate).toBe(true);
  });

  it("detects typo queries but requires suggestion selection", () => {
    const serviceTypo = resolveMenuSearch("servics");
    const tarifTypo = resolveMenuSearch("tarf 2025");
    const stationTypo = resolveMenuSearch("stasion proche");
    const circuitTypo = resolveMenuSearch("cirkuit etreta");

    expect(serviceTypo.route).toBe("/services");
    expect(serviceTypo.autoNavigate).toBe(false);

    expect(tarifTypo.route).toBe("/tarifs");
    expect(tarifTypo.autoNavigate).toBe(false);

    expect(stationTypo.route).toBe("/contact");
    expect(stationTypo.autoNavigate).toBe(false);

    expect(circuitTypo.route).toBeNull();
    expect(circuitTypo.autoNavigate).toBe(false);
    expect(circuitTypo.suggestions.some((item) => item.route === "/circuits-touristiques")).toBe(true);
  });

  it("returns null for unknown query and provides suggestions", () => {
    const resolution = resolveMenuSearch("motcle-introuvable");
    expect(resolveMenuSearchRoute("motcle-introuvable")).toBeNull();
    expect(resolution.route).toBeNull();
    expect(resolution.confidence).toBe("none");
    expect(resolution.autoNavigate).toBe(false);
    expect(resolution.suggestions.length).toBeGreaterThan(0);
  });

  it("supports accents and case-insensitive matching", () => {
    expect(resolveMenuSearchRoute("Étretat")).toBe("/circuits-touristiques/2");
    expect(resolveMenuSearchRoute("RÉSERVATION")).toBe("/contact");
  });

  it("opens exact circuit detail pages from circuit names", () => {
    const leHavre = resolveMenuSearch("Le havre");
    const rouen = resolveMenuSearch("Rouen");

    expect(leHavre.route).toBe("/circuits-touristiques/1");
    expect(leHavre.autoNavigate).toBe(true);

    expect(rouen.route).toBe("/circuits-touristiques/6");
    expect(rouen.autoNavigate).toBe(true);
  });

  it("keeps tariff intent when the query explicitly asks for tariffs", () => {
    const tarif = resolveMenuSearch("tarif honfleur");
    expect(tarif.route).toBe("/tarifs");
    expect(tarif.autoNavigate).toBe(true);
  });
});
