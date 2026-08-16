import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { MAX_CUSTOM_TRACKS } from "@/lib/limits";
import { resolveMediaImport } from "@/lib/youtube";
import { clientIp, genericError, rateLimit, readJson } from "@/lib/validate";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(`resolve:${userId}:${clientIp(request)}`, 12, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = (await readJson(request)) as Record<string, unknown> | null;
  const url = typeof body?.url === "string" ? body.url.trim().slice(0, 2000) : "";
  if (!url) {
    return NextResponse.json({ error: "Paste a YouTube, playlist, or Spotify link" }, { status: 400 });
  }

  const limit =
    typeof body?.limit === "number" && Number.isFinite(body.limit)
      ? Math.min(MAX_CUSTOM_TRACKS, Math.max(1, Math.floor(body.limit)))
      : MAX_CUSTOM_TRACKS;

  try {
    const tracks = await resolveMediaImport(url, limit);
    if (tracks.length === 0) {
      return NextResponse.json(
        {
          error:
            "Couldn’t read that link. Paste a YouTube video, a YouTube playlist, a Spotify track/playlist, or a song name.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ track: tracks[0], tracks });
  } catch {
    return NextResponse.json(genericError(), { status: 500 });
  }
}
