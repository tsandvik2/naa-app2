# NÅ – Hva gjør vi nå?

> Slutt å scrolle. Begynn å leve.

A mobile-first Next.js web app for challenge-based social interaction. Users get random challenges matched to their mood and situation, capture proof with the camera, earn points, and compete on the leaderboard.

## Stack

- **Framework**: Next.js 14+ (App Router)
- **Backend**: Supabase (auth, database, storage)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript (strict, no `any`)
- **State**: Zustand with local persistence
- **Fonts**: Bebas Neue + Plus Jakarta Sans

## Features

- 🎯 Challenge wizard (mood → time → players → personalized challenge)
- 📸 Camera capture with TikTok-style NÅ filter overlay
- 🔥 Streak tracking and points system
- 🏆 Leaderboard from Supabase
- 👯 Friends system with shareable friend codes
- 📱 PWA-ready, mobile-first design (max-width 430px)
- 🌙 Dark mode by default
- 📲 Deep-link sharing to Snapchat, Instagram, TikTok, SMS
- 🎯 Daily challenge with reset logic

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd naa-app2
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql` via the SQL editor in your Supabase dashboard
3. Enable **Email** authentication under Authentication → Providers
4. The storage bucket `proofs` is created automatically by the migration

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in your Supabase project under Settings → API.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    (auth)/
      login/          ← Login page
      signup/         ← Signup page
    (app)/
      home/           ← Challenge wizard + full challenge flow
      today/          ← Daily challenge + weekly stats
      leaderboard/    ← Points leaderboard
      friends/        ← Friends management (add by code, pending requests)
      profile/        ← User profile, streak, history, badges, logout
  components/
    challenge/        ← Onboarding, WizardChip, ChallengeCard, CameraCapture, ShareSheet
    layout/           ← AppHeader, BottomNav
    shared/           ← LoadingDots, MeshBackground
    ui/               ← shadcn primitives (button, input, card, sonner)
  lib/
    supabase/         ← client.ts, server.ts, middleware.ts
    challenges/       ← Challenge data, picker logic, avatar list
    types/            ← database.ts (typed Supabase schema)
  store/
    app-store.ts      ← Zustand store (profile, wizard, challenge state)
supabase/
  migrations/
    001_initial_schema.sql   ← Full schema + RLS policies + storage bucket
```

## Database Schema

```sql
profiles     -- id (auth.users FK), username, avatar_url, age_group,
             -- friend_code (unique), pts, streak, best_streak, done_count,
             -- daily_done, daily_date, last_seen, created_at

challenges   -- id, title, description, category, difficulty,
             -- requires_camera, punishment, is_group, min_players, created_at

completions  -- id, user_id (FK), challenge_id (FK nullable), challenge_text,
             -- photo_url, pts_earned, completed_at

friendships  -- id, from_user_id (FK), to_user_id (FK),
             -- status (pending|accepted), created_at
```

### Row Level Security

- **profiles**: Public read, own write only
- **challenges**: Public read
- **completions**: Own read/write (users can only insert their own)
- **friendships**: Users can only read/create their own; accept only when recipient
- **storage (proofs)**: Public read, authenticated write

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key |

## Deployment

```bash
npx vercel --prod
```

Add environment variables in the Vercel dashboard under Settings → Environment Variables.
