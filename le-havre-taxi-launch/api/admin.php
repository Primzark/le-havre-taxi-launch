<?php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    json_response(["success" => true]);
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    json_response([
        "success" => true,
        "authenticated" => is_admin_authenticated(),
        "username" => is_admin_authenticated() ? get_authenticated_admin_username() : "",
    ]);
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    if (is_admin_authenticated()) {
        api_log("info", "admin_logout", ["username" => get_authenticated_admin_username(), "client_ip" => get_client_ip()]);
    }
    logout_admin_user();
    json_response(["success" => true, "authenticated" => false]);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(["success" => false, "error" => "Method not allowed"], 405);
}

enforce_rate_limit("admin_login", get_login_rate_limit_max(), get_login_rate_limit_window_seconds());

$payload = get_request_payload();
$username = sanitize_text((string) ($payload["username"] ?? ""), 80);
$password = (string) ($payload["password"] ?? "");

if ($username === "" || $password === "") {
    json_response(["success" => false, "error" => "Missing credentials"], 422);
}

if (!login_admin_user($username, $password)) {
    api_log("warning", "admin_login_failed", ["username" => $username, "client_ip" => get_client_ip()]);
    json_response(["success" => false, "error" => "Invalid credentials"], 401);
}

api_log("info", "admin_login_success", ["username" => $username, "client_ip" => get_client_ip()]);

json_response([
    "success" => true,
    "authenticated" => true,
    "username" => $username,
]);
