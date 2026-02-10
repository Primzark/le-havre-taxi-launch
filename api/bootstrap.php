<?php
declare(strict_types=1);

/**
 * Shared bootstrap for lightweight PHP APIs used by the site.
 */

header("Content-Type: application/json; charset=utf-8");

/**
 * @param mixed $data
 */
function json_response($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * @return array<string, mixed>
 */
function get_request_payload(): array
{
    $contentType = $_SERVER["CONTENT_TYPE"] ?? "";
    $rawBody = file_get_contents("php://input");

    if (stripos($contentType, "application/json") !== false) {
        $decoded = json_decode($rawBody ?: "{}", true);
        return is_array($decoded) ? $decoded : [];
    }

    if (!empty($_POST)) {
        return $_POST;
    }

    if (!$rawBody) {
        return [];
    }

    parse_str($rawBody, $parsed);
    return is_array($parsed) ? $parsed : [];
}

/**
 * @return string
 */
function get_header_value(string $headerName): string
{
    $key = "HTTP_" . strtoupper(str_replace("-", "_", $headerName));
    return isset($_SERVER[$key]) ? trim((string) $_SERVER[$key]) : "";
}

function sanitize_text(string $value, int $maxLength): string
{
    $trimmed = trim($value);
    if (mb_strlen($trimmed, "UTF-8") > $maxLength) {
        return mb_substr($trimmed, 0, $maxLength, "UTF-8");
    }
    return $trimmed;
}

function load_api_config(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }

    $loaded = true;
    $configPath = __DIR__ . "/config.php";
    if (is_file($configPath)) {
        require_once $configPath;
    }
}

function get_contact_email(): string
{
    load_api_config();

    if (defined("CONTACT_FORM_EMAIL") && is_string(CONTACT_FORM_EMAIL) && CONTACT_FORM_EMAIL !== "") {
        return CONTACT_FORM_EMAIL;
    }

    $envEmail = getenv("CONTACT_FORM_EMAIL");
    if (is_string($envEmail) && trim($envEmail) !== "") {
        return trim($envEmail);
    }

    return "contactradiotaxilehavre@gmail.com";
}

function get_actus_admin_token(): string
{
    load_api_config();

    if (defined("ACTUS_ADMIN_TOKEN") && is_string(ACTUS_ADMIN_TOKEN) && ACTUS_ADMIN_TOKEN !== "") {
        return ACTUS_ADMIN_TOKEN;
    }

    $envToken = getenv("ACTUS_ADMIN_TOKEN");
    if (is_string($envToken) && trim($envToken) !== "") {
        return trim($envToken);
    }

    return "change-this-admin-token";
}

/**
 * @return array{root:string,news:string,messages:string}
 */
function get_data_paths(): array
{
    $root = dirname(__DIR__) . "/var";
    if (!is_dir($root)) {
        mkdir($root, 0775, true);
    }

    return [
        "root" => $root,
        "news" => $root . "/news.json",
        "messages" => $root . "/contact_messages.jsonl",
    ];
}

