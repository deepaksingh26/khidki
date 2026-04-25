Run the Khidkee DB migrations

This folder contains SQL migration files (apply in order):
- 20260413120000_init_extensions.sql
- 20260413121000_schema.sql
- 20260413122000_policies_and_views.sql
- 20260413123000_seed.sql (optional)

Recommended: Paste each file, in order, into the Supabase project SQL editor and run. This is the safest approach.

If you prefer CLI (you must have the DB connection string or the supabase CLI configured with appropriate access):

1) Using `supabase` CLI (recommended if you have it set up):

   # login and link to project, then
   supabase db reset --no-branch-prompt
   supabase db push

2) Using `psql` and the Postgres connection string (you need the DB host, user, password, and database):

   export DATABASE_URL="postgres://<db_user>:<db_password>@<db_host>:5432/postgres"
   psql "$DATABASE_URL" -f 20260413120000_init_extensions.sql
   psql "$DATABASE_URL" -f 20260413121000_schema.sql
   psql "$DATABASE_URL" -f 20260413122000_policies_and_views.sql
   psql "$DATABASE_URL" -f 20260413123000_seed.sql

Notes:
- The migrations create PostGIS and pgcrypto extensions, tables, RLS policies, functions and views used by the app.
- Do NOT expose the service role key publicly. If running CLI commands that require the service role key, store it in environment variables or your OS key store.

After applying migrations:
1. Re-run the quick connectivity test:

   node scripts/test-supabase-connection.mjs

2. Start the app locally:

   npm install
   npm run dev

If you'd like, I can run the migrations for you now — provide a Postgres connection URL (postgres://user:pass@host:5432/postgres) or supply the service role key and allow me to run via the Supabase CLI. If you prefer NOT to share secrets, paste the SQL files into the Supabase SQL editor yourself and tell me when you're done; I'll re-run verification.
