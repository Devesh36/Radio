"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type LanguageKey } from "@/data/brand";
import { getAmbienceId } from "@/data/rooms";
import { RoomAtmosphere } from "@/components/room/RoomAtmosphere";
import { RoomChat } from "@/components/room/RoomChat";
import { RoomRipples } from "@/components/room/RoomRipples";
import { RoomOnboarding } from "@/components/room/RoomOnboarding";
import { RoomPlayer } from "@/components/room/RoomPlayer";
import { RoomPresence } from "@/components/room/RoomPresence";
import { ShareSheet } from "@/components/room/ShareSheet";
import { useRoomPresence } from "@/hooks/useRoomPresence";
import type { OfficialRoom, RadioState, Track } from "@/lib/types";
import { MAX_CUSTOM_TRACKS } from "@/lib/limits";
import { cssSafeUrl } from "@/lib/validate";

const EMPTY_EXTRAS: Record<LanguageKey, Track[]> = { hindi: [], tamil: [], telugu: [] };
const EMPTY_REMOVED: Record<LanguageKey, string[]> = { hindi: [], tamil: [], telugu: [] };

function mergeTracks(base: Track[], extras: Track[], removed: string[] = []) {
  const blocked = new Set(removed);
  const seen = new Set<string>();
  const merged: Track[] = [];
  for (const track of [...base, ...extras]) {
    if (blocked.has(track.youtubeId) || seen.has(track.youtubeId)) continue;
    seen.add(track.youtubeId);
    merged.push(track);
  }
  return merged;
}

interface RoomExperienceProps {
  room: OfficialRoom;
}

export function RoomExperience({ room }: RoomExperienceProps) {
  const [entered, setEntered] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [language, setLanguage] = useState<LanguageKey>("hindi");
  const [radioSync, setRadioSync] = useState<RadioState | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [extras, setExtras] = useState<Record<LanguageKey, Track[]>>(EMPTY_EXTRAS);
  const extrasRef = useRef(extras);
  const [removed, setRemoved] = useState<Record<LanguageKey, string[]>>(EMPTY_REMOVED);
  const removedRef = useRef(removed);
  const [playlist, setPlaylist] = useState<Track[]>(room.catalogs.hindi);

  useEffect(() => {
    extrasRef.current = extras;
  }, [extras]);

  useEffect(() => {
    if (!room.isCustom) return;
    fetch("/api/rooms/custom")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.rooms?.some((item: { slug?: string }) => item.slug === room.slug)) {
          setIsHost(true);
        }
      })
      .catch(() => undefined);
  }, [room.isCustom, room.slug]);

  useEffect(() => {
    removedRef.current = removed;
  }, [removed]);

  const fetchRadio = useCallback(async (lang: LanguageKey) => {
    const res = await fetch(`/api/rooms/${room.slug}/now?lang=${lang}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.track) {
      setRadioSync((prev) => {
        if (
          prev &&
          prev.track.youtubeId === data.track.youtubeId &&
          prev.startedAt === data.startedAt
        ) {
          return prev;
        }
        return {
          track: data.track,
          startedAt: data.startedAt,
          offsetSec: data.offsetSec ?? 0,
        };
      });
      if (typeof data.isHost === "boolean") setIsHost(data.isHost);
      if (data.playlist) {
        setPlaylist((prev) => {
          const next = mergeTracks(
            data.playlist,
            [...(extrasRef.current[lang] ?? []), ...prev],
            removedRef.current[lang] ?? [],
          );
          if (
            prev.length === next.length &&
            prev.every((track, index) => track.youtubeId === next[index]?.youtubeId)
          ) {
            return prev;
          }
          return next;
        });
      }
    }
  }, [room.slug]);

  const handleEnter = (name: string) => {
    setDisplayName(name);
    setLanguage("hindi");
    setPlaylist(mergeTracks(room.catalogs.hindi, extras.hindi, removed.hindi));
    setEntered(true);
    if (room.isCustom) fetchRadio("hindi");
  };

  const addTrackFromLink = async (url: string) => {
    const remaining = Math.max(0, MAX_CUSTOM_TRACKS - playlist.length);
    const resolveRes = await fetch("/api/tracks/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, limit: Math.max(1, remaining || 1) }),
    });
    const resolved = await resolveRes.json();
    const incoming = (
      Array.isArray(resolved.tracks) ? resolved.tracks : resolved.track ? [resolved.track] : []
    ) as Track[];
    if (!resolveRes.ok || incoming.length === 0) {
      throw new Error(resolved.error ?? "Couldn’t add that link");
    }

    const added: Track[] = [];
    let nextPlaylist = playlist;
    for (const track of incoming) {
      if (nextPlaylist.some((item) => item.youtubeId === track.youtubeId)) continue;
      if (nextPlaylist.length >= MAX_CUSTOM_TRACKS) {
        if (added.length === 0) {
          throw new Error(
            `This room can hold ${MAX_CUSTOM_TRACKS} songs. More rooms and bigger playlists land with Baithak Pro — coming soon.`,
          );
        }
        break;
      }
      const saveRes = await fetch(`/api/rooms/${room.slug}/tracks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track, language }),
      });
      if (!saveRes.ok) {
        const saved = await saveRes.json().catch(() => null);
        if (added.length === 0) {
          throw new Error(saved?.error ?? "Couldn’t add that song");
        }
        break;
      }
      added.push(track);
      nextPlaylist = mergeTracks(nextPlaylist, [track]);
    }

    if (added.length === 0) {
      throw new Error("Those songs are already in this room");
    }

    const addedIds = new Set(added.map((track) => track.youtubeId));
    const nextRemoved = {
      ...removedRef.current,
      [language]: (removedRef.current[language] ?? []).filter((id) => !addedIds.has(id)),
    };
    const currentExtras = extrasRef.current[language] ?? [];
    const extra = added.filter((track) => !currentExtras.some((item) => item.youtubeId === track.youtubeId));
    const nextExtras = extra.length
      ? { ...extrasRef.current, [language]: [...currentExtras, ...extra] }
      : extrasRef.current;
    extrasRef.current = nextExtras;
    removedRef.current = nextRemoved;
    setRemoved(nextRemoved);
    setExtras(nextExtras);
    setPlaylist(nextPlaylist);
    return added;
  };

  const removeTrackFromCatalog = async (youtubeId: string) => {
    if (playlist.filter((track) => track.youtubeId !== youtubeId).length === 0) {
      throw new Error("Keep at least one song in this catalog");
    }
    const previousPlaylist = playlist;
    const previousExtras = extras[language] ?? [];
    const previousRemoved = removed[language] ?? [];
    setRemoved((prev) => {
      const current = prev[language] ?? [];
      if (current.includes(youtubeId)) return prev;
      return { ...prev, [language]: [...current, youtubeId] };
    });
    setExtras((prev) => ({
      ...prev,
      [language]: (prev[language] ?? []).filter((track) => track.youtubeId !== youtubeId),
    }));
    setPlaylist((prev) => prev.filter((track) => track.youtubeId !== youtubeId));
    const res = await fetch(`/api/rooms/${room.slug}/tracks`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeId, language }),
    });
    if (!res.ok) {
      setPlaylist(previousPlaylist);
      setExtras((prev) => ({ ...prev, [language]: previousExtras }));
      setRemoved((prev) => ({ ...prev, [language]: previousRemoved }));
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "Couldn’t remove that song");
    }
  };

  useEffect(() => {
    if (!entered || !room.isCustom) return;
    fetchRadio(language);
    const interval = setInterval(() => fetchRadio(language), 30000);
    return () => clearInterval(interval);
  }, [entered, language, fetchRadio, room.isCustom]);

  const ambienceId = getAmbienceId(room, language);
  const listeningTrack = currentTrack ?? playlist[0] ?? null;
  const { count, members } = useRoomPresence({
    roomSlug: room.slug,
    displayName,
    language,
    track: listeningTrack,
    enabled: entered,
  });

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black">
      <div
        className="room-backdrop absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${cssSafeUrl(room.imageUrl)}")` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35" />
      <div className="grain vignette pointer-events-none absolute inset-0 z-[6]" />
      <RoomAtmosphere />
      <RoomRipples />

      <header
        className="relative z-20 flex items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#f3e6d8]/80 sm:px-5 md:px-8"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Link href="/" className="font-display shrink-0 text-lg normal-case tracking-normal text-[#f3e6d8]">
          baithak<span className="text-[#c47a52]">.</span>
        </Link>
        {entered && (
          <div className="min-w-0 flex-1 truncate text-center">
            <RoomPresence count={count} />
          </div>
        )}
        <div className="min-w-0 max-w-[55%] text-right">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f3e6d8]/70">
            {room.emoji} {room.isCustom ? "Private room" : "Live room"}
          </p>
          <h1 className="font-display truncate text-lg normal-case tracking-normal text-[#f3e6d8] sm:text-xl">
            {room.name}
          </h1>
        </div>
      </header>

      {!entered && (
        <section className="pointer-events-none relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-36 text-center sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f3e6d8]/70">
            {room.emoji} {room.isCustom ? "Private room" : "Live room"}
          </p>
          <h1 className="font-display mt-3 max-w-4xl text-4xl leading-[1.05] text-[#f3e6d8] drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)] sm:text-5xl md:text-7xl">
            {room.name}
          </h1>
        </section>
      )}

      {!entered && (
        <RoomOnboarding
          roomName={room.name}
          chatEnabled={Boolean(room.isCustom && room.chatEnabled)}
          onComplete={handleEnter}
        />
      )}

      {entered && (
        <>
          <RoomPlayer
            key={language}
            roomSlug={room.slug}
            ambienceId={ambienceId}
            language={language}
            playlist={playlist}
            radioSync={radioSync}
            onTrackChange={setCurrentTrack}
            onShare={room.isCustom ? () => setShowShare(true) : undefined}
            onAddTrack={room.isCustom && isHost ? addTrackFromLink : undefined}
            onRemoveTrack={room.isCustom && isHost ? removeTrackFromCatalog : undefined}
            radioLocked={false}
            liveSyncEnabled={false}
          />
          <RoomChat
            roomSlug={room.slug}
            displayName={displayName}
            enabled={Boolean(room.isCustom && room.chatEnabled)}
            listeners={members}
          />
        </>
      )}

      {showShare && (currentTrack ?? playlist[0]) && (
        <ShareSheet
          track={currentTrack ?? playlist[0]}
          roomName={room.name}
          roomSlug={room.slug}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
