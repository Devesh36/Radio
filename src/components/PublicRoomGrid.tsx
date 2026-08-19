"use client";

import { officialRooms } from "@/data/rooms";
import { useLiveRoomCounts } from "@/hooks/useLiveRoomCounts";
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
  const ranked = officialRooms
    .map((room, index) => ({
      room,
      index,
      listeners: counts[room.slug] ?? 0,
    }))
    .sort(
      (a, b) =>
        b.listeners - a.listeners ||
        featuredRank(a.room.slug) - featuredRank(b.room.slug) ||
        a.index - b.index,
    );

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {ranked.map(({ room, listeners }) => (
        <RoomCard key={room.slug} room={room} listeners={listeners} />
      ))}
    </div>
  );
}
