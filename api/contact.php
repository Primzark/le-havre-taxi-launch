<?php
declare(strict_types=1);

require_once __DIR__ . "/bootstrap.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(["success" => false, "error" => "Method not allowed"], 405);
}

$payload = get_request_payload();

if (!empty($payload["website"])) {
    json_response([
        "success" => true,
        "recipient" => get_contact_email(),
        "delivered" => false,
    ]);
}

$name = sanitize_text((string) ($payload["name"] ?? ""), 100);
$phone = sanitize_text((string) ($payload["phone"] ?? ""), 40);
$email = sanitize_text((string) ($payload["email"] ?? ""), 255);
$subject = sanitize_text((string) ($payload["subject"] ?? ""), 200);
$message = sanitize_text((string) ($payload["message"] ?? ""), 2000);

if ($name === "" || $email === "" || $subject === "" || $message === "") {
    json_response(["success" => false, "error" => "Missing required fields"], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(["success" => false, "error" => "Invalid email"], 422);
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
    "ip" => $_SERVER["REMOTE_ADDR"] ?? "",
];

$paths = get_data_paths();
$line = json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
file_put_contents($paths["messages"], $line, FILE_APPEND | LOCK_EX);

$siteHost = $_SERVER["HTTP_HOST"] ?? "taxis-lehavre.com";
$safeFrom = "no-reply@" . preg_replace("/[^a-zA-Z0-9.-]/", "", $siteHost);
$mailSubject = "[Contact Site] " . $subject;
$mailBody = "Nouveau message depuis le site Taxi Le Havre\n\n";
$mailBody .= "Date: " . $now . "\n";
$mailBody .= "Nom: " . $name . "\n";
$mailBody .= "Téléphone: " . $phone . "\n";
$mailBody .= "Email: " . $email . "\n";
$mailBody .= "Sujet: " . $subject . "\n\n";
$mailBody .= "Message:\n" . $message . "\n";

$headers = [];
$headers[] = "From: Taxi Le Havre <" . $safeFrom . ">";
$headers[] = "Reply-To: " . $email;
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "X-Mailer: PHP/" . phpversion();

$delivered = @mail($recipient, $mailSubject, $mailBody, implode("\r\n", $headers));

json_response([
    "success" => true,
    "recipient" => $recipient,
    "delivered" => $delivered,
]);

