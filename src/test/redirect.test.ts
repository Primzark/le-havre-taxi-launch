import { describe, expect, it } from "vitest";
import { buildLegacyDomainRedirectUrl } from "@/utils/redirect";

describe("buildLegacyDomainRedirectUrl", () => {
  it("returns a redirect url for legacy hosts", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxihavre.com",
      "/contact",
      "?source=google",
      "#section",
      "https://taxis-lehavre.com",
    );

    expect(result).toBe("https://taxis-lehavre.com/contact?source=google#section");
  });

  it("returns null for non-legacy hosts", () => {
    const result = buildLegacyDomainRedirectUrl(
      "taxis-lehavre.com",
      "/",
      "",
      "",
      "https://taxis-lehavre.com",
    );

    expect(result).toBeNull();
  });
});
