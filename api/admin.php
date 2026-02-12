<?php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "OPTIONS") {
    json_response(["success" => true]);
}

switch ($method) {
    case "GET":
        $isAuthenticated = is_admin_authenticated();
        json_response([
            "success" => true,
            "authenticated" => $isAuthenticated,
            "username" => $isAuthenticated ? get_authenticated_admin_username() : "",
        ]);
        break;
    case "DELETE":
        $isAuthenticated = is_admin_authenticated();
        if ($isAuthenticated) {
            api_log("info", "admin_logout", ["username" => get_authenticated_admin_username(), "client_ip" => get_client_ip()]);
        }
        logout_admin_user();
        json_response(["success" => true, "authenticated" => false]);
        break;
    case "POST":
        break;
    default:
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
