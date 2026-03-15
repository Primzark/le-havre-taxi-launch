<?php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "OPTIONS") {
    json_response(["success" => true]);
}

if ($method !== "POST") {
    json_response(["success" => false, "error" => "Méthode non autorisée"], 405);
}

require_admin_auth();
enforce_rate_limit("news_upload", 40, 3600);

if (!isset($_FILES["image"]) || !is_array($_FILES["image"])) {
    json_response(["success" => false, "error" => "Fichier téléversé manquant"], 422);
}

$file = $_FILES["image"];
$errorCode = (int) ($file["error"] ?? UPLOAD_ERR_NO_FILE);

if ($errorCode !== UPLOAD_ERR_OK) {
    $errors = [
        UPLOAD_ERR_INI_SIZE => "Le fichier dépasse la limite du serveur",
        UPLOAD_ERR_FORM_SIZE => "Le fichier dépasse la limite du formulaire",
        UPLOAD_ERR_PARTIAL => "Le téléversement du fichier a été interrompu",
        UPLOAD_ERR_NO_FILE => "Aucun fichier téléversé",
        UPLOAD_ERR_NO_TMP_DIR => "Dossier temporaire manquant",
        UPLOAD_ERR_CANT_WRITE => "Écriture du fichier impossible",
        UPLOAD_ERR_EXTENSION => "Téléversement arrêté par une extension",
    ];

    json_response([
        "success" => false,
        "error" => $errors[$errorCode] ?? "Erreur de téléversement",
    ], 422);
}

$tmpPath = (string) ($file["tmp_name"] ?? "");
$originalName = sanitize_text((string) ($file["name"] ?? "image"), 150);
$size = (int) ($file["size"] ?? 0);

if ($tmpPath === "" || !is_uploaded_file($tmpPath)) {
    json_response(["success" => false, "error" => "Charge utile de téléversement invalide"], 422);
}

$maxBytes = get_upload_max_bytes();
if ($size <= 0 || $size > $maxBytes) {
    json_response([
        "success" => false,
        "error" => "Fichier trop volumineux. Maximum " . (int) floor($maxBytes / 1024 / 1024) . " Mo",
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
    json_response(["success" => false, "error" => "Type d'image non pris en charge. Utilisez du WebP."], 422);
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
    json_response(["success" => false, "error" => "Impossible d'enregistrer le fichier téléversé"], 500);
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
