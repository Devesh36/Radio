/**
 * Remembers which songs the listener hearted (and into which private room
 * they were saved) so the heart stays filled across visits. The room's
 * catalog in the database is the real source of truth.
 */
const LIKES_KEY = "radio-likes";
export const LIKES_EVENT = "radio-likes-change";

type LikesMap = Record<string, string>;

function readLikes(): LikesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as LikesMap) : {};
  } catch {
    return {};
  }
}

function writeLikes(map: LikesMap) {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event(LIKES_EVENT));
  } catch {
    // ignore
  }
}

export function likedRoomSlug(youtubeId: string): string | null {
  return readLikes()[youtubeId] ?? null;
}

export function markLiked(youtubeId: string, roomSlug: string) {
  writeLikes({ ...readLikes(), [youtubeId]: roomSlug });
}

export function unmarkLiked(youtubeId: string) {
  const map = readLikes();
  delete map[youtubeId];
  writeLikes(map);
}
