-- Lock down writes: the anon key must not insert/update/delete rooms, tracks, or battles.
-- Service role used by the Next.js API bypasses RLS, so these policies are not needed.

drop policy if exists "Service role manages all" on custom_rooms;
drop policy if exists "Service role manages tracks" on custom_tracks;
drop policy if exists "Service role manages epochs" on radio_epochs;
drop policy if exists "Service role manages battles" on battle_states;
drop policy if exists "Anyone can insert pitches" on pitches;

delete from custom_tracks a
  using custom_tracks b
  where a.ctid < b.ctid
    and a.room_id = b.room_id
    and a.youtube_id = b.youtube_id;

delete from custom_rooms
where id in (
  select id from (
    select id, row_number() over (partition by clerk_user_id order by created_at desc) as rn
    from custom_rooms
  ) ranked
  where ranked.rn > 1
);

drop index if exists custom_rooms_clerk_user_id_idx;
create unique index if not exists custom_rooms_clerk_user_id_idx on custom_rooms (clerk_user_id);

create unique index if not exists custom_tracks_room_youtube_idx on custom_tracks (room_id, youtube_id);

