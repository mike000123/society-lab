# Supabase Foundation Setup

1. Create a Supabase project.
2. Copy [`.env.example`](<C:\Users\dimzo\Documents\ENTERTAINMENT\Coding\new_society\.env.example>) to `.env.local`.
3. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Open the Supabase SQL editor and run [`schema.sql`](<C:\Users\dimzo\Documents\ENTERTAINMENT\Coding\new_society\supabase\schema.sql>).
5. In Supabase Auth URL configuration add:
   - `http://127.0.0.1:3000`
   - `http://localhost:3000`
   - your production Vercel URL
6. Add redirect URLs:
   - `http://127.0.0.1:3000/auth/callback`
   - `http://localhost:3000/auth/callback`
   - `https://your-production-domain/auth/callback`
7. Optional:
   - Enable GitHub and Google providers in Supabase Auth for OAuth buttons.
   - Add `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` later for server-only jobs and webhooks.

The current foundation includes:
- App Router server/browser Supabase clients
- auth callback handling
- middleware-based session refresh
- protected `/dashboard`
- protected `/api/me`
- starter schema for profiles, discussions, simulations, proposals, and votes

