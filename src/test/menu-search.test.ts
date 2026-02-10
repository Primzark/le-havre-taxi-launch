import { describe, expect, it } from "vitest";
import { resolveMenuSearchRoute } from "@/utils/menu-search";

describe("resolveMenuSearchRoute", () => {
  it("matches accents and case-insensitive values", () => {
    expect(resolveMenuSearchRoute("Étretat")).toBe("/circuits-touristiques");
    expect(resolveMenuSearchRoute("RÉSERVATION" )).toBe("/contact");
  });

  it("matches key menu routes", () => {
    expect(resolveMenuSearchRoute("devenir taxi")).toBe("/devenir-taxi");
    expect(resolveMenuSearchRoute("actualités instagram")).toBe("/actus");
    expect(resolveMenuSearchRoute("a propos entreprise")).toBe("/entreprise");
    expect(resolveMenuSearchRoute("tarifs 2025")).toBe("/tarifs");
  });

  it("returns null for unknown query", () => {
    expect(resolveMenuSearchRoute("motcle-introuvable")).toBeNull();
  });
});
