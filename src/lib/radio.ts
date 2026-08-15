import type { RadioState, Track } from "@/lib/types";

export function getTotalDuration(tracks: Track[]): number {
  return tracks.reduce((sum, track) => sum + track.duration_sec, 0);
}

export function getRadioState(
  tracks: Track[],
  epochMs: number,
  nowMs: number = Date.now(),
): RadioState | null {
  if (tracks.length === 0) return null;

  const totalDuration = getTotalDuration(tracks);
  if (totalDuration <= 0) return null;

  const elapsedTotal = Math.floor((nowMs - epochMs) / 1000);
  let elapsed = ((elapsedTotal % totalDuration) + totalDuration) % totalDuration;

  for (const track of tracks) {
    if (elapsed < track.duration_sec) {
      const startedAt = epochMs + (elapsedTotal - elapsed) * 1000;
      return {
        track,
        startedAt,
        offsetSec: elapsed,
      };
    }
    elapsed -= track.duration_sec;
  }

  const track = tracks[0];
  return {
    track,
    startedAt: epochMs + elapsedTotal * 1000,
    offsetSec: 0,
  };
}

export function getNextTrackIndex(tracks: Track[], currentYoutubeId: string): number {
  if (tracks.length === 0) return 0;
  const idx = tracks.findIndex((t) => t.youtubeId === currentYoutubeId);
  if (idx === -1) return 0;
  return (idx + 1) % tracks.length;
}
