import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { resolveYouTubeTrack } from "@/lib/youtube";
import { clientIp, genericError, rateLimit, readJson } from "@/lib/validate";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(`resolve:${userId}:${clientIp(request)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = (await readJson(request)) as Record<string, unknown> | null;
  const url = typeof body?.url === "string" ? body.url.trim().slice(0, 500) : "";
  if (!url) {
    return NextResponse.json({ error: "Paste a YouTube link" }, { status: 400 });
  }

  try {
    const track = await resolveYouTubeTrack(url);
    if (!track) {
      return NextResponse.json(
        { error: "That link didn’t work. Paste a YouTube video URL or id." },
        { status: 400 },
      );
    }
    return NextResponse.json({ track });
  } catch {
    return NextResponse.json(genericError(), { status: 500 });
  }
}
