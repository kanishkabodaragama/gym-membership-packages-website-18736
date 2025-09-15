# Royal Gym – Membership Packages Frontend

Elegant React frontend to display gym membership packages and their features using the "Royal Purple" theme and Supabase.

## Quick Start

1) Install
   npm install

2) Environment variables
   Copy `.env.example` to `.env` and set:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_KEY

3) Start
   npm start

## Data Source (Supabase)

Expected tables:
- packages (id, name, price, billing_cycle, description, highlight)
- package_features (id, package_id, feature, included, note)

Adjust names/columns in `src/App.js` if your schema differs.
See `../assets/supabase.md` for more details and security notes.

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
