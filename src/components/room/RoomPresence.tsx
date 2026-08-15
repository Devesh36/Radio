"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { LanguageKey } from "@/data/brand";
import type { PresenceMember } from "@/lib/types";
import { isSlug } from "@/lib/validate";

interface RoomPresenceProps {
  roomSlug: string;
  displayName: string;
  language: LanguageKey;
  enabled: boolean;
}

export function RoomPresence({
  roomSlug,
  displayName,
  language,
  enabled,
}: RoomPresenceProps) {
  const [count, setCount] = useState(1);
  const [members, setMembers] = useState<PresenceMember[]>([]);

  useEffect(() => {
    if (!enabled || !isSlug(roomSlug)) return;
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    const sessionId =
      sessionStorage.getItem("baithak-session-id") ??
      (() => {
        const id = crypto.randomUUID();
        sessionStorage.setItem("baithak-session-id", id);
        return id;
      })();

    const channel = supabase.channel(`room:${roomSlug}:presence`, {
      config: { presence: { key: sessionId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceMember>();
        const list = Object.values(state)
          .flat()
          .map((m) => ({
            sessionId: m.sessionId ?? sessionId,
            displayName: m.displayName ?? "Guest",
            language: m.language ?? "hindi",
          }));
        setMembers(list);
        setCount(list.length || 1);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            sessionId,
            displayName,
            language,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomSlug, displayName, language, enabled]);

  if (!enabled) return null;

  return (
    <p className="truncate text-[10px] uppercase tracking-[0.16em] text-[#f3e6d8]/80 sm:text-[11px] sm:tracking-[0.18em]">
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500 align-middle" />
      {count} listening
      <span className="hidden sm:inline">{members[0] ? ` · ${members[0].displayName}` : ""}</span>
    </p>
  );
}
