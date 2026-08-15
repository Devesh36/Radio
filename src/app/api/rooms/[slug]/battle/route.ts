import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/server";
import { resolveRoom } from "@/lib/rooms-server";
import {
  clientIp,
  clip,
  genericError,
  isSlug,
  isYouTubeId,
  rateLimit,
  readJson,
} from "@/lib/validate";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isSlug(slug)) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const supabase = createAdminSupabase();

  if (!supabase) {
    return NextResponse.json({
      room_slug: slug,
      round_number: 1,
      candidate_a: null,
      candidate_b: null,
      votes_a: 0,
      votes_b: 0,
      ends_at: null,
    });
  }

  const { data } = await supabase
    .from("battle_states")
    .select("room_slug, round_number, candidate_a, candidate_b, votes_a, votes_b, ends_at")
    .eq("room_slug", slug)
    .maybeSingle();

  return NextResponse.json(data ?? { room_slug: slug, candidate_a: null, candidate_b: null });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isSlug(slug)) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (!rateLimit(`battle:${clientIp(request)}:${slug}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const resolved = await resolveRoom(slug);
  if (!resolved || !resolved.room.battleEnabled) {
    return NextResponse.json({ error: "Battles are off in this room" }, { status: 403 });
  }

  const body = (await readJson(request)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const supabase = createAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: true, offline: true });
  }

  const playlist = [
    ...resolved.room.catalogs.hindi,
    ...resolved.room.catalogs.tamil,
    ...resolved.room.catalogs.telugu,
  ];

  const { data: current } = await supabase
    .from("battle_states")
    .select("*")
    .eq("room_slug", slug)
    .maybeSingle();

  if (body.action === "vote" && current) {
    if (body.side !== "a" && body.side !== "b") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    const field = body.side === "a" ? "votes_a" : "votes_b";
    const next = (current[field] ?? 0) + 1;
    const { error } = await supabase
      .from("battle_states")
      .update({ [field]: next, updated_at: new Date().toISOString() })
      .eq("room_slug", slug);
    if (error) return NextResponse.json(genericError(), { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "nominate") {
    const rawId =
      body.candidate && typeof body.candidate === "object"
        ? clip((body.candidate as { youtubeId?: unknown }).youtubeId, 11)
        : "";
    if (!isYouTubeId(rawId)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    const track = playlist.find((item) => item.youtubeId === rawId);
    if (!track) {
      return NextResponse.json({ error: "Track is not in this room" }, { status: 400 });
    }
    const candidate = {
      youtubeId: track.youtubeId,
      title: track.title,
      artist: track.artist,
      votes: 0,
    };

    if (current?.candidate_a && current?.candidate_b) {
      return NextResponse.json({ error: "Both slots are filled" }, { status: 400 });
    }

    if (!current) {
      const { error } = await supabase.from("battle_states").insert({
        room_slug: slug,
        round_number: 1,
        candidate_a: candidate,
        candidate_b: null,
        votes_a: 0,
        votes_b: 0,
      });
      if (error) return NextResponse.json(genericError(), { status: 500 });
    } else {
      const emptySlot = !current.candidate_a ? "candidate_a" : "candidate_b";
      const { error } = await supabase
        .from("battle_states")
        .update({
          [emptySlot]: candidate,
          updated_at: new Date().toISOString(),
        })
        .eq("room_slug", slug);
      if (error) return NextResponse.json(genericError(), { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
