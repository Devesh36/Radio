import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { CustomRoom, CustomTrack } from "@/lib/types";
import { MAX_CUSTOM_TRACKS } from "@/lib/limits";

export type StoredCustomRoom = CustomRoom & { custom_tracks: CustomTrack[] };

const STORE_PATH = join(process.cwd(), "data", "custom-rooms.json");

export function isMissingTableError(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    (error.message ?? "").includes("schema cache") ||
    (error.message ?? "").includes("does not exist")
  );
}

function readAll(): StoredCustomRoom[] {
  try {
    return JSON.parse(readFileSync(STORE_PATH, "utf8")) as StoredCustomRoom[];
  } catch {
    return [];
  }
}

function writeAll(rooms: StoredCustomRoom[]) {
  mkdirSync(dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(rooms, null, 2));
}

export function fsListRooms(userId?: string): StoredCustomRoom[] {
  const rooms = readAll();
  return userId ? rooms.filter((room) => room.clerk_user_id === userId) : rooms;
}

export function fsGetRoomBySlug(slug: string): StoredCustomRoom | null {
  return readAll().find((room) => room.slug === slug) ?? null;
}

export function fsSlugTaken(slug: string) {
  return Boolean(fsGetRoomBySlug(slug));
}

export function fsInsertRoom(input: {
  clerk_user_id: string;
  slug: string;
  title: string;
  tagline?: string | null;
  background_url?: string | null;
  theme?: string;
  chat_enabled?: boolean;
  battle_enabled?: boolean;
  tracks: Array<{
    youtube_id: string;
    title: string;
    artist?: string;
    duration_sec?: number;
  }>;
}): StoredCustomRoom {
  const now = new Date().toISOString();
  const roomId = crypto.randomUUID();
  const room: StoredCustomRoom = {
    id: roomId,
    clerk_user_id: input.clerk_user_id,
    slug: input.slug,
    title: input.title,
    tagline: input.tagline ?? null,
    background_url: input.background_url ?? null,
    theme: input.theme ?? "default",
    chat_enabled: input.chat_enabled ?? true,
    battle_enabled: input.battle_enabled ?? true,
    radio_epoch: Date.now(),
    created_at: now,
    custom_tracks: input.tracks.map((track, index) => ({
      id: crypto.randomUUID(),
      room_id: roomId,
      youtube_id: track.youtube_id,
      title: track.title,
      artist: track.artist ?? null,
      duration_sec: track.duration_sec ?? 240,
      position: index,
    })),
  };

  writeAll([...readAll(), room]);
  return room;
}

export function fsDeleteRoom(id: string, userId: string) {
  const rooms = readAll();
  const room = rooms.find((item) => item.id === id);
  if (!room || room.clerk_user_id !== userId) return null;
  writeAll(rooms.filter((item) => item.id !== id));
  return room;
}

export function fsAppendTrack(
  slug: string,
  track: { youtube_id: string; title: string; artist?: string; duration_sec?: number },
) {
  const rooms = readAll();
  const index = rooms.findIndex((item) => item.slug === slug);
  if (index < 0) return null;
  if (rooms[index].custom_tracks.some((item) => item.youtube_id === track.youtube_id)) {
    return rooms[index];
  }
  if (rooms[index].custom_tracks.length >= MAX_CUSTOM_TRACKS) {
    return rooms[index];
  }
  rooms[index].custom_tracks.push({
    id: crypto.randomUUID(),
    room_id: rooms[index].id,
    youtube_id: track.youtube_id,
    title: track.title,
    artist: track.artist ?? null,
    duration_sec: track.duration_sec ?? 240,
    position: rooms[index].custom_tracks.length,
  });
  writeAll(rooms);
  return rooms[index];
}

export function fsRemoveTrack(slug: string, youtubeId: string) {
  const rooms = readAll();
  const index = rooms.findIndex((item) => item.slug === slug);
  if (index < 0) return null;
  rooms[index].custom_tracks = rooms[index].custom_tracks.filter(
    (track) => track.youtube_id !== youtubeId,
  );
  writeAll(rooms);
  return rooms[index];
}

export function fsUpdateRoom(
  id: string,
  userId: string,
  patch: Partial<Pick<CustomRoom, "title" | "tagline" | "background_url" | "chat_enabled" | "battle_enabled">>,
) {
  const rooms = readAll();
  const index = rooms.findIndex((item) => item.id === id);
  if (index < 0 || rooms[index].clerk_user_id !== userId) return null;
  rooms[index] = { ...rooms[index], ...patch };
  writeAll(rooms);
  return rooms[index];
}
