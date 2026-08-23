import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOfficialRoom } from "@/data/rooms";
import {
  fsInsertRoom,
  fsListRooms,
  fsReplaceRoom,
  isMissingTableError,
} from "@/lib/custom-rooms-store";
import { MAX_CUSTOM_TRACKS, MIN_CUSTOM_TRACKS } from "@/lib/limits";
import { createAdminSupabase, persistenceUnavailable } from "@/lib/supabase/server";
import {
  asBoolean,
  clip,
  genericError,
  isSlug,
  parseTrackInput,
  readJson,
  sanitizeBackgroundUrl,
} from "@/lib/validate";
import { resolveMediaImport } from "@/lib/youtube";

export const maxDuration = 60;

function failDb() {
  return NextResponse.json(genericError(), { status: 500 });
}

async function resolveTracks(body: Record<string, unknown>) {
  const seen = new Set<string>();
  const resolved: Array<{
    youtube_id: string;
    title: string;
    artist: string;
    duration_sec: number;
  }> = [];

  const links = Array.isArray(body.links) ? body.links : [];
  for (const item of links) {
    if (typeof item !== "string" || resolved.length >= MAX_CUSTOM_TRACKS) continue;
    const tracks = await resolveMediaImport(item, MAX_CUSTOM_TRACKS - resolved.length);
    for (const track of tracks) {
      if (seen.has(track.youtubeId) || resolved.length >= MAX_CUSTOM_TRACKS) continue;
      seen.add(track.youtubeId);
      resolved.push({
        youtube_id: track.youtubeId,
        title: track.title,
        artist: track.artist,
        duration_sec: track.duration_sec,
      });
    }
  }

  if (resolved.length > 0) return resolved;

  const incoming = Array.isArray(body.tracks) ? body.tracks : [];
  for (const item of incoming) {
    if (resolved.length >= MAX_CUSTOM_TRACKS) break;
    const parsed = parseTrackInput(item);
    if (!parsed || seen.has(parsed.youtube_id)) continue;
    seen.add(parsed.youtube_id);
    resolved.push(parsed);
  }

  return resolved;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (persistenceUnavailable()) {
    return NextResponse.json(genericError(), { status: 503 });
  }

  const supabase = createAdminSupabase();
  if (supabase) {
    const { data: rooms, error } = await supabase
      .from("custom_rooms")
      .select("id, slug, title, tagline, background_url, created_at, custom_tracks(id, youtube_id)")
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) {
      return NextResponse.json({ rooms: rooms ?? [] });
    }
    if (!isMissingTableError(error)) {
      return failDb();
    }
    if (process.env.NODE_ENV === "production") {
      return failDb();
    }
  }

  return NextResponse.json({ rooms: fsListRooms(userId) });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (persistenceUnavailable()) {
    return NextResponse.json(genericError(), { status: 503 });
  }

  const body = (await readJson(request)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const slug = clip(body.slug, 40).toLowerCase();
  const title = clip(body.title, 80);
  const tagline = clip(body.tagline, 120) || "Listen";
  const background_url = sanitizeBackgroundUrl(body.background_url);
  if (!background_url) {
    return NextResponse.json({ error: "Pick one of the room backdrops" }, { status: 400 });
  }
  const chat_enabled = asBoolean(body.chat_enabled, true);
  const battle_enabled = asBoolean(body.battle_enabled, false);

  if (!slug || !title) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  if (getOfficialRoom(slug)) {
    return NextResponse.json({ error: "That URL is already a Radio room" }, { status: 409 });
  }

  const tracks = await resolveTracks(body);
  if (tracks.length < MIN_CUSTOM_TRACKS || tracks.length > MAX_CUSTOM_TRACKS) {
    return NextResponse.json(
      { error: `Add ${MIN_CUSTOM_TRACKS}–${MAX_CUSTOM_TRACKS} YouTube links` },
      { status: 400 },
    );
  }

  const payload = {
    clerk_user_id: userId,
    slug,
    title,
    tagline,
    background_url,
    theme: "default",
    chat_enabled,
    battle_enabled,
    tracks,
  };

  const supabase = createAdminSupabase();
  if (supabase) {
    const { data: mine, error: mineError } = await supabase
      .from("custom_rooms")
      .select("id, slug")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (mineError && !isMissingTableError(mineError)) {
      return failDb();
    }

    if (!mineError) {
      const { data: slugOwner } = await supabase
        .from("custom_rooms")
        .select("id, clerk_user_id")
        .eq("slug", slug)
        .maybeSingle();

      if (slugOwner && slugOwner.clerk_user_id !== userId) {
        return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
      }

      const trackRows = (roomId: string) =>
        tracks.map((track, i) => ({
          room_id: roomId,
          youtube_id: track.youtube_id,
          title: track.title,
          artist: track.artist,
          duration_sec: track.duration_sec,
          position: i,
        }));

      if (mine) {
        const { error: updateError } = await supabase
          .from("custom_rooms")
          .update({
            slug,
            title,
            tagline,
            background_url,
            chat_enabled,
            battle_enabled,
            updated_at: new Date().toISOString(),
          })
          .eq("id", mine.id);
        if (updateError) return failDb();
        const { error: deleteError } = await supabase.from("custom_tracks").delete().eq("room_id", mine.id);
        if (deleteError) return failDb();
        const { error: trackError } = await supabase.from("custom_tracks").insert(trackRows(mine.id));
        if (trackError) return failDb();
        return NextResponse.json({ room: { id: mine.id, slug, title } });
      }

      const { data: room, error } = await supabase
        .from("custom_rooms")
        .insert({
          clerk_user_id: userId,
          slug,
          title,
          tagline,
          background_url,
          theme: "default",
          chat_enabled,
          battle_enabled,
          radio_epoch: Date.now(),
        })
        .select("id, slug, title")
        .single();

      if (!error && room) {
        const { error: trackError } = await supabase.from("custom_tracks").insert(trackRows(room.id));
        if (trackError) {
          await supabase.from("custom_rooms").delete().eq("id", room.id);
          return failDb();
        }
        return NextResponse.json({ room });
      }

      if (error && !isMissingTableError(error)) {
        return failDb();
      }
    }

    if (process.env.NODE_ENV === "production") {
      return failDb();
    }
  }

  const mine = fsListRooms(userId)[0];
  if (mine) {
    const replaced = fsReplaceRoom(userId, payload);
    if (replaced === "taken") {
      return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
    }
    if (replaced) {
      return NextResponse.json({ room: { id: replaced.id, slug: replaced.slug, title: replaced.title } });
    }
  }

  const taken = fsListRooms().some((room) => room.slug === slug && room.clerk_user_id !== userId);
  if (taken) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
  }

  const room = fsInsertRoom(payload);
  return NextResponse.json({ room: { id: room.id, slug: room.slug, title: room.title } });
}
