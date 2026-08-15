import Link from "next/link";
import type { OfficialRoom } from "@/lib/types";

export function RoomCard({ room }: { room: OfficialRoom }) {
  return (
    <Link
      href={`/r/${room.slug}`}
      className="group overflow-hidden rounded-2xl transition hover:-translate-y-1"
      style={{ backgroundColor: "#1f1a17" }}
    >
      <div
              className="relative h-40 bg-cover bg-center sm:h-44"
        style={{ backgroundImage: `url("${room.imageUrl}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/40 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#1f1a17]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#f3e6d8]">
          <span className="live-pulse inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
          Live
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl text-[#f3e6d8]">{room.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-[#c9b8a8]">{room.tagline}</p>
        <span className="mt-3 inline-block text-sm text-[#c47a52] group-hover:underline">
          Step inside ↗
        </span>
      </div>
    </Link>
  );
}
