import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ScrollToRooms } from "@/components/ScrollToRooms";
import { brand } from "@/data/brand";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose-page mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-16 md:px-[5vw]">
        <h1>What is {brand.name}?</h1>
        <p>
          {brand.name} is a living audio space. We build rooms that recreate the
          feeling of specific places in 90s India — not as museums, but as nights
          you can actually sit inside and listen.
        </p>
        <h2>Why nostalgia rooms?</h2>
        <p>
          Memory is tied to sound more than any other sense. The crackle of a
          cassette, the ambient noise of a chai tapri, the distant dhol from a
          garba night — these sounds carry an entire world with them.
        </p>
        <h2>How it works</h2>
        <p>
          Step into a room and you&apos;ll hear the catalog with the room&apos;s
          ambient soundscape around it. Playback is yours — skip, seek, or pick
          a song without changing what anyone else hears. Private rooms add chat.
        </p>
        <p>
          We use YouTube for the music layer, spatial audio design for the ambience,
          and Supabase Realtime for live presence — so the rooms stay fast and
          always-on.
        </p>
        <ScrollToRooms className="mt-8 inline-block text-[var(--amber)]">
          Step into a room →
        </ScrollToRooms>
      </main>
      <SiteFooter />
    </>
  );
}
