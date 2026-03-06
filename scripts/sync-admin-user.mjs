import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const envFile = path.join(repoRoot, ".env.local");

const parseEnvValue = (value) => {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const loadEnvFile = async (filePath) => {
  let raw = "";

  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    return;
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = parseEnvValue(trimmed.slice(separatorIndex + 1));

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
};

const requireEnv = (name) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
};

const main = async () => {
  await loadEnvFile(envFile);

  const supabase = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const username = requireEnv("ACTUS_ADMIN_USERNAME");
  const passwordHash = requireEnv("ACTUS_ADMIN_PASSWORD_HASH");
  const now = new Date().toISOString();

  const { error } = await supabase.from("admin_users").upsert(
    {
      username,
      password_hash: passwordHash,
      is_active: true,
      updated_at: now,
    },
    {
      onConflict: "username",
    },
  );

  if (error) {
    throw new Error(`Unable to sync admin user: ${error.message}`);
  }

  console.log(`Synced admin user "${username}" into public.admin_users.`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
