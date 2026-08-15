"use client";

import { useState } from "react";
import { languages, type LanguageKey } from "@/data/brand";

function getInitialDisplayName(): string {
  if (typeof window === "undefined") return "";
  const saved = localStorage.getItem("baithak-username");
  return saved || `Guest-${Math.floor(Math.random() * 10000)}`;
}

function getInitialLanguage(): LanguageKey {
  if (typeof window === "undefined") return "hindi";
  const savedLang = localStorage.getItem("baithak-language") as LanguageKey | null;
  if (savedLang && savedLang in languages) return savedLang;
  return "hindi";
}

interface RoomOnboardingProps {
  roomName: string;
  showLanguage?: boolean;
  onComplete: (displayName: string, language: LanguageKey) => void;
}

export function RoomOnboarding({
  roomName,
  showLanguage = true,
  onComplete,
}: RoomOnboardingProps) {
  const [displayName, setDisplayName] = useState(getInitialDisplayName);
  const [language, setLanguage] = useState<LanguageKey>(
    showLanguage ? getInitialLanguage : "hindi",
  );
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
    if (showLanguage) {
      localStorage.setItem("baithak-language", language);
    }
    onComplete(trimmed, showLanguage ? language : "hindi");
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
          {showLanguage
            ? "Choose a display name and language. Put your headphones on."
            : "Choose a display name. Put your headphones on."}
        </p>

        <label className="mt-6 block text-sm text-[#c9b8a8]">Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="field-input mt-1"
          maxLength={20}
        />

        {showLanguage && (
          <>
            <p className="mt-4 text-sm text-[#c9b8a8]">Language — this picks the playlist</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(Object.keys(languages) as LanguageKey[]).map((key) => {
                const active = language === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLanguage(key)}
                    className="rounded-xl px-3 py-3 text-center transition"
                    style={
                      active
                        ? { backgroundColor: "rgba(196,122,82,0.18)", border: "1px solid #c47a52", color: "#c47a52" }
                        : { backgroundColor: "#1f1a17", border: "1px solid transparent", color: "#c9b8a8" }
                    }
                  >
                    <span className="block text-lg leading-none">{languages[key].native}</span>
                    <span className="mt-1 block text-[11px] uppercase tracking-wider">
                      {languages[key].label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-xl py-3 font-semibold text-white transition hover:brightness-105"
          style={{ backgroundColor: "#c47a52" }}
        >
          Step inside{showLanguage ? ` → ${languages[language].label}` : ""}
        </button>
      </form>
    </div>
  );
}
