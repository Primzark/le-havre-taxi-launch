import {
  apiLog,
  badRequest,
  deleteUploadedImageIfManaged,
  enforceRateLimit,
  getRequestPayload,
  getSupabaseAdminClient,
  handleOptions,
  isAdminNewsRow,
  isValidHttpUrl,
  isValidNewsImageReference,
  jsonResponse,
  methodNotAllowed,
  normalizeNewsItemRow,
  normalizeNewsSourceName,
  randomHex,
  requireAdminSession,
  sanitizeText,
  withApiHandler,
} from "./_lib/core.js";

function extractNewsFields(payload = {}, fallback = {}) {
  const title = sanitizeText(payload.title ?? fallback.title ?? "", 160);
  const image = sanitizeText(payload.image ?? fallback.image ?? "", 500);
  const sourceUrl = sanitizeText(payload.sourceUrl ?? fallback.sourceUrl ?? "", 500);
  const sourceName = normalizeNewsSourceName(
    sanitizeText(payload.sourceName ?? fallback.sourceName ?? "Actualite", 30),
  );

  return { title, image, sourceUrl, sourceName };
}

function validateNewsFields(fields) {
  if (!fields.title || !fields.image || !fields.sourceUrl) {
    badRequest("Champs obligatoires manquants");
  }

  if (!isValidNewsImageReference(fields.image)) {
    badRequest("Référence d'image invalide");
  }

  if (!isValidHttpUrl(fields.sourceUrl)) {
    badRequest("URL source invalide");
  }
}

async function fetchNewsRows() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("actus_items")
    .select("id, title, image, source_url, source_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load news: ${error.message}`);
  }

  return Array.isArray(data) ? data.filter(isAdminNewsRow) : [];
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  await withApiHandler(req, res, async () => {
    const method = (req.method || "GET").toUpperCase();

    if (method === "GET") {
      const items = await fetchNewsRows();
      jsonResponse(res, 200, {
        success: true,
        items: items.map(normalizeNewsItemRow),
      });
      return;
    }

    if (!["POST", "PUT", "DELETE"].includes(method)) {
      methodNotAllowed();
    }

    const session = requireAdminSession(req);
    await enforceRateLimit(req, res, "news_write", 120, 900);

    const payload = await getRequestPayload(req);
    const supabase = getSupabaseAdminClient();

    if (method === "POST") {
      const fields = extractNewsFields(payload);
      validateNewsFields(fields);

      const item = {
        id: `news-${randomHex(6)}`,
        title: fields.title,
        image: fields.image,
        source_url: fields.sourceUrl,
        source_name: fields.sourceName,
      };

      const { data, error } = await supabase
        .from("actus_items")
        .insert(item)
        .select("id, title, image, source_url, source_name, created_at")
        .single();

      if (error) {
        throw new Error(`Unable to create news item: ${error.message}`);
      }

      await apiLog("info", "news_item_created", {
        id: item.id,
        admin: session.username,
      });

      jsonResponse(res, 201, {
        success: true,
        item: normalizeNewsItemRow(data),
      });
      return;
    }

    if (method === "DELETE") {
      const id = sanitizeText(payload.id ?? "", 100);
      if (!id) {
        badRequest("Identifiant manquant");
      }

      const { data: existing, error: findError } = await supabase
        .from("actus_items")
        .select("id, image")
        .eq("id", id)
        .maybeSingle();

      if (findError) {
        throw new Error(`Unable to read item: ${findError.message}`);
      }
      if (!existing) {
        jsonResponse(res, 404, { success: false, error: "Élément introuvable" });
        return;
      }

      const { error: deleteError } = await supabase.from("actus_items").delete().eq("id", id);
      if (deleteError) {
        throw new Error(`Unable to delete item: ${deleteError.message}`);
      }

      await deleteUploadedImageIfManaged(existing.image || "");

      const items = await fetchNewsRows();
      await apiLog("info", "news_item_deleted", { id, admin: session.username });
      jsonResponse(res, 200, {
        success: true,
        items: items.map(normalizeNewsItemRow),
      });
      return;
    }

    if (method === "PUT") {
      const id = sanitizeText(payload.id ?? "", 100);
      if (!id) {
        badRequest("Identifiant manquant");
      }

      const { data: existing, error: findError } = await supabase
        .from("actus_items")
        .select("id, title, image, source_url, source_name, created_at")
        .eq("id", id)
        .maybeSingle();

      if (findError) {
        throw new Error(`Unable to read item: ${findError.message}`);
      }
      if (!existing) {
        jsonResponse(res, 404, { success: false, error: "Élément introuvable" });
        return;
      }

      const fields = extractNewsFields(payload, {
        title: existing.title,
        image: existing.image,
        sourceUrl: existing.source_url,
        sourceName: isAdminNewsRow(existing) ? "Actualite" : existing.source_name,
      });
      validateNewsFields(fields);

      const { error: updateError } = await supabase
        .from("actus_items")
        .update({
          title: fields.title,
          image: fields.image,
          source_url: fields.sourceUrl,
          source_name: fields.sourceName,
        })
        .eq("id", id);

      if (updateError) {
        throw new Error(`Unable to update item: ${updateError.message}`);
      }

      const items = await fetchNewsRows();
      await apiLog("info", "news_item_updated", { id, admin: session.username });
      jsonResponse(res, 200, {
        success: true,
        items: items.map(normalizeNewsItemRow),
      });
      return;
    }
  });
}
