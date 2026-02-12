<?php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";

$method = $_SERVER["REQUEST_METHOD"] ?? "GET";

if ($method === "GET") {
    json_response([
        "success" => true,
        "recipient" => get_contact_email(),
        "provider" => get_mail_provider(),
    ]);
}

if ($method !== "POST") {
    json_response(["success" => false, "error" => "Method not allowed"], 405);
}

enforce_rate_limit("contact_form", get_contact_rate_limit_max(), get_contact_rate_limit_window_seconds());

$payload = get_request_payload();

if (!empty($payload["website"])) {
    api_log("info", "contact_honeypot_triggered", ["client_ip" => get_client_ip()]);
    json_response([
        "success" => true,
        "recipient" => get_contact_email(),
        "delivered" => false,
        "provider" => get_mail_provider(),
    ]);
}

$name = sanitize_text((string) ($payload["name"] ?? ""), 100);
$phone = sanitize_text((string) ($payload["phone"] ?? ""), 40);
$email = sanitize_text((string) ($payload["email"] ?? ""), 255);
$subject = sanitize_text((string) ($payload["subject"] ?? ""), 200);
$message = sanitize_multiline_text((string) ($payload["message"] ?? ""), 2000);

if ($name === "" || $email === "" || $subject === "" || $message === "") {
    json_response(["success" => false, "error" => "Missing required fields"], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(["success" => false, "error" => "Invalid email"], 422);
}

if (mb_strlen($message, "UTF-8") < 10) {
    json_response(["success" => false, "error" => "Message is too short"], 422);
}

$recipient = get_contact_email();
$now = gmdate("c");

$entry = [
    "id" => bin2hex(random_bytes(8)),
    "created_at" => $now,
    "name" => $name,
    "phone" => $phone,
    "email" => $email,
    "subject" => $subject,
    "message" => $message,
    "ip" => get_client_ip(),
    "user_agent" => substr((string) ($_SERVER["HTTP_USER_AGENT"] ?? ""), 0, 300),
];

$paths = get_data_paths();
$line = json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
@file_put_contents($paths["messages"], $line, FILE_APPEND | LOCK_EX);

$mailSubject = "[Contact Site] " . $subject;
$mailBody = "Nouveau message depuis le site Taxi Le Havre\n\n";
$mailBody .= "Date: " . $now . "\n";
$mailBody .= "Nom: " . $name . "\n";
$mailBody .= "Téléphone: " . $phone . "\n";
$mailBody .= "Email: " . $email . "\n";
$mailBody .= "Sujet: " . $subject . "\n\n";
$mailBody .= "Message:\n" . $message . "\n";

$mailResult = send_contact_email($recipient, $mailSubject, $mailBody, $email);

if (!$mailResult["delivered"]) {
    api_log("error", "contact_email_delivery_failed", [
        "recipient" => $recipient,
        "provider" => $mailResult["provider"],
        "error" => $mailResult["error"],
    ]);

    send_alert("Contact email delivery failed", [
        "recipient" => $recipient,
        "provider" => $mailResult["provider"],
        "error" => $mailResult["error"],
    ]);

    json_response([
        "success" => false,
        "recipient" => $recipient,
        "delivered" => false,
        "provider" => $mailResult["provider"],
        "error" => $mailResult["error"] !== "" ? $mailResult["error"] : "Email delivery failed",
    ], 503);
} else {
    api_log("info", "contact_email_delivered", [
        "recipient" => $recipient,
        "provider" => $mailResult["provider"],
    ]);
}

json_response([
    "success" => true,
    "recipient" => $recipient,
    "delivered" => $mailResult["delivered"],
    "provider" => $mailResult["provider"],
]);
