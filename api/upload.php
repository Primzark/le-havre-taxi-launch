<?php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    json_response(["success" => true]);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(["success" => false, "error" => "Method not allowed"], 405);
}

require_admin_auth();
enforce_rate_limit("news_upload", 40, 3600);

if (!isset($_FILES["image"]) || !is_array($_FILES["image"])) {
    json_response(["success" => false, "error" => "Missing uploaded file"], 422);
}

$file = $_FILES["image"];
$errorCode = (int) ($file["error"] ?? UPLOAD_ERR_NO_FILE);

if ($errorCode !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE => "File exceeds server limit",
        UPLOAD_ERR_FORM_SIZE => "File exceeds form limit",
        UPLOAD_ERR_PARTIAL => "File upload was interrupted",
        UPLOAD_ERR_NO_FILE => "No file uploaded",
        UPLOAD_ERR_NO_TMP_DIR => "Missing temporary folder",
        UPLOAD_ERR_CANT_WRITE => "Failed to write file",
        UPLOAD_ERR_EXTENSION => "Upload stopped by extension",
    ];

    json_response([
        "success" => false,
        "error" => $errors[$errorCode] ?? "Upload error",
    ], 422);
}

$tmpPath = (string) ($file["tmp_name"] ?? "");
$originalName = sanitize_text((string) ($file["name"] ?? "image"), 150);
$size = (int) ($file["size"] ?? 0);

if ($tmpPath === "" || !is_uploaded_file($tmpPath)) {
    json_response(["success" => false, "error" => "Invalid upload payload"], 422);
}

$maxBytes = get_upload_max_bytes();
if ($size <= 0 || $size > $maxBytes) {
    json_response([
        "success" => false,
        "error" => "File too large. Max " . (int) floor($maxBytes / 1024 / 1024) . " MB",
    ], 413);
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = $finfo ? (string) finfo_file($finfo, $tmpPath) : "";
if ($finfo) {
    finfo_close($finfo);
}

$allowed = [
    "image/webp" => "webp",
];

if (!isset($allowed[$mimeType])) {
    json_response(["success" => false, "error" => "Unsupported image type. Use WebP."], 422);
}

$extension = $allowed[$mimeType];
$publicDirectory = get_public_root_path() . "/uploads/actus";
if (!is_dir($publicDirectory)) {
    mkdir($publicDirectory, 0775, true);
}

$filename = "actus-" . gmdate("Ymd-His") . "-" . bin2hex(random_bytes(5)) . "." . $extension;
$destination = $publicDirectory . "/" . $filename;

if (!move_uploaded_file($tmpPath, $destination)) {
    api_log("error", "upload_move_failed", ["tmp" => $tmpPath, "dest" => $destination]);
    json_response(["success" => false, "error" => "Unable to store uploaded file"], 500);
}

$dimensions = @getimagesize($destination);
$width = is_array($dimensions) ? (int) ($dimensions[0] ?? 0) : 0;
$height = is_array($dimensions) ? (int) ($dimensions[1] ?? 0) : 0;

$url = "/uploads/actus/" . $filename;

api_log("info", "news_image_uploaded", [
    "file" => $filename,
    "size" => $size,
    "mime" => $mimeType,
    "admin" => get_authenticated_admin_username(),
]);

json_response([
    "success" => true,
    "url" => $url,
    "file" => [
        "name" => $filename,
        "original_name" => $originalName,
        "mime" => $mimeType,
        "size" => $size,
        "width" => $width,
        "height" => $height,
    ],
], 201);
