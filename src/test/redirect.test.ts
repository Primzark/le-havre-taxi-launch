import { describe, expect, it } from "vitest";
import { buildLegacyDomainRedirectUrl } from "@/utils/redirect";

describe("buildLegacyDomainRedirectUrl", () => {
  it("returns a redirect url for legacy hosts", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxihavre.com",
      "/contact",
      "?source=google",
      "#section",
      "https://taxi-le-havre.com",
    );

    expect(result).toBe("https://taxi-le-havre.com/contact?source=google#section");
  });

  it("returns a redirect url for lovable host", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxi-le-havre-hub.lovable.app",
      "/tarifs",
      "",
      "",
      "https://taxi-le-havre.com",
    );

    expect(result).toBe("https://taxi-le-havre.com/tarifs");
  });

  it("returns null for non-legacy hosts", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxi-le-havre.com",
      "/",
      "",
      "",
      "https://taxi-le-havre.com",
    );

    expect(result).toBeNull();
  });
});
