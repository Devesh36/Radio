"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PitchPage() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || user?.fullName || "Anonymous",
          email: email || user?.primaryEmailAddress?.emailAddress || "",
          message,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-5 sm:py-16 md:px-[5vw]">
        <h1 className="font-display text-3xl text-[var(--mist)] sm:text-4xl">Pitch a room</h1>
        <p className="mt-3 text-[var(--mist-dim)]">
          Describe a childhood setting that deserves its own audio room.
        </p>

        {status === "done" ? (
          <p className="mt-10 rounded-xl border border-[var(--amber-dim)] bg-[var(--amber)]/10 p-6 text-[var(--amber)]">
            Thanks! We received your pitch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field-input w-full"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input w-full"
              required
            />
            <textarea
              placeholder="What does this room sound like?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="field-input min-h-[160px] w-full"
              maxLength={2000}
              required
            />
            <p className="text-right text-xs text-[var(--mist-dim)]">
              {message.length}/2000
            </p>
            {status === "error" && (
              <p className="text-sm text-red-400">Could not submit. Try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-[var(--amber)] py-3 font-semibold text-white disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Submit pitch"}
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
