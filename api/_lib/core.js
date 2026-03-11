import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

const LOCAL_DEV_ORIGINS = new Set([
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

const ADMIN_COOKIE_NAME = "taxi_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;
const DEFAULT_UPLOAD_BUCKET = "actus";
const ADMIN_USERS_TABLE = "admin_users";

let supabaseAdminClient;

export class ApiHttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.payload = { success: false, error: message, ...extra };
  }
}

export function jsonResponse(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "same-origin");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

export function textResponse(res, status, text, headers = {}) {
  res.statusCode = status;
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.end(text);
}

export function redirectResponse(res, location, status = 307) {
  res.statusCode = status;
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end("");
}

export function applyCors(req, res) {
  const origin = getHeader(req, "origin");
  if (!origin || !LOCAL_DEV_ORIGINS.has(origin)) {
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export function handleOptions(req, res) {
  applyCors(req, res);
  if ((req.method || "GET").toUpperCase() !== "OPTIONS") {
    return false;
  }

  res.statusCode = 204;
  res.end("");
  return true;
}

export async function withApiHandler(req, res, handler) {
  applyCors(req, res);

  try {
    await handler(req, res);
  } catch (error) {
    if (error instanceof ApiHttpError) {
      jsonResponse(res, error.status, error.payload);
      return;
    }

    await apiLog("error", "unhandled_exception", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    await sendAlert("Unhandled API exception", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    jsonResponse(res, 500, { success: false, error: "Internal server error" });
  }
}

export function methodNotAllowed() {
  throw new ApiHttpError(405, "Method not allowed");
}

export function unauthorized() {
  throw new ApiHttpError(401, "Unauthorized");
}

export function badRequest(message, extra = {}) {
  throw new ApiHttpError(422, message, extra);
}

export function serviceUnavailable(message, extra = {}) {
  throw new ApiHttpError(503, message, extra);
}

export function getHeader(req, name) {
  const raw = req.headers?.[name.toLowerCase()];
  if (Array.isArray(raw)) {
    return raw[0] || "";
  }
  return typeof raw === "string" ? raw : "";
}

export function getRequestUrl(req) {
  const proto = getHeader(req, "x-forwarded-proto") || "http";
  const host =
    getHeader(req, "x-forwarded-host") ||
    getHeader(req, "host") ||
    "localhost";
  return new URL(req.url || "/", `${proto}://${host}`);
}

export async function readRawBody(req, maxBytes = 2_000_000) {
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }

  if (typeof req.body === "string") {
    return Buffer.from(req.body);
  }

  if (req.body && typeof req.body === "object") {
    return Buffer.from(JSON.stringify(req.body));
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on("data", (chunk) => {
      const bufferChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += bufferChunk.length;
      if (total > maxBytes) {
        reject(new ApiHttpError(413, "Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(bufferChunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export async function getRequestPayload(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  const contentType = getHeader(req, "content-type").toLowerCase();
  const raw = await readRawBody(req);
  if (!raw.length) {
    return {};
  }

  if (contentType.includes("application/json")) {
    try {
      const decoded = JSON.parse(raw.toString("utf8"));
      return decoded && typeof decoded === "object" ? decoded : {};
    } catch {
      throw new ApiHttpError(400, "Invalid JSON payload");
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams(raw.toString("utf8"));
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result;
  }

  return {};
}

export function sanitizeText(value, maxLength) {
  const normalized = String(value ?? "").trim();
  return normalized.length > maxLength
    ? normalized.slice(0, maxLength)
    : normalized;
}

export function sanitizeMultilineText(value, maxLength) {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
  return normalized.length > maxLength
    ? normalized.slice(0, maxLength)
    : normalized;
}

export function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function isWebpReference(value) {
  try {
    const url = new URL(value, "https://placeholder.local");
    return url.pathname.toLowerCase().endsWith(".webp");
  } catch {
    return false;
  }
}

export function normalizeNewsSourceName(value) {
  if (value === "Facebook") {
    return "Facebook";
  }

  if (value === "Actualite") {
    return "Actualite";
  }

  return "Instagram";
}

export function isAdminNewsRow(row) {
  const id = String(row?.id || "");
  const sourceName = String(row?.source_name || row?.sourceName || "");

  return (
    sourceName === "Actualite" ||
    id.startsWith("news-") ||
    id.startsWith("manual-")
  );
}

export function isValidNewsImageReference(image) {
  if (!isWebpReference(image)) {
    return false;
  }

  if (
    String(image).startsWith("/images/") ||
    String(image).startsWith("/uploads/actus/")
  ) {
    return true;
  }

  return isValidHttpUrl(image);
}

export function getClientIp(req) {
  const forwardedFor = getHeader(req, "x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = getHeader(req, "x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return req.socket?.remoteAddress || "unknown";
}

function env(name) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export function requireEnv(name) {
  const value = env(name);
  if (!value) {
    throw new ApiHttpError(500, `Missing server configuration: ${name}`);
  }
  return value;
}

export function getSupabaseUrl() {
  return env("SUPABASE_URL") || env("VITE_SUPABASE_URL");
}

export function getSupabaseServiceRoleKey() {
  return env("SUPABASE_SERVICE_ROLE_KEY");
}

export function getSupabaseAdminClient() {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!url || !serviceRoleKey) {
    throw new ApiHttpError(
      500,
      "Supabase backend is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  supabaseAdminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseAdminClient;
}

export function getUploadBucket() {
  return env("SUPABASE_ACTUS_BUCKET") || env("SUPABASE_STORAGE_BUCKET") || DEFAULT_UPLOAD_BUCKET;
}

export function buildUploadPublicPath(filename) {
  return `/uploads/actus/${filename}`;
}

export function publicUploadPathToStorageKey(publicPath) {
  if (!String(publicPath).startsWith("/uploads/actus/")) {
    return null;
  }
  return `actus/${String(publicPath).slice("/uploads/actus/".length)}`;
}

export function uploadsRewritePathToStorageKey(pathValue) {
  const clean = String(pathValue ?? "").replace(/^\/+/, "");
  if (!clean.startsWith("actus/")) {
    return null;
  }
  return clean;
}

export function getPublicStorageUrl(storageKey) {
  const supabase = getSupabaseAdminClient();
  const { data } = supabase.storage.from(getUploadBucket()).getPublicUrl(storageKey);
  return data?.publicUrl || "";
}

export async function deleteUploadedImageIfManaged(imagePath) {
  const storageKey = publicUploadPathToStorageKey(imagePath);
  if (!storageKey) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage.from(getUploadBucket()).remove([storageKey]);
  if (error) {
    await apiLog("warning", "storage_delete_failed", {
      imagePath,
      error: error.message,
    });
  }
}

export async function apiLog(level, event, context = {}) {
  const line = {
    time: new Date().toISOString(),
    level,
    event,
    context,
  };
  // Always emit to function logs.
  console[level === "error" ? "error" : "log"]("[api]", JSON.stringify(line));

  const supabase = safeGetSupabaseClient();
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("api_events").insert({
    level,
    event,
    context,
  });
  if (error) {
    console.error("[api] api_events_insert_failed", error.message);
  }
}

function safeGetSupabaseClient() {
  try {
    return getSupabaseAdminClient();
  } catch {
    return null;
  }
}

export function getAlertWebhookUrl() {
  return env("ALERT_WEBHOOK_URL");
}

export async function sendAlert(title, context = {}) {
  const webhook = getAlertWebhookUrl();
  if (!webhook) {
    return;
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: title, context }),
    });
  } catch (error) {
    console.error("[api] alert_webhook_failed", error instanceof Error ? error.message : error);
  }
}

export function getAdminUsername() {
  return env("ACTUS_ADMIN_USERNAME") || "admin";
}

export function getAdminPasswordHash() {
  return env("ACTUS_ADMIN_PASSWORD_HASH");
}

function normalizeBcryptHash(hash) {
  if (String(hash).startsWith("$2y$")) {
    return `$2b$${String(hash).slice(4)}`;
  }
  return String(hash);
}

function isMissingAdminUsersTableError(error) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "").toLowerCase();

  if (code === "42P01") {
    return true;
  }

  if (code === "PGRST205" && message.includes(ADMIN_USERS_TABLE)) {
    return true;
  }

  return (
    message.includes(`relation "${ADMIN_USERS_TABLE}" does not exist`) ||
    message.includes(`table '${ADMIN_USERS_TABLE}'`) ||
    message.includes(`table "${ADMIN_USERS_TABLE}"`)
  );
}

async function getDatabaseAdminUser(username) {
  const supabase = safeGetSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(ADMIN_USERS_TABLE)
    .select("username, password_hash, is_active")
    .eq("username", String(username))
    .maybeSingle();

  if (error) {
    if (isMissingAdminUsersTableError(error)) {
      return null;
    }

    await apiLog("error", "admin_user_lookup_failed", {
      username,
      error: error.message,
    });
    return null;
  }

  return data ?? null;
}

async function touchDatabaseAdminLogin(username) {
  const supabase = safeGetSupabaseClient();
  if (!supabase) {
    return;
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from(ADMIN_USERS_TABLE)
    .update({
      updated_at: now,
      last_login_at: now,
    })
    .eq("username", String(username));

  if (error && !isMissingAdminUsersTableError(error)) {
    await apiLog("warning", "admin_last_login_update_failed", {
      username,
      error: error.message,
    });
  }
}

export async function verifyAdminCredentials(username, password) {
  const submittedUsername = String(username);
  const submittedPassword = String(password);
  const databaseAdmin = await getDatabaseAdminUser(submittedUsername);

  if (databaseAdmin) {
    if (databaseAdmin.is_active === false) {
      return false;
    }

    try {
      const isValid = await bcrypt.compare(
        submittedPassword,
        normalizeBcryptHash(databaseAdmin.password_hash),
      );

      if (isValid) {
        await touchDatabaseAdminLogin(databaseAdmin.username);
      }

      return isValid;
    } catch {
      return false;
    }
  }

  const expectedUsername = getAdminUsername();
  const expectedHash = getAdminPasswordHash();

  if (!expectedHash) {
    await apiLog("error", "admin_hash_missing", {});
    return false;
  }

  if (String(username) !== expectedUsername) {
    return false;
  }

  try {
    return await bcrypt.compare(submittedPassword, normalizeBcryptHash(expectedHash));
  } catch {
    return false;
  }
}

function getAdminSessionSecret() {
  return env("ADMIN_SESSION_SECRET") || getAdminPasswordHash();
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signSessionPayload(payloadBase64) {
  const secret = getAdminSessionSecret();
  if (!secret) {
    throw new ApiHttpError(
      500,
      "Missing server configuration: ADMIN_SESSION_SECRET or ACTUS_ADMIN_PASSWORD_HASH",
    );
  }

  return createHmac("sha256", secret).update(payloadBase64).digest("base64url");
}

function getCookieSecureFlag(req) {
  const proto = (getHeader(req, "x-forwarded-proto") || "").toLowerCase();
  if (proto) {
    return proto === "https";
  }

  const host = (getHeader(req, "host") || "").toLowerCase();
  return host !== "" && !host.startsWith("localhost") && !host.startsWith("127.0.0.1");
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${value}`];
  parts.push(`Path=${options.path || "/"}`);

  if (typeof options.maxAge === "number") {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }
  if (options.httpOnly !== false) {
    parts.push("HttpOnly");
  }
  if (options.secure) {
    parts.push("Secure");
  }
  parts.push(`SameSite=${options.sameSite || "Strict"}`);
  return parts.join("; ");
}

function appendSetCookie(res, cookieValue) {
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", cookieValue);
    return;
  }
  if (Array.isArray(current)) {
    res.setHeader("Set-Cookie", [...current, cookieValue]);
    return;
  }
  res.setHeader("Set-Cookie", [String(current), cookieValue]);
}

export function issueAdminSession(res, req, username) {
  const payload = {
    u: String(username),
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS,
  };
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
  const signature = signSessionPayload(payloadBase64);
  const token = `${payloadBase64}.${signature}`;

  appendSetCookie(
    res,
    serializeCookie(ADMIN_COOKIE_NAME, token, {
      maxAge: ADMIN_SESSION_TTL_SECONDS,
      secure: getCookieSecureFlag(req),
      sameSite: "Strict",
      httpOnly: true,
      path: "/",
    }),
  );
}

export function clearAdminSession(res, req) {
  appendSetCookie(
    res,
    serializeCookie(ADMIN_COOKIE_NAME, "", {
      maxAge: 0,
      secure: getCookieSecureFlag(req),
      sameSite: "Strict",
      httpOnly: true,
      path: "/",
    }),
  );
}

export function parseCookies(req) {
  const raw = getHeader(req, "cookie");
  if (!raw) {
    return {};
  }

  const parsed = {};
  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (!key) continue;
    parsed[key] = decodeURIComponent(rest.join("="));
  }
  return parsed;
}

export function getAdminSession(req) {
  const cookies = parseCookies(req);
  const token = cookies[ADMIN_COOKIE_NAME];
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payloadBase64, signature] = token.split(".", 2);
  const expectedSignature = signSessionPayload(payloadBase64);

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadBase64));
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const exp = Number(payload.exp || 0);
    if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    const username = String(payload.u || "");
    if (!username) {
      return null;
    }

    return { username, exp };
  } catch {
    return null;
  }
}

export function requireAdminSession(req) {
  const session = getAdminSession(req);
  if (!session) {
    unauthorized();
  }
  return session;
}

export function getContactEmail() {
  return env("CONTACT_FORM_EMAIL") || "bureautaxi@gmail.com";
}

export function getMailProvider() {
  return (env("MAIL_PROVIDER") || "mail").toLowerCase();
}

export function getMailFromEmail(req) {
  const explicit = env("MAIL_FROM_EMAIL");
  if (explicit) return explicit;

  const host = (getHeader(req, "host") || "le-havre-taxi-launch.vercel.app").replace(/[^a-zA-Z0-9.-]/g, "");
  return `no-reply@${host || "le-havre-taxi-launch.vercel.app"}`;
}

export function getMailFromName() {
  return env("MAIL_FROM_NAME") || "Taxi Le Havre";
}

export function getResendApiKey() {
  return env("RESEND_API_KEY");
}

export async function sendContactEmail(req, { to, subject, body, replyTo }) {
  const provider = getMailProvider();

  if (provider !== "resend") {
    return {
      delivered: false,
      provider,
      error: "MAIL_PROVIDER=mail is not supported on Vercel. Configure MAIL_PROVIDER=resend.",
    };
  }

  const apiKey = getResendApiKey();
  if (!apiKey) {
    return {
      delivered: false,
      provider: "resend",
      error: "RESEND_API_KEY is not configured",
    };
  }

  const payload = {
    from: `${getMailFromName()} <${getMailFromEmail(req)}>`,
    to: [to],
    subject,
    text: body,
    ...(replyTo ? { reply_to: replyTo } : {}),
  };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        delivered: false,
        provider: "resend",
        error: `Resend request failed: HTTP ${response.status}${text ? ` (${text.slice(0, 200)})` : ""}`,
      };
    }

    return { delivered: true, provider: "resend", error: "" };
  } catch (error) {
    return {
      delivered: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Resend request failed",
    };
  }
}

export function getContactRateLimitMax() {
  const value = Number(env("CONTACT_RATE_LIMIT_MAX") || "5");
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 5;
}

export function getContactRateLimitWindowSeconds() {
  const value = Number(env("CONTACT_RATE_LIMIT_WINDOW_SECONDS") || "600");
  return Number.isFinite(value) ? Math.max(60, Math.floor(value)) : 600;
}

export function getLoginRateLimitMax() {
  const value = Number(env("LOGIN_RATE_LIMIT_MAX") || "10");
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 10;
}

export function getLoginRateLimitWindowSeconds() {
  const value = Number(env("LOGIN_RATE_LIMIT_WINDOW_SECONDS") || "900");
  return Number.isFinite(value) ? Math.max(60, Math.floor(value)) : 900;
}

export function getUploadMaxBytes() {
  const value = Number(env("ACTUS_UPLOAD_MAX_MB") || "5");
  const mb = Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 5;
  return mb * 1024 * 1024;
}

export function hashRateLimitKey(scope, clientIp) {
  return createHash("sha256")
    .update(`${scope}|${clientIp}`)
    .digest("hex");
}

export async function consumeRateLimit(scope, clientIp, maxAttempts, windowSeconds) {
  const supabase = safeGetSupabaseClient();
  if (!supabase) {
    return { allowed: true, retryAfter: 0, remaining: Math.max(0, maxAttempts - 1) };
  }

  const key = hashRateLimitKey(scope, clientIp);
  const now = Date.now();
  const nowIso = new Date(now).toISOString();

  const { data: row, error: selectError } = await supabase
    .from("api_rate_limits")
    .select("key, scope, count, window_started_at")
    .eq("key", key)
    .maybeSingle();

  if (selectError) {
    console.error("[api] rate_limit_select_failed", selectError.message);
    return { allowed: true, retryAfter: 0, remaining: Math.max(0, maxAttempts - 1) };
  }

  const max = Math.max(1, maxAttempts);
  const windowMs = Math.max(1, windowSeconds) * 1000;

  if (!row) {
    await supabase.from("api_rate_limits").upsert(
      {
        key,
        scope,
        count: 1,
        window_started_at: nowIso,
        updated_at: nowIso,
      },
      { onConflict: "key" },
    );
    return { allowed: true, retryAfter: 0, remaining: Math.max(0, max - 1) };
  }

  const windowStarted = Date.parse(row.window_started_at || nowIso);
  const inWindow = Number.isFinite(windowStarted) && now - windowStarted < windowMs;

  if (!inWindow) {
    await supabase
      .from("api_rate_limits")
      .update({ count: 1, window_started_at: nowIso, updated_at: nowIso, scope })
      .eq("key", key);
    return { allowed: true, retryAfter: 0, remaining: Math.max(0, max - 1) };
  }

  const currentCount = Math.max(0, Number(row.count || 0));
  if (currentCount >= max) {
    const retryAfter = Math.max(
      1,
      Math.ceil((windowMs - (now - windowStarted)) / 1000),
    );
    return { allowed: false, retryAfter, remaining: 0 };
  }

  await supabase
    .from("api_rate_limits")
    .update({ count: currentCount + 1, updated_at: nowIso, scope })
    .eq("key", key);

  return { allowed: true, retryAfter: 0, remaining: Math.max(0, max - (currentCount + 1)) };
}

export async function enforceRateLimit(req, res, scope, maxAttempts, windowSeconds) {
  const clientIp = getClientIp(req);
  const result = await consumeRateLimit(scope, clientIp, maxAttempts, windowSeconds);
  if (result.allowed) {
    return true;
  }

  if (result.retryAfter > 0) {
    res.setHeader("Retry-After", String(result.retryAfter));
  }

  await apiLog("warning", "rate_limit_exceeded", {
    scope,
    client_ip: clientIp,
    retry_after: result.retryAfter,
  });

  throw new ApiHttpError(429, "Too many requests. Please retry later.", {
    retry_after: result.retryAfter,
  });
}

export function normalizeNewsItemRow(row) {
  return {
    id: String(row.id),
    title: String(row.title),
    image: String(row.image),
    sourceUrl: String(row.source_url),
    sourceName: isAdminNewsRow(row)
      ? "Actualite"
      : normalizeNewsSourceName(String(row.source_name || "Instagram")),
    created_at: row.created_at || new Date().toISOString(),
  };
}

export function randomHex(bytes = 6) {
  return randomBytes(bytes).toString("hex");
}

export function randomId(prefix = "") {
  return `${prefix}${randomUUID()}`;
}

export function formatContactMailBody({ nowIso, name, phone, email, subject, message }) {
  let body = "Nouveau message depuis le site Taxi Le Havre\n\n";
  body += `Date: ${nowIso}\n`;
  body += `Nom: ${name}\n`;
  body += `Téléphone: ${phone}\n`;
  body += `Email: ${email}\n`;
  body += `Sujet: ${subject}\n\n`;
  body += `Message:\n${message}\n`;
  return body;
}
