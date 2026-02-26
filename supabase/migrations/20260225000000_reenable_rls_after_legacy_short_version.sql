-- Legacy ordering workaround:
-- The original base migration uses a short version number (20260226), which can
-- sort after newer timestamped migrations in Supabase CLI's remote push flow.
-- This finalizer migration uses an intentionally lower version so it runs after
-- the legacy base migration and leaves RLS enabled.

alter table if exists public.actus_items enable row level security;
alter table if exists public.contact_messages enable row level security;
alter table if exists public.api_rate_limits enable row level security;
alter table if exists public.api_events enable row level security;
