"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProTeaser } from "@/components/ProTeaser";
import { StudioFeatureGrid } from "@/components/StudioFeatureGrid";
import { MAX_CUSTOM_TRACKS, MIN_CUSTOM_TRACKS } from "@/lib/limits";

interface TrackInput {
  youtube_id: string;
  title: string;
  artist: string;
  duration_sec: number;
}

const STARTER_PLAYLIST = `mt9xg0mmt28 | Tum Se Hi | Mohit Chauhan | 258
N0jnLZxYwYc | Mujhse Mohabbat Ka Izhaar | Kumar Sanu, Alka Yagnik | 300
cNV5hLSa9H8 | Tujhe Dekha Toh | Lata Mangeshkar, Kumar Sanu | 303
SBfPs-PMGTA | Pehla Nasha | Udit Narayan, Sadhana Sargam | 258
OMoU0Pfibc4 | Tere Naam | Udit Narayan, Alka Yagnik | 282
3NWMK2MRqIk | Tumsa Koi Pyaara | Kumar Sanu, Alka Yagnik | 280`;

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

export default function StudioPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("my-baithak");
  const [title, setTitle] = useState("My Baithak");
  const [tagline, setTagline] = useState("Listen");
  const [backgroundUrl, setBackgroundUrl] = useState("/images/hero-kulhad.jpg");
  const [tracksText, setTracksText] = useState(STARTER_PLAYLIST);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingSlug, setExistingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rooms/custom")
      .then((r) => r.json())
      .then((data) => {
        const room = data.rooms?.[0];
        if (room?.slug) setExistingSlug(room.slug);
      })
      .catch(() => undefined);
  }, []);

  const parseTracks = (): TrackInput[] => {
    return tracksText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [youtube_id, titlePart, artistPart, durationPart] = line.split("|");
        return {
          youtube_id: youtube_id?.trim() ?? "",
          title: titlePart?.trim() || "Untitled",
          artist: artistPart?.trim() || "Unknown",
          duration_sec: parseInt(durationPart?.trim() || "240", 10) || 240,
        };
      })
      .filter((t) => t.youtube_id.length >= 6);
  };

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

    const tracks = parseTracks();
    if (tracks.length < MIN_CUSTOM_TRACKS || tracks.length > MAX_CUSTOM_TRACKS) {
      setError(`Add ${MIN_CUSTOM_TRACKS}–${MAX_CUSTOM_TRACKS} tracks (one per line), or click Use starter cassette.`);
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
          tracks,
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
          Create one personal nostalgia room with {MIN_CUSTOM_TRACKS}–{MAX_CUSTOM_TRACKS}{" "}
          YouTube tracks. Public rooms stay on a shared radio; yours comes with the
          full controls.
        </p>
        <ProTeaser className="mt-4" />

        <div className="mt-8">
          <StudioFeatureGrid />
        </div>

        {existingSlug ? (
          <div className="mt-10 rounded-2xl p-6" style={{ backgroundColor: "#1f1a17" }}>
            <p className="text-[#f3e6d8]">You already have a personal room.</p>
            <p className="mt-2 text-sm text-[#c9b8a8]">
              Each account can keep one room with up to {MAX_CUSTOM_TRACKS} songs.
              Delete it from My Rooms if you want to start over.
            </p>
            <ProTeaser className="mt-3" />
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/r/${existingSlug}`}
                className="rounded-full px-5 py-2.5 font-semibold text-white"
                style={{ backgroundColor: "#c47a52" }}
              >
                Enter your room
              </Link>
              <Link
                href="/my-rooms"
                className="rounded-full bg-[#161210] px-5 py-2.5 text-[#c9b8a8] hover:text-[#f3e6d8]"
              >
                Manage room
              </Link>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
          <Field label="Room URL slug" hint="e.g. my-dhaba-nights">
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
          <Field label="Background image URL">
            <input
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
              className="field-input"
              placeholder="/images/hero-kulhad.jpg"
            />
          </Field>
          <Field
            label={`Playlist (${MIN_CUSTOM_TRACKS}–${MAX_CUSTOM_TRACKS} tracks)`}
            hint="One per line: youtubeId | Title | Artist | duration_sec"
          >
            <textarea
              value={tracksText}
              onChange={(e) => setTracksText(e.target.value)}
              className="field-input min-h-[180px] font-mono text-sm sm:min-h-[200px]"
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
            {loading ? "Creating…" : "Create room →"}
          </button>
        </form>
        )}
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
