create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

do $$
begin
  create type public.thread_status as enum ('draft', 'open', 'closed', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.thread_visibility as enum ('public', 'members', 'private');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.post_kind as enum ('claim', 'evidence', 'counterpoint', 'question', 'synthesis');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.proposal_status as enum ('draft', 'open', 'accepted', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.proposal_comment_tag as enum (
    'point_of_improvement',
    'feasibility_issue',
    'implementation_detail',
    'supporting_evidence',
    'risk_tradeoff',
    'clarifying_question'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.contact_permission as enum ('none', 'shared_modules', 'any_member');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.thread_kind as enum ('public_discussion', 'private_circle');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.thread_context_type as enum ('general', 'module', 'track');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.thread_participant_status as enum ('pending', 'accepted', 'declined', 'left');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.thread_participant_role as enum ('owner', 'member');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.thread_participation_mode as enum ('open', 'background_guided');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  linkedin_url text,
  share_linkedin_profile boolean not null default false,
  bio text,
  reputation_score integer not null default 0 check (reputation_score >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles
  add column if not exists academic_level text,
  add column if not exists show_learning_activity boolean not null default false,
  add column if not exists discoverable_by_shared_modules boolean not null default false,
  add column if not exists allow_study_circle_invites boolean not null default false,
  add column if not exists contact_permission public.contact_permission not null default 'none',
  add column if not exists allow_participant_invites boolean not null default false,
  add column if not exists professional_stage text,
  add column if not exists professional_title text,
  add column if not exists expertise_domains text[] not null default '{}'::text[],
  add column if not exists linkedin_url text,
  add column if not exists share_linkedin_profile boolean not null default false;

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body_markdown text,
  is_published boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics (id) on delete set null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  prompt text,
  status public.thread_status not null default 'draft',
  visibility public.thread_visibility not null default 'public',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.threads
  add column if not exists kind public.thread_kind not null default 'public_discussion',
  add column if not exists context_type public.thread_context_type not null default 'general',
  add column if not exists context_slug text,
  add column if not exists participation_mode public.thread_participation_mode not null default 'open',
  add column if not exists desired_academic_levels text[] not null default '{}'::text[],
  add column if not exists desired_professional_stages text[] not null default '{}'::text[],
  add column if not exists desired_expertise_domains text[] not null default '{}'::text[];

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  kind public.post_kind not null default 'claim',
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.post_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  value integer not null check (value in (-1, 1)),
  created_at timestamptz not null default timezone('utc', now()),
  unique (post_id, user_id)
);

create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  scenario jsonb not null default '{}'::jsonb,
  results jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  status public.proposal_status not null default 'draft',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.proposal_votes (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  value integer not null check (value in (-1, 1)),
  created_at timestamptz not null default timezone('utc', now()),
  unique (proposal_id, user_id)
);

create table if not exists public.proposal_comments (
  id uuid primary key default gen_random_uuid(),
  proposal_id text not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  tag public.proposal_comment_tag not null,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  module_slug text not null,
  visited boolean not null default false,
  quiz_score integer,
  quiz_passed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, module_slug)
);

create table if not exists public.thread_participants (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  invited_by uuid references public.profiles (id) on delete set null,
  status public.thread_participant_status not null default 'pending',
  role public.thread_participant_role not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (thread_id, user_id)
);

create index if not exists threads_author_id_idx on public.threads (author_id);
create index if not exists threads_topic_id_idx on public.threads (topic_id);
create index if not exists threads_kind_idx on public.threads (kind);
create index if not exists threads_context_idx on public.threads (context_type, context_slug);
create index if not exists posts_thread_id_idx on public.posts (thread_id);
create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists simulations_owner_id_idx on public.simulations (owner_id);
create index if not exists proposals_author_id_idx on public.proposals (author_id);
create index if not exists proposal_comments_proposal_id_idx on public.proposal_comments (proposal_id);
create index if not exists proposal_comments_author_id_idx on public.proposal_comments (author_id);
create index if not exists user_module_progress_user_id_idx on public.user_module_progress (user_id);
create index if not exists user_module_progress_module_slug_idx on public.user_module_progress (module_slug);
create index if not exists thread_participants_thread_id_idx on public.thread_participants (thread_id);
create index if not exists thread_participants_user_id_idx on public.thread_participants (user_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists topics_set_updated_at on public.topics;
create trigger topics_set_updated_at
before update on public.topics
for each row execute function public.touch_updated_at();

drop trigger if exists threads_set_updated_at on public.threads;
create trigger threads_set_updated_at
before update on public.threads
for each row execute function public.touch_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.touch_updated_at();

drop trigger if exists simulations_set_updated_at on public.simulations;
create trigger simulations_set_updated_at
before update on public.simulations
for each row execute function public.touch_updated_at();

drop trigger if exists proposals_set_updated_at on public.proposals;
create trigger proposals_set_updated_at
before update on public.proposals
for each row execute function public.touch_updated_at();

drop trigger if exists proposal_comments_set_updated_at on public.proposal_comments;
create trigger proposal_comments_set_updated_at
before update on public.proposal_comments
for each row execute function public.touch_updated_at();

drop trigger if exists user_module_progress_set_updated_at on public.user_module_progress;
create trigger user_module_progress_set_updated_at
before update on public.user_module_progress
for each row execute function public.touch_updated_at();

drop trigger if exists thread_participants_set_updated_at on public.thread_participants;
create trigger thread_participants_set_updated_at
before update on public.thread_participants
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    avatar_url,
    academic_level,
    professional_stage,
    professional_title,
    expertise_domains,
    linkedin_url,
    share_linkedin_profile
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'academic_level',
    new.raw_user_meta_data ->> 'professional_stage',
    new.raw_user_meta_data ->> 'professional_title',
    coalesce(
      (
        select array_agg(value)
        from jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'expertise_domains', '[]'::jsonb)) as value
      ),
      '{}'::text[]
    ),
    new.raw_user_meta_data ->> 'linkedin_url',
    coalesce((new.raw_user_meta_data ->> 'share_linkedin_profile')::boolean, false)
  )
  on conflict (id) do update
  set
    academic_level = coalesce(new.raw_user_meta_data ->> 'academic_level', public.profiles.academic_level),
    expertise_domains = coalesce(
      (
        select array_agg(value)
        from jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'expertise_domains', '[]'::jsonb)) as value
      ),
      public.profiles.expertise_domains
    ),
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    linkedin_url = coalesce(new.raw_user_meta_data ->> 'linkedin_url', public.profiles.linkedin_url),
    professional_stage = coalesce(new.raw_user_meta_data ->> 'professional_stage', public.profiles.professional_stage),
    professional_title = coalesce(new.raw_user_meta_data ->> 'professional_title', public.profiles.professional_title),
    share_linkedin_profile = coalesce((new.raw_user_meta_data ->> 'share_linkedin_profile')::boolean, public.profiles.share_linkedin_profile),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

create or replace function public.profile_matches_thread_background(
  target_thread_id uuid,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  with target_thread as (
    select
      participation_mode,
      desired_academic_levels,
      desired_professional_stages,
      desired_expertise_domains
    from public.threads
    where id = target_thread_id
  ),
  target_profile as (
    select
      academic_level,
      professional_stage,
      expertise_domains
    from public.profiles
    where id = target_user_id
  )
  select case
    when not exists (select 1 from target_thread) then false
    when (select participation_mode from target_thread) = 'open' then true
    when not exists (select 1 from target_profile) then false
    else
      (
        (
          coalesce(array_length((select desired_academic_levels from target_thread), 1), 0) = 0
          or (select academic_level from target_profile) = any(coalesce((select desired_academic_levels from target_thread), '{}'::text[]))
        )
        and
        (
          coalesce(array_length((select desired_professional_stages from target_thread), 1), 0) = 0
          or (select professional_stage from target_profile) = any(coalesce((select desired_professional_stages from target_thread), '{}'::text[]))
        )
        and
        (
          coalesce(array_length((select desired_expertise_domains from target_thread), 1), 0) = 0
          or coalesce((select expertise_domains from target_profile), '{}'::text[]) && coalesce((select desired_expertise_domains from target_thread), '{}'::text[])
        )
      )
  end;
$$;

create or replace function public.ensure_private_circle_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.kind = 'private_circle' then
    insert into public.thread_participants (
      thread_id,
      user_id,
      invited_by,
      status,
      role
    )
    values (
      new.id,
      new.author_id,
      new.author_id,
      'accepted',
      'owner'
    )
    on conflict (thread_id, user_id) do update
    set
      invited_by = excluded.invited_by,
      status = 'accepted',
      role = 'owner',
      updated_at = timezone('utc', now());
  end if;

  return new;
end;
$$;

create or replace function public.is_accepted_thread_participant(
  target_thread_id uuid,
  target_user_id uuid default auth.uid()
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.thread_participants as memberships
    where memberships.thread_id = target_thread_id
      and memberships.user_id = target_user_id
      and memberships.status = 'accepted'
  );
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists on_private_circle_created on public.threads;
create trigger on_private_circle_created
after insert on public.threads
for each row execute function public.ensure_private_circle_owner();

alter table public.profiles enable row level security;
alter table public.topics enable row level security;
alter table public.threads enable row level security;
alter table public.posts enable row level security;
alter table public.post_votes enable row level security;
alter table public.simulations enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_votes enable row level security;
alter table public.proposal_comments enable row level security;
alter table public.user_module_progress enable row level security;
alter table public.thread_participants enable row level security;

drop policy if exists "profiles are viewable by everyone" on public.profiles;
create policy "profiles are viewable by everyone"
on public.profiles
for select
using (true);

drop policy if exists "users can insert their own profile" on public.profiles;
create policy "users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "published topics are viewable by everyone" on public.topics;
create policy "published topics are viewable by everyone"
on public.topics
for select
using (is_published or auth.uid() = created_by);

drop policy if exists "authenticated users can create topics" on public.topics;
create policy "authenticated users can create topics"
on public.topics
for insert
with check (auth.uid() = created_by);

drop policy if exists "topic creators can update their topics" on public.topics;
create policy "topic creators can update their topics"
on public.topics
for update
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

drop policy if exists "members can view public or owned threads" on public.threads;
create policy "members can view public or owned threads"
on public.threads
for select
using (
  visibility = 'public'
  or auth.uid() = author_id
  or exists (
    select 1
    from public.thread_participants
    where public.thread_participants.thread_id = public.threads.id
      and public.thread_participants.user_id = auth.uid()
      and public.thread_participants.status in ('pending', 'accepted')
  )
);

drop policy if exists "members can create threads" on public.threads;
create policy "members can create threads"
on public.threads
for insert
with check (auth.uid() = author_id);

drop policy if exists "authors can update their own threads" on public.threads;
create policy "authors can update their own threads"
on public.threads
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "members can view posts in public or owned threads" on public.posts;
create policy "members can view posts in public or owned threads"
on public.posts
for select
using (
  exists (
    select 1
    from public.threads
    where public.threads.id = public.posts.thread_id
      and (
        public.threads.visibility = 'public'
        or public.threads.author_id = auth.uid()
        or exists (
          select 1
          from public.thread_participants
          where public.thread_participants.thread_id = public.threads.id
            and public.thread_participants.user_id = auth.uid()
            and public.thread_participants.status = 'accepted'
        )
      )
  )
);

drop policy if exists "members can create their own posts" on public.posts;
create policy "members can create their own posts"
on public.posts
for insert
with check (
  auth.uid() = author_id
  and exists (
    select 1
    from public.threads
    where public.threads.id = public.posts.thread_id
      and (
        (
          public.threads.visibility <> 'private'
          and public.profile_matches_thread_background(public.threads.id, auth.uid())
        )
        or public.threads.author_id = auth.uid()
        or exists (
          select 1
          from public.thread_participants
          where public.thread_participants.thread_id = public.threads.id
            and public.thread_participants.user_id = auth.uid()
            and public.thread_participants.status = 'accepted'
        )
      )
  )
);

drop policy if exists "authors can update their own posts" on public.posts;
create policy "authors can update their own posts"
on public.posts
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "members can vote on posts" on public.post_votes;
create policy "members can vote on posts"
on public.post_votes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "simulations are visible to owners or when public" on public.simulations;
create policy "simulations are visible to owners or when public"
on public.simulations
for select
using (is_public or auth.uid() = owner_id);

drop policy if exists "owners can manage their simulations" on public.simulations;
create policy "owners can manage their simulations"
on public.simulations
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "proposals are viewable by everyone" on public.proposals;
create policy "proposals are viewable by everyone"
on public.proposals
for select
using (true);

drop policy if exists "authenticated users can create proposals" on public.proposals;
create policy "authenticated users can create proposals"
on public.proposals
for insert
with check (auth.uid() = author_id);

drop policy if exists "proposal authors can update their proposals" on public.proposals;
create policy "proposal authors can update their proposals"
on public.proposals
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "proposal votes are viewable by everyone" on public.proposal_votes;
create policy "proposal votes are viewable by everyone"
on public.proposal_votes
for select
using (true);

drop policy if exists "members can manage their proposal votes" on public.proposal_votes;
create policy "members can manage their proposal votes"
on public.proposal_votes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "proposal comments are viewable by everyone" on public.proposal_comments;
create policy "proposal comments are viewable by everyone"
on public.proposal_comments
for select
using (true);

drop policy if exists "members can create their own proposal comments" on public.proposal_comments;
create policy "members can create their own proposal comments"
on public.proposal_comments
for insert
with check (auth.uid() = author_id);

drop policy if exists "comment authors can update their proposal comments" on public.proposal_comments;
create policy "comment authors can update their proposal comments"
on public.proposal_comments
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "comment authors can delete their proposal comments" on public.proposal_comments;
create policy "comment authors can delete their proposal comments"
on public.proposal_comments
for delete
using (auth.uid() = author_id);

drop policy if exists "users can read their own or shared module progress" on public.user_module_progress;
create policy "users can read their own or shared module progress"
on public.user_module_progress
for select
using (
  auth.uid() = user_id
  or (
    auth.uid() is not null
    and visited = true
    and exists (
      select 1
      from public.profiles
      where public.profiles.id = public.user_module_progress.user_id
        and public.profiles.show_learning_activity = true
        and public.profiles.discoverable_by_shared_modules = true
    )
  )
);

drop policy if exists "users can insert their own module progress" on public.user_module_progress;
create policy "users can insert their own module progress"
on public.user_module_progress
for insert
with check (auth.uid() = user_id);

drop policy if exists "users can update their own module progress" on public.user_module_progress;
create policy "users can update their own module progress"
on public.user_module_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users can delete their own module progress" on public.user_module_progress;
create policy "users can delete their own module progress"
on public.user_module_progress
for delete
using (auth.uid() = user_id);

drop policy if exists "thread members can view participants" on public.thread_participants;
drop policy if exists "thread authors and invitees can view participants" on public.thread_participants;
create policy "thread members can view participants"
on public.thread_participants
for select
using (
  auth.uid() = user_id
  or public.is_accepted_thread_participant(public.thread_participants.thread_id, auth.uid())
);

drop policy if exists "authorized circle members can invite participants" on public.thread_participants;
drop policy if exists "thread authors can invite participants" on public.thread_participants;
create policy "authorized circle members can invite participants"
on public.thread_participants
for insert
with check (
  exists (
    select 1
    from public.threads
    left join public.profiles as owners
      on owners.id = public.threads.author_id
    where public.threads.id = public.thread_participants.thread_id
      and (
        public.threads.author_id = auth.uid()
        or (
          public.threads.kind = 'private_circle'
          and owners.allow_participant_invites = true
          and public.is_accepted_thread_participant(public.thread_participants.thread_id, auth.uid())
        )
      )
  )
);

drop policy if exists "thread authors and invitees can update participants" on public.thread_participants;
create policy "thread authors and invitees can update participants"
on public.thread_participants
for update
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.threads
    where public.threads.id = public.thread_participants.thread_id
      and public.threads.author_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  or exists (
    select 1
    from public.threads
    where public.threads.id = public.thread_participants.thread_id
      and public.threads.author_id = auth.uid()
  )
);

drop policy if exists "thread authors can remove participants" on public.thread_participants;
create policy "thread authors can remove participants"
on public.thread_participants
for delete
using (
  exists (
    select 1
    from public.threads
    where public.threads.id = public.thread_participants.thread_id
      and public.threads.author_id = auth.uid()
  )
);

insert into public.topics (slug, title, summary, body_markdown, is_published)
values
  (
    'economy',
    'Economic System',
    'Explore how GDP-first incentives shape wellbeing, housing stability, and precarity.',
    'What if policy optimized for life outcomes rather than output?',
    true
  ),
  (
    'politics',
    'Democracy & Governance',
    'Test how deliberation, assemblies, and transparent trade-offs can improve civic decisions.',
    'How can citizens contribute continuously without chaos?',
    true
  ),
  (
    'cities',
    'Cities & Everyday Life',
    'Examine how urban design choices affect stress, isolation, and daily quality of life.',
    'What changes when human wellbeing becomes the main design constraint?',
    true
  )
on conflict (slug) do update
set
  title = excluded.title,
  summary = excluded.summary,
  body_markdown = excluded.body_markdown,
  is_published = excluded.is_published,
  updated_at = timezone('utc', now());
