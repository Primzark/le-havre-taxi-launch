# Taxi Le Havre Website

## Stack
- Vite + React + TypeScript
- Tailwind + shadcn/ui
- Vercel Functions (JS) in `api/` for production
- Legacy PHP APIs in `api/*.php` kept temporarily for migration/cutover

## Local run

```sh
npm install
npm run dev
```

Optional frontend env (contact email shown on the site):

```sh
VITE_CONTACT_EMAIL=bureautaxi@gmail.com
```

For production-parity local env, pull the current Vercel production variables into
an ignored `.env.local` file:

```sh
npm run env:pull:prod
```

Use the Vite dev server when you only need the frontend:

```sh
npm run dev
```

Use Vercel dev when you want the Vercel Functions + Supabase path that matches
production:

```sh
npm run dev:vercel
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

Local secret-bearing files are intentionally ignored:
- `.env.local` for Vercel/Vite env sync
- `api/config.php` for legacy PHP fallback config

Use `.env.example` as a non-secret reference only.

## API endpoints
- `GET/POST /api/contact.php`
- `GET/POST/PUT/DELETE /api/news.php`
- `GET/POST/DELETE /api/admin.php`
- `POST /api/upload.php`

## Vercel-only deployment (frontend + functions + Supabase)

Production target:
- `Vercel` hosts the Vite frontend and serverless API functions
- `Supabase` provides database + storage persistence (replaces PHP file storage)

### Vercel project settings
- Framework preset: `Vite`
- Root directory: `/`
- Build command: `npm run build`
- Output directory: `dist`

### Frontend env (Vercel)
- `VITE_CONTACT_EMAIL=contact@radiotaxi-lehavre.com`

### Server env (Vercel Functions)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ACTUS_BUCKET=actus` (optional if using default `actus`)
- `ACTUS_ADMIN_USERNAME`
- `ACTUS_ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET` (recommended)
- `CONTACT_FORM_EMAIL`
- `MAIL_PROVIDER=resend`
- `RESEND_API_KEY`
- `MAIL_FROM_EMAIL` (recommended)
- `MAIL_FROM_NAME` (recommended)
- Optional alerts: `ALERT_WEBHOOK_URL`
- Optional anti-spam tuning:
  - `CONTACT_RATE_LIMIT_MAX`
  - `CONTACT_RATE_LIMIT_WINDOW_SECONDS`
  - `LOGIN_RATE_LIMIT_MAX`
  - `LOGIN_RATE_LIMIT_WINDOW_SECONDS`
  - `ACTUS_UPLOAD_MAX_MB`

### Supabase setup
Run the SQL migration:
- `supabase/migrations/20260226_vercel_backend_core.sql`

It creates:
- `public.actus_items`
- `public.contact_messages`
- `public.api_rate_limits`
- `public.api_events` (optional logs)
- public storage bucket `actus`

### Vercel routing in this repo
- `/api/*.php` -> Vercel Functions (`api/*.php.js`)
- `/uploads/*` -> rewritten to `/api/uploads.php` then redirected to Supabase public storage URL
- SPA fallback and canonical host redirects are handled in `vercel.json`

### DNS / domains
- Public site on Vercel:
  - `le-havre-taxi-launch.vercel.app` (primary)
  - `taxis-lehavre.com` -> redirect to `le-havre-taxi-launch.vercel.app`
  - `www.taxis-lehavre.com` -> redirect to `le-havre-taxi-launch.vercel.app`
  - `taxihavre.com` -> redirect to `le-havre-taxi-launch.vercel.app`
  - `www.taxihavre.com` -> redirect to `le-havre-taxi-launch.vercel.app`

### Legacy PHP backend (temporary only)
- Old PHP endpoints remain in `api/*.php` for migration fallback/cutover.
- Vercel excludes them via `.vercelignore` in Vercel-only mode.

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
