-- Baithak schema for custom rooms, battles, pitches, and radio epochs

create extension if not exists "pgcrypto";

create table if not exists custom_rooms (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  slug text unique not null,
  title text not null,
  tagline text,
  background_url text,
  theme text not null default 'default',
  chat_enabled boolean not null default true,
  battle_enabled boolean not null default true,
  radio_epoch bigint not null default (extract(epoch from now()) * 1000)::bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists custom_rooms_clerk_user_id_idx on custom_rooms (clerk_user_id);

create table if not exists custom_tracks (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references custom_rooms(id) on delete cascade,
  youtube_id text not null,
  title text not null,
  artist text,
  duration_sec integer not null default 240 check (duration_sec > 0 and duration_sec <= 540),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists custom_tracks_room_youtube_idx on custom_tracks (room_id, youtube_id);
create index if not exists custom_tracks_room_id_idx on custom_tracks (room_id, position);

create table if not exists radio_epochs (
  room_slug text not null,
  language text not null,
  epoch_ms bigint not null,
  updated_at timestamptz not null default now(),
  primary key (room_slug, language)
);

create table if not exists battle_states (
  room_slug text primary key,
  round_number integer not null default 1,
  candidate_a jsonb,
  candidate_b jsonb,
  votes_a integer not null default 0,
  votes_b integer not null default 0,
  ends_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists pitches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  clerk_user_id text,
  created_at timestamptz not null default now()
);

alter publication supabase_realtime add table battle_states;
alter publication supabase_realtime add table radio_epochs;

alter table custom_rooms enable row level security;
alter table custom_tracks enable row level security;
alter table radio_epochs enable row level security;
alter table battle_states enable row level security;
alter table pitches enable row level security;

create policy "Public read custom rooms"
  on custom_rooms for select using (true);

create policy "Public read custom tracks"
  on custom_tracks for select using (true);

create policy "Public read radio epochs"
  on radio_epochs for select using (true);

create policy "Public read battle states"
  on battle_states for select using (true);
