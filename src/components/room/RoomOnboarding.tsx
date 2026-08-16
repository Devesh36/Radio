"use client";

import { useState } from "react";

function getInitialDisplayName(): string {
  if (typeof window === "undefined") return "";
  const saved = localStorage.getItem("baithak-username");
  return saved || `Guest-${Math.floor(Math.random() * 10000)}`;
}

interface RoomOnboardingProps {
  roomName: string;
  chatEnabled?: boolean;
  onComplete: (displayName: string) => void;
}

export function RoomOnboarding({ roomName, chatEnabled = false, onComplete }: RoomOnboardingProps) {
  const [displayName, setDisplayName] = useState(getInitialDisplayName);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      setError("At least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Max 20 characters");
      return;
    }
    if (!/^[a-zA-Z0-9\s\-_.]+$/.test(trimmed)) {
      setError("Letters, numbers, spaces only");
      return;
    }
    localStorage.setItem("baithak-username", trimmed);
    onComplete(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[min(92dvh,100%)] w-full max-w-md overflow-y-auto rounded-t-3xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-2xl sm:p-6"
        style={{ backgroundColor: "#161210", boxShadow: "0 24px 80px rgba(0,0,0,0.55)" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-[#c47a52]">
          Enter the room
        </p>
        <h2 className="font-display mt-2 text-xl text-[#f3e6d8] sm:text-2xl">{roomName}</h2>
        <p className="mt-2 text-sm text-[#c9b8a8]">
          {chatEnabled
            ? "Pick a display name for yourself — this is how you’ll show up in chat."
            : "Pick a display name for yourself."}
        </p>

        <label className="mt-6 block text-sm text-[#c9b8a8]">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="field-input mt-1"
          maxLength={20}
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-xl py-3 font-semibold text-white transition hover:brightness-105"
          style={{ backgroundColor: "#c47a52" }}
        >
          Step inside →
        </button>
      </form>
    </div>
  );
}
