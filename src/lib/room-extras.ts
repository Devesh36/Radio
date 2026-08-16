import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { LanguageKey } from "@/data/brand";
import { MAX_CUSTOM_TRACKS } from "@/lib/limits";
import type { Track } from "@/lib/types";

type ExtraMap = Record<string, Partial<Record<LanguageKey, Track[]>>>;
type RemovedMap = Record<string, Partial<Record<LanguageKey, string[]>>>;

const EXTRAS_PATH = join(process.cwd(), "data", "room-extras.json");
const REMOVED_PATH = join(process.cwd(), "data", "room-removed.json");
const MAX_EXTRAS = MAX_CUSTOM_TRACKS;

function readJson<T>(path: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(path: string, data: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}

function readExtras(): ExtraMap {
  return readJson<ExtraMap>(EXTRAS_PATH, {});
}

function readRemoved(): RemovedMap {
  return readJson<RemovedMap>(REMOVED_PATH, {});
}

export function getRoomExtras(slug: string, language: LanguageKey): Track[] {
  return readExtras()[slug]?.[language] ?? [];
}

export function getAllRoomExtras(slug: string): Record<LanguageKey, Track[]> {
  const stored = readExtras()[slug] ?? {};
  return {
    hindi: stored.hindi ?? [],
    tamil: stored.tamil ?? [],
    telugu: stored.telugu ?? [],
  };
}

export function getRemovedIds(slug: string, language: LanguageKey): string[] {
  return readRemoved()[slug]?.[language] ?? [];
}

export function getAllRemovedIds(slug: string): Record<LanguageKey, string[]> {
  const stored = readRemoved()[slug] ?? {};
  return {
    hindi: stored.hindi ?? [],
    tamil: stored.tamil ?? [],
    telugu: stored.telugu ?? [],
  };
}

export function appendRoomExtra(slug: string, language: LanguageKey, track: Track): Track[] {
  const all = readExtras();
  const room = all[slug] ?? {};
  const current = room[language] ?? [];
  const next = current.some((item) => item.youtubeId === track.youtubeId)
    ? current
    : [...current, { ...track, added: true }].slice(-MAX_EXTRAS);
  all[slug] = { ...room, [language]: next };
  writeJson(EXTRAS_PATH, all);

  const removed = readRemoved();
  const blocked = (removed[slug]?.[language] ?? []).filter((id) => id !== track.youtubeId);
  removed[slug] = { ...(removed[slug] ?? {}), [language]: blocked };
  writeJson(REMOVED_PATH, removed);

  return next;
}

export function removeRoomTrack(slug: string, language: LanguageKey, youtubeId: string) {
  const extras = readExtras();
  const roomExtras = extras[slug] ?? {};
  extras[slug] = {
    ...roomExtras,
    [language]: (roomExtras[language] ?? []).filter((track) => track.youtubeId !== youtubeId),
  };
  writeJson(EXTRAS_PATH, extras);

  const removed = readRemoved();
  const current = removed[slug]?.[language] ?? [];
  if (!current.includes(youtubeId)) {
    removed[slug] = { ...(removed[slug] ?? {}), [language]: [...current, youtubeId] };
    writeJson(REMOVED_PATH, removed);
  }
}

export function mergeCatalog(base: Track[], extras: Track[], removed: string[] = []): Track[] {
  const blocked = new Set(removed);
  const seen = new Set<string>();
  const merged: Track[] = [];
  for (const track of [...base, ...extras.map((item) => ({ ...item, added: true as const }))]) {
    if (blocked.has(track.youtubeId) || seen.has(track.youtubeId)) continue;
    seen.add(track.youtubeId);
    merged.push(track);
  }
  return merged;
}
