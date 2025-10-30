Fastbreak — Sports Event Management (Next.js + Supabase)
=======================================================

Fastbreak is a sports event management app built with Next.js App Router and Supabase. It lets users sign up, sign in (email/password and Google OAuth), create and manage events with venues, and browse/filter events on a dashboard.

Features
--------
- Email/password auth and Google OAuth via Supabase
- Create, view, update, and delete events with ownership checks
- Event venues with capacity formatting and multi-venue display
- Dashboard with search and sport-type filtering
- Comprehensive unit tests with Jest + React Testing Library

Tech Stack
---------
- Framework: Next.js 16 (App Router)
- UI: React 19, Radix UI, Tailwind presets/styles
- Backend: Supabase (auth + database)
- Validation: Zod
- Testing: Jest + @testing-library/react + jest-dom

Local Development
-----------------
1) Configure environment variables: copy `.env.example` to `.env.local` and fill in your Supabase creds

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # if needed for server-side operations
```

Important: `.env.local` (or any .env files for that matter) is intentionally gitignored. For plain obvious security reaons. In production, set these env vars in Vercel Project Settings instead of committing any .env files.

2) Install dependencies and run the dev server

```
npm install
npm run dev
```

Open http://localhost:3000 to view the app.

Testing
-------
We use Jest with React Testing Library. Cypress has been removed from this project.

```
npm test
```

Key test coverage includes:
- Auth actions (signup, signin, Google OAuth, signout, current user)
- Event actions (create/list/get/update/delete with ownership checks)
- Dashboard UI (EventCard details and DashboardClient filtering/search)

Project Structure (high-level)
------------------------------
- `src/app` — App Router pages and routes (including auth callback)
- `src/components` — UI and feature components (dashboard, forms, ui)
- `src/lib` — actions, schemas, auth context, Supabase clients
- `public` — static assets
- `src/**/__tests__` — Jest test suites





