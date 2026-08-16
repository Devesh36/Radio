"use client";

interface RoomPresenceProps {
  count: number;
}

export function RoomPresence({ count }: RoomPresenceProps) {
  return (
    <p className="truncate text-[10px] uppercase tracking-[0.16em] text-[#f3e6d8]/80 sm:text-[11px] sm:tracking-[0.18em]">
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500 align-middle" />
      {count} listening
    </p>
  );
}
