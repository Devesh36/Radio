import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Caveat, DM_Sans, DM_Serif_Display } from "next/font/google";
import { brand } from "@/data/brand";
import "./globals.css";

const serif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const script = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: brand.name,
    description: brand.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0a09",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${serif.variable} ${body.variable} ${script.variable} h-full`}
      style={{ colorScheme: "dark", backgroundColor: "#0c0a09" }}
    >
      <body
        className="flex min-h-dvh flex-col overflow-x-hidden antialiased"
        style={{ backgroundColor: "#0c0a09", color: "#f3e6d8" }}
      >
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#c47a52",
              colorBackground: "#1f1a17",
              colorInputBackground: "#2a231e",
              colorText: "#f3e6d8",
              colorNeutral: "#f3e6d8",
              borderRadius: "0.75rem",
            } as Record<string, string>,
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
