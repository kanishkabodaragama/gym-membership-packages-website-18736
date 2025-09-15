# Supabase Integration - Royal Gym Packages Frontend

This frontend uses Supabase to fetch membership packages and their features.

Environment variables required (set in the gym_packages_frontend/.env file):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

Schema expectation (adjust names if yours differ):
- Table: packages
  - id: uuid or int, primary key
  - name: text
  - price: numeric
  - billing_cycle: text (e.g., "mo", "yr")
  - description: text (optional)
  - highlight: boolean (optional) - marks the featured plan

- Table: package_features
  - id: uuid or int, primary key
  - package_id: fk -> packages.id
  - feature: text
  - included: boolean
  - note: text (optional)

Minimum Row Level Security Policies:
- For read-only public access, enable RLS and add select policies for anon role on both tables as appropriate.
- Alternatively, restrict with authenticated only and use Supabase Auth.

Frontend code reference:
- src/App.js creates the Supabase client using:
  - process.env.REACT_APP_SUPABASE_URL
  - process.env.REACT_APP_SUPABASE_KEY

Usage notes:
- If the app shows "Supabase is not configured", confirm your .env is set and the app restarted.
- If no packages appear, ensure tables contain data and policies allow select for the used key.

Security:
- Never commit actual keys to source control. Use environment variables.
