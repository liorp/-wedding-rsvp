insert into storage.buckets (id, name, public)
values ('wedding-rsvp', 'wedding-rsvp', true)
on conflict (id) do update set public = excluded.public;
