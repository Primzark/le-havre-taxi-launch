import {
  getPublicStorageUrl,
  handleOptions,
  redirectResponse,
  textResponse,
  uploadsRewritePathToStorageKey,
  withApiHandler,
} from "./_lib/core.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  await withApiHandler(req, res, async () => {
    const method = (req.method || "GET").toUpperCase();
    if (method !== "GET") {
      textResponse(res, 405, "Method not allowed", { "Cache-Control": "no-store" });
      return;
    }

    const url = new URL(req.url || "/", "https://placeholder.local");
    const pathValue = url.searchParams.get("path") || "";
    const storageKey = uploadsRewritePathToStorageKey(pathValue);

    if (!storageKey || !storageKey.toLowerCase().endsWith(".webp")) {
      textResponse(res, 404, "Not found", { "Cache-Control": "no-store" });
      return;
    }

    const publicUrl = getPublicStorageUrl(storageKey);
    if (!publicUrl) {
      textResponse(res, 500, "Storage not configured", { "Cache-Control": "no-store" });
      return;
    }

    redirectResponse(res, publicUrl, 307);
  });
}
