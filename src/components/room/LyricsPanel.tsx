"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/lib/types";

interface LyricLine {
  time: number;
  text: string;
}

function parseLrc(synced: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const raw of synced.split("\n")) {
    const stamps = [...raw.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
    if (stamps.length === 0) continue;
    const text = raw.replace(/\[[^\]]*\]/g, "").trim();
    for (const stamp of stamps) {
      lines.push({ time: parseInt(stamp[1], 10) * 60 + parseFloat(stamp[2]), text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

/**
 * Left-to-right fill over the active line, timed to end when the next line
 * starts. Mounted fresh (keyed) each time the active line changes.
 */
function KaraokeLine({
  text,
  start,
  end,
  elapsed,
}: {
  text: string;
  start: number;
  end: number;
  elapsed: number;
}) {
  const [running, setRunning] = useState(false);
  // Capture once on mount: how far into the line we are, and time remaining.
  const initialProgress = useRef(
    Math.min(1, Math.max(0, (elapsed - start) / Math.max(0.5, end - start))),
  );
  const remaining = useRef(Math.max(0.3, end - elapsed));

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRunning(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  const startClip = (1 - initialProgress.current) * 100;

  return (
    <span className="relative block">
      <span className="block text-[#c9b8a8]/70">{text}</span>
      <span
        aria-hidden
        className="absolute inset-0 block text-[#f3e6d8]"
        style={{
          clipPath: running ? "inset(0 0% 0 0)" : `inset(0 ${startClip}% 0 0)`,
          transition: running ? `clip-path ${remaining.current}s linear` : "none",
          textShadow: "0 0 24px rgba(196,122,82,0.45)",
        }}
      >
        {text}
      </span>
    </span>
  );
}

interface LyricsState {
  status: "loading" | "none" | "ready";
  lines: LyricLine[];
  plain: string;
  credit: string;
}

const EMPTY: LyricsState = { status: "loading", lines: [], plain: "", credit: "" };

export function LyricsPanel({
  track,
  elapsed,
  onSeek,
  onClose,
}: {
  track: Track;
  elapsed: number;
  onSeek?: (seconds: number) => void;
  onClose: () => void;
}) {
  const [state, setState] = useState<LyricsState>(EMPTY);
  const activeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState(EMPTY);
    fetch(
      `/api/lyrics?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`,
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (!data || (!data.synced && !data.plain)) {
          setState({ ...EMPTY, status: "none" });
          return;
        }
        setState({
          status: "ready",
          lines: data.synced ? parseLrc(data.synced) : [],
          plain: data.plain ?? "",
          credit: [data.trackName, data.artistName].filter(Boolean).join(" — "),
        });
      })
      .catch(() => {
        if (!cancelled) setState({ ...EMPTY, status: "none" });
      });
    return () => {
      cancelled = true;
    };
  }, [track.youtubeId, track.title, track.artist]);

  const activeIndex = state.lines.reduce(
    (acc, line, index) => (line.time <= elapsed + 0.4 ? index : acc),
    -1,
  );

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIndex]);

  return (
    <div
      className="fixed inset-0 z-[92] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="lyrics-panel flex h-[min(85dvh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[#f3e6d814] sm:rounded-2xl"
        style={{ backgroundColor: "#161210" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#f3e6d814] px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-[#c47a52]">Lyrics</p>
            <h3 className="font-display truncate text-xl text-[#f3e6d8]">{track.title}</h3>
            <p className="truncate text-xs text-[#c9b8a8]">{track.artist}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full px-3 py-1 text-sm text-[#c9b8a8] hover:text-[#f3e6d8]"
          >
            Close
          </button>
        </div>

        <div className="song-scroll min-h-0 flex-1 overflow-y-auto px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
          {state.status === "loading" && (
            <p className="lyric-line-in text-sm text-[#c9b8a8]">Finding the words…</p>
          )}
          {state.status === "none" && (
            <p className="lyric-line-in text-sm text-[#c9b8a8]">
              No lyrics found for this one. Instrumentals keep their secrets.
            </p>
          )}
          {state.status === "ready" && state.lines.length > 0 && (
            <div className="space-y-4">
              {state.lines.map((line, index) => {
                const active = index === activeIndex;
                const isPast = activeIndex >= 0 && index < activeIndex;
                const distance =
                  activeIndex < 0 ? Math.min(index, 8) : Math.abs(index - activeIndex);
                const lineEnd = state.lines[index + 1]?.time ?? line.time + 6;
                return (
                  <button
                    key={`${line.time}-${index}`}
                    type="button"
                    ref={
                      active
                        ? (el: HTMLButtonElement | null) => void (activeRef.current = el)
                        : undefined
                    }
                    onClick={onSeek ? () => onSeek(line.time) : undefined}
                    className={`lyric-line-in block w-full text-left text-xl leading-snug sm:text-2xl ${
                      onSeek ? "" : "cursor-default"
                    } ${active ? "font-semibold" : "font-medium"}`}
                    style={{
                      animationDelay: `${Math.min(index * 45, 500)}ms`,
                      opacity: active ? 1 : isPast ? 0.25 : Math.max(0.25, 0.7 - distance * 0.09),
                      filter: active ? "none" : `blur(${Math.min(1.6, distance * 0.35)}px)`,
                      transform: active ? "scale(1.04)" : "scale(1)",
                      transformOrigin: "left center",
                      transition:
                        "opacity 0.5s ease, filter 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                      color: active ? undefined : "#c9b8a8",
                    }}
                  >
                    {active ? (
                      <KaraokeLine
                        text={line.text || "…"}
                        start={line.time}
                        end={lineEnd}
                        elapsed={elapsed}
                      />
                    ) : (
                      line.text || "…"
                    )}
                  </button>
                );
              })}
              <div className="h-24" aria-hidden />
            </div>
          )}
          {state.status === "ready" && state.lines.length === 0 && (
            <p className="lyric-line-in whitespace-pre-wrap text-base leading-relaxed text-[#e6d5c3]">
              {state.plain}
            </p>
          )}
        </div>

        {state.status === "ready" && (
          <p className="shrink-0 border-t border-[#f3e6d814] px-5 py-2 text-[10px] text-[#c9b8a8]/70">
            {state.credit ? `${state.credit} · ` : ""}Lyrics via LRCLIB
          </p>
        )}
      </div>
    </div>
  );
}
