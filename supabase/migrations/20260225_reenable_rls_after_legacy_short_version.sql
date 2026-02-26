-- Final RLS enforcement after legacy base migration (20260226).
-- This intentionally uses a lower short version so Supabase CLI's descending
-- numeric migration ordering applies the legacy base migration first and this
-- hardening migration last.

alter table if exists public.actus_items enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.api_rate_limits enable row level security;
alter table if exists public.api_events enable row level security;
