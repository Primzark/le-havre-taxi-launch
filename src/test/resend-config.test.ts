import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createClientMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

const trackedEnvKeys = [
  "MAIL_PROVIDER",
  "MAIL_FROM_EMAIL",
  "MAIL_FROM_NAME",
  "RESEND_API_KEY",
];

const clearTrackedEnv = () => {
  for (const key of trackedEnvKeys) {
    delete process.env[key];
  }
};

describe("Resend mail configuration", () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockReset();
    clearTrackedEnv();
  });

  afterEach(() => {
    clearTrackedEnv();
    vi.restoreAllMocks();
  });

  it("defaults to Resend when an API key is present", async () => {
    process.env.RESEND_API_KEY = "re_test_key";

    const { getMailProvider } = await import("../../api/_lib/core.js");

    expect(getMailProvider()).toBe("resend");
  });

  it("returns a clear error when MAIL_FROM_EMAIL is missing for Resend", async () => {
    process.env.MAIL_PROVIDER = "resend";
    process.env.RESEND_API_KEY = "re_test_key";

    const { sendContactEmail } = await import("../../api/_lib/core.js");

    await expect(
      sendContactEmail(
        { headers: {}, socket: { remoteAddress: "127.0.0.1" } },
        {
          to: "contact@example.com",
          subject: "Test",
          body: "Bonjour",
          replyTo: "client@example.com",
        },
      ),
    ).resolves.toMatchObject({
      delivered: false,
      provider: "resend",
      error: expect.stringContaining("MAIL_FROM_EMAIL"),
    });
  });

  it("sends through Resend with the configured sender address", async () => {
    process.env.MAIL_PROVIDER = "resend";
    process.env.MAIL_FROM_EMAIL = "contact@mail.example.com";
    process.env.MAIL_FROM_NAME = "Taxi Le Havre";
    process.env.RESEND_API_KEY = "re_test_key";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "",
    });
    vi.stubGlobal("fetch", fetchMock);

    const { sendContactEmail } = await import("../../api/_lib/core.js");

    await expect(
      sendContactEmail(
        { headers: {}, socket: { remoteAddress: "127.0.0.1" } },
        {
          to: "contact@example.com",
          subject: "Test",
          body: "Bonjour",
          replyTo: "client@example.com",
        },
      ),
    ).resolves.toMatchObject({
      delivered: true,
      provider: "resend",
      error: "",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer re_test_key",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          from: "Taxi Le Havre <contact@mail.example.com>",
          to: ["contact@example.com"],
          subject: "Test",
          text: "Bonjour",
          reply_to: "client@example.com",
        }),
      }),
    );
  });
});
