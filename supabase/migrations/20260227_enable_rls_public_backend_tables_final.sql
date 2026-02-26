-- Final RLS hardening migration.
-- Uses an 8-digit version greater than the legacy base migration (20260226)
-- so it is applied after the base migration in Supabase CLI's mixed-version
-- ordering behavior.

alter table if exists public.actus_items enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.api_rate_limits enable row level security;
alter table if exists public.api_events enable row level security;
