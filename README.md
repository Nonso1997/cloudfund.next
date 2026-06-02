# Cloudfund Next.js

This is a Vercel-ready rewrite of the Cloudfund application using Next.js and Supabase.

## Setup

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor.
3. Copy the project values into your local `.env.local` file:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `JWT_SECRET`

### Hosted database setup

Use the values from your Supabase project dashboard:

- `SUPABASE_URL` → Project URL
- `SUPABASE_SERVICE_ROLE_KEY` → Service role key
- `NEXT_PUBLIC_SUPABASE_URL` → Same Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Public anon key

> The app now prefers Supabase when these values are present. If they are missing, the app falls back to the local JSON database in `local-db.json` for local development only.

4. Install dependencies:
   - `npm install`

5. Run locally:
   - `npm run dev`

## Features

- Public landing page
- Register/login with JWT cookie auth
- User dashboard with deposit, withdrawal, plan selection, and transaction history
- Roadmap page

> Admin pages are not included in this initial rewrite but can be added using the same auth patterns.
