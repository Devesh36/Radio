import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { languages, type LanguageKey } from "@/data/brand";
import { fsAppendTrack, fsRemoveTrack, isMissingTableError } from "@/lib/custom-rooms-store";
import { MAX_CUSTOM_TRACKS } from "@/lib/limits";
import { userOwnsCustomRoom } from "@/lib/room-auth";
import { appendRoomExtra, removeRoomTrack } from "@/lib/room-extras";
import { createAdminSupabase, persistenceUnavailable } from "@/lib/supabase/server";
import { resolveRoom } from "@/lib/rooms-server";
import {
  clip,
  genericError,
  isSlug,
  isYouTubeId,
  parseTrackInput,
  readJson,
} from "@/lib/validate";

function parseLanguage(value: unknown): LanguageKey {
  const requested = typeof value === "string" ? value : "hindi";
  return (requested in languages ? requested : "hindi") as LanguageKey;
}

function failDb() {
  return NextResponse.json(genericError(), { status: 500 });
}

async function requireHost(slug: string) {
  if (!isSlug(slug)) {
    return { error: NextResponse.json({ error: "Room not found" }, { status: 404 }) };
  }
  const { userId } = await auth();
  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!(await userOwnsCustomRoom(slug, userId))) {
    return { error: NextResponse.json({ error: "Only the host can change this catalog" }, { status: 403 }) };
  }
  if (persistenceUnavailable()) {
    return { error: NextResponse.json(genericError(), { status: 503 }) };
  }
  return { userId };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const host = await requireHost(slug);
  if ("error" in host && host.error) return host.error;

  const body = (await readJson(request)) as Record<string, unknown> | null;
  const parsed = parseTrackInput(body?.track);
  const language = parseLanguage(body?.language);

  if (!parsed) {
    return NextResponse.json({ error: "Missing track" }, { status: 400 });
  }

  const resolved = await resolveRoom(slug);
  if (!resolved) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  if (resolved.type !== "custom") {
    return NextResponse.json({ error: "Public rooms have a fixed catalog" }, { status: 403 });
  }

  const catalog = resolved.room.catalogs[language] ?? resolved.room.catalogs.hindi;
  const alreadyInCatalog = catalog.some((item) => item.youtubeId === parsed.youtube_id);
  if (!alreadyInCatalog && catalog.length >= MAX_CUSTOM_TRACKS) {
    return NextResponse.json(
      { error: `This room can hold ${MAX_CUSTOM_TRACKS} songs. Baithak Pro (more rooms and songs) is coming soon.` },
      { status: 400 },
    );
  }

  const track = {
    youtubeId: parsed.youtube_id,
    title: parsed.title,
    artist: parsed.artist,
    duration_sec: parsed.duration_sec,
    added: true as const,
  };
  const saved = appendRoomExtra(slug, language, track);

  const supabase = createAdminSupabase();
  if (supabase) {
    const { data: room, error } = await supabase
      .from("custom_rooms")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && room) {
      const { data: existing } = await supabase
        .from("custom_tracks")
        .select("id")
        .eq("room_id", room.id)
        .eq("youtube_id", track.youtubeId)
        .maybeSingle();
      if (!existing) {
        const { count } = await supabase
          .from("custom_tracks")
          .select("*", { count: "exact", head: true })
          .eq("room_id", room.id);
        if ((count ?? 0) >= MAX_CUSTOM_TRACKS) {
          return NextResponse.json(
            { error: `This room can hold ${MAX_CUSTOM_TRACKS} songs. Baithak Pro (more rooms and songs) is coming soon.` },
            { status: 400 },
          );
        }
        const { error: insertError } = await supabase.from("custom_tracks").insert({
          room_id: room.id,
          youtube_id: track.youtubeId,
          title: track.title,
          artist: track.artist,
          duration_sec: track.duration_sec,
          position: count ?? 0,
        });
        if (insertError) return failDb();
      }
    } else if (error && !isMissingTableError(error)) {
      return failDb();
    } else if (process.env.NODE_ENV === "production" && (error || !room)) {
      return failDb();
    }
  }

  if (process.env.NODE_ENV !== "production") {
    fsAppendTrack(slug, {
      youtube_id: track.youtubeId,
      title: track.title,
      artist: track.artist,
      duration_sec: track.duration_sec,
    });
  }

  return NextResponse.json({ ok: true, extras: saved });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const host = await requireHost(slug);
  if ("error" in host && host.error) return host.error;

  const body = (await readJson(request)) as Record<string, unknown> | null;
  const youtubeId = clip(body?.youtubeId, 11);
  const language = parseLanguage(body?.language);

  if (!isYouTubeId(youtubeId)) {
    return NextResponse.json({ error: "Missing track" }, { status: 400 });
  }

  const resolved = await resolveRoom(slug);
  if (!resolved) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }
  if (resolved.type !== "custom") {
    return NextResponse.json({ error: "Public rooms have a fixed catalog" }, { status: 403 });
  }

  const catalog = resolved.room.catalogs[language] ?? resolved.room.catalogs.hindi;
  if (catalog.filter((track) => track.youtubeId !== youtubeId).length === 0) {
    return NextResponse.json({ error: "Keep at least one song in this catalog" }, { status: 400 });
  }

  removeRoomTrack(slug, language, youtubeId);

  const supabase = createAdminSupabase();
  if (supabase) {
    const { data: room, error } = await supabase
      .from("custom_rooms")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && room) {
      await supabase
        .from("custom_tracks")
        .delete()
        .eq("room_id", room.id)
        .eq("youtube_id", youtubeId);
    } else if (error && !isMissingTableError(error)) {
      return failDb();
    } else if (process.env.NODE_ENV === "production") {
      return failDb();
    }
  }

  if (process.env.NODE_ENV !== "production") {
    fsRemoveTrack(slug, youtubeId);
  }

  return NextResponse.json({ ok: true });
}
