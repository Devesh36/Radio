"use client";

import { useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-lg px-4 py-10 sm:px-5 sm:py-16 md:px-[5vw]">
        <h1 className="font-display text-3xl text-[var(--mist)] sm:text-4xl">Contact</h1>
        <p className="mt-3 text-[var(--mist-dim)]">
          Questions, feedback, or copyright concerns — reach out.
        </p>

        {sent ? (
          <p className="mt-10 text-[var(--amber)]">Message received. We&apos;ll be in touch.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <input placeholder="Name" className="field-input w-full" required />
            <input
              type="email"
              placeholder="Email"
              className="field-input w-full"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="field-input min-h-[140px] w-full"
              maxLength={2000}
              required
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[var(--amber)] py-3 font-semibold text-white"
            >
              Send message
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
