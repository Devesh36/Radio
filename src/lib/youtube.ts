import type { Track } from "@/lib/types";

export const VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;

export function isYouTubeId(value: string): boolean {
  return VIDEO_ID.test(value);
}

export function extractYouTubeId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  if (VIDEO_ID.test(input)) return input;

  const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "").replace(/^music\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0]?.split("?")[0];
      return id && VIDEO_ID.test(id) ? id : null;
    }
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && VIDEO_ID.test(v)) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      for (let i = 0; i < parts.length; i += 1) {
        if (["embed", "shorts", "live", "v"].includes(parts[i]) && parts[i + 1] && VIDEO_ID.test(parts[i + 1])) {
          return parts[i + 1];
        }
      }
    }
  } catch {
    // fall through to regex
  }

  const match = input.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? null;
}

function cleanArtist(author: string) {
  return author
    .replace(/\s+[-–]\s*topic$/i, "")
    .replace(/\s+VEVO$/i, "")
    .replace(/\s+-\s*YouTube$/i, "")
    .trim();
}

export async function resolveYouTubeTrack(input: string): Promise<Track | null> {
  const youtubeId = extractYouTubeId(input);
  if (!youtubeId) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
      { headers: { "User-Agent": "Mozilla/5.0 Baithak" } },
    );
    if (res.ok) {
      const data = (await res.json()) as { title?: string; author_name?: string };
      return {
        youtubeId,
        title: data.title?.trim() || "YouTube track",
        artist: cleanArtist(data.author_name || "YouTube"),
        duration_sec: 240,
        cover: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        added: true,
      };
    }
  } catch {
    // still allow adding by id
  }

  return {
    youtubeId,
    title: "YouTube track",
    artist: "YouTube",
    duration_sec: 240,
    cover: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    added: true,
  };
}
