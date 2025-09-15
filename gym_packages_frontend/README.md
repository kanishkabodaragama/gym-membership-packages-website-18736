# Royal Gym – Membership Packages Frontend

Elegant React frontend to display gym membership packages and their features using the "Royal Purple" theme and Supabase.

## Quick Start

1) Install  
   npm install

2) Environment variables  
   Create `.env` in `gym_packages_frontend/` and set:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_KEY
   - (Optional) REACT_APP_SITE_URL for dynamic redirects in auth flows

3) Start  
   npm start

## Supabase Configuration

This project expects two tables `packages` and `package_features` with read access.  
We have provisioned these tables and basic RLS policies (read for anon) during setup.  
If you need different access rules (e.g., authenticated-only), update policies accordingly.

See `../assets/supabase.md` for:
- Full schema details
- RLS policies and alternatives
- Auth URL configuration steps
- Troubleshooting

## Data Source (Supabase)

Expected tables:
- packages (id, name, price, billing_cycle, description, highlight)
- package_features (id, package_id, feature, included, note)

Adjust names/columns in `src/App.js` if your schema differs.

## Theme

Royal Purple Elegant palette:
- primary: #8B5CF6
- secondary: #6B7280
- success: #10B981
- error: #EF4444
- background: #F3E8FF
- surface: #FFFFFF
- text: #374151

The layout includes:
- Header with navigation and theme toggle
- Main section with package cards
- Footer with contact info

## Scripts

- npm start – dev server
- npm run build – production build
- npm test – test runner
