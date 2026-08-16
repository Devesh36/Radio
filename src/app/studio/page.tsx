"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProTeaser } from "@/components/ProTeaser";
import { StudioFeatureGrid } from "@/components/StudioFeatureGrid";
import { roomBackdrops } from "@/data/backdrops";
import { MAX_CUSTOM_TRACKS, MIN_CUSTOM_TRACKS } from "@/lib/limits";

const STARTER_PLAYLIST = `https://www.youtube.com/watch?v=mt9xg0mmt28
https://www.youtube.com/watch?v=N0jnLZxYwYc
https://www.youtube.com/watch?v=cNV5hLSa9H8
https://www.youtube.com/watch?v=SBfPs-PMGTA
https://www.youtube.com/watch?v=OMoU0Pfibc4
https://www.youtube.com/watch?v=3NWMK2MRqIk`;

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

function parseLinks(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, MAX_CUSTOM_TRACKS);
}

export default function StudioPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("my-baithak");
  const [title, setTitle] = useState("My Baithak");
  const [tagline, setTagline] = useState("Listen");
  const [backgroundUrl, setBackgroundUrl] = useState("/images/hero-kulhad.jpg");
  const [tracksText, setTracksText] = useState("https://www.youtube.com/watch?v=mt9xg0mmt28");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingSlug, setExistingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rooms/custom")
      .then((r) => r.json())
      .then((data) => {
        const room = data.rooms?.[0];
        if (!room?.slug) return;
        setExistingSlug(room.slug);
        setSlug(room.slug);
        if (room.title) setTitle(room.title);
        if (room.tagline) setTagline(room.tagline);
        if (room.background_url && roomBackdrops.some((item) => item.src === room.background_url)) {
          setBackgroundUrl(room.background_url);
        }
      })
      .catch(() => undefined);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanSlug = normalizeSlug(slug);
    setSlug(cleanSlug);

    if (!/^[a-z0-9-]{3,40}$/.test(cleanSlug)) {
      setError("Use a short URL like my-dhaba-nights (lowercase letters, numbers, dashes).");
      setLoading(false);
      return;
    }

    const links = parseLinks(tracksText);
    if (links.length < MIN_CUSTOM_TRACKS) {
      setError("Paste at least one YouTube, playlist, or Spotify link.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/rooms/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: cleanSlug,
          title: title.trim() || "Untitled room",
          tagline,
          background_url: backgroundUrl.trim() || "/images/hero-kulhad.jpg",
          links,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create room");
        return;
      }

      router.push(`/r/${data.room.slug}`);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-16 md:px-[5vw]">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c47a52]">
          Studio
        </span>
        <h1 className="font-display mt-2 text-3xl text-[#f3e6d8] sm:text-4xl">Build your room</h1>
        <p className="mt-3 text-[#c9b8a8]">
          Start with one YouTube link. Add more later inside the room, up to{" "}
          {MAX_CUSTOM_TRACKS} songs. Public rooms already let you skip and pick;
          yours adds your catalog, chat, and share.
        </p>
        <ProTeaser className="mt-4" />

        <div className="mt-8">
          <StudioFeatureGrid />
        </div>

        {existingSlug && (
          <p className="mt-10 text-sm text-[#c9b8a8]">
            Saving updates{" "}
            <Link href={`/r/${existingSlug}`} className="text-[#c47a52] hover:underline">
              /r/{existingSlug}
            </Link>
            . You can keep this URL.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
          <Field label="Room URL slug" hint="e.g. my-dhaba-nights. Yours to keep if you already have it.">
            <input
              value={slug}
              onChange={(e) => setSlug(normalizeSlug(e.target.value))}
              className="field-input"
              required
            />
          </Field>
          <Field label="Room title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field-input"
              required
            />
          </Field>
          <Field label="Tagline">
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="field-input"
            />
          </Field>
          <Field label="Backdrop" hint="Choose one of the room scenes.">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {roomBackdrops.map((item) => {
                const active = backgroundUrl === item.src;
                return (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => setBackgroundUrl(item.src)}
                    className="overflow-hidden rounded-xl"
                    style={{
                      outline: active ? "2px solid #c47a52" : "2px solid transparent",
                      outlineOffset: 2,
                    }}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <span
                      className="block h-14 bg-cover bg-center sm:h-16"
                      style={{ backgroundImage: `url("${item.src}")` }}
                    />
                  </button>
                );
              })}
            </div>
          </Field>
          <Field
            label={`Songs (${MIN_CUSTOM_TRACKS}–${MAX_CUSTOM_TRACKS})`}
            hint="One YouTube video, playlist, Spotify link, or song name per line."
          >
            <textarea
              value={tracksText}
              onChange={(e) => setTracksText(e.target.value)}
              className="field-input min-h-[140px] text-sm sm:min-h-[160px]"
              placeholder="https://www.youtube.com/watch?v=…"
              required
            />
            <button
              type="button"
              onClick={() => setTracksText(STARTER_PLAYLIST)}
              className="mt-2 text-xs text-[#c47a52] hover:underline"
            >
              Use starter cassette
            </button>
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "#c47a52" }}
          >
            {loading ? "Saving…" : existingSlug ? "Save room →" : "Create room →"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm text-[#c9b8a8]">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-[#c9b8a8]/70">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
