-- Store Actus admin credentials in Supabase so admin access is backed by the
-- same production database as the rest of the Vercel backend.

create table if not exists public.admin_users (
  username text primary key,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_login_at timestamptz
);

create unique index if not exists admin_users_username_lower_idx
  on public.admin_users ((lower(username)));

alter table if exists public.admin_users enable row level security;
