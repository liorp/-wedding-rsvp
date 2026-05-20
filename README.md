# Wedding RSVP

Hebrew RTL wedding RSVP app built with Vite, React, TypeScript, Tailwind, shadcn-style components, and Supabase.

## Local Development

```bash
cd wedding-rsvp-project
npm install
npm run dev
```

Local environment values live in `wedding-rsvp-project/.env.local` and are ignored by git. Copy `.env.example` when setting up another machine.

## Configuration

Default event configuration is centralized in:

```text
wedding-rsvp-project/src/config.ts
```

It includes couple names, wedding date, venue, Waze, payment phone numbers, WhatsApp message text, admin password, and Supabase env bindings.

Runtime editable event values are stored in `localStorage`; Supabase URL and key are build-time env values:

```bash
VITE_SUPABASE_URL=https://bugwiklegzeduufvognl.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_PASSWORD=...
```

## Supabase

The remote Supabase project is linked through the CLI:

```bash
cd wedding-rsvp-project
supabase db push
```

The guests schema and RLS policies are in:

```text
wedding-rsvp-project/supabase/migrations/20260520093600_create_guests.sql
```

## Deploy

GitHub Pages is disabled. Deployments are served only from Supabase.

```bash
cd wedding-rsvp-project
npm run deploy:supabase
```

The script builds the Vite app, uploads `dist` to the public Supabase Storage bucket, and deploys the public Edge Function proxy.

Public app URL:

```text
https://bugwiklegzeduufvognl.supabase.co/functions/v1/app
```
