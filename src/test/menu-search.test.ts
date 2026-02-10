import { describe, expect, it } from "vitest";
import { resolveMenuSearch, resolveMenuSearchRoute } from "@/utils/menu-search";

describe("menu search resolution", () => {
  it("matches accents and case-insensitive values", () => {
    expect(resolveMenuSearchRoute("Étretat")).toBe("/circuits-touristiques");
    expect(resolveMenuSearchRoute("RÉSERVATION")).toBe("/contact");
  });

  it("tolerates common typos", () => {
    expect(resolveMenuSearchRoute("servics")).toBe("/services");
    expect(resolveMenuSearchRoute("tarf 2025")).toBe("/tarifs");
    expect(resolveMenuSearchRoute("stasion proche")).toBe("/contact");
    expect(resolveMenuSearchRoute("cirkuit etreta")).toBe("/circuits-touristiques");
  });

  it("returns actionable feedback when query is unknown", () => {
    const resolution = resolveMenuSearch("motcle-introuvable");
    expect(resolution.route).toBeNull();
    expect(resolution.confidence).toBe("none");
    expect(resolution.suggestions.length).toBeGreaterThan(0);
  });
});
