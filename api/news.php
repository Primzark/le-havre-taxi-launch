<?php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";

$paths = get_data_paths();

/**
 * @return array<int, array<string, mixed>>
 */
function read_news(string $filePath): array
{
    if (!is_file($filePath)) {
        return [];
    }

    $raw = file_get_contents($filePath);
    if ($raw === false || trim($raw) === "") {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        return [];
    }

    $items = [];
    foreach ($decoded as $item) {
        if (is_array($item)) {
            $items[] = $item;
        }
    }

    usort($items, static function (array $a, array $b): int {
        $aDate = (string) ($a["created_at"] ?? "");
        $bDate = (string) ($b["created_at"] ?? "");
        return strcmp($bDate, $aDate);
    });

    return $items;
}

/**
 * @param array<int, array<string, mixed>> $items
 */
function write_news(string $filePath, array $items): void
{
    $json = json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    @file_put_contents($filePath, $json ?: "[]", LOCK_EX);
}

function normalize_source_name(string $sourceName): string
{
    return $sourceName === "Facebook" ? "Facebook" : "Instagram";
}

function is_webp_reference(string $image): bool
{
    $path = parse_url($image, PHP_URL_PATH);
    if (!is_string($path) || $path === "") {
        return false;
    }

    return str_ends_with(strtolower($path), ".webp");
}

function is_valid_news_image_reference(string $image): bool
{
    if (!is_webp_reference($image)) {
        return false;
    }

    if (str_starts_with($image, "/images/") || str_starts_with($image, "/uploads/actus/")) {
        $realPath = get_public_root_path() . $image;
        return is_file($realPath);
    }

    return is_valid_http_url($image);
}

function try_delete_uploaded_image(string $imagePath): void
{
    if (!str_starts_with($imagePath, "/uploads/actus/")) {
        return;
    }

    $realPath = get_public_root_path() . $imagePath;
    if (is_file($realPath)) {
        @unlink($realPath);
    }
}

/**
 * @param array<string, mixed> $payload
 * @param array<string, mixed> $fallback
 * @return array{title: string, image: string, sourceUrl: string, sourceName: string}
 */
function extract_news_fields(array $payload, array $fallback = []): array
{
    $title = sanitize_text((string) ($payload["title"] ?? ($fallback["title"] ?? "")), 160);
    $image = sanitize_text((string) ($payload["image"] ?? ($fallback["image"] ?? "")), 500);
    $sourceUrl = sanitize_text((string) ($payload["sourceUrl"] ?? ($fallback["sourceUrl"] ?? "")), 500);
    $sourceName = normalize_source_name(
        sanitize_text((string) ($payload["sourceName"] ?? ($fallback["sourceName"] ?? "Instagram")), 30)
    );

    return [
        "title" => $title,
        "image" => $image,
        "sourceUrl" => $sourceUrl,
        "sourceName" => $sourceName,
    ];
}

/**
 * @param array{title: string, image: string, sourceUrl: string, sourceName: string} $fields
 */
function validate_news_fields(array $fields): void
{
    if ($fields["title"] === "" || $fields["image"] === "" || $fields["sourceUrl"] === "") {
        json_response(["success" => false, "error" => "Missing required fields"], 422);
    }

    if (!is_valid_news_image_reference($fields["image"])) {
        json_response(["success" => false, "error" => "Invalid image reference"], 422);
    }

    if (!is_valid_http_url($fields["sourceUrl"])) {
        json_response(["success" => false, "error" => "Invalid source URL"], 422);
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    json_response([
        "success" => true,
        "items" => read_news($paths["news"]),
    ]);
}

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    json_response(["success" => true]);
}

require_admin_auth();
enforce_rate_limit("news_write", 120, 900);

$payload = get_request_payload();
$items = read_news($paths["news"]);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $fields = extract_news_fields($payload);
    validate_news_fields($fields);

    $item = [
        "id" => "manual-" . bin2hex(random_bytes(6)),
        "title" => $fields["title"],
        "image" => $fields["image"],
        "sourceUrl" => $fields["sourceUrl"],
        "sourceName" => $fields["sourceName"],
        "created_at" => gmdate("c"),
    ];

    array_unshift($items, $item);
    write_news($paths["news"], $items);

    api_log("info", "news_item_created", ["id" => $item["id"], "admin" => get_authenticated_admin_username()]);

    json_response(["success" => true, "item" => $item], 201);
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $id = sanitize_text((string) ($payload["id"] ?? ""), 100);
    if ($id === "") {
        json_response(["success" => false, "error" => "Missing id"], 422);
    }

    $deletedImage = "";
    $found = false;
    $filtered = [];

    foreach ($items as $item) {
        if ((string) ($item["id"] ?? "") === $id) {
            $found = true;
            $deletedImage = (string) ($item["image"] ?? "");
            continue;
        }
        $filtered[] = $item;
    }

    if (!$found) {
        json_response(["success" => false, "error" => "Item not found"], 404);
    }

    write_news($paths["news"], array_values($filtered));
    try_delete_uploaded_image($deletedImage);

    api_log("info", "news_item_deleted", ["id" => $id, "admin" => get_authenticated_admin_username()]);

    json_response(["success" => true, "items" => array_values($filtered)]);
}

if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $id = sanitize_text((string) ($payload["id"] ?? ""), 100);
    if ($id === "") {
        json_response(["success" => false, "error" => "Missing id"], 422);
    }

    $updated = [];
    $found = false;

    foreach ($items as $item) {
        if ((string) ($item["id"] ?? "") !== $id) {
            $updated[] = $item;
            continue;
        }

        $found = true;

        $fields = extract_news_fields($payload, $item);
        validate_news_fields($fields);

        $item["title"] = $fields["title"];
        $item["image"] = $fields["image"];
        $item["sourceUrl"] = $fields["sourceUrl"];
        $item["sourceName"] = $fields["sourceName"];
        $updated[] = $item;
    }

    if (!$found) {
        json_response(["success" => false, "error" => "Item not found"], 404);
    }

    write_news($paths["news"], $updated);

    api_log("info", "news_item_updated", ["id" => $id, "admin" => get_authenticated_admin_username()]);

    json_response(["success" => true, "items" => $updated]);
}

json_response(["success" => false, "error" => "Method not allowed"], 405);
