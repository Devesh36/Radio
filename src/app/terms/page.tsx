import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { brand } from "@/data/brand";
import { MAX_CUSTOM_ROOMS, MAX_CUSTOM_TRACKS, MIN_CUSTOM_TRACKS } from "@/lib/limits";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose-page mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-16 md:px-[5vw]">
        <h1>Terms of Service</h1>
        <p>Last updated: August 2026</p>
        <h2>What {brand.name} is</h2>
        <p>
          {brand.name} is a network of audio rooms for listening, sharing, and
          building community around Indian music and nostalgia.
        </p>
        <h2>Music and copyright</h2>
        <p>
          {brand.name} uses YouTube&apos;s embed API to play music. We do not host
          audio files. Copyright remains with respective owners. YouTube handles
          licensing for embedded content.
        </p>
        <h2>Room limits</h2>
        <ul>
          <li>Each account may create {MAX_CUSTOM_ROOMS === 1 ? "one personal room" : `up to ${MAX_CUSTOM_ROOMS} personal rooms`}.</li>
          <li>Rooms must contain {MIN_CUSTOM_TRACKS}–{MAX_CUSTOM_TRACKS} songs.</li>
          <li>Songs must be under 9 minutes.</li>
          <li>Tracks must be publicly available YouTube videos.</li>
          <li>Baithak Pro, when it launches, will allow more rooms and larger playlists.</li>
        </ul>
        <h2>Prohibited conduct</h2>
        <ul>
          <li>Harassment, spam, or abusive chat.</li>
          <li>Scraping or overloading our infrastructure.</li>
          <li>Impersonation or circumventing security.</li>
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
