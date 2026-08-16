import type { Track } from "@/lib/types";

export const VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Cookie: "CONSENT=YES+; SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg",
};

export function isYouTubeId(value: string): boolean {
  return VIDEO_ID.test(value);
}

function withProtocol(raw: string) {
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function youtubeHost(hostname: string) {
  return hostname.replace(/^www\./, "").replace(/^m\./, "").replace(/^music\./, "");
}

export function extractYouTubeId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  if (VIDEO_ID.test(input)) return input;

  try {
    const url = new URL(withProtocol(input));
    const host = youtubeHost(url.hostname);
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

export function extractYouTubePlaylistId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  try {
    const url = new URL(withProtocol(input));
    const host = youtubeHost(url.hostname);
    if (host !== "youtu.be" && host !== "youtube.com" && !host.endsWith(".youtube.com")) {
      return null;
    }
    const list = url.searchParams.get("list");
    if (!list || list.startsWith("RD")) return null;
    const path = url.pathname.toLowerCase();
    if (path.includes("/playlist") || path.includes("/channel")) return list;
    if (/^(PL|OL|UU|FL)/.test(list) && !url.searchParams.get("v")) return list;
  } catch {
    return null;
  }
  return null;
}

function cleanArtist(author: string) {
  return author
    .replace(/\s+[-–]\s*topic$/i, "")
    .replace(/\s+VEVO$/i, "")
    .replace(/\s+-\s*YouTube$/i, "")
    .trim();
}

function splitTitle(raw: string): { title: string; artist: string } {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  const parts = cleaned.split(/\s+[-–|]\s+/);
  if (parts.length >= 2) {
    return { artist: cleanArtist(parts[0]), title: parts.slice(1).join(" - ") };
  }
  return { title: cleaned || "YouTube track", artist: "YouTube" };
}

function parseClock(text: string | undefined): number {
  if (!text) return 240;
  const parts = text.split(":").map((part) => Number(part));
  if (parts.some((n) => !Number.isFinite(n))) return 240;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 240;
}

function asTrack(youtubeId: string, title: string, artist: string, duration_sec = 240): Track {
  return {
    youtubeId,
    title: title.trim() || "YouTube track",
    artist: cleanArtist(artist || "YouTube") || "YouTube",
    duration_sec: Number.isFinite(duration_sec) && duration_sec > 0 ? Math.round(duration_sec) : 240,
    cover: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    added: true,
  };
}

function extractJsonObject(html: string, from: number): unknown | null {
  const start = html.indexOf("{", from);
  if (start < 0) return null;
  let depth = 0;
  let inStr = false;
  let escape = false;
  for (let i = start; i < html.length; i += 1) {
    const c = html[i];
    if (inStr) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === "\"") inStr = false;
      continue;
    }
    if (c === "\"") inStr = true;
    else if (c === "{") depth += 1;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function extractYtInitialData(html: string): unknown | null {
  const marker = html.indexOf("ytInitialData");
  if (marker < 0) return null;
  return extractJsonObject(html, marker);
}

function walk(node: unknown, visit: (value: Record<string, unknown>) => void, seen = new Set<unknown>()) {
  if (!node || typeof node !== "object" || seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) {
    for (const item of node) walk(item, visit, seen);
    return;
  }
  const record = node as Record<string, unknown>;
  visit(record);
  for (const value of Object.values(record)) walk(value, visit, seen);
}

function textFrom(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const record = node as Record<string, unknown>;
  if (typeof record.simpleText === "string") return record.simpleText;
  if (Array.isArray(record.runs)) {
    return record.runs
      .map((run) => (run && typeof run === "object" && "text" in run ? String((run as { text?: string }).text ?? "") : ""))
      .join("");
  }
  return "";
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: BROWSER_HEADERS,
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return "";
  return res.text();
}

export async function resolveYouTubeTrack(input: string): Promise<Track | null> {
  const youtubeId = extractYouTubeId(input);
  if (!youtubeId) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
      { headers: { "User-Agent": "Mozilla/5.0 Baithak" }, signal: AbortSignal.timeout(8000) },
    );
    if (res.ok) {
      const data = (await res.json()) as { title?: string; author_name?: string };
      return asTrack(youtubeId, data.title?.trim() || "YouTube track", data.author_name || "YouTube");
    }
  } catch {
    // still allow adding by id
  }

  return asTrack(youtubeId, "YouTube track", "YouTube");
}

async function resolveYouTubePlaylist(playlistId: string, limit: number): Promise<Track[]> {
  const html = await fetchText(`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`);
  const data = extractYtInitialData(html);
  if (!data) return [];

  const tracks: Track[] = [];
  const seen = new Set<string>();
  walk(data, (node) => {
    const renderer = node.playlistVideoRenderer;
    if (!renderer || typeof renderer !== "object") return;
    const video = renderer as Record<string, unknown>;
    const youtubeId = typeof video.videoId === "string" ? video.videoId : "";
    if (!VIDEO_ID.test(youtubeId) || seen.has(youtubeId) || tracks.length >= limit) return;
    seen.add(youtubeId);
    const rawTitle = textFrom(video.title) || "YouTube track";
    const split = splitTitle(rawTitle);
    const seconds =
      typeof video.lengthSeconds === "string" || typeof video.lengthSeconds === "number"
        ? Number(video.lengthSeconds)
        : parseClock(textFrom(video.lengthText));
    tracks.push(asTrack(youtubeId, split.title, split.artist, seconds));
  });
  return tracks;
}

async function searchYouTubeTrack(query: string): Promise<Track | null> {
  const q = query.replace(/\s+/g, " ").trim();
  if (q.length < 2) return null;
  const html = await fetchText(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&sp=EgIQAQ%3D%3D`,
  );
  const data = extractYtInitialData(html);
  if (!data) return null;

  let found: Track | null = null;
  walk(data, (node) => {
    if (found) return;
    const renderer = node.videoRenderer;
    if (!renderer || typeof renderer !== "object") return;
    const video = renderer as Record<string, unknown>;
    const youtubeId = typeof video.videoId === "string" ? video.videoId : "";
    if (!VIDEO_ID.test(youtubeId)) return;
    const rawTitle = textFrom(video.title) || q;
    const owner = textFrom(
      video.ownerText ??
        (video.shortBylineText as unknown) ??
        ((video.longBylineText as Record<string, unknown> | undefined) ?? {}),
    );
    const split = splitTitle(rawTitle);
    found = asTrack(youtubeId, split.title, owner || split.artist, parseClock(textFrom(video.lengthText)));
  });
  return found;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      out[current] = await fn(items[current]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return out;
}

function looksLikeUrl(raw: string) {
  return /^https?:\/\//i.test(raw) || /^[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(raw);
}

function spotifyKind(raw: string): "track" | "playlist" | "album" | null {
  try {
    const url = new URL(withProtocol(raw));
    const host = url.hostname.replace(/^www\./, "");
    if (host !== "open.spotify.com" && host !== "spotify.link" && host !== "spotify.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    const kind = parts.find((part) => ["track", "playlist", "album"].includes(part));
    return kind === "track" || kind === "playlist" || kind === "album" ? kind : null;
  } catch {
    return null;
  }
}

function cleanExternalTitle(title: string) {
  return title
    .replace(/\s*[|·–-]\s*Spotify$/i, "")
    .replace(/\s+on\s+Spotify$/i, "")
    .replace(/\s+\|\s+Apple Music.*$/i, "")
    .replace(/\s+[-–]\s*song and lyrics by\s+/i, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function ogTitle(html: string) {
  const match =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  return match?.[1] ? decodeHtml(match[1]) : "";
}

function collectSpotifyQueries(html: string): string[] {
  const queries: string[] = [];
  const seen = new Set<string>();
  const blobs: unknown[] = [];
  const nextData = html.indexOf("__NEXT_DATA__");
  if (nextData >= 0) blobs.push(extractJsonObject(html, nextData));
  const entity = html.indexOf("Spotify.Entity");
  if (entity >= 0) blobs.push(extractJsonObject(html, entity));
  blobs.push(extractJsonObject(html, html.indexOf('{"props"')));

  const visit = (node: unknown) => {
    walk(node, (record) => {
      const uri = typeof record.uri === "string" ? record.uri : "";
      const name = typeof record.name === "string" ? record.name : "";
      if (!name || !uri.startsWith("spotify:track:")) return;
      const artists = Array.isArray(record.artists)
        ? record.artists
            .map((artist) =>
              artist && typeof artist === "object" && "name" in artist
                ? String((artist as { name?: string }).name ?? "")
                : "",
            )
            .filter(Boolean)
            .join(", ")
        : "";
      const query = `${artists} ${name}`.replace(/\s+/g, " ").trim();
      if (query.length < 2 || seen.has(query)) return;
      seen.add(query);
      queries.push(query);
    });
  };
  for (const blob of blobs) visit(blob);
  return queries;
}

async function fetchOEmbed(url: string): Promise<string | null> {
  const host = (() => {
    try {
      return new URL(withProtocol(url)).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();

  const endpoints: string[] = [];
  if (host.includes("spotify")) {
    endpoints.push(`https://open.spotify.com/oembed?url=${encodeURIComponent(withProtocol(url))}`);
  } else if (host.includes("soundcloud")) {
    endpoints.push(`https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(withProtocol(url))}`);
  }
  endpoints.push(`https://noembed.com/embed?url=${encodeURIComponent(withProtocol(url))}`);

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { "User-Agent": "Mozilla/5.0 Baithak" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as { title?: string; author_name?: string };
      const title = cleanExternalTitle(data.title ?? "");
      if (!title) continue;
      const author = cleanArtist(data.author_name ?? "");
      return author && !title.toLowerCase().includes(author.toLowerCase()) ? `${author} ${title}` : title;
    } catch {
      // try next
    }
  }
  return null;
}

async function titlesFromExternalUrl(raw: string): Promise<string[]> {
  const url = withProtocol(raw);
  const kind = spotifyKind(url);
  if (kind === "playlist" || kind === "album") {
    const embedPath = kind === "playlist" ? "playlist" : "album";
    const id = new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? "";
    const pages = await Promise.all([
      fetchText(url),
      id ? fetchText(`https://open.spotify.com/embed/${embedPath}/${id}`) : Promise.resolve(""),
    ]);
    for (const html of pages) {
      const queries = collectSpotifyQueries(html);
      if (queries.length) return queries;
    }
    return [];
  }

  const oembed = await fetchOEmbed(url);
  if (oembed) return [oembed];

  const html = await fetchText(url);
  const title = cleanExternalTitle(ogTitle(html));
  return title ? [title] : [];
}

export async function resolveMediaImport(input: string, limit = 50): Promise<Track[]> {
  const raw = input.trim();
  if (!raw || limit <= 0) return [];

  const playlistId = extractYouTubePlaylistId(raw);
  if (playlistId) {
    return resolveYouTubePlaylist(playlistId, limit);
  }

  const direct = await resolveYouTubeTrack(raw);
  if (direct) return [direct];

  if (looksLikeUrl(raw)) {
    const queries = await titlesFromExternalUrl(raw);
    if (queries.length === 0) return [];
    const found = await mapLimit(queries.slice(0, limit), 4, searchYouTubeTrack);
    const tracks: Track[] = [];
    const seen = new Set<string>();
    for (const track of found) {
      if (!track || seen.has(track.youtubeId)) continue;
      seen.add(track.youtubeId);
      tracks.push(track);
      if (tracks.length >= limit) break;
    }
    return tracks;
  }

  const searched = await searchYouTubeTrack(raw);
  return searched ? [searched] : [];
}
