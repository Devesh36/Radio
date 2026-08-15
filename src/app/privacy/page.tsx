import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { brand } from "@/data/brand";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="prose-page mx-auto max-w-2xl px-4 py-10 sm:px-5 sm:py-16 md:px-[5vw]">
        <h1>Privacy Policy</h1>
        <p>Last updated: August 2026</p>
        <p>
          We built {brand.name} to be a place to listen, not a place to be watched.
        </p>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Account data.</strong> If you sign in, Clerk manages your
            account. We store your Clerk user ID to associate rooms you create.
          </li>
          <li>
            <strong>Room data.</strong> When you create a room, we store title,
            tagline, background URL, playlist (YouTube IDs), and settings.
          </li>
          <li>
            <strong>Display name.</strong> Stored in localStorage and sent via
            Realtime to other listeners. Not linked to your account.
          </li>
          <li>
            <strong>Chat.</strong> Ephemeral — broadcast in real-time, not stored
            long-term.
          </li>
        </ul>
        <h2>What we do not collect</h2>
        <ul>
          <li>We do not sell your data.</li>
          <li>We do not run advertising or build ad profiles.</li>
          <li>We do not store payment information.</li>
        </ul>
        <h2>Third-party services</h2>
        <p>
          Clerk handles authentication. YouTube provides music embeds and may set
          cookies per their policy. Supabase hosts our database and realtime
          infrastructure.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
