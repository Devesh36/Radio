"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { LanguageKey } from "@/data/brand";
import type { PresenceMember, Track } from "@/lib/types";
import { LIVE_CAPACITY } from "@/lib/limits";
import { isSlug } from "@/lib/validate";

function sessionId() {
  const existing = sessionStorage.getItem("baithak-session-id");
  if (existing) return existing;
  const id = crypto.randomUUID();
  sessionStorage.setItem("baithak-session-id", id);
  return id;
}

function clip(value: string | undefined, max: number) {
  return (value ?? "").trim().slice(0, max);
}

function payload(
  id: string,
  displayName: string,
  language: LanguageKey,
  track: Track | null,
): PresenceMember {
  return {
    sessionId: id,
    displayName: clip(displayName, 20) || "Guest",
    language,
    online_at: new Date().toISOString(),
    trackTitle: clip(track?.title, 80),
    trackArtist: clip(track?.artist, 80),
    youtubeId: clip(track?.youtubeId, 11),
  };
}

function readMembers(
  state: Record<string, PresenceMember[] | PresenceMember | undefined>,
  fallbackId: string,
): PresenceMember[] {
  const seen = new Set<string>();
  const members: PresenceMember[] = [];
  for (const entry of Object.values(state)) {
    const list = Array.isArray(entry) ? entry : entry ? [entry] : [];
    for (const raw of list) {
      const id = clip(raw.sessionId, 80) || fallbackId;
      if (seen.has(id)) continue;
      seen.add(id);
      members.push({
        sessionId: id,
        displayName: clip(raw.displayName, 20) || "Guest",
        language: raw.language ?? "hindi",
        trackTitle: clip(raw.trackTitle, 80),
        trackArtist: clip(raw.trackArtist, 80),
        youtubeId: clip(raw.youtubeId, 11),
      });
    }
  }
  return members;
}

export function useRoomPresence({
  roomSlug,
  displayName,
  language,
  track,
  enabled,
}: {
  roomSlug: string;
  displayName: string;
  language: LanguageKey;
  track: Track | null;
  enabled: boolean;
}) {
  const [members, setMembers] = useState<PresenceMember[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const liveRef = useRef<RealtimeChannel | null>(null);
  const sessionRef = useRef("");
  const trackRef = useRef(track);

  useEffect(() => {
    trackRef.current = track;
  }, [track]);

  useEffect(() => {
    if (!enabled || !isSlug(roomSlug)) return;
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    const id = sessionId();
    sessionRef.current = id;

    const markFull = () => setIsFull(true);

    const channel = supabase.channel(`room:${roomSlug}:presence`, {
      config: { presence: { key: id } },
    });
    channelRef.current = channel;

    const live = supabase.channel("baithak:live", {
      config: { presence: { key: id } },
    });
    liveRef.current = live;

    channel
      .on("presence", { event: "sync" }, () => {
        setMembers(readMembers(channel.presenceState<PresenceMember>(), id));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track(payload(id, displayName, language, trackRef.current));
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") markFull();
      });

    live
      .on("presence", { event: "sync" }, () => {
        const n = Object.keys(live.presenceState()).length;
        setLiveCount(n);
        setIsFull(n >= LIVE_CAPACITY);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await live.track({ sessionId: id, room: roomSlug });
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") markFull();
      });

    return () => {
      channelRef.current = null;
      liveRef.current = null;
      supabase.removeChannel(channel);
      supabase.removeChannel(live);
    };
  }, [roomSlug, displayName, language, enabled]);

  useEffect(() => {
    const channel = channelRef.current;
    const id = sessionRef.current;
    if (!channel || !id) return;
    void channel.track(payload(id, displayName, language, track));
  }, [displayName, language, track?.youtubeId, track?.title, track?.artist]);

  return {
    count: members.length || (enabled && !isFull ? 1 : members.length),
    liveCount,
    capacity: LIVE_CAPACITY,
    isFull,
    members,
  };
}
