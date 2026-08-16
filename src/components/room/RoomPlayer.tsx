"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import YouTube, { type YouTubeEvent, type YouTubePlayer } from "react-youtube";
import { type LanguageKey } from "@/data/brand";
import { useBackgroundPlayback } from "@/hooks/useBackgroundPlayback";
import type { RadioState, Track } from "@/lib/types";

const PLAYER_OPTS = {
  height: "1",
  width: "1",
  playerVars: {
    autoplay: 1,
    controls: 0,
    disablekb: 1,
    fs: 0,
    modestbranding: 1,
    rel: 0,
    playsinline: 1,
    origin: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  },
};

function IconPlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path fill="#ffffff" d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path fill="#ffffff" d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

function IconPrev() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path fill="#c9b8a8" d="M6 6h2v12H6zm3.5 6L18 6v12z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path fill="#c9b8a8" d="M16 6h2v12h-2zM6 18V6l8.5 6z" />
    </svg>
  );
}

function IconRemove() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      />
    </svg>
  );
}
function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function splitAddInputs(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const urls = trimmed.match(/https?:\/\/[^\s]+/gi);
  if (urls?.length) {
    const leftover = trimmed
      .replace(/https?:\/\/[^\s]+/gi, "\n")
      .split("\n")
      .map((part) => part.trim())
      .filter(Boolean);
    return [...urls, ...leftover];
  }
  return trimmed
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean);
}

interface RoomPlayerProps {
  roomSlug: string;
  ambienceId: string;
  language: LanguageKey;
  playlist: Track[];
  radioSync: RadioState | null;
  onTrackChange?: (track: Track) => void;
  onShare?: () => void;
  onAddTrack?: (url: string) => Promise<Track[]>;
  onRemoveTrack?: (youtubeId: string) => Promise<void>;
  radioLocked?: boolean;
  liveSyncEnabled?: boolean;
}

export function RoomPlayer({
  roomSlug,
  ambienceId,
  language,
  playlist,
  radioSync,
  onTrackChange,
  onShare,
  onAddTrack,
  onRemoveTrack,
  radioLocked = false,
  liveSyncEnabled = false,
}: RoomPlayerProps) {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(radioSync?.track ?? playlist[0] ?? null);
  const [liveRadio, setLiveRadio] = useState(radioLocked);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [musicVolume, setMusicVolume] = useState(80);
  const [ambienceVolume, setAmbienceVolume] = useState(35);

  const musicRef = useRef<YouTubePlayer | null>(null);
  const ambienceRef = useRef<YouTubePlayer | null>(null);
  const musicReady = useRef(false);
  const lastSyncKey = useRef("");
  const ignorePauseRef = useRef(false);
  const userPausedRef = useRef(false);
  const liveRadioRef = useRef(radioLocked);
  const currentTrackRef = useRef<Track | null>(radioSync?.track ?? playlist[0] ?? null);
  const bootIdRef = useRef(radioSync?.track.youtubeId ?? playlist[0]?.youtubeId ?? "");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  useEffect(() => {
    liveRadioRef.current = liveRadio;
  }, [liveRadio]);

  useEffect(() => {
    if (!radioLocked) return;
    setLiveRadio(true);
    liveRadioRef.current = true;
  }, [radioLocked]);

  useEffect(() => {
    if (!pickerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [pickerOpen]);

  useEffect(() => {
    const storedMusic = localStorage.getItem(`music-vol-${roomSlug}`);
    const storedAmbience = localStorage.getItem(`ambience-vol-${roomSlug}`);
    if (storedMusic) setMusicVolume(parseInt(storedMusic, 10));
    if (storedAmbience) setAmbienceVolume(parseInt(storedAmbience, 10));
  }, [roomSlug]);

  const playTrack = useCallback(
    (track: Track, startSeconds = 0, fromRadio = false) => {
      if (radioLocked && !fromRadio) return;
      userPausedRef.current = false;
      const sameVideo = currentTrackRef.current?.youtubeId === track.youtubeId;
      if (!fromRadio) {
        setLiveRadio(false);
        liveRadioRef.current = false;
      }
      if (!sameVideo) {
        setCurrentTrack(track);
        currentTrackRef.current = track;
        setElapsed(startSeconds);
        setDuration(track.duration_sec);
        onTrackChange?.(track);
      }
      if (!musicRef.current || !musicReady.current) return;
      try {
        if (sameVideo) {
          const current = musicRef.current.getCurrentTime?.() ?? 0;
          if (Math.abs(current - startSeconds) <= 8) return;
          ignorePauseRef.current = true;
          musicRef.current.seekTo(startSeconds, true);
          musicRef.current.playVideo();
          setElapsed(startSeconds);
          setIsPlaying(true);
          return;
        }
        ignorePauseRef.current = true;
        musicRef.current.loadVideoById({
          videoId: track.youtubeId,
          startSeconds,
        });
        musicRef.current.setVolume(musicVolume);
        musicRef.current.unMute();
        musicRef.current.playVideo();
        ambienceRef.current?.unMute();
        ambienceRef.current?.playVideo();
        setIsPlaying(true);
      } catch {
        ignorePauseRef.current = false;
      }
    },
    [musicVolume, onTrackChange, radioLocked],
  );

  const applyRadioSync = useCallback(() => {
    if (!liveRadioRef.current || !radioSync || !musicRef.current || !musicReady.current) return;
    const syncKey = `${radioSync.track.youtubeId}_${radioSync.startedAt}`;
    if (lastSyncKey.current === syncKey) return;
    lastSyncKey.current = syncKey;
    const offset = Math.max(0, Math.floor((Date.now() - radioSync.startedAt) / 1000));
    playTrack(radioSync.track, offset, true);
  }, [radioSync, playTrack]);

  useEffect(() => {
    applyRadioSync();
  }, [applyRadioSync]);

  useEffect(() => {
    try {
      musicRef.current?.setVolume(musicVolume);
      localStorage.setItem(`music-vol-${roomSlug}`, String(musicVolume));
    } catch {
      // ignore
    }
  }, [musicVolume, roomSlug]);

  useEffect(() => {
    try {
      ambienceRef.current?.setVolume(ambienceVolume);
      localStorage.setItem(`ambience-vol-${roomSlug}`, String(ambienceVolume));
    } catch {
      // ignore
    }
  }, [ambienceVolume, roomSlug]);

  useEffect(() => {
    if (!isPlaying) return;
    const tick = window.setInterval(() => {
      try {
        const t = musicRef.current?.getCurrentTime?.() ?? 0;
        const d = musicRef.current?.getDuration?.() ?? 0;
        setElapsed((prev) => (Math.abs(prev - t) > 0.35 ? t : prev));
        if (d > 0) setDuration((prev) => (Math.abs(prev - d) > 0.5 ? d : prev));
      } catch {
        // ignore
      }
    }, 500);
    return () => window.clearInterval(tick);
  }, [isPlaying]);

  const onMusicReady = (event: YouTubeEvent) => {
    musicRef.current = event.target;
    musicReady.current = true;
    try {
      event.target.setVolume(musicVolume);
      event.target.unMute();
    } catch {
      // ignore
    }
    if (liveRadioRef.current) {
      lastSyncKey.current = "";
      applyRadioSync();
      return;
    }
    const start = currentTrackRef.current;
    if (!start) return;
    try {
      ignorePauseRef.current = true;
      if (start.youtubeId !== bootIdRef.current) {
        event.target.loadVideoById({
          videoId: start.youtubeId,
          startSeconds: 0,
        });
      }
      event.target.playVideo();
      setIsPlaying(true);
    } catch {
      ignorePauseRef.current = false;
    }
  };

  const onAmbienceReady = (event: YouTubeEvent) => {
    ambienceRef.current = event.target;
    try {
      event.target.setVolume(ambienceVolume);
      event.target.unMute();
      event.target.playVideo();
    } catch {
      // ignore
    }
  };

  const skip = useCallback(
    (dir: -1 | 1) => {
      if (radioLocked || !playlist.length) return;
      const idx = playlist.findIndex((t) => t.youtubeId === currentTrackRef.current?.youtubeId);
      const i = idx >= 0 ? idx : 0;
      const next = playlist[(i + dir + playlist.length) % playlist.length];
      playTrack(next, 0, false);
    },
    [playlist, playTrack, radioLocked],
  );

  const syncFromNowPlaying = useCallback(() => {
    fetch(`/api/rooms/${roomSlug}/now?lang=${language}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data?.track) return;
        lastSyncKey.current = "";
        playTrack(data.track, data.offsetSec ?? 0, true);
      })
      .catch(() => undefined);
  }, [language, playTrack, roomSlug]);

  const resumePlayback = useCallback(() => {
    userPausedRef.current = false;
    try {
      musicRef.current?.playVideo();
      ambienceRef.current?.playVideo();
      setIsPlaying(true);
    } catch {
      // ignore
    }
  }, []);

  const pausePlayback = useCallback(() => {
    userPausedRef.current = true;
    try {
      musicRef.current?.pauseVideo();
      ambienceRef.current?.pauseVideo();
      setIsPlaying(false);
    } catch {
      // ignore
    }
  }, []);

  const onMusicStateChange = (event: YouTubeEvent) => {
    if (event.data === 1) {
      ignorePauseRef.current = false;
      userPausedRef.current = false;
      setIsPlaying(true);
      return;
    }
    if (event.data === 3) return;
    if (event.data === 2) {
      if (ignorePauseRef.current) return;
      if (!userPausedRef.current && document.visibilityState === "hidden") {
        resumePlayback();
        return;
      }
      setIsPlaying(false);
      return;
    }
    if (event.data === 0) {
      if (radioLocked || liveRadioRef.current) {
        syncFromNowPlaying();
      } else {
        skip(1);
      }
    }
  };

  const togglePlay = useCallback(() => {
    if (!musicRef.current) return;
    if (isPlaying) {
      pausePlayback();
    } else if (radioLocked) {
      userPausedRef.current = false;
      lastSyncKey.current = "";
      applyRadioSync();
      syncFromNowPlaying();
      ambienceRef.current?.playVideo();
    } else {
      resumePlayback();
    }
  }, [applyRadioSync, isPlaying, pausePlayback, radioLocked, resumePlayback, syncFromNowPlaying]);

  const seek = useCallback(
    (value: number) => {
      if (radioLocked) return;
      setElapsed(value);
      try {
        musicRef.current?.seekTo(value, true);
      } catch {
        // ignore
      }
    },
    [radioLocked],
  );

  useBackgroundPlayback({
    isPlaying,
    track: currentTrack,
    duration,
    elapsed,
    resume: resumePlayback,
    pause: pausePlayback,
    skip,
    seek,
  });

  const seekFromClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (duration <= 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    seek(ratio * duration);
  };

  const joinLive = () => {
    if (!liveSyncEnabled) return;
    setLiveRadio(true);
    liveRadioRef.current = true;
    lastSyncKey.current = "";
    applyRadioSync();
  };

  const submitAdd = async (event: FormEvent) => {
    event.preventDefault();
    const raw = addUrl.trim();
    if (!raw || !onAddTrack) return;
    setAdding(true);
    setAddError("");
    try {
      const links = splitAddInputs(raw);
      const added: Track[] = [];
      for (const link of links) {
        added.push(...(await onAddTrack(link)));
      }
      setAddUrl("");
      if (added[0]) playTrack(added[0], 0, false);
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "Couldn’t add that link");
    } finally {
      setAdding(false);
    }
  };

  const removeSong = async (item: Track) => {
    if (!onRemoveTrack || playlist.length <= 1) return;
    const wasPlaying = item.youtubeId === currentTrack?.youtubeId;
    const idx = playlist.findIndex((track) => track.youtubeId === item.youtubeId);
    const remaining = playlist.filter((track) => track.youtubeId !== item.youtubeId);
    setRemovingId(item.youtubeId);
    setAddError("");
    try {
      await onRemoveTrack(item.youtubeId);
      if (wasPlaying && remaining.length) {
        playTrack(remaining[Math.max(0, idx) % remaining.length], 0, false);
      }
    } catch (error) {
      setAddError(error instanceof Error ? error.message : "Couldn’t remove that song");
    } finally {
      setRemovingId("");
    }
  };

  const filtered = playlist.filter((track) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${track.title} ${track.artist}`.toLowerCase().includes(q);
  });

  const track = currentTrack ?? radioSync?.track ?? null;
  const progress = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0;

  const dock =
    track && mounted
      ? createPortal(
          <>
            <div className="room-dock fixed left-1/2 z-[80] w-[min(calc(100vw-1.25rem),640px)] -translate-x-1/2">
              <div
                className="overflow-hidden rounded-2xl px-3 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:px-4 sm:py-3"
                style={{ backgroundColor: "rgba(12,10,9,0.82)", backdropFilter: "blur(18px)" }}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#f3e6d8]">{track.title}</p>
                    <p className="truncate text-xs text-[#c9b8a8]">{track.artist}</p>
                  </div>
                  <button
                    onClick={() => setPickerOpen(true)}
                    className="shrink-0 px-1 py-2 text-[11px] uppercase tracking-[0.16em] text-[#c9b8a8] hover:text-[#f3e6d8]"
                  >
                    Songs
                  </button>
                  {onShare && (
                    <button
                      type="button"
                      onClick={onShare}
                      className="shrink-0 px-1 py-2 text-[11px] uppercase tracking-[0.16em] text-[#c9b8a8] hover:text-[#f3e6d8]"
                    >
                      Share
                    </button>
                  )}
                  {liveSyncEnabled && (
                    <button
                      onClick={joinLive}
                      className="hidden shrink-0 text-[11px] uppercase tracking-[0.16em] sm:block"
                      style={{ color: liveRadio ? "#c47a52" : "#c9b8a8" }}
                    >
                      {liveRadio ? "Live" : "Join live"}
                    </button>
                  )}
                  <div className="hidden items-center gap-2 sm:flex">
                    {!radioLocked && (
                      <button onClick={() => skip(-1)} className="p-1 text-[#c9b8a8]" aria-label="Previous">
                        <IconPrev />
                      </button>
                    )}
                    <button
                      onClick={togglePlay}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                          <path fill="#111" d="M6 5h4v14H6zm8 0h4v14h-4z" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                          <path fill="#111" d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    {!radioLocked && (
                      <button onClick={() => skip(1)} className="p-1 text-[#c9b8a8]" aria-label="Next">
                        <IconNext />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 sm:mt-3">
                  <button
                    type="button"
                    onClick={seekFromClick}
                    disabled={radioLocked}
                    className="relative h-4 flex-1 sm:h-[3px] disabled:cursor-default"
                    aria-label={radioLocked ? "Live progress" : "Seek"}
                  >
                    <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/20" />
                    <span
                      className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full bg-white"
                      style={{ width: `${progress}%` }}
                    />
                  </button>
                  <span className="shrink-0 text-[11px] tabular-nums text-[#c9b8a8]">
                    {formatTime(elapsed)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-center gap-5 sm:hidden">
                  {!radioLocked && (
                    <button onClick={() => skip(-1)} className="p-2 text-[#c9b8a8]" aria-label="Previous">
                      <IconPrev />
                    </button>
                  )}
                  <button
                    onClick={togglePlay}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                        <path fill="#111" d="M6 5h4v14H6zm8 0h4v14h-4z" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                        <path fill="#111" d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  {!radioLocked && (
                    <button onClick={() => skip(1)} className="p-2 text-[#c9b8a8]" aria-label="Next">
                      <IconNext />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {pickerOpen && (
              <div
                className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
                onClick={() => setPickerOpen(false)}
              >
                <div
                  className="flex h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[#f3e6d814] sm:h-[min(82vh,720px)] sm:rounded-2xl"
                  style={{ backgroundColor: "#161210" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="shrink-0 border-b border-[#f3e6d814] px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#c47a52]">
                          Room catalog
                        </p>
                        <h3 className="font-display text-xl text-[#f3e6d8] sm:text-2xl">
                          {radioLocked ? "On the radio" : "Pick a song"}
                        </h3>
                        {radioLocked && (
                          <p className="mt-1 text-xs text-[#c9b8a8]">
                            Everyone here hears the same song. The room changes it.
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {liveSyncEnabled && (
                          <button
                            type="button"
                            onClick={joinLive}
                            className="rounded-full px-3 py-1 text-sm sm:hidden"
                            style={{ color: liveRadio ? "#c47a52" : "#c9b8a8" }}
                          >
                            {liveRadio ? "Live" : "Join live"}
                          </button>
                        )}
                        <button
                          onClick={() => setPickerOpen(false)}
                          className="rounded-full px-3 py-1 text-sm text-[#c9b8a8] hover:text-[#f3e6d8]"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search this room’s catalog…"
                      className="field-input mt-3 py-2.5 text-sm sm:mt-4"
                    />
                    {onAddTrack && (
                      <form onSubmit={submitAdd} className="mt-3 flex gap-2">
                        <input
                          value={addUrl}
                          onChange={(e) => setAddUrl(e.target.value)}
                          placeholder="YouTube video, playlist, Spotify, or a song name…"
                          className="field-input min-w-0 flex-1 py-2.5 text-sm"
                        />
                        <button
                          type="submit"
                          disabled={adding || !addUrl.trim()}
                          className="shrink-0 rounded-xl px-3 text-sm font-semibold text-white disabled:opacity-50"
                          style={{ backgroundColor: "#c47a52" }}
                        >
                          {adding ? "Adding…" : "Add"}
                        </button>
                      </form>
                    )}
                    {addError && <p className="mt-2 text-xs text-red-400">{addError}</p>}
                  </div>
                  <ul className="song-scroll min-h-0 flex-1 space-y-1 p-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-3">
                    {filtered.map((item, index) => {
                      const active = item.youtubeId === track.youtubeId;
                      const canRemove = playlist.length > 1 && Boolean(onRemoveTrack);
                      return (
                        <li
                          key={`${item.youtubeId}-${index}`}
                          className="flex items-center gap-0.5 rounded-xl pr-0.5 hover:bg-[#c47a52]/10 sm:gap-1 sm:pr-1"
                          style={active ? { backgroundColor: "rgba(196,122,82,0.16)" } : undefined}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (radioLocked) return;
                              playTrack(item, 0, false);
                              setPickerOpen(false);
                            }}
                            className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2.5 text-left ${radioLocked ? "cursor-default" : ""}`}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${item.youtubeId}/default.jpg`}
                              alt=""
                              className="h-11 w-11 shrink-0 rounded-md object-cover"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm text-[#f3e6d8]">{item.title}</span>
                              <span className="block truncate text-xs text-[#c9b8a8]">{item.artist}</span>
                            </span>
                            {item.added && !active && (
                              <span className="hidden text-[10px] uppercase tracking-wider text-[#c9b8a8] sm:inline">
                                Added
                              </span>
                            )}
                            {active && <span className="text-xs text-[#c47a52]">Playing</span>}
                          </button>
                          {onRemoveTrack && (
                            <button
                              type="button"
                              onClick={() => removeSong(item)}
                              disabled={!canRemove || removingId === item.youtubeId}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#c9b8a8] hover:text-[#e8a090] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-2 sm:py-1 sm:text-[11px] sm:uppercase sm:tracking-wider"
                              aria-label={`Remove ${item.title}`}
                              title={canRemove ? "Remove from this catalog" : "Keep at least one song"}
                            >
                              <span className="sm:hidden">
                                {removingId === item.youtubeId ? "…" : <IconRemove />}
                              </span>
                              <span className="hidden sm:inline">
                                {removingId === item.youtubeId ? "…" : "Remove"}
                              </span>
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="hidden-player" aria-hidden="true">
        {bootIdRef.current && (
          <YouTube
            videoId={bootIdRef.current}
            opts={PLAYER_OPTS}
            onReady={onMusicReady}
            onStateChange={onMusicStateChange}
          />
        )}
        <YouTube
          videoId={ambienceId}
          opts={{
            ...PLAYER_OPTS,
            playerVars: {
              ...PLAYER_OPTS.playerVars,
              loop: 1,
              playlist: ambienceId,
            },
          }}
          onReady={onAmbienceReady}
        />
      </div>
      {dock}
    </>
  );
}
