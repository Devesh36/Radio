"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

function countsFromPresence(state: Record<string, unknown>): Record<string, number> {
  const rooms = new Map<string, Set<string>>();

  for (const [key, entry] of Object.entries(state)) {
    const list = Array.isArray(entry) ? entry : entry ? [entry] : [];
    for (const raw of list) {
      if (!raw || typeof raw !== "object") continue;
      const row = raw as { room?: unknown; sessionId?: unknown };
      const room = typeof row.room === "string" ? row.room.trim() : "";
      if (!room) continue;
      const id = typeof row.sessionId === "string" && row.sessionId ? row.sessionId : key;
      const set = rooms.get(room) ?? new Set<string>();
      set.add(id);
      rooms.set(room, set);
    }
  }

  const counts: Record<string, number> = {};
  for (const [slug, people] of rooms) counts[slug] = people.size;
  return counts;
}

/** Listen-only: homepage visitors do not join the live cap. */
export function useLiveRoomCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    const channel = supabase.channel("baithak:live");
    channel.on("presence", { event: "sync" }, () => {
      setCounts(countsFromPresence(channel.presenceState()));
    });
    void channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return counts;
}
