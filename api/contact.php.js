import {
  apiLog,
  badRequest,
  enforceRateLimit,
  formatContactMailBody,
  getClientIp,
  getContactEmail,
  getContactRateLimitMax,
  getContactRateLimitWindowSeconds,
  getMailProvider,
  getRequestPayload,
  getSupabaseAdminClient,
  handleOptions,
  jsonResponse,
  methodNotAllowed,
  sanitizeMultilineText,
  sanitizeText,
  sendAlert,
  sendContactEmail,
  serviceUnavailable,
  randomId,
  withApiHandler,
} from "./_lib/core.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  await withApiHandler(req, res, async () => {
    const method = (req.method || "GET").toUpperCase();

    if (method === "GET") {
      jsonResponse(res, 200, {
        success: true,
        recipient: getContactEmail(),
        provider: getMailProvider(),
      });
      return;
    }

    if (method !== "POST") {
      methodNotAllowed();
    }

    await enforceRateLimit(
      req,
      res,
      "contact_form",
      getContactRateLimitMax(),
      getContactRateLimitWindowSeconds(),
    );

    const payload = await getRequestPayload(req);

    if (payload.website) {
      await apiLog("info", "contact_honeypot_triggered", {
        client_ip: getClientIp(req),
      });
      jsonResponse(res, 200, {
        success: true,
        recipient: getContactEmail(),
        delivered: false,
        provider: getMailProvider(),
      });
      return;
    }

    const name = sanitizeText(payload.name ?? "", 100);
    const phone = sanitizeText(payload.phone ?? "", 40);
    const email = sanitizeText(payload.email ?? "", 255);
    const subject = sanitizeText(payload.subject ?? "", 200);
    const message = sanitizeMultilineText(payload.message ?? "", 2000);

    if (!name || !email || !subject || !message) {
      badRequest("Missing required fields");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      badRequest("Invalid email");
    }

    if (message.length < 10) {
      badRequest("Message is too short");
    }

    const recipient = getContactEmail();
    const nowIso = new Date().toISOString();
    const mailSubject = `[Contact Site] ${subject}`;
    const mailBody = formatContactMailBody({
      nowIso,
      name,
      phone,
      email,
      subject,
      message,
    });

    const mailResult = await sendContactEmail(req, {
      to: recipient,
      subject: mailSubject,
      body: mailBody,
      replyTo: email,
    });

    try {
      const supabase = getSupabaseAdminClient();
      await supabase.from("contact_messages").insert({
        id: randomId("contact-"),
        created_at: nowIso,
        name,
        phone,
        email,
        subject,
        message,
        ip: getClientIp(req),
        user_agent: String(req.headers["user-agent"] || "").slice(0, 300),
        delivered: mailResult.delivered,
        provider: mailResult.provider,
        error: mailResult.error || "",
      });
    } catch (error) {
      await apiLog("warning", "contact_message_persist_failed", {
        error: error instanceof Error ? error.message : "unknown",
      });
    }

    if (!mailResult.delivered) {
      await apiLog("error", "contact_email_delivery_failed", {
        recipient,
        provider: mailResult.provider,
        error: mailResult.error,
      });

      await sendAlert("Contact email delivery failed", {
        recipient,
        provider: mailResult.provider,
        error: mailResult.error,
      });

      serviceUnavailable(
        mailResult.error || "Email delivery failed",
        {
          recipient,
          delivered: false,
          provider: mailResult.provider,
        },
      );
    }

    await apiLog("info", "contact_email_delivered", {
      recipient,
      provider: mailResult.provider,
    });

    jsonResponse(res, 200, {
      success: true,
      recipient,
      delivered: mailResult.delivered,
      provider: mailResult.provider,
    });
  });
}
