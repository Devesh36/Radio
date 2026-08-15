"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { ChatMessage } from "@/lib/types";
import { isSlug } from "@/lib/validate";

interface RoomChatProps {
  roomSlug: string;
  displayName: string;
  enabled: boolean;
}

export function RoomChat({ roomSlug, displayName, enabled }: RoomChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (!enabled || !isSlug(roomSlug)) return;
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    const channel = supabase.channel(`room:${roomSlug}:chat`);

    channel
      .on("broadcast", { event: "message" }, ({ payload }) => {
        const msg = payload as ChatMessage;
        if (!msg?.id || typeof msg.id !== "string" || msg.id.length > 80) return;
        if (typeof msg.displayName !== "string" || msg.displayName.length > 20) return;
        if (typeof msg.text !== "string" || !msg.text || msg.text.length > 500) return;
        setMessages((prev) => {
          if (prev.some((item) => item.id === msg.id)) return prev;
          return [...prev.slice(-99), msg];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomSlug, enabled]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 500 || !isSlug(roomSlug)) return;

    const supabase = createBrowserSupabase();
    if (!supabase) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      displayName,
      text: trimmed,
      createdAt: Date.now(),
      type: "user",
    };

    supabase.channel(`room:${roomSlug}:chat`).send({
      type: "broadcast",
      event: "message",
      payload: msg,
    });

    setMessages((prev) => {
      if (prev.some((item) => item.id === msg.id)) return prev;
      return [...prev.slice(-99), msg];
    });
    setText("");
  };

  if (!enabled) return null;

  const uniqueMessages = messages.filter(
    (msg, index) => messages.findIndex((item) => item.id === msg.id) === index,
  );

  return (
    <div
      className={`room-overlay fixed z-30 flex flex-col border border-[#f3e6d814] transition ${
        collapsed
          ? "right-3 h-12 w-auto overflow-hidden rounded-full sm:right-4 sm:w-80 sm:rounded-2xl"
          : "inset-x-3 h-[min(52dvh,24rem)] rounded-2xl sm:inset-x-auto sm:right-4 sm:h-[420px] sm:w-80"
      }`}
      style={{
        backgroundColor: "rgba(16, 12, 10, 0.9)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 px-4 sm:border-b sm:border-[#f3e6d814]">
        <span className="text-sm font-semibold text-[#f3e6d8]">
          {collapsed ? "Chat" : "Room chat"}
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs text-[#c9b8a8] hover:text-[#f3e6d8]"
        >
          {collapsed ? "Open" : "Minimize"}
        </button>
      </div>
      {!collapsed && (
        <>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-3">
            {uniqueMessages.length === 0 && (
              <p className="text-center text-xs text-[#c9b8a8]">
                Be the first to whisper into the atmosphere.
              </p>
            )}
            {uniqueMessages.map((msg) => (
              <div key={msg.id} className="rounded-lg bg-[#2a231e] px-3 py-2">
                <p className="text-[10px] font-bold text-[#c47a52]">{msg.displayName}</p>
                <p className="break-words text-sm text-[#f3e6d8]">{msg.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="border-t border-[#f3e6d814] p-3">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Say something…"
                className="field-input min-w-0 flex-1 py-2 text-sm"
                maxLength={500}
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg px-3 text-sm text-white"
                style={{ backgroundColor: "#c47a52" }}
              >
                Send
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
