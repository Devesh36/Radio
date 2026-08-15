import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-4xl text-[var(--mist)]">Room not found</h1>
      <p className="mt-3 text-[var(--mist-dim)]">
        This door doesn&apos;t open anywhere yet.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[var(--amber)] px-6 py-3 font-semibold text-white"
      >
        Back to rooms
      </Link>
    </div>
  );
}
