"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { BattleCandidate, BattleState, Track } from "@/lib/types";
import { isSlug } from "@/lib/validate";

interface RoomBattleProps {
  roomSlug: string;
  displayName: string;
  playlist: Track[];
  enabled: boolean;
}

export function RoomBattle({
  roomSlug,
  displayName,
  playlist,
  enabled,
}: RoomBattleProps) {
  const [battle, setBattle] = useState<BattleState | null>(null);
  const [showNominate, setShowNominate] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(window.matchMedia("(min-width: 640px)").matches);
  }, []);

  useEffect(() => {
    if (!enabled || !isSlug(roomSlug)) return;

    fetch(`/api/rooms/${roomSlug}/battle`)
      .then((r) => r.json())
      .then((data) => setBattle(data))
      .catch(() => undefined);

    const supabase = createBrowserSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel(`room:${roomSlug}:battle`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "battle_states",
          filter: `room_slug=eq.${roomSlug}`,
        },
        (payload) => {
          setBattle(payload.new as BattleState);
          setHasVoted(false);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomSlug, enabled]);

  const vote = async (side: "a" | "b") => {
    if (hasVoted) return;
    await fetch(`/api/rooms/${roomSlug}/battle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "vote", side, voter: displayName }),
    });
    setHasVoted(true);
  };

  const nominate = async (track: Track) => {
    await fetch(`/api/rooms/${roomSlug}/battle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "nominate",
        candidate: {
          youtubeId: track.youtubeId,
          title: track.title,
          artist: track.artist,
          votes: 0,
          nominatedBy: displayName,
        } satisfies BattleCandidate,
      }),
    });
    setShowNominate(false);
  };

  if (!enabled || !battle?.candidate_a || !battle?.candidate_b) return null;

  const total = battle.votes_a + battle.votes_b;
  const pctA = total > 0 ? Math.round((battle.votes_a / total) * 100) : 50;
  const pctB = 100 - pctA;

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="room-overlay room-battle panel-surface fixed left-3 z-30 max-w-[calc(100vw-6.5rem)] rounded-full px-4 py-2 text-left text-sm text-[var(--amber)] sm:left-1/2 sm:max-w-none sm:-translate-x-1/2"
      >
        Song Battle #{battle.round_number} — Tap to expand
      </button>
    );
  }

  return (
    <>
      <div className="room-overlay room-battle panel-surface fixed inset-x-3 z-30 rounded-2xl p-4 sm:inset-x-auto sm:left-1/2 sm:w-[min(92vw,420px)] sm:-translate-x-1/2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--amber)]">
            Song Battle #{battle.round_number}
          </span>
          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-[var(--mist-dim)] hover:text-[var(--mist)]"
          >
            Minimize
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            onClick={() => vote("a")}
            disabled={hasVoted}
            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-muted)] p-3 text-left transition hover:border-[var(--amber)] disabled:opacity-60"
          >
            <p className="truncate text-sm font-semibold text-[var(--mist)]">
              {battle.candidate_a.title}
            </p>
            <p className="truncate text-xs text-[var(--mist-dim)]">
              {battle.candidate_a.artist}
            </p>
            <p className="mt-2 text-xs text-[var(--amber)]">{pctA}% · {battle.votes_a} votes</p>
          </button>
          <button
            onClick={() => vote("b")}
            disabled={hasVoted}
            className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-muted)] p-3 text-left transition hover:border-[var(--amber)] disabled:opacity-60"
          >
            <p className="truncate text-sm font-semibold text-[var(--mist)]">
              {battle.candidate_b.title}
            </p>
            <p className="truncate text-xs text-[var(--mist-dim)]">
              {battle.candidate_b.artist}
            </p>
            <p className="mt-2 text-xs text-[var(--amber)]">{pctB}% · {battle.votes_b} votes</p>
          </button>
        </div>

        <button
          onClick={() => setShowNominate(true)}
          className="mt-3 w-full rounded-xl border border-dashed border-[var(--surface-border)] py-2 text-xs text-[var(--mist-dim)] hover:border-[var(--amber)] hover:text-[var(--amber)]"
        >
          Nominate track for next round
        </button>
      </div>

      {showNominate && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--overlay)] p-0 sm:items-center sm:p-4"
          onClick={() => setShowNominate(false)}
        >
          <div
            className="card-surface max-h-[min(80dvh,70vh)] w-full max-w-md overflow-y-auto rounded-t-3xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg text-[var(--mist)]">Nominate a track</h3>
            <ul className="mt-4 space-y-2">
              {playlist.map((track) => (
                <li key={track.youtubeId}>
                  <button
                    onClick={() => nominate(track)}
                    className="w-full rounded-lg border border-[var(--surface-border)] px-3 py-2 text-left text-sm hover:border-[var(--amber)]"
                  >
                    <span className="block truncate text-[var(--mist)]">{track.title}</span>
                    <span className="block truncate text-xs text-[var(--mist-dim)]">{track.artist}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
