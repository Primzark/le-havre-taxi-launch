import { describe, expect, it } from "vitest";
import { buildLegacyDomainRedirectUrl } from "@/utils/redirect";

describe("buildLegacyDomainRedirectUrl", () => {
  it("returns a redirect url for legacy hosts", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxihavre.com",
      "/contact",
      "?source=google",
      "#section",
      "https://www.taxis-lehavre.com",
    );

    expect(result).toBe("https://www.taxis-lehavre.com/contact?source=google#section");
  });

  it("redirects non-www current domain to www", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxis-lehavre.com",
      "/",
      "",
      "",
      "https://www.taxis-lehavre.com",
    );

    expect(result).toBe("https://www.taxis-lehavre.com/");
  });

  it("returns null for the canonical host", () => {
    const result = buildLegacyDomainRedirectUrl(
      "www.taxis-lehavre.com",
      "/",
      "",
      "",
      "https://www.taxis-lehavre.com",
    );

    expect(result).toBeNull();
  });
});
