import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureBattleState, getNowPlaying, resolveRoom } from "@/lib/rooms-server";
import { languages, type LanguageKey } from "@/data/brand";
import { userOwnsCustomRoom } from "@/lib/room-auth";
import { isSlug } from "@/lib/validate";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!isSlug(slug)) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const requested = searchParams.get("lang") || "hindi";

  const resolved = await resolveRoom(slug);
  if (!resolved) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const lang = (
    resolved.type === "official" || !(requested in languages) ? "hindi" : requested
  ) as LanguageKey;

  const playlist =
    resolved.room.catalogs[lang] ?? resolved.room.catalogs.hindi;

  if (resolved.room.battleEnabled) {
    await ensureBattleState(slug, playlist);
  }

  const now = await getNowPlaying(slug, lang);
  if (!now) {
    return NextResponse.json({ error: "No tracks" }, { status: 404 });
  }

  const { userId } = await auth();
  const isHost = resolved.type === "custom" && (await userOwnsCustomRoom(slug, userId));

  return NextResponse.json({
    track: now.track,
    startedAt: now.startedAt,
    offsetSec: now.offsetSec,
    playlist: now.playlist,
    room: resolved.room.name,
    isHost,
  });
}
