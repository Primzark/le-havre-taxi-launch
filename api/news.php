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
    file_put_contents($filePath, $json ?: "[]", LOCK_EX);
}

function require_admin_token(): void
{
    $expected = get_actus_admin_token();
    $provided = get_header_value("X-Admin-Token");
    if ($provided === "") {
        $provided = trim((string) ($_GET["token"] ?? ""));
    }

    if ($provided === "" || !hash_equals($expected, $provided)) {
        json_response(["success" => false, "error" => "Unauthorized"], 401);
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

require_admin_token();
$payload = get_request_payload();
$items = read_news($paths["news"]);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title = sanitize_text((string) ($payload["title"] ?? ""), 160);
    $image = sanitize_text((string) ($payload["image"] ?? ""), 500);
    $sourceUrl = sanitize_text((string) ($payload["sourceUrl"] ?? ""), 500);
    $sourceName = sanitize_text((string) ($payload["sourceName"] ?? "Instagram"), 30);

    if ($title === "" || $image === "" || $sourceUrl === "") {
        json_response(["success" => false, "error" => "Missing required fields"], 422);
    }

    $item = [
        "id" => "manual-" . bin2hex(random_bytes(6)),
        "title" => $title,
        "image" => $image,
        "sourceUrl" => $sourceUrl,
        "sourceName" => $sourceName === "Facebook" ? "Facebook" : "Instagram",
        "created_at" => gmdate("c"),
    ];

    array_unshift($items, $item);
    write_news($paths["news"], $items);
    json_response(["success" => true, "item" => $item], 201);
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $id = sanitize_text((string) ($payload["id"] ?? ""), 100);
    if ($id === "") {
        json_response(["success" => false, "error" => "Missing id"], 422);
    }

    $filtered = array_values(array_filter($items, static fn(array $item): bool => (string) ($item["id"] ?? "") !== $id));
    write_news($paths["news"], $filtered);
    json_response(["success" => true, "items" => $filtered]);
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
        $item["title"] = sanitize_text((string) ($payload["title"] ?? (string) ($item["title"] ?? "")), 160);
        $item["image"] = sanitize_text((string) ($payload["image"] ?? (string) ($item["image"] ?? "")), 500);
        $item["sourceUrl"] = sanitize_text((string) ($payload["sourceUrl"] ?? (string) ($item["sourceUrl"] ?? "")), 500);
        $sourceName = sanitize_text((string) ($payload["sourceName"] ?? (string) ($item["sourceName"] ?? "Instagram")), 30);
        $item["sourceName"] = $sourceName === "Facebook" ? "Facebook" : "Instagram";
        $updated[] = $item;
    }

    if (!$found) {
        json_response(["success" => false, "error" => "Item not found"], 404);
    }

    write_news($paths["news"], $updated);
    json_response(["success" => true, "items" => $updated]);
}

json_response(["success" => false, "error" => "Method not allowed"], 405);

