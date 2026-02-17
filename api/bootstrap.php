<?php
declare(strict_types=1);

/**
 * Shared bootstrap for lightweight PHP APIs used by the site.
 */

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: same-origin");

// Allow local frontend dev servers to call the PHP API (same machine, different port).
$origin = isset($_SERVER["HTTP_ORIGIN"]) ? trim((string) $_SERVER["HTTP_ORIGIN"]) : "";
$localDevOrigins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
];

if ($origin !== "" && in_array($origin, $localDevOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Vary: Origin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Accept");
    header("Access-Control-Max-Age: 86400");
}

if (($_SERVER["REQUEST_METHOD"] ?? "") === "OPTIONS") {
    http_response_code(204);
    exit;
}

/**
 * @param mixed $data
 */
function json_response($data, int $status = 200): void
{
    http_response_code($status);
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) {
        $json = '{"success":false,"error":"Serialization failure"}';
        http_response_code(500);
    }
    echo $json;
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
    $trimmed = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $trimmed) ?? $trimmed;
    if (mb_strlen($trimmed, "UTF-8") > $maxLength) {
        return mb_substr($trimmed, 0, $maxLength, "UTF-8");
    }
    return $trimmed;
}

function sanitize_multiline_text(string $value, int $maxLength): string
{
    $normalized = str_replace(["\r\n", "\r"], "\n", trim($value));
    $normalized = preg_replace('/\n{3,}/', "\n\n", $normalized) ?? $normalized;
    if (mb_strlen($normalized, "UTF-8") > $maxLength) {
        return mb_substr($normalized, 0, $maxLength, "UTF-8");
    }
    return $normalized;
}

function is_valid_http_url(string $value): bool
{
    if ($value === "") {
        return false;
    }

    if (!filter_var($value, FILTER_VALIDATE_URL)) {
        return false;
    }

    $parts = parse_url($value);
    $scheme = strtolower((string) ($parts["scheme"] ?? ""));
    return $scheme === "http" || $scheme === "https";
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

/**
 * @return array{root:string,news:string,messages:string,logs:string,rate_limits:string}
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
        "logs" => $root . "/api.log",
        "rate_limits" => $root . "/rate_limits.json",
    ];
}

function get_public_root_path(): string
{
    $publicPath = dirname(__DIR__) . "/public";
    if (!is_dir($publicPath)) {
        mkdir($publicPath, 0775, true);
    }
    return $publicPath;
}

function get_client_ip(): string
{
    $forwardedFor = $_SERVER["HTTP_X_FORWARDED_FOR"] ?? "";
    if (is_string($forwardedFor) && $forwardedFor !== "") {
        $parts = explode(",", $forwardedFor);
        $first = trim((string) ($parts[0] ?? ""));
        if ($first !== "") {
            return $first;
        }
    }

    $realIp = $_SERVER["HTTP_X_REAL_IP"] ?? "";
    if (is_string($realIp) && $realIp !== "") {
        return trim($realIp);
    }

    return trim((string) ($_SERVER["REMOTE_ADDR"] ?? "unknown"));
}

/**
 * @param array<string, mixed> $context
 */
function api_log(string $level, string $event, array $context = []): void
{
    $paths = get_data_paths();
    $entry = [
        "time" => gmdate("c"),
        "level" => $level,
        "event" => $event,
        "context" => $context,
    ];

    $line = json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($line === false) {
        return;
    }

    @file_put_contents($paths["logs"], $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function get_alert_webhook_url(): string
{
    load_api_config();

    if (defined("ALERT_WEBHOOK_URL") && is_string(ALERT_WEBHOOK_URL) && ALERT_WEBHOOK_URL !== "") {
        return trim(ALERT_WEBHOOK_URL);
    }

    $fromEnv = getenv("ALERT_WEBHOOK_URL");
    if (is_string($fromEnv) && trim($fromEnv) !== "") {
        return trim($fromEnv);
    }

    return "";
}

function get_alert_email(): string
{
    load_api_config();

    if (defined("ALERT_EMAIL") && is_string(ALERT_EMAIL) && ALERT_EMAIL !== "") {
        return trim(ALERT_EMAIL);
    }

    $fromEnv = getenv("ALERT_EMAIL");
    if (is_string($fromEnv) && trim($fromEnv) !== "") {
        return trim($fromEnv);
    }

    return "";
}

/**
 * @param array<string, mixed> $context
 */
function send_alert(string $title, array $context = []): void
{
    $webhook = get_alert_webhook_url();
    $email = get_alert_email();

    if ($webhook !== "" && function_exists("curl_init")) {
        $payload = [
            "text" => $title,
            "context" => $context,
        ];

        $ch = curl_init($webhook);
        if ($ch !== false) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 8);
            curl_exec($ch);
            curl_close($ch);
            return;
        }
    }

    if ($email !== "") {
        $lines = [$title, "", json_encode($context, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: "{}"]; 
        @mail($email, "[Taxi API Alert] " . $title, implode("\n", $lines));
    }
}

function is_https_request(): bool
{
    $https = strtolower((string) ($_SERVER["HTTPS"] ?? ""));
    if ($https === "on" || $https === "1") {
        return true;
    }

    $forwardedProto = strtolower((string) ($_SERVER["HTTP_X_FORWARDED_PROTO"] ?? ""));
    return $forwardedProto === "https";
}

function start_secure_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secureCookie = is_https_request();

    session_name("taxi_admin_session");
    session_set_cookie_params([
        "lifetime" => 0,
        "path" => "/",
        "secure" => $secureCookie,
        "httponly" => true,
        "samesite" => "Strict",
    ]);

    session_start();

    if (!isset($_SESSION["session_started_at"])) {
        $_SESSION["session_started_at"] = time();
    }
}

function get_admin_username(): string
{
    load_api_config();

    if (defined("ACTUS_ADMIN_USERNAME") && is_string(ACTUS_ADMIN_USERNAME) && ACTUS_ADMIN_USERNAME !== "") {
        return trim(ACTUS_ADMIN_USERNAME);
    }

    $fromEnv = getenv("ACTUS_ADMIN_USERNAME");
    if (is_string($fromEnv) && trim($fromEnv) !== "") {
        return trim($fromEnv);
    }

    return "admin";
}

function get_admin_password_hash(): string
{
    load_api_config();

    if (defined("ACTUS_ADMIN_PASSWORD_HASH") && is_string(ACTUS_ADMIN_PASSWORD_HASH) && ACTUS_ADMIN_PASSWORD_HASH !== "") {
        return trim(ACTUS_ADMIN_PASSWORD_HASH);
    }

    $fromEnv = getenv("ACTUS_ADMIN_PASSWORD_HASH");
    if (is_string($fromEnv) && trim($fromEnv) !== "") {
        return trim($fromEnv);
    }

    // No fallback — admin password MUST be configured.
    error_log("[SECURITY] ACTUS_ADMIN_PASSWORD_HASH is not configured. Admin login disabled.");
    return "";
}

function is_admin_authenticated(): bool
{
    start_secure_session();

    $isAdmin = (bool) ($_SESSION["is_admin"] ?? false);
    $expiresAt = (int) ($_SESSION["admin_expires_at"] ?? 0);

    if (!$isAdmin || $expiresAt <= time()) {
        return false;
    }

    return true;
}

function get_authenticated_admin_username(): string
{
    start_secure_session();
    return (string) ($_SESSION["admin_username"] ?? "");
}

function require_admin_auth(): void
{
    if (!is_admin_authenticated()) {
        json_response(["success" => false, "error" => "Unauthorized"], 401);
    }
}

function login_admin_user(string $username, string $password): bool
{
    start_secure_session();

    $expectedUsername = get_admin_username();
    $expectedHash = get_admin_password_hash();

    if (!hash_equals($expectedUsername, $username)) {
        return false;
    }

    if ($expectedHash === "" || !password_verify($password, $expectedHash)) {
        return false;
    }

    session_regenerate_id(true);
    $_SESSION["is_admin"] = true;
    $_SESSION["admin_username"] = $expectedUsername;
    $_SESSION["admin_logged_in_at"] = time();
    $_SESSION["admin_expires_at"] = time() + (8 * 60 * 60);

    return true;
}

function logout_admin_user(): void
{
    start_secure_session();

    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), "", time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
    }

    session_destroy();
}

function get_contact_email(): string
{
    load_api_config();

    if (defined("CONTACT_FORM_EMAIL") && is_string(CONTACT_FORM_EMAIL) && CONTACT_FORM_EMAIL !== "") {
        return trim(CONTACT_FORM_EMAIL);
    }

    $envEmail = getenv("CONTACT_FORM_EMAIL");
    if (is_string($envEmail) && trim($envEmail) !== "") {
        return trim($envEmail);
    }

    return "starlod7696@gmail.com";
}

function get_mail_provider(): string
{
    load_api_config();

    if (defined("MAIL_PROVIDER") && is_string(MAIL_PROVIDER) && MAIL_PROVIDER !== "") {
        return strtolower(trim(MAIL_PROVIDER));
    }

    $fromEnv = getenv("MAIL_PROVIDER");
    if (is_string($fromEnv) && trim($fromEnv) !== "") {
        return strtolower(trim($fromEnv));
    }

    return "mail";
}

function get_mail_from_email(): string
{
    load_api_config();

    if (defined("MAIL_FROM_EMAIL") && is_string(MAIL_FROM_EMAIL) && MAIL_FROM_EMAIL !== "") {
        return trim(MAIL_FROM_EMAIL);
    }

    $fromEnv = getenv("MAIL_FROM_EMAIL");
    if (is_string($fromEnv) && trim($fromEnv) !== "") {
        return trim($fromEnv);
    }

    $host = preg_replace('/[^a-zA-Z0-9.-]/', '', (string) ($_SERVER["HTTP_HOST"] ?? "taxis-lehavre.com"));
    return "no-reply@" . ($host !== "" ? $host : "taxis-lehavre.com");
}

function get_mail_from_name(): string
{
    load_api_config();

    if (defined("MAIL_FROM_NAME") && is_string(MAIL_FROM_NAME) && MAIL_FROM_NAME !== "") {
        return trim(MAIL_FROM_NAME);
    }

    $fromEnv = getenv("MAIL_FROM_NAME");
    if (is_string($fromEnv) && trim($fromEnv) !== "") {
        return trim($fromEnv);
    }

    return "Taxi Le Havre";
}

function get_resend_api_key(): string
{
    load_api_config();

    if (defined("RESEND_API_KEY") && is_string(RESEND_API_KEY) && RESEND_API_KEY !== "") {
        return trim(RESEND_API_KEY);
    }

    $fromEnv = getenv("RESEND_API_KEY");
    if (is_string($fromEnv) && trim($fromEnv) !== "") {
        return trim($fromEnv);
    }

    return "";
}

/**
 * @return array{delivered:bool,provider:string,error:string}
 */
function send_email_with_php_mail(string $to, string $subject, string $body, string $replyTo): array
{
    $fromEmail = get_mail_from_email();
    $fromName = get_mail_from_name();

    $headers = [];
    $headers[] = "From: " . $fromName . " <" . $fromEmail . ">";
    if ($replyTo !== "") {
        $headers[] = "Reply-To: " . $replyTo;
    }
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "X-Mailer: TaxiLeHavre";

    $delivered = @mail($to, $subject, $body, implode("\r\n", $headers));

    return [
        "delivered" => $delivered,
        "provider" => "mail",
        "error" => $delivered ? "" : "mail() delivery failed",
    ];
}

/**
 * @return array{delivered:bool,provider:string,error:string}
 */
function send_email_with_resend(string $to, string $subject, string $body, string $replyTo): array
{
    if (!function_exists("curl_init")) {
        return [
            "delivered" => false,
            "provider" => "resend",
            "error" => "curl extension unavailable",
        ];
    }

    $apiKey = get_resend_api_key();
    if ($apiKey === "") {
        return [
            "delivered" => false,
            "provider" => "resend",
            "error" => "RESEND_API_KEY is not configured",
        ];
    }

    $payload = [
        "from" => get_mail_from_name() . " <" . get_mail_from_email() . ">",
        "to" => [$to],
        "subject" => $subject,
        "text" => $body,
    ];

    if ($replyTo !== "") {
        $payload["reply_to"] = $replyTo;
    }

    $ch = curl_init("https://api.resend.com/emails");
    if ($ch === false) {
        return [
            "delivered" => false,
            "provider" => "resend",
            "error" => "Unable to initialize cURL",
        ];
    }

    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . $apiKey,
        "Content-Type: application/json",
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false || $httpCode < 200 || $httpCode >= 300) {
        $message = $error !== "" ? $error : "HTTP " . $httpCode;
        return [
            "delivered" => false,
            "provider" => "resend",
            "error" => "Resend request failed: " . $message,
        ];
    }

    return [
        "delivered" => true,
        "provider" => "resend",
        "error" => "",
    ];
}

/**
 * @return array{delivered:bool,provider:string,error:string}
 */
function send_contact_email(string $to, string $subject, string $body, string $replyTo): array
{
    $provider = get_mail_provider();

    if ($provider === "resend") {
        $result = send_email_with_resend($to, $subject, $body, $replyTo);
        if ($result["delivered"]) {
            return $result;
        }

        api_log("warning", "contact_email_resend_failed", ["error" => $result["error"]]);
        $fallback = send_email_with_php_mail($to, $subject, $body, $replyTo);
        if ($fallback["delivered"]) {
            $fallback["provider"] = "resend->mail";
            return $fallback;
        }

        $fallback["provider"] = "resend->mail";
        $fallback["error"] = trim($result["error"] . " | " . $fallback["error"], " |");
        return $fallback;
    }

    return send_email_with_php_mail($to, $subject, $body, $replyTo);
}

function get_contact_rate_limit_max(): int
{
    load_api_config();

    if (defined("CONTACT_RATE_LIMIT_MAX") && is_int(CONTACT_RATE_LIMIT_MAX)) {
        return max(1, CONTACT_RATE_LIMIT_MAX);
    }

    $fromEnv = getenv("CONTACT_RATE_LIMIT_MAX");
    if (is_string($fromEnv) && ctype_digit($fromEnv)) {
        return max(1, (int) $fromEnv);
    }

    return 5;
}

function get_contact_rate_limit_window_seconds(): int
{
    load_api_config();

    if (defined("CONTACT_RATE_LIMIT_WINDOW_SECONDS") && is_int(CONTACT_RATE_LIMIT_WINDOW_SECONDS)) {
        return max(60, CONTACT_RATE_LIMIT_WINDOW_SECONDS);
    }

    $fromEnv = getenv("CONTACT_RATE_LIMIT_WINDOW_SECONDS");
    if (is_string($fromEnv) && ctype_digit($fromEnv)) {
        return max(60, (int) $fromEnv);
    }

    return 600;
}

function get_login_rate_limit_max(): int
{
    load_api_config();

    if (defined("LOGIN_RATE_LIMIT_MAX") && is_int(LOGIN_RATE_LIMIT_MAX)) {
        return max(1, LOGIN_RATE_LIMIT_MAX);
    }

    $fromEnv = getenv("LOGIN_RATE_LIMIT_MAX");
    if (is_string($fromEnv) && ctype_digit($fromEnv)) {
        return max(1, (int) $fromEnv);
    }

    return 10;
}

function get_login_rate_limit_window_seconds(): int
{
    load_api_config();

    if (defined("LOGIN_RATE_LIMIT_WINDOW_SECONDS") && is_int(LOGIN_RATE_LIMIT_WINDOW_SECONDS)) {
        return max(60, LOGIN_RATE_LIMIT_WINDOW_SECONDS);
    }

    $fromEnv = getenv("LOGIN_RATE_LIMIT_WINDOW_SECONDS");
    if (is_string($fromEnv) && ctype_digit($fromEnv)) {
        return max(60, (int) $fromEnv);
    }

    return 900;
}

function get_upload_max_bytes(): int
{
    load_api_config();

    if (defined("ACTUS_UPLOAD_MAX_MB") && is_int(ACTUS_UPLOAD_MAX_MB)) {
        return max(1, ACTUS_UPLOAD_MAX_MB) * 1024 * 1024;
    }

    $fromEnv = getenv("ACTUS_UPLOAD_MAX_MB");
    if (is_string($fromEnv) && ctype_digit($fromEnv)) {
        return max(1, (int) $fromEnv) * 1024 * 1024;
    }

    return 5 * 1024 * 1024;
}

/**
 * @return array{allowed:bool,retry_after:int,remaining:int}
 */
function consume_rate_limit(string $key, int $maxAttempts, int $windowSeconds): array
{
    $paths = get_data_paths();
    $file = $paths["rate_limits"];

    $maxAttempts = max(1, $maxAttempts);
    $windowSeconds = max(1, $windowSeconds);

    $handle = fopen($file, "c+");
    if ($handle === false) {
        return ["allowed" => true, "retry_after" => 0, "remaining" => max(0, $maxAttempts - 1)];
    }

    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return ["allowed" => true, "retry_after" => 0, "remaining" => max(0, $maxAttempts - 1)];
    }

    $raw = stream_get_contents($handle);
    $store = [];
    if (is_string($raw) && trim($raw) !== "") {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $store = $decoded;
        }
    }

    $now = time();
    $windowStart = $now - $windowSeconds;

    $bucket = [];
    $existing = $store[$key] ?? [];
    if (is_array($existing)) {
        foreach ($existing as $timestamp) {
            if (is_int($timestamp) && $timestamp >= $windowStart) {
                $bucket[] = $timestamp;
            }
        }
    }

    $allowed = count($bucket) < $maxAttempts;
    $retryAfter = 0;

    if ($allowed) {
        $bucket[] = $now;
    } elseif (isset($bucket[0])) {
        $retryAfter = max(1, ((int) $bucket[0] + $windowSeconds) - $now);
    }

    $store[$key] = $bucket;

    // Prune empty buckets.
    foreach ($store as $bucketKey => $timestamps) {
        if (!is_array($timestamps) || count($timestamps) === 0) {
            unset($store[$bucketKey]);
        }
    }

    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($store, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: "{}");
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return [
        "allowed" => $allowed,
        "retry_after" => $retryAfter,
        "remaining" => max(0, $maxAttempts - count($bucket)),
    ];
}

function enforce_rate_limit(string $scope, int $maxAttempts, int $windowSeconds): void
{
    $client = get_client_ip();
    $key = hash("sha256", $scope . "|" . $client);
    $result = consume_rate_limit($key, $maxAttempts, $windowSeconds);

    if ($result["allowed"]) {
        return;
    }

    if ($result["retry_after"] > 0) {
        header("Retry-After: " . (string) $result["retry_after"]);
    }

    api_log("warning", "rate_limit_exceeded", [
        "scope" => $scope,
        "client_ip" => $client,
        "retry_after" => $result["retry_after"],
    ]);

    json_response([
        "success" => false,
        "error" => "Too many requests. Please retry later.",
        "retry_after" => $result["retry_after"],
    ], 429);
}

set_exception_handler(static function (Throwable $exception): void {
    api_log("error", "unhandled_exception", [
        "message" => $exception->getMessage(),
        "file" => $exception->getFile(),
        "line" => $exception->getLine(),
    ]);

    send_alert("Unhandled API exception", [
        "message" => $exception->getMessage(),
        "file" => $exception->getFile(),
        "line" => $exception->getLine(),
    ]);

    json_response([
        "success" => false,
        "error" => "Internal server error",
    ], 500);
});
