import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { brand } from "@/data/brand";
import { ScrollToRooms } from "@/components/ScrollToRooms";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between gap-3 px-4 py-3 backdrop-blur-md sm:px-5 md:px-[5vw]"
      style={{
        backgroundColor: "rgba(12, 10, 9, 0.94)",
        paddingTop: "max(0.75rem, env(safe-area-inset-top))",
      }}
    >
      <Link href="/" className="font-display shrink-0 text-xl text-[#f3e6d8] no-underline sm:text-2xl">
        {brand.name.toLowerCase()}
        <span className="text-[#c47a52]">.</span>
      </Link>
      <nav className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 text-sm sm:gap-4">
        <ScrollToRooms className="hidden text-[#c9b8a8] transition hover:text-[#f3e6d8] sm:inline">
          Enter a room
        </ScrollToRooms>
        <Link
          href="/studio"
          className="rounded-full px-2.5 py-1.5 text-[#c47a52] transition hover:bg-[#c47a52]/10 sm:px-3"
          style={{ border: "1px solid #c47a52" }}
        >
          <span className="sm:hidden">Studio</span>
          <span className="hidden sm:inline">Build yours</span>
        </Link>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              className="rounded-full px-2.5 py-1.5 text-[#c9b8a8] transition hover:text-[#f3e6d8] sm:px-3"
              style={{ backgroundColor: "transparent" }}
            >
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              className="rounded-full px-2.5 py-1.5 text-white transition hover:brightness-110 sm:px-3"
              style={{ backgroundColor: "#c47a52" }}
            >
              Sign up
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link href="/my-rooms" className="px-1 text-[#c9b8a8] hover:text-[#f3e6d8]">
            <span className="sm:hidden">Rooms</span>
            <span className="hidden sm:inline">My Rooms</span>
          </Link>
          <UserButton />
        </Show>
      </nav>
    </header>
  );
}
