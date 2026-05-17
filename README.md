# System Shift Lab MVP Foundation

This repository now provides a clean Next.js MVP foundation aligned to `docs/architecture.md` and inspired by `src/lets_change_the_world_prototype.jsx`.

## What is implemented now (Task 1)
- Next.js App Router + TypeScript + Tailwind architecture
- Mobile-first dark futuristic UI baseline
- Reusable component structure (`components/ui`, `components/layout`, `components/charts`, `components/sections`)
- Homepage and navigation shell
- Policy simulator page (mock model/UI)
- Discussion mock UI
- Placeholder routes: `/learn`, `/simulate`, `/discuss`, `/governance`, `/map`
- Deployment-ready project scripts/config for Vercel

## What is explicitly NOT implemented yet
- Real auth/session handling
- Real database writes or backend API
- AI calls/agents
- Multiplayer realtime collaboration
- Moderation automation
- Payments

## Run locally
```bash
npm install
npm run dev
```

## Suggested Task 2 (next milestone)
1. Add Supabase client/server wiring and environment setup
2. Implement real topic/discussion schemas and read-only fetches
3. Build structured discussion composer (claim/evidence/counterpoint forms)
4. Add route groups and layout states for authenticated vs guest users
5. Add simulator persistence for saved scenarios (local first, DB next)
6. Establish UI test/lint/typecheck/build CI pipeline
