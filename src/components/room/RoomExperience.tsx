"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type LanguageKey } from "@/data/brand";
import { getAmbienceId } from "@/data/rooms";
import { RoomBattle } from "@/components/room/RoomBattle";
import { RoomChat } from "@/components/room/RoomChat";
import { RoomOnboarding } from "@/components/room/RoomOnboarding";
import { RoomPlayer } from "@/components/room/RoomPlayer";
import { RoomPresence } from "@/components/room/RoomPresence";
import { ShareSheet } from "@/components/room/ShareSheet";
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
      setRadioSync({
        track: data.track,
        startedAt: data.startedAt,
        offsetSec: data.offsetSec ?? 0,
      });
      if (typeof data.isHost === "boolean") setIsHost(data.isHost);
      if (data.playlist) {
        setPlaylist(mergeTracks(data.playlist, extrasRef.current[lang] ?? [], removedRef.current[lang] ?? []));
      }
    }
  }, [room.slug]);

  const handleEnter = (name: string, lang: LanguageKey) => {
    const nextLang = room.isCustom ? lang : "hindi";
    setDisplayName(name);
    setLanguage(nextLang);
    setPlaylist(mergeTracks(room.catalogs[nextLang] ?? room.catalogs.hindi, extras[nextLang], removed[nextLang]));
    setEntered(true);
    fetchRadio(nextLang);
  };

  const changeLanguage = (lang: LanguageKey) => {
    if (!room.isCustom || lang === language) return;
    setLanguage(lang);
    localStorage.setItem("baithak-language", lang);
    setPlaylist(mergeTracks(room.catalogs[lang] ?? room.catalogs.hindi, extras[lang], removed[lang]));
    setRadioSync(null);
    fetchRadio(lang);
  };

  const addTrackFromLink = async (url: string) => {
    const resolveRes = await fetch("/api/tracks/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const resolved = await resolveRes.json();
    if (!resolveRes.ok || !resolved.track) {
      throw new Error(resolved.error ?? "Couldn’t add that link");
    }
    const track = resolved.track as Track;
    const alreadyInPlaylist = playlist.some((item) => item.youtubeId === track.youtubeId);
    if (!alreadyInPlaylist && playlist.length >= MAX_CUSTOM_TRACKS) {
      throw new Error(
        `This room can hold ${MAX_CUSTOM_TRACKS} songs. More rooms and bigger playlists land with Baithak Pro — coming soon.`,
      );
    }
    setRemoved((prev) => ({
      ...prev,
      [language]: (prev[language] ?? []).filter((id) => id !== track.youtubeId),
    }));
    setExtras((prev) => {
      const current = prev[language] ?? [];
      if (current.some((item) => item.youtubeId === track.youtubeId)) return prev;
      return { ...prev, [language]: [...current, track] };
    });
    setPlaylist((prev) => mergeTracks(prev, [track]));
    const saveRes = await fetch(`/api/rooms/${room.slug}/tracks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track, language }),
    });
    if (!saveRes.ok) {
      const saved = await saveRes.json().catch(() => null);
      throw new Error(saved?.error ?? "Couldn’t add that song");
    }
    return track;
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
    if (!entered) return;
    const interval = setInterval(() => fetchRadio(language), room.isCustom ? 30000 : 8000);
    return () => clearInterval(interval);
  }, [entered, language, fetchRadio, room.isCustom]);

  const ambienceId = getAmbienceId(room, language);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${cssSafeUrl(room.imageUrl)}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35" />

      <header
        className="relative z-20 flex items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#f3e6d8]/80 sm:px-5 md:px-8"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Link href="/" className="font-display shrink-0 text-lg normal-case tracking-normal text-[#f3e6d8]">
          baithak<span className="text-[#c47a52]">.</span>
        </Link>
        {entered && (
          <div className="min-w-0 flex-1 truncate text-center">
            <RoomPresence
              roomSlug={room.slug}
              displayName={displayName}
              language={language}
              enabled
            />
          </div>
        )}
        {room.isCustom ? (
          <div className="min-w-0 max-w-[55%] text-right">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f3e6d8]/70">
              {room.emoji} {room.slug.replaceAll("-", " ")}
            </p>
            <h1 className="font-display truncate text-lg normal-case tracking-normal text-[#f3e6d8] sm:text-xl">
              {room.name}
            </h1>
          </div>
        ) : (
          <p className="hidden max-w-[40%] truncate text-right sm:block">{room.name}</p>
        )}
      </header>

      {!room.isCustom && (
        <section className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-36 text-center sm:px-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f3e6d8]/70">
            {room.emoji} {room.slug.replaceAll("-", " ")}
          </p>
          <h1 className="font-display mt-3 max-w-4xl text-4xl leading-[1.05] text-[#f3e6d8] drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)] sm:text-5xl md:text-7xl">
            {room.name}
          </h1>
        </section>
      )}

      {!entered && (
        <RoomOnboarding
          roomName={room.name}
          showLanguage={Boolean(room.isCustom)}
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
            onLanguageChange={room.isCustom ? changeLanguage : undefined}
            onAddTrack={room.isCustom && isHost ? addTrackFromLink : undefined}
            onRemoveTrack={room.isCustom && isHost ? removeTrackFromCatalog : undefined}
            radioLocked={!room.isCustom}
          />
          <RoomChat
            roomSlug={room.slug}
            displayName={displayName}
            enabled={Boolean(room.isCustom && room.chatEnabled)}
          />
          <RoomBattle
            roomSlug={room.slug}
            displayName={displayName}
            playlist={playlist}
            enabled={Boolean(room.isCustom && room.battleEnabled)}
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
