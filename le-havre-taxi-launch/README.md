# Taxi Le Havre Website

## Stack
- Vite + React + TypeScript
- Tailwind + shadcn/ui
- PHP APIs in `api/`

## Local run

```sh
npm install
npm run dev
```

If you need PHP endpoints locally:

```sh
php -S 127.0.0.1:8090 -t .
```

## API configuration

1. Copy `api/config.sample.php` to `api/config.php`.
2. Set production values for:
- `CONTACT_FORM_EMAIL`
- `ACTUS_ADMIN_USERNAME`
- `ACTUS_ADMIN_PASSWORD_HASH`
- `MAIL_PROVIDER` + mail provider credentials
- Optional alerting (`ALERT_WEBHOOK_URL`, `ALERT_EMAIL`)

Generate an admin password hash:

```sh
php -r 'echo password_hash("your-strong-password", PASSWORD_DEFAULT), PHP_EOL;'
```

## API endpoints
- `GET/POST /api/contact.php`
- `GET/POST/PUT/DELETE /api/news.php`
- `GET/POST/DELETE /api/admin.php`
- `POST /api/upload.php`

## Security and reliability
- Session-based admin authentication for Actus operations.
- File upload validation (type + size) and restricted upload directory.
- IP-based rate limiting for contact submissions and admin login.
- API structured logs in `var/api.log` and optional alert hooks.

## Tests

```sh
npm run test
npm run build
```
