import Link from "next/link";
import { brand } from "@/data/brand";
import { ScrollToRooms } from "@/components/ScrollToRooms";

export function SiteFooter() {
  return (
    <footer
      className="px-4 py-10 sm:px-5 md:px-[5vw]"
      style={{ backgroundColor: "#161210", paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <Link href="/" className="font-display text-xl text-[#f3e6d8]">
            {brand.name.toLowerCase()}
            <span className="text-[#c47a52]">.</span>
          </Link>
          <p className="mt-2 max-w-sm text-sm text-[#c9b8a8]">
            Indian nostalgia audio rooms. Step inside.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#c9b8a8]">
          <Link href="/about" className="hover:text-[#c47a52]">
            About
          </Link>
          <Link href="/studio" className="hover:text-[#c47a52]">
            Studio
          </Link>
          <Link href="/my-rooms" className="hover:text-[#c47a52]">
            My Rooms
          </Link>
          <ScrollToRooms className="hover:text-[#c47a52]">
            Enter a room
          </ScrollToRooms>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#c9b8a8]">
          <Link href="/privacy" className="hover:text-[#c47a52]">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#c47a52]">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-[#c47a52]">
            Contact
          </Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-xs text-[#c9b8a8]">
        © {new Date().getFullYear()} {brand.name}. Made with chai
      </p>
    </footer>
  );
}
