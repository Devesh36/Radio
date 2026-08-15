import { extractYouTubeId } from "@/lib/youtube";

export const SLUG_RE = /^[a-z0-9-]{3,40}$/;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function clip(value: unknown, max: number, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

export function isSlug(value: string): boolean {
  return SLUG_RE.test(value);
}

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export function isYouTubeId(value: string): boolean {
  return YOUTUBE_ID_RE.test(value);
}

export function clampDuration(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 240;
  return Math.min(540, Math.max(1, Math.round(n)));
}

export function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function sanitizeBackgroundUrl(raw: unknown): string {
  const fallback = "/images/hero-kulhad.jpg";
  if (typeof raw !== "string") return fallback;
  const value = raw.trim();
  if (/^\/images\/[a-zA-Z0-9._/-]+\.(jpg|jpeg|png|webp|gif)$/i.test(value) && !value.includes("..")) {
    return value;
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return fallback;
    if (/[)\\s'"<>]/.test(value)) return fallback;
    if (url.username || url.password) return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
}

export function cssSafeUrl(raw: string): string {
  return sanitizeBackgroundUrl(raw);
}

export function parseTrackInput(raw: unknown): {
  youtube_id: string;
  title: string;
  artist: string;
  duration_sec: number;
} | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const youtube_id =
    (typeof row.youtube_id === "string" && isYouTubeId(row.youtube_id) && row.youtube_id) ||
    (typeof row.youtubeId === "string" && isYouTubeId(row.youtubeId) && row.youtubeId) ||
    (typeof row.youtube_id === "string" ? extractYouTubeId(row.youtube_id) : null) ||
    (typeof row.youtubeId === "string" ? extractYouTubeId(row.youtubeId) : null);
  if (!youtube_id) return null;
  const title = clip(row.title, 120, "YouTube track") || "YouTube track";
  const artist = clip(row.artist, 80, "Unknown") || "Unknown";
  return {
    youtube_id,
    title,
    artist,
    duration_sec: clampDuration(row.duration_sec),
  };
}

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value) && value.length <= 254;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return ip.slice(0, 64);
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const current = rateBuckets.get(key);
  if (!current || now >= current.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function genericError() {
  return { error: "Something went wrong" };
}

export function readJson(request: Request): Promise<unknown> {
  return request.json().catch(() => null);
}
