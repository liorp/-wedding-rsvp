create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  attending boolean not null default true,
  guest_count integer not null default 1 check (guest_count >= 0 and guest_count <= 20),
  created_at timestamptz not null default now()
);

alter table public.guests enable row level security;

drop policy if exists "Guests are insertable by anyone" on public.guests;
create policy "Guests are insertable by anyone"
  on public.guests
  for insert
  to anon
  with check (true);

drop policy if exists "Guests are readable by anyone" on public.guests;
create policy "Guests are readable by anyone"
  on public.guests
  for select
  to anon
  using (true);
