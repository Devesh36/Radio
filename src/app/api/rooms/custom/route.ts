import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getOfficialRoom } from "@/data/rooms";
import {
  fsInsertRoom,
  fsListRooms,
  fsSlugTaken,
  isMissingTableError,
} from "@/lib/custom-rooms-store";
import { MAX_CUSTOM_ROOMS, MAX_CUSTOM_TRACKS, MIN_CUSTOM_TRACKS } from "@/lib/limits";
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

function failDb() {
  return NextResponse.json(genericError(), { status: 500 });
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
  const chat_enabled = asBoolean(body.chat_enabled, true);
  const battle_enabled = asBoolean(body.battle_enabled, true);

  if (!slug || !title || !Array.isArray(body.tracks)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!isSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  if (getOfficialRoom(slug)) {
    return NextResponse.json({ error: "That URL is already a Baithak room" }, { status: 409 });
  }

  const tracks = body.tracks.map(parseTrackInput).filter((track): track is NonNullable<typeof track> => Boolean(track));
  if (tracks.length < MIN_CUSTOM_TRACKS || tracks.length > MAX_CUSTOM_TRACKS) {
    return NextResponse.json(
      { error: `Need ${MIN_CUSTOM_TRACKS}–${MAX_CUSTOM_TRACKS} valid tracks` },
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
    const { count, error: countError } = await supabase
      .from("custom_rooms")
      .select("*", { count: "exact", head: true })
      .eq("clerk_user_id", userId);

    if (!countError) {
      if ((count ?? 0) >= MAX_CUSTOM_ROOMS) {
        return NextResponse.json(
          { error: "You can only have one personal room. More rooms land with Baithak Pro — coming soon." },
          { status: 400 },
        );
      }

      const { data: existingSlug } = await supabase
        .from("custom_rooms")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existingSlug) {
        return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
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
        const trackRows = tracks.map((track, i) => ({
          room_id: room.id,
          youtube_id: track.youtube_id,
          title: track.title,
          artist: track.artist,
          duration_sec: track.duration_sec,
          position: i,
        }));
        const { error: trackError } = await supabase.from("custom_tracks").insert(trackRows);
        if (trackError) {
          await supabase.from("custom_rooms").delete().eq("id", room.id);
          return failDb();
        }
        return NextResponse.json({ room });
      }

      if (error && !isMissingTableError(error)) {
        return failDb();
      }
    } else if (!isMissingTableError(countError)) {
      return failDb();
    }

    if (process.env.NODE_ENV === "production") {
      return failDb();
    }
  }

  if (fsListRooms(userId).length >= MAX_CUSTOM_ROOMS) {
    return NextResponse.json(
      { error: "You can only have one personal room. More rooms land with Baithak Pro — coming soon." },
      { status: 400 },
    );
  }
  if (fsSlugTaken(slug)) {
    return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
  }

  const room = fsInsertRoom(payload);
  return NextResponse.json({ room: { id: room.id, slug: room.slug, title: room.title } });
}
