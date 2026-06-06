# Private Study Circles Roadmap

This document turns the social-learning idea into an implementation path that fits Society Lab's existing architecture.

## Product framing

This should behave like **module-based and track-based private study circles**, not generic direct messages.

Users can:

- opt in to showing completed modules
- allow discovery through shared modules
- receive invitations to private conversations tied to a module or track
- accept an invite into a small private circle
- invite additional people later if the circle owner and participant settings allow it

## Data foundation already added

The database now supports:

- `profiles` privacy/discovery settings
- `user_module_progress` for synced module progress
- `threads.kind`, `threads.context_type`, and `threads.context_slug`
- `thread_participants` for invitations and private-circle membership

See:

- `supabase/schema.sql`
- `lib/database.types.ts`

## Recommended rollout

### Phase 1: Persist learning progress

Goal: move beyond local-only progress so discovery can work across users.

Tasks:

- create a signed-in sync layer for `lib/progress/store.ts`
- mirror local progress into `public.user_module_progress`
- preserve local progress as an offline fallback
- upsert progress rows on:
  - lesson visit
  - quiz result
  - completion

Suggested implementation touchpoints:

- `lib/progress/store.ts`
- `lib/supabase/client.ts`
- optional helper: `lib/progress/sync.ts`

### Phase 2: Privacy and discovery settings

Goal: let users control visibility before any discovery UI appears.

Settings to expose:

- `show_learning_activity`
- `discoverable_by_shared_modules`
- `allow_study_circle_invites`
- `contact_permission`
- `allow_participant_invites`

Suggested UI location:

- dashboard account settings
- or a dedicated `Privacy & discovery` panel inside the member dashboard

Suggested implementation touchpoints:

- `app/dashboard/page.tsx`
- `components/dashboard/MemberDashboardClient.tsx`

### Phase 3: Discovery surfaces

Goal: show relevant people only in learning context.

Recommended entry points:

- module page: `People who studied this`
- track page: `People exploring this track`
- dashboard: `Find learning peers`

Discovery should be:

- opt-in only
- based on shared modules or track overlap
- hidden completely when the viewer is not signed in

Suggested implementation touchpoints:

- `components/learn/AtlasLessonPage.tsx`
- `app/learn/page.tsx`
- `lib/tracks/config.ts`

### Phase 4: Study-circle invites and private threads

Goal: create group-capable private conversations linked to a module or track.

Recommended conversation model:

- `threads.kind = 'private_circle'`
- `threads.context_type = 'module' | 'track'`
- `threads.context_slug = <module-slug | track-id>`

Participant flow:

- owner creates a private circle
- selected users get `thread_participants.status = 'pending'`
- invited users accept or decline
- accepted users can read/post
- owner can invite more participants

Suggested implementation touchpoints:

- `app/discussions/page.tsx`
- `components/discussion/discussion-thread.tsx`
- new invite/inbox components under `components/discussion/`

### Phase 5: Safety and moderation

Before broad rollout, add:

- invite rate limits
- max circle size
- leave / mute / report
- block future invites from a user

## Suggested defaults

Use conservative defaults:

- `show_learning_activity = false`
- `discoverable_by_shared_modules = false`
- `allow_study_circle_invites = false`
- `contact_permission = 'none'`
- `allow_participant_invites = false`

## Design principle

Keep the feature anchored to learning objects:

- modules
- tracks
- study circles

That keeps it useful, avoids turning the product into a generic messenger, and reinforces Society Lab's educational identity.
