import { studioFeatureGroups } from "@/data/studio-features";

export function StudioFeatureGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid gap-x-8 gap-y-8 rounded-2xl p-5 sm:grid-cols-2 sm:p-6 ${className}`}
      style={{ backgroundColor: "#1f1a17" }}
    >
      {studioFeatureGroups.map((group) => (
        <section key={group.label}>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c47a52]">
            {group.label}
          </p>
          <ul className="mt-3 space-y-3">
            {group.items.map((item) => (
              <li key={item.title}>
                <h3 className="text-sm font-semibold text-[#f3e6d8]">{item.title}</h3>
                <p className="mt-0.5 text-sm leading-snug text-[#c9b8a8]">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
