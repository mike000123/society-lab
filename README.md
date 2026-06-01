# Society Lab MVP Foundation

This repository provides a Next.js MVP foundation for Society Lab, aligned to `docs/architecture.md` and ready for Vercel + Supabase.

## What is implemented now
- Next.js App Router + TypeScript + Tailwind architecture
- Mobile-first dark UI baseline
- Homepage, simulator mock, discussion mock, governance placeholder, map placeholder
- Supabase auth foundation with:
  - browser/server Supabase clients
  - auth callback route
  - middleware-based session refresh
  - password sign-in
  - email/password sign-up
  - magic-link sign-in
  - OAuth starter buttons for GitHub and Google
- Protected member dashboard at `/dashboard`
- Protected backend sample route at `/api/me`
- Starter SQL schema in `supabase/schema.sql` for:
  - profiles
  - topics
  - threads
  - posts
  - simulations
  - proposals
  - votes
  - row-level security

## Still not implemented yet
- Live realtime discussions
- Multiplayer simulations
- AI debate agents
- Economic simulation engine
- Moderation AI
- Reputation automation logic
- Full governance workflows
- Payments

## Local run
```bash
npm install
npm run dev
```

Recommended on this machine:

```bash
npm run build
npm run preview:local
```

Windows shortcut:
- Run [open-platform.cmd](/C:/Users/dimzo/Documents/ENTERTAINMENT/Coding/new_society/open-platform.cmd)

Notes:
- `open-platform.cmd` is the safest way to open the platform on this machine
- `npm run preview:local` serves the built app at `http://127.0.0.1:3004`
- `npm run local` still exists for development work, but the dev cache has been flaky locally
- `open-platform.cmd` keeps the terminal window open if startup fails, so the error message does not disappear

Production validation:
```bash
npm run build
```

## Supabase setup
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase URL and publishable key
3. Run `supabase/schema.sql` in the Supabase SQL editor
4. Add local and production callback URLs in Supabase Auth settings
5. Restart the dev server

More detailed steps live in `supabase/README.md`.

## Current foundation routes
- `/auth`: auth setup and sign-in/sign-up flows
- `/auth/callback`: Supabase auth callback
- `/dashboard`: protected member area
- `/api/me`: protected JSON endpoint with current user/profile data
