import { readFile } from "node:fs/promises";
import { formidable } from "formidable";
import {
  apiLog,
  buildUploadPublicPath,
  enforceRateLimit,
  getSupabaseAdminClient,
  getUploadBucket,
  getUploadMaxBytes,
  handleOptions,
  jsonResponse,
  methodNotAllowed,
  randomHex,
  requireAdminSession,
  sanitizeText,
  withApiHandler,
} from "./_lib/core.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req, maxFileSize) {
  const form = formidable({
    multiples: false,
    maxFiles: 1,
    maxFileSize,
    allowEmptyFiles: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ fields, files });
    });
  });
}

function pickUploadedFile(files) {
  const raw = files?.image;
  if (!raw) {
    return null;
  }
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function handler(req, res) {
  if (handleOptions(req, res)) {
    return;
  }

  await withApiHandler(req, res, async () => {
    const method = (req.method || "GET").toUpperCase();
    if (method !== "POST") {
      methodNotAllowed();
    }

    const session = requireAdminSession(req);
    await enforceRateLimit(req, res, "news_upload", 40, 3600);

    const maxBytes = getUploadMaxBytes();
    let parsed;

    try {
      parsed = await parseForm(req, maxBytes);
    } catch (error) {
      jsonResponse(res, 422, {
        success: false,
        error: error instanceof Error ? error.message : "Upload error",
      });
      return;
    }

    const file = pickUploadedFile(parsed.files);
    if (!file) {
      jsonResponse(res, 422, { success: false, error: "Missing uploaded file" });
      return;
    }

    const size = Number(file.size || 0);
    if (!size || size > maxBytes) {
      jsonResponse(res, 413, {
        success: false,
        error: `File too large. Max ${Math.floor(maxBytes / 1024 / 1024)} MB`,
      });
      return;
    }

    const mimeType = String(file.mimetype || "");
    if (mimeType !== "image/webp") {
      jsonResponse(res, 422, {
        success: false,
        error: "Unsupported image type. Use WebP.",
      });
      return;
    }

    const filepath = String(file.filepath || "");
    if (!filepath) {
      jsonResponse(res, 422, { success: false, error: "Invalid upload payload" });
      return;
    }

    const buffer = await readFile(filepath);
    const filename = `actus-${new Date()
      .toISOString()
      .replace(/[:.]/g, "")
      .replace("T", "-")
      .replace("Z", "")}-${randomHex(5)}.webp`;
    const storageKey = `actus/${filename}`;

    const supabase = getSupabaseAdminClient();
    const { error: uploadError } = await supabase.storage
      .from(getUploadBucket())
      .upload(storageKey, buffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      await apiLog("error", "upload_store_failed", {
        error: uploadError.message,
        key: storageKey,
      });
      jsonResponse(res, 500, {
        success: false,
        error: "Unable to store uploaded file",
      });
      return;
    }

    const url = buildUploadPublicPath(filename);
    await apiLog("info", "news_image_uploaded", {
      file: filename,
      size,
      mime: mimeType,
      admin: session.username,
    });

    jsonResponse(res, 201, {
      success: true,
      url,
      file: {
        name: filename,
        original_name: sanitizeText(file.originalFilename || "image", 150),
        mime: mimeType,
        size,
        width: 0,
        height: 0,
      },
    });
  });
}
