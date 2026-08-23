"use client";

import { useEffect, useState } from "react";
import { officialRooms } from "@/data/rooms";
import { useLiveRoomCounts } from "@/hooks/useLiveRoomCounts";
import { getRadioState } from "@/lib/radio";
import { RoomCard } from "@/components/RoomCard";

/** Default homepage order when nobody is in the extra rooms. */
const FEATURED_SLUGS = [
  "chai-tapri",
  "truck-dhaba",
  "hostel-midnight",
  "std-booth",
  "night-bus",
  "baraat-street",
] as const;

function featuredRank(slug: string): number {
  const index = FEATURED_SLUGS.indexOf(slug as (typeof FEATURED_SLUGS)[number]);
  return index === -1 ? FEATURED_SLUGS.length : index;
}

export function PublicRoomGrid() {
  const counts = useLiveRoomCounts();
  // Set after mount so the server and client render the same initial HTML.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const tick = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(tick);
  }, []);

  const ranked = officialRooms
    .map((room, index) => ({
      room,
      index,
      listeners: counts[room.slug] ?? 0,
      nowPlaying: now ? getRadioState(room.catalogs.hindi, room.radioEpoch, now)?.track ?? null : null,
    }))
    .sort(
      (a, b) =>
        b.listeners - a.listeners ||
        featuredRank(a.room.slug) - featuredRank(b.room.slug) ||
        a.index - b.index,
    );

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ranked.map(({ room, listeners, nowPlaying }) => (
        <RoomCard key={room.slug} room={room} listeners={listeners} nowPlaying={nowPlaying} />
      ))}
    </div>
  );
}
