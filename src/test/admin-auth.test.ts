import bcrypt from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const createClientMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

const trackedEnvKeys = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ACTUS_ADMIN_USERNAME",
  "ACTUS_ADMIN_PASSWORD_HASH",
];

const clearTrackedEnv = () => {
  for (const key of trackedEnvKeys) {
    delete process.env[key];
  }
};

describe("verifyAdminCredentials", () => {
  beforeEach(() => {
    vi.resetModules();
    createClientMock.mockReset();
    clearTrackedEnv();

    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    process.env.ACTUS_ADMIN_USERNAME = "admin";
  });

  afterEach(() => {
    clearTrackedEnv();
  });

  it("authenticates against the Supabase admin_users table when a row exists", async () => {
    const databaseHash = bcrypt.hashSync("db-backed-secret", 4);
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        username: "admin",
        password_hash: databaseHash,
        is_active: true,
      },
      error: null,
    });
    const eqForSelect = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq: eqForSelect });
    const eqForUpdate = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq: eqForUpdate });
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn((table: string) => {
      if (table === "admin_users") {
        return { select, update };
      }

      if (table === "api_events") {
        return { insert };
      }

      return { insert };
    });

    createClientMock.mockReturnValue({
      from,
      storage: { from: vi.fn() },
    });
    process.env.ACTUS_ADMIN_PASSWORD_HASH = bcrypt.hashSync("env-fallback-secret", 4);

    const { verifyAdminCredentials } = await import("../../api/_lib/core.js");

    await expect(verifyAdminCredentials("admin", "db-backed-secret")).resolves.toBe(true);
    expect(from).toHaveBeenCalledWith("admin_users");
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        last_login_at: expect.any(String),
        updated_at: expect.any(String),
      }),
    );
  });

  it("falls back to the env hash when the admin_users table is not available yet", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: {
        code: "42P01",
        message: 'relation "admin_users" does not exist',
      },
    });
    const eqForSelect = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq: eqForSelect });
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn((table: string) => {
      if (table === "admin_users") {
        return { select };
      }

      if (table === "api_events") {
        return { insert };
      }

      return { insert };
    });

    createClientMock.mockReturnValue({
      from,
      storage: { from: vi.fn() },
    });
    process.env.ACTUS_ADMIN_PASSWORD_HASH = bcrypt.hashSync("env-bootstrap-secret", 4);

    const { verifyAdminCredentials } = await import("../../api/_lib/core.js");

    await expect(verifyAdminCredentials("admin", "env-bootstrap-secret")).resolves.toBe(true);
  });
});
