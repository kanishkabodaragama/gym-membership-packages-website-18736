# Supabase Integration - Royal Gym Packages Frontend

This frontend uses Supabase to fetch membership packages and their features.

Environment variables required (set in the gym_packages_frontend/.env file):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

IMPORTANT: Supabase Configuration Required
1) In your Supabase Dashboard:
   - Go to Authentication > URL Configuration
   - Set Site URL to your dev/prod domains (e.g., http://localhost:3000/ and https://yourapp.com/)
   - Add Redirect URLs:
     * http://localhost:3000/**
     * https://yourapp.com/**

2) Environment Variables:
   - Ensure REACT_APP_SUPABASE_URL is your Supabase project URL (https://XYZ.supabase.co)
   - Ensure REACT_APP_SUPABASE_KEY is an anon or service key suitable for the RLS policies you apply
   - Restart the dev server after changing .env

3) Security:
   - Never commit actual keys to source control. Use environment variables.
   - The current policies allow read-only public access for anon on the two tables below.
     Update/lock down as needed for your use case.

Database schema provisioned
- Table: packages
  - id: uuid primary key, default gen_random_uuid()
  - name: text
  - price: numeric
  - billing_cycle: text (e.g., "mo", "yr")
  - description: text (optional)
  - highlight: boolean (optional) - marks the featured plan

- Table: package_features
  - id: uuid primary key, default gen_random_uuid()
  - package_id: fk -> packages.id (on delete cascade)
  - feature: text
  - included: boolean (default true)
  - note: text (optional)

Indexes:
- package_features(package_id)

Row Level Security (RLS) and policies:
- RLS enabled on packages and package_features
- Policies created:
  - "Anon can read packages" (for select to anon using TRUE)
  - "Anon can read package_features" (for select to anon using TRUE)

If you prefer authenticated-only read access:
- Remove the anon read policies and add:
  create policy "Authenticated can read packages" on public.packages for select to authenticated using (true);
  create policy "Authenticated can read package_features" on public.package_features for select to authenticated using (true);

Frontend code reference:
- src/App.js creates the Supabase client using:
  - process.env.REACT_APP_SUPABASE_URL
  - process.env.REACT_APP_SUPABASE_KEY

Usage notes:
- If the app shows "Supabase is not configured", confirm your .env is set and the app restarted.
- If no packages appear, ensure:
  1) Tables contain data
  2) RLS policies allow select for the used key
  3) Column names match the expected schema

Dynamic URL helper (for future auth flows):
- Add src/utils/getURL.js and import when implementing auth flows so emailRedirectTo/redirectTo always use the correct environment URL.

Troubleshooting:
- 401/permission errors: Verify RLS and the key being used (anon vs service).
- Empty lists: Check data presence and filters; confirm package_features.package_id matches packages.id.
- Environment vars not picked up: Ensure variable names start with REACT_APP_ and restart dev server.
