export const brand = {
  name: "Baithak",
  tagline: "A network of Indian nostalgia rooms",
  domain: "baithak.app",
  description:
    "Step into authentic spatial audio recreations of Indian nostalgia settings paired with iconic tracks.",
  emoji: "🎵",
} as const;

export const languages = {
  hindi: { code: "hi", label: "Hindi", native: "हिन्दी", badge: "हि" },
  tamil: { code: "ta", label: "Tamil", native: "தமிழ்", badge: "த" },
  telugu: { code: "te", label: "Telugu", native: "తెలుగు", badge: "తె" },
} as const;

export type LanguageKey = keyof typeof languages;
