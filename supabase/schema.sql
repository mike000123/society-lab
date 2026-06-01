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

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  reputation_score integer not null default 0 check (reputation_score >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

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

create index if not exists threads_author_id_idx on public.threads (author_id);
create index if not exists threads_topic_id_idx on public.threads (topic_id);
create index if not exists posts_thread_id_idx on public.posts (thread_id);
create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists simulations_owner_id_idx on public.simulations (owner_id);
create index if not exists proposals_author_id_idx on public.proposals (author_id);

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.topics enable row level security;
alter table public.threads enable row level security;
alter table public.posts enable row level security;
alter table public.post_votes enable row level security;
alter table public.simulations enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_votes enable row level security;

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
using (visibility = 'public' or auth.uid() = author_id);

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
      and (public.threads.visibility = 'public' or public.threads.author_id = auth.uid())
  )
);

drop policy if exists "members can create their own posts" on public.posts;
create policy "members can create their own posts"
on public.posts
for insert
with check (auth.uid() = author_id);

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

