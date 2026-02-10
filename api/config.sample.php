<?php
declare(strict_types=1);

/**
 * Copy this file to `api/config.php` and set your own values.
 */

// Contact form destination.
define("CONTACT_FORM_EMAIL", "contactradiotaxilehavre@gmail.com");

// Admin authentication for actus CRUD/upload.
define("ACTUS_ADMIN_USERNAME", "admin");
define("ACTUS_ADMIN_PASSWORD_HASH", '$2y$12$KFUC9kuwJjsVzCLQ9xMvGeUrzKIZjgGjmIaCzPRo0AAiSGDAI2NVm');

// Upload limit for actus images (MB).
define("ACTUS_UPLOAD_MAX_MB", 5);

// Mail transport: "resend" (recommended) or "mail".
define("MAIL_PROVIDER", "resend");
define("MAIL_FROM_EMAIL", "no-reply@taxis-lehavre.com");
define("MAIL_FROM_NAME", "Taxi Le Havre");
define("RESEND_API_KEY", "re_xxxxxxxxxxxxxxxxxxxxx");

// Optional monitoring alerts.
define("ALERT_WEBHOOK_URL", "");
define("ALERT_EMAIL", "");

// Optional anti-spam tuning.
define("CONTACT_RATE_LIMIT_MAX", 5);
define("CONTACT_RATE_LIMIT_WINDOW_SECONDS", 600);
define("LOGIN_RATE_LIMIT_MAX", 10);
define("LOGIN_RATE_LIMIT_WINDOW_SECONDS", 900);
