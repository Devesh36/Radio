import { getOfficialRoom } from "@/data/rooms";
import { getRadioState } from "@/lib/radio";
import { createAdminSupabase } from "@/lib/supabase/server";
import { fsGetRoomBySlug, isMissingTableError } from "@/lib/custom-rooms-store";
import { sanitizeBackgroundUrl } from "@/lib/validate";
import type { LanguageKey } from "@/data/brand";
import type { CustomRoom, OfficialRoom, Track } from "@/lib/types";

function adaptCustomRoom(
  customRoom: CustomRoom,
  tracks: Array<{ youtube_id: string; title: string; artist?: string | null; duration_sec: number }>,
): OfficialRoom & { isCustom: true } {
  const catalogTracks: Track[] = tracks.map((t) => ({
    youtubeId: t.youtube_id,
    title: t.title,
    artist: t.artist ?? "Unknown",
    duration_sec: t.duration_sec,
  }));

  return {
    slug: customRoom.slug,
    name: customRoom.title,
    tagline: customRoom.tagline ?? "A personal nostalgia room.",
    emoji: "✨",
    accent: "#c47a52",
    gradientA: "#1a1208",
    gradientB: "#070504",
    imageUrl: sanitizeBackgroundUrl(customRoom.background_url ?? "/images/hero-kulhad.jpg"),
    ambienceIds: { default: "F74m01xL2D0" },
    radioEpoch: Number(customRoom.radio_epoch),
    catalogs: {
      hindi: catalogTracks,
      tamil: catalogTracks,
      telugu: catalogTracks,
    },
    chatEnabled: customRoom.chat_enabled,
    battleEnabled: customRoom.battle_enabled,
    isCustom: true,
  };
}

export async function resolveRoom(slug: string): Promise<{
  type: "official" | "custom";
  room: OfficialRoom | (OfficialRoom & { isCustom: true });
} | null> {
  const official = getOfficialRoom(slug);
  if (official) {
    return { type: "official", room: official };
  }

  const supabase = createAdminSupabase();
  if (supabase) {
    const { data: custom, error } = await supabase
      .from("custom_rooms")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && custom) {
      const { data: tracks } = await supabase
        .from("custom_tracks")
        .select("*")
        .eq("room_id", custom.id)
        .order("position");

      return {
        type: "custom",
        room: { ...adaptCustomRoom(custom as CustomRoom, tracks ?? []), isCustom: true },
      };
    }

    if (error && !isMissingTableError(error) && error.code !== "PGRST116") {
      return null;
    }
  }

  const stored = fsGetRoomBySlug(slug);
  if (!stored) return null;

  return {
    type: "custom",
    room: { ...adaptCustomRoom(stored, stored.custom_tracks), isCustom: true },
  };
}

export async function getRoomRadioEpoch(
  slug: string,
  language: LanguageKey,
  fallbackEpoch: number,
): Promise<number> {
  const supabase = createAdminSupabase();
  if (!supabase) return fallbackEpoch;

  const { data } = await supabase
    .from("radio_epochs")
    .select("epoch_ms")
    .eq("room_slug", slug)
    .eq("language", language)
    .maybeSingle();

  return data?.epoch_ms ?? fallbackEpoch;
}

export async function getNowPlaying(
  slug: string,
  language: LanguageKey,
): Promise<{
  track: Track;
  startedAt: number;
  offsetSec: number;
  playlist: Track[];
} | null> {
  const resolved = await resolveRoom(slug);
  if (!resolved) return null;

  const room = resolved.room;
  const playlist = room.catalogs[language] ?? room.catalogs.hindi;
  const epoch = await getRoomRadioEpoch(slug, language, room.radioEpoch);
  const state = getRadioState(playlist, epoch);

  if (!state) return null;

  return {
    ...state,
    playlist,
  };
}

export async function ensureBattleState(
  roomSlug: string,
  playlist: Track[],
): Promise<void> {
  const supabase = createAdminSupabase();
  if (!supabase || playlist.length < 2) return;

  const { data: existing } = await supabase
    .from("battle_states")
    .select("*")
    .eq("room_slug", roomSlug)
    .maybeSingle();

  if (existing?.candidate_a && existing?.candidate_b) return;

  const a = playlist[0];
  const b = playlist[1] ?? playlist[0];

  await supabase.from("battle_states").upsert({
    room_slug: roomSlug,
    round_number: 1,
    candidate_a: {
      youtubeId: a.youtubeId,
      title: a.title,
      artist: a.artist,
      votes: 0,
    },
    candidate_b: {
      youtubeId: b.youtubeId,
      title: b.title,
      artist: b.artist,
      votes: 0,
    },
    votes_a: 0,
    votes_b: 0,
    ends_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
}
