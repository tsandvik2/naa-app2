-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ══ PROFILES ══
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text not null,
  avatar_url text,
  age_group text not null default '16-19',
  friend_code text unique not null,
  pts integer not null default 0,
  streak integer not null default 0,
  best_streak integer not null default 0,
  done_count integer not null default 0,
  daily_done boolean not null default false,
  daily_date date,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ══ CHALLENGES ══
create table if not exists public.challenges (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null default 'kreativ',
  difficulty text not null check (difficulty in ('easy', 'medium', 'wild', 'safe')),
  requires_camera boolean not null default false,
  punishment text,
  is_group boolean not null default false,
  min_players integer not null default 1,
  created_at timestamptz not null default now()
);

-- ══ COMPLETIONS ══
create table if not exists public.completions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  challenge_id uuid references public.challenges(id) on delete set null,
  challenge_text text not null,
  photo_url text,
  pts_earned integer not null default 10,
  completed_at timestamptz not null default now()
);

-- ══ FRIENDSHIPS ══
create table if not exists public.friendships (
  id uuid default uuid_generate_v4() primary key,
  from_user_id uuid references public.profiles(id) on delete cascade not null,
  to_user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamptz not null default now(),
  unique(from_user_id, to_user_id)
);

-- ══ ROW LEVEL SECURITY ══

-- Profiles: public read, own write
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Challenges: public read, admin write
alter table public.challenges enable row level security;

create policy "Challenges are viewable by everyone"
  on public.challenges for select using (true);

-- Completions: own read/write
alter table public.completions enable row level security;

create policy "Users can view their own completions"
  on public.completions for select using (auth.uid() = user_id);

create policy "Users can view completions in leaderboard context"
  on public.completions for select using (true);

create policy "Users can insert their own completions"
  on public.completions for insert with check (auth.uid() = user_id);

-- Friendships: own read/write
alter table public.friendships enable row level security;

create policy "Users can view their own friendships"
  on public.friendships for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Users can create friendships from themselves"
  on public.friendships for insert with check (auth.uid() = from_user_id);

create policy "Users can update friendships where they are the recipient"
  on public.friendships for update
  using (auth.uid() = to_user_id or auth.uid() = from_user_id);

-- ══ STORAGE BUCKET ══
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', true)
on conflict do nothing;

create policy "Anyone can view proof photos"
  on storage.objects for select
  using (bucket_id = 'proofs');

create policy "Authenticated users can upload proof photos"
  on storage.objects for insert
  with check (bucket_id = 'proofs' and auth.role() = 'authenticated');

-- ══ INDEXES ══
create index if not exists idx_profiles_friend_code on public.profiles(friend_code);
create index if not exists idx_completions_user_id on public.completions(user_id);
create index if not exists idx_completions_completed_at on public.completions(completed_at desc);
create index if not exists idx_friendships_from_user on public.friendships(from_user_id);
create index if not exists idx_friendships_to_user on public.friendships(to_user_id);
create index if not exists idx_profiles_pts on public.profiles(pts desc);
