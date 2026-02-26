-- Security hardening for Vercel backend tables exposed via PostgREST.
-- The app uses the service role key server-side, which bypasses RLS.
-- Enabling RLS removes Security Advisor warnings without breaking the backend.

alter table if exists public.actus_items enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.api_rate_limits enable row level security;
alter table if exists public.api_events enable row level security;

-- No policies are created on purpose. The frontend does not access these tables
-- directly; the Vercel backend uses the service role key and bypasses RLS.
