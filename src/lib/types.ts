import type { LanguageKey } from "@/data/brand";

export interface Track {
  youtubeId: string;
  title: string;
  artist: string;
  duration_sec: number;
  cover?: string;
  added?: boolean;
}

export interface RadioState {
  track: Track;
  startedAt: number;
  offsetSec: number;
}

export interface OfficialRoom {
  slug: string;
  name: string;
  tagline: string;
  emoji: string;
  accent: string;
  gradientA: string;
  gradientB: string;
  imageUrl: string;
  /** Default ambience YouTube video ID per language override */
  ambienceIds: Partial<Record<LanguageKey, string>> & { default: string };
  /** Unix ms when the radio loop started */
  radioEpoch: number;
  catalogs: Record<LanguageKey, Track[]>;
  chatEnabled: boolean;
  battleEnabled: boolean;
  isCustom?: boolean;
}

export interface CustomRoom {
  id: string;
  clerk_user_id: string;
  slug: string;
  title: string;
  tagline: string | null;
  background_url: string | null;
  theme: string;
  chat_enabled: boolean;
  battle_enabled: boolean;
  radio_epoch: number;
  created_at: string;
}

export interface CustomTrack {
  id: string;
  room_id: string;
  youtube_id: string;
  title: string;
  artist: string | null;
  duration_sec: number;
  position: number;
}

export interface BattleCandidate {
  youtubeId: string;
  title: string;
  artist: string;
  votes: number;
  nominatedBy?: string;
}

export interface BattleState {
  room_slug: string;
  round_number: number;
  candidate_a: BattleCandidate | null;
  candidate_b: BattleCandidate | null;
  votes_a: number;
  votes_b: number;
  ends_at: string | null;
}

export interface ChatMessage {
  id: string;
  displayName: string;
  text: string;
  createdAt: number;
  type?: "user" | "system";
}

export interface PresenceMember {
  sessionId: string;
  displayName: string;
  language: LanguageKey;
  online_at?: string;
  trackTitle?: string;
  trackArtist?: string;
  youtubeId?: string;
}
