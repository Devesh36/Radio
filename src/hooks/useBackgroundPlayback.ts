"use client";

import { useEffect, useRef } from "react";
import type { Track } from "@/lib/types";

const SILENT_WAV =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

function artworkFor(track: Track) {
  const id = track.youtubeId;
  return [
    { src: `https://img.youtube.com/vi/${id}/default.jpg`, sizes: "120x90", type: "image/jpeg" },
    { src: `https://img.youtube.com/vi/${id}/mqdefault.jpg`, sizes: "320x180", type: "image/jpeg" },
    { src: `https://img.youtube.com/vi/${id}/hqdefault.jpg`, sizes: "480x360", type: "image/jpeg" },
  ];
}

export function useBackgroundPlayback({
  isPlaying,
  track,
  duration,
  elapsed,
  resume,
  pause,
  skip,
  seek,
}: {
  isPlaying: boolean;
  track: Track | null;
  duration: number;
  elapsed: number;
  resume: () => void;
  pause: () => void;
  skip: (dir: -1 | 1) => void;
  seek: (seconds: number) => void;
}) {
  const wantPlaying = useRef(false);
  const silentRef = useRef<HTMLAudioElement | null>(null);
  const resumeRef = useRef(resume);
  const pauseRef = useRef(pause);
  const skipRef = useRef(skip);
  const seekRef = useRef(seek);
  const elapsedRef = useRef(elapsed);
  const durationRef = useRef(duration);

  useEffect(() => {
    resumeRef.current = resume;
    pauseRef.current = pause;
    skipRef.current = skip;
    seekRef.current = seek;
  }, [resume, pause, skip, seek]);

  useEffect(() => {
    wantPlaying.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    elapsedRef.current = elapsed;
    durationRef.current = duration;
  }, [elapsed, duration]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio(SILENT_WAV);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.01;
    silentRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      silentRef.current = null;
    };
  }, []);

  useEffect(() => {
    const silent = silentRef.current;
    if (!silent) return;
    if (isPlaying) {
      void silent.play().catch(() => undefined);
    } else {
      silent.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const keepPlaying = () => {
      if (!wantPlaying.current) return;
      resumeRef.current();
      void silentRef.current?.play().catch(() => undefined);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") keepPlaying();
    };
    const onPageHide = () => keepPlaying();
    const onFreeze = () => keepPlaying();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("freeze", onFreeze);

    let pulse: number | undefined;
    if (isPlaying) {
      pulse = window.setInterval(() => {
        if (document.visibilityState === "hidden" && wantPlaying.current) {
          keepPlaying();
        }
      }, 1500);
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("freeze", onFreeze);
      if (pulse) window.clearInterval(pulse);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!track || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    session.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: "Baithak",
      artwork: artworkFor(track),
    });
    session.playbackState = isPlaying ? "playing" : "paused";

    session.setActionHandler("play", () => resumeRef.current());
    session.setActionHandler("pause", () => pauseRef.current());
    session.setActionHandler("previoustrack", () => skipRef.current(-1));
    session.setActionHandler("nexttrack", () => skipRef.current(1));
    session.setActionHandler("seekbackward", (details) => {
      seekRef.current(Math.max(0, elapsedRef.current - (details.seekOffset ?? 10)));
    });
    session.setActionHandler("seekforward", (details) => {
      seekRef.current(elapsedRef.current + (details.seekOffset ?? 10));
    });
    session.setActionHandler("seekto", (details) => {
      if (typeof details.seekTime === "number") seekRef.current(details.seekTime);
    });

    return () => {
      session.setActionHandler("play", null);
      session.setActionHandler("pause", null);
      session.setActionHandler("previoustrack", null);
      session.setActionHandler("nexttrack", null);
      session.setActionHandler("seekbackward", null);
      session.setActionHandler("seekforward", null);
      session.setActionHandler("seekto", null);
    };
  }, [track, isPlaying]);

  useEffect(() => {
    if (!track || typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const length = duration > 0 ? duration : track.duration_sec;
    if (length <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration: length,
        playbackRate: 1,
        position: Math.min(elapsed, length),
      });
    } catch {
      // some browsers reject invalid position state
    }
  }, [track, duration, elapsed]);
}
