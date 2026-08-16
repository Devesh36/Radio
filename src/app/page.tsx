import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { RoomCard } from "@/components/RoomCard";
import { HomeLandingScroll, ScrollToRooms } from "@/components/ScrollToRooms";
import { ProTeaser } from "@/components/ProTeaser";
import { StudioFeatureGrid } from "@/components/StudioFeatureGrid";
import { officialRooms } from "@/data/rooms";

export default function HomePage() {
  const tickerItems = officialRooms.map((r) => r.name.split(" ").slice(-2).join(" "));

  return (
    <>
      <HomeLandingScroll />
      <SiteHeader />
      <main style={{ backgroundColor: "#0c0a09", color: "#f3e6d8" }}>
        <section
          className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden"
          style={{ backgroundColor: "#0c0a09" }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/hero-kulhad.jpg)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(12,10,9,0.88) 0%, rgba(12,10,9,0.62) 42%, rgba(12,10,9,0.18) 100%), linear-gradient(180deg, rgba(12,10,9,0.35) 0%, transparent 28%, rgba(12,10,9,0.55) 100%)",
            }}
          />
          <div className="relative z-10 flex min-h-[calc(100svh-4.5rem)] flex-col justify-center px-4 py-16 pb-20 sm:px-5 sm:py-20 md:px-[5vw]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c47a52] sm:text-xs sm:tracking-[0.25em]">
              Night radio · Kulhad steam · Open seats
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-[2.5rem] leading-[1.08] text-[#f3e6d8] sm:text-5xl md:text-7xl">
              Come sit.
              <br />
              The tape is still running.
            </h1>
            <p className="mt-5 max-w-xl text-base text-[#c9b8a8] sm:mt-6 sm:text-lg">
              Six rooms, each with its own night — rain on a tapri roof, a yellow
              booth, a Navratri circle. Pick a seat. The song is already on.
            </p>
            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
              <ScrollToRooms
                className="rounded-full px-6 py-3 text-center font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: "#c47a52" }}
              >
                Browse rooms ↓
              </ScrollToRooms>
              <Link
                href="/studio"
                className="rounded-full px-6 py-3 text-center text-[#f3e6d8] transition hover:border-[#c47a52]"
                style={{ border: "1px solid #c47a52", backgroundColor: "#1f1a17" }}
              >
                Make a room →
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-[#1f1a17]/90 py-3 backdrop-blur-sm">
            <div className="ticker-track flex w-max gap-8 whitespace-nowrap text-sm text-[#c9b8a8]">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i}>
                  {item} <span className="text-[#c47a52]">·</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="rooms-grid" className="px-4 py-14 sm:px-5 sm:py-20 md:px-[5vw]" style={{ backgroundColor: "#0c0a09" }}>
          <div className="mx-auto max-w-6xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c47a52]">
              Room catalog
            </span>
            <h2 className="font-display mt-2 text-3xl text-[#f3e6d8] sm:text-4xl md:text-5xl">
              Six nights, still on
            </h2>
            <p className="mt-3 max-w-xl text-[#c9b8a8]">
              Walk into any of them. Skip if you want. Someone else may already be
              listening in the same dark.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {officialRooms.map((room) => (
                <RoomCard key={room.slug} room={room} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-5 sm:py-20 md:px-[5vw]" style={{ backgroundColor: "#161210" }}>
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-lg">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c47a52]">
                  Studio
                </span>
                <h2 className="font-display mt-2 text-3xl text-[#f3e6d8] sm:text-4xl">Make it yours.</h2>
                <p className="mt-4 text-[#c9b8a8]">
                  Public rooms let everyone pick and skip their own song. Build
                  your own room to add YouTube tracks, chat, and share.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/studio"
                  className="rounded-full px-5 py-2.5 font-semibold text-white"
                  style={{ backgroundColor: "#c47a52" }}
                >
                  Open Studio →
                </Link>
                <Link
                  href="/my-rooms"
                  className="rounded-full bg-[#1f1a17] px-5 py-2.5 text-[#c9b8a8] hover:text-[#f3e6d8]"
                >
                  Manage my rooms
                </Link>
              </div>
            </div>
            <div className="mt-10">
              <StudioFeatureGrid className="lg:grid-cols-4" />
            </div>
            <ProTeaser className="mt-8" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
