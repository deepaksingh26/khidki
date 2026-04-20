# Khidkee

Khidkee is a mobile-first community field intelligence platform for rural outreach teams. This Phase 1 repo ships a public marketing site and a protected product web app built with Next.js, TypeScript, Tailwind CSS, Supabase, PostgreSQL, and PostGIS.

## What is in this MVP

- Public site with grounded product content, pilot request flow, privacy framing, and sign-in
- Protected app shell with dashboard, contacts, nearby map, issues, visits, field diary, alerts, team, and settings
- Supabase schema, PostGIS functions, views, row-level security, and realistic seed data
- Demo mode fallback so the UI works before live Supabase keys are added
- CSV exports and offline-ready cache hooks for future sync work

## Stack

- Next.js 15.5.3 with App Router
- React 19.1.1
- TypeScript
- Tailwind CSS 4
- Supabase Auth and PostgreSQL
- PostGIS for geo queries
- Leaflet with OpenStreetMap
- Zod and React Hook Form

## Project shape

```text
.
├── public/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   ├── (auth)/
│   │   ├── (protected)/app/
│   │   └── auth/callback/
│   ├── components/
│   │   ├── brand/
│   │   ├── contacts/
│   │   ├── forms/
│   │   ├── issues/
│   │   ├── layout/
│   │   ├── map/
│   │   ├── ui/
│   │   └── visits/
│   ├── hooks/
│   ├── lib/
│   │   ├── data/
│   │   ├── offline/
│   │   └── supabase/
│   └── types/
└── supabase/
    └── migrations/
```

## Local setup

1. Install dependencies.

```bash
npm install
```

2. Copy environment values.

```bash
cp .env.example .env.local
```

3. For quick UI review, keep `KHIDKEE_DEMO_MODE=true`.

4. For live Supabase:

- add `NEXT_PUBLIC_SUPABASE_URL`
- add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- add `SUPABASE_SERVICE_ROLE_KEY` if you want admin-side extensions later

5. Start the app.

```bash
npm run dev
```

If Node is not installed globally on your machine, this repo also includes a local runtime and helper scripts:

```bash
./scripts/dev.sh
./scripts/npm.sh run typecheck
```

## Supabase setup

1. Create a new Supabase project.
2. Enable email auth.
3. Run the SQL files from `supabase/migrations` in timestamp order, or use the Supabase CLI if you prefer.
4. The `handle_new_user` trigger creates a `team_members` row automatically when a new auth user signs up.
5. PostGIS must stay enabled because nearby search depends on it.

## Demo mode

When Supabase env vars are missing, the app uses believable rural-context seeded records from `src/lib/demo-data.ts`.

This keeps the UI reviewable while preserving the live data architecture:

- public forms still return success messages
- sign-in opens a demo session
- protected pages render with realistic contacts, issues, visits, and alerts

## Deployment notes

### Vercel

1. Import the repo into Vercel.
2. Set the same environment variables from `.env.example`.
3. Keep Node runtime defaults.
4. Deploy.

### Supabase

1. Apply the migrations.
2. Turn on email auth.
3. If you want phone OTP later, add your SMS provider inside Supabase Auth and extend the sign-in flow with OTP verification UI.

## What to extend next

- Pending team invites and invite acceptance flow
- Photo upload for contacts and visits via Supabase Storage
- True offline sync with IndexedDB and conflict resolution
- Phone OTP verification screen
- Organization or multi-workspace partitioning if the pilot expands beyond one shared workspace
