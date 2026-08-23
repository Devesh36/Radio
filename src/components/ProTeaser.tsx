import { MAX_CUSTOM_TRACKS } from "@/lib/limits";

export function ProTeaser({
  className = "",
  variant = "inline",
}: {
  className?: string;
  variant?: "inline" | "card";
}) {
  const badge = (
    <span
      className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#c47a52]"
      style={{ backgroundColor: "rgba(196,122,82,0.16)" }}
    >
      Pro · upcoming
    </span>
  );

  if (variant === "card") {
    return (
      <aside
        className={`rounded-2xl p-5 sm:p-6 ${className}`}
        style={{ backgroundColor: "#1f1a17", border: "1px solid rgba(196,122,82,0.22)" }}
      >
        {badge}
        <h2 className="font-display mt-3 text-2xl text-[#f3e6d8]">Want more rooms?</h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#c9b8a8]">
          Free accounts keep one personal room and {MAX_CUSTOM_TRACKS} songs.
          Radio Pro will unlock extra rooms and bigger playlists. Subscription
          is coming soon.
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#c47a52]">
          Subscribe · coming soon
        </p>
      </aside>
    );
  }

  return (
    <p className={`text-sm leading-relaxed text-[#c9b8a8] ${className}`}>
      <span className="mr-2 inline-block">{badge}</span>
      Want more rooms and more than {MAX_CUSTOM_TRACKS} songs? Subscribe to Radio
      Pro — coming soon.
    </p>
  );
}
