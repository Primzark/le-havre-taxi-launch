import { describe, expect, it } from "vitest";
import { buildLegacyDomainRedirectUrl } from "@/utils/redirect";

describe("buildLegacyDomainRedirectUrl", () => {
  it("returns a redirect url for legacy hosts", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxihavre.com",
      "/contact",
      "?source=google",
      "#section",
      "https://le-havre-taxi-launch.vercel.app",
    );

    expect(result).toBe("https://le-havre-taxi-launch.vercel.app/contact?source=google#section");
  });

  it("redirects legacy custom domains to the Vercel alias", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxis-lehavre.com",
      "/",
      "",
      "",
      "https://le-havre-taxi-launch.vercel.app",
    );

    expect(result).toBe("https://le-havre-taxi-launch.vercel.app/");
  });

  it("returns null for the canonical host", () => {
    const result = buildLegacyDomainRedirectUrl(
      "le-havre-taxi-launch.vercel.app",
      "/",
      "",
      "",
      "https://le-havre-taxi-launch.vercel.app",
    );

    expect(result).toBeNull();
  });
});
