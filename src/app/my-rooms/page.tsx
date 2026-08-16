"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ProTeaser } from "@/components/ProTeaser";
import { MAX_CUSTOM_ROOMS, MAX_CUSTOM_TRACKS } from "@/lib/limits";
import { cssSafeUrl } from "@/lib/validate";

interface CustomRoomRow {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  background_url?: string | null;
  created_at: string;
  custom_tracks?: Array<{ id?: string; youtube_id?: string }>;
}

export default function MyRoomsPage() {
  const [rooms, setRooms] = useState<CustomRoomRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    fetch("/api/rooms/custom")
      .then((r) => r.json())
      .then((data) => setRooms(data.rooms ?? []))
      .finally(() => setLoading(false));
  }, []);

  const deleteRoom = async (id: string) => {
    if (!confirm("Delete this room permanently?")) return;
    setDeletingId(id);
    await fetch(`/api/rooms/custom/${id}`, { method: "DELETE" });
    setRooms((prev) => prev.filter((r) => r.id !== id));
    setDeletingId("");
  };

  const room = rooms[0];
  const songCount = room?.custom_tracks?.length ?? 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-5 sm:py-16 md:px-[5vw]">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c47a52]">Studio</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl text-[#f3e6d8] sm:text-4xl">My rooms</h1>
            <p className="mt-2 max-w-md text-[#c9b8a8]">
              Your private baithak — add and remove YouTube songs. Public rooms
              already let everyone skip and pick from the catalog.
            </p>
          </div>
          {!loading && !room && (
            <Link
              href="/studio"
              className="shrink-0 rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: "#c47a52" }}
            >
              Open Studio →
            </Link>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Rooms" value={`${rooms.length} / ${MAX_CUSTOM_ROOMS}`} />
          <Stat
            label="Songs"
            value={room ? `${songCount} / ${MAX_CUSTOM_TRACKS}` : `0 / ${MAX_CUSTOM_TRACKS}`}
          />
          <Stat label="Playback" value="You control it" className="col-span-2 sm:col-span-1" />
        </div>

        {loading && (
          <div
            className="mt-8 h-72 animate-pulse rounded-2xl"
            style={{ backgroundColor: "#1f1a17" }}
          />
        )}

        {!loading && !room && (
          <div
            className="mt-8 rounded-2xl border border-dashed px-6 py-14 text-center"
            style={{ borderColor: "rgba(243,230,216,0.12)" }}
          >
            <p className="font-display text-2xl text-[#f3e6d8]">No room yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#c9b8a8]">
              Build one personal nostalgia room with up to {MAX_CUSTOM_TRACKS} songs.
            </p>
            <Link
              href="/studio"
              className="mt-6 inline-block rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#c47a52" }}
            >
              Open Studio →
            </Link>
          </div>
        )}

        {!loading && room && (
          <article className="mt-8 overflow-hidden rounded-2xl" style={{ backgroundColor: "#1f1a17" }}>
            <div
              className="relative h-44 bg-cover bg-center sm:h-52"
              style={{
                backgroundImage: `url("${cssSafeUrl(room.background_url || "/images/hero-kulhad.jpg")}")`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f1a17] via-[#1f1a17]/35 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-[#0c0a09]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#c47a52]">
                Private
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <h2 className="font-display text-2xl text-[#f3e6d8] sm:text-3xl">{room.title}</h2>
              {room.tagline && <p className="mt-1 text-[#c9b8a8]">{room.tagline}</p>}
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#c9b8a8]">
                <span className="rounded-full bg-[#161210] px-3 py-1">/r/{room.slug}</span>
                <span className="rounded-full bg-[#161210] px-3 py-1">
                  {songCount} / {MAX_CUSTOM_TRACKS} songs
                </span>
                <span className="rounded-full bg-[#161210] px-3 py-1">Pick · skip · add</span>
              </div>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={`/r/${room.slug}`}
                  className="flex-1 rounded-xl py-3 text-center text-sm font-semibold text-white"
                  style={{ backgroundColor: "#c47a52" }}
                >
                  Enter room
                </Link>
                <button
                  onClick={() => deleteRoom(room.id)}
                  disabled={deletingId === room.id}
                  className="rounded-xl px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  style={{ border: "1px solid rgba(248,113,113,0.28)" }}
                >
                  {deletingId === room.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </article>
        )}

        <ProTeaser variant="card" className="mt-8" />
      </main>
      <SiteFooter />
    </>
  );
}

function Stat({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl px-4 py-3 ${className}`} style={{ backgroundColor: "#1f1a17" }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c47a52]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#f3e6d8]">{value}</p>
    </div>
  );
}
