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

Optional frontend env (contact email shown on the site):

```sh
VITE_CONTACT_EMAIL=bureautaxi@gmail.com
```

If you need PHP endpoints locally:

```sh
php -S 127.0.0.1:8090 -t .
```

## API configuration

1. Copy `api/config.sample.php` to `api/config.php`.
2. Set production values for:
- Frontend build env `VITE_CONTACT_EMAIL=contact@radiotaxi-lehavre.com`
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

## Vercel deployment (frontend) + PHP origin (backend)

This project is deployed with:
- `Vercel` for the Vite frontend (`www.taxis-lehavre.com`)
- a separate PHP host for the existing backend APIs/uploads (`origin.taxis-lehavre.com`)

### Why
- Vercel hosts the frontend well.
- The current backend uses PHP sessions and file persistence (`var/`, `public/uploads/`), which should stay on a PHP host.

### Repo files for Vercel
- `vercel.json`: Vercel rewrites/proxy for `/api/*` and `/uploads/*`, plus SPA fallback.
- `.vercelignore`: excludes PHP backend files and local artifacts from the Vercel upload.

### Vercel project settings
- Framework preset: `Vite`
- Root directory: `/`
- Build command: `npm run build`
- Output directory: `dist`
- Frontend env: `VITE_CONTACT_EMAIL=contact@radiotaxi-lehavre.com`

### PHP origin host layout (`origin.taxis-lehavre.com`)
Deploy these paths from the repo root to the PHP host (same relative layout):
- `api/`
- `var/` (or allow creation at runtime)
- `public/uploads/`

The PHP host document root should be the project root (the directory containing `api/`, `public/`, `var/`).

Required PHP host permissions:
- writable `var/`
- writable `public/uploads/` (and `public/uploads/actus/`)

### DNS / domains
- Public site on Vercel:
  - `www.taxis-lehavre.com` (primary)
  - `taxis-lehavre.com` -> redirect to `www.taxis-lehavre.com`
  - `taxihavre.com` -> redirect to `www.taxis-lehavre.com`
  - `www.taxihavre.com` -> redirect to `www.taxis-lehavre.com`
- Hidden backend origin:
  - `origin.taxis-lehavre.com` -> PHP host

### Important note
- `.htaccess` and `public/_redirects` are not used by Vercel.
- Domain redirects for apex/legacy hosts must be configured in Vercel project domain settings.
- `vercel.json` handles path rewrites and SPA routing.

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
