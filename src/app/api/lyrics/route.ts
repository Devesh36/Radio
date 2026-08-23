import { NextResponse } from "next/server";
import { brand } from "@/data/brand";

const SEARCH_URL = "https://lrclib.net/api/search";

interface LrclibResult {
  trackName?: string;
  artistName?: string;
  syncedLyrics?: string | null;
  plainLyrics?: string | null;
}

/** Strips YouTube-title noise so the lyrics search matches the actual song. */
function cleanTitle(raw: string): string {
  return raw
    .replace(/\(.*?\)|\[.*?\]|\{.*?\}/g, " ")
    .replace(/\|.*$/, " ")
    .replace(
      /\b(official|music|video|lyrical|lyrics?|full|song|audio|hd|4k|8k|remaster(?:ed)?|visualizer|visualiser|mv|extended|slowed|reverb)\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

async function search(query: string): Promise<LrclibResult[]> {
  try {
    const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(query)}`, {
      headers: { "User-Agent": `${brand.name} (music rooms; lyrics view)` },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function pickBest(results: LrclibResult[], artist: string): LrclibResult | null {
  const needle = artist.trim().toLowerCase();
  let best: LrclibResult | null = null;
  let bestScore = 0;
  for (const item of results) {
    let score = 0;
    if (item.syncedLyrics) score += 2;
    if (item.plainLyrics) score += 1;
    if (needle && (item.artistName ?? "").toLowerCase().includes(needle)) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return best;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "").slice(0, 150);
  const artist = (searchParams.get("artist") ?? "").slice(0, 100);
  const q = cleanTitle(title);
  if (!q) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  let results = await search(q);
  if (results.length === 0 && artist.trim()) {
    results = await search(`${q} ${artist}`.trim());
  }

  const best = pickBest(results, artist);
  const body = {
    synced: best?.syncedLyrics ?? null,
    plain: best?.plainLyrics ?? null,
    trackName: best?.trackName ?? null,
    artistName: best?.artistName ?? null,
  };
  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
