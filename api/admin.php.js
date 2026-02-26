import {
  apiLog,
  badRequest,
  clearAdminSession,
  enforceRateLimit,
  getAdminSession,
  getLoginRateLimitMax,
  getLoginRateLimitWindowSeconds,
  getRequestPayload,
  handleOptions,
  issueAdminSession,
  jsonResponse,
  methodNotAllowed,
  sanitizeText,
  verifyAdminCredentials,
  withApiHandler,
} from "./_lib/core.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  await withApiHandler(req, res, async () => {
    const method = (req.method || "GET").toUpperCase();

    if (method === "GET") {
      const session = getAdminSession(req);
      jsonResponse(res, 200, {
        success: true,
        authenticated: Boolean(session),
        username: session?.username || "",
      });
      return;
    }

    if (method === "DELETE") {
      const session = getAdminSession(req);
      if (session) {
        await apiLog("info", "admin_logout", {
          username: session.username,
        });
      }

      clearAdminSession(res, req);
      jsonResponse(res, 200, { success: true, authenticated: false });
      return;
    }

    if (method !== "POST") {
      methodNotAllowed();
    }

    await enforceRateLimit(
      req,
      res,
      "admin_login",
      getLoginRateLimitMax(),
      getLoginRateLimitWindowSeconds(),
    );

    const payload = await getRequestPayload(req);
    const username = sanitizeText(payload.username ?? "", 80);
    const password = String(payload.password ?? "");

    if (!username || !password) {
      badRequest("Missing credentials");
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      await apiLog("warning", "admin_login_failed", { username });
      jsonResponse(res, 401, { success: false, error: "Invalid credentials" });
      return;
    }

    issueAdminSession(res, req, username);
    await apiLog("info", "admin_login_success", { username });

    jsonResponse(res, 200, {
      success: true,
      authenticated: true,
      username,
    });
  });
}
