export const MAX_CUSTOM_ROOMS = 1;
export const MIN_CUSTOM_TRACKS = 1;
export const MAX_CUSTOM_TRACKS = 50;

/** Shared live-listener cap across every room (Supabase Free = 200, Pro = 500). */
export const LIVE_CAPACITY = Math.max(
  1,
  Number.parseInt(process.env.NEXT_PUBLIC_LIVE_CAPACITY ?? "200", 10) || 200,
);
