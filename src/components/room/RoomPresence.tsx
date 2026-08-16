"use client";

interface RoomPresenceProps {
  count: number;
  isFull?: boolean;
}

export function RoomPresence({ count, isFull = false }: RoomPresenceProps) {
  if (isFull) {
    return (
      <p className="truncate text-[10px] uppercase tracking-[0.16em] text-[#e8b4a2] sm:text-[11px] sm:tracking-[0.18em]">
        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#c47a52] align-middle" />
        Capacity full
      </p>
    );
  }

  return (
    <p className="truncate text-[10px] uppercase tracking-[0.16em] text-[#f3e6d8]/80 sm:text-[11px] sm:tracking-[0.18em]">
      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-red-500 align-middle" />
      {count} listening
    </p>
  );
}

export function RoomCapacityBanner({ capacity }: { capacity: number }) {
  return (
    <div
      className="relative z-30 mx-4 mt-2 rounded-xl px-4 py-3 text-center sm:mx-auto sm:max-w-lg"
      style={{ backgroundColor: "rgba(22, 18, 16, 0.92)", border: "1px solid rgba(196, 122, 82, 0.35)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c47a52]">Capacity full</p>
      <p className="mt-1 text-sm text-[#f3e6d8]">
        All {capacity} live spots across Baithak are taken. Music still plays here — presence
        and chat will return when someone leaves.
      </p>
    </div>
  );
}
