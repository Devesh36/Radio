# Baithak

Maahol-style Indian nostalgia audio rooms — built with **Next.js**, deployed on **Vercel**.

## Features

- 6 curated nostalgia rooms with Hindi / Tamil / Telugu playlists
- Hidden YouTube music + ambience players with custom UI
- Deterministic radio sync (everyone hears the same song at the same second)
- Live presence and ephemeral chat (Supabase Realtime)
- Song battles (nominate + vote)
- Studio: create up to 2 personal rooms (Clerk auth)
- Share cards, pitch form, legal pages

## Stack

- Next.js 16 App Router + TypeScript + Tailwind CSS v4
- Clerk (authentication)
- Supabase (Postgres + Realtime)
- react-youtube (YouTube IFrame API)
- Vercel (hosting)

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill in Clerk + Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

Run the migration in [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql) in the Supabase SQL editor.

Enable **Realtime** for `battle_states` and `radio_epochs` tables.

## Deploy to Vercel

1. Push to GitHub and import in Vercel
2. Add all env vars from `.env.example`
3. Deploy

## Room URLs

- Official: `/r/chai-tapri`, `/r/truck-dhaba`, etc.
- Custom: `/r/your-slug` (created in Studio)

## Notes

- Music plays via YouTube embeds — we do not host audio files
- Rename the product in [`src/data/brand.ts`](src/data/brand.ts) and [`src/data/rooms.ts`](src/data/rooms.ts)
# baithak-
