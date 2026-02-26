-- Vercel-only backend replacement for legacy PHP API.
-- Creates storage + tables used by /api/contact.php, /api/admin.php, /api/news.php, /api/upload.php.

create extension if not exists pgcrypto;

create table if not exists public.actus_items (
  id text primary key,
  title text not null,
  image text not null,
  source_url text not null,
  source_name text not null default 'Instagram',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists actus_items_created_at_idx
  on public.actus_items (created_at desc);

create table if not exists public.contact_messages (
  id text primary key,
  created_at timestamptz not null default timezone('utc', now()),
  name text not null,
  phone text not null default '',
  email text not null,
  subject text not null,
  message text not null,
  ip text not null default '',
  user_agent text not null default '',
  delivered boolean not null default false,
  provider text not null default '',
  error text not null default ''
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

create table if not exists public.api_rate_limits (
  key text primary key,
  scope text not null,
  count integer not null default 0,
  window_started_at timestamptz not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists api_rate_limits_scope_updated_idx
  on public.api_rate_limits (scope, updated_at desc);

create table if not exists public.api_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default timezone('utc', now()),
  level text not null,
  event text not null,
  context jsonb not null default '{}'::jsonb
);

create index if not exists api_events_created_at_idx
  on public.api_events (created_at desc);

-- Public bucket for Actus images uploaded through /api/upload.php
insert into storage.buckets (id, name, public)
values ('actus', 'actus', true)
on conflict (id) do update set public = true;

-- Optional hardening: keep these tables inaccessible from the browser.
alter table if exists public.actus_items disable row level security;
alter table if exists public.contact_messages disable row level security;
alter table if exists public.api_rate_limits disable row level security;
alter table if exists public.api_events disable row level security;
