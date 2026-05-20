drop policy if exists "Guests are insertable by anyone" on public.guests;
create policy "Guests are insertable by anyone"
  on public.guests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Guests are readable by anyone" on public.guests;
drop policy if exists "Guests are readable by authenticated users" on public.guests;
create policy "Guests are readable by authenticated users"
  on public.guests
  for select
  to authenticated
  using (true);
