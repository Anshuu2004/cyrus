/* ══ layout.tsx — root server layout: metadata, fonts, shell ═══════════ */
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import Shell from "@/components/Shell";
import { fmt, statsLine, STATS } from "@/lib/siteStats";
import { SITE_ORIGIN } from "@/lib/seo";
import "./globals.css";

const SITE = SITE_ORIGIN;

/* Self-hosted at build time by next/font: the CSS is inlined into the
 * bundle and the woff2 files ship from our own origin, so first paint
 * waits on no third-party round trip. The variables are what globals.css
 * binds --font-display, --font-sans and --font-mono to. Each weight list
 * mirrors, exactly, what the old Google Fonts URL asked for, so no element
 * on the site loses the face it rendered in before. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  title: {
    default: "cyrus.ai - find your open-source contribution",
    template: "%s · cyrus.ai",
  },
  description:
    `${statsLine()} - skills, Cursor rules, AGENTS.md configs and MCP servers ranked by stars, ${STATS.programs} tracked open-source programs with a timeline of every contribution window, and ${fmt(STATS.orgs)} organization profiles.`,
  keywords: ["open source", "GSoC", "NSOC", "hackathons", "AI agents", "MCP servers", "Cursor rules", "AGENTS.md", "agent skills"],
  openGraph: {
    type: "website",
    siteName: "cyrus.ai",
    title: "cyrus.ai - the developer-program platform",
    description: `${statsLine(new Date())} in one self-refreshing catalog.`,
    url: SITE,
  },
  twitter: { card: "summary_large_image", title: "cyrus.ai", description: "The developer-program platform." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  /* dark graphite is the default mode now, so the browser chrome follows
     it; a visitor who switches to light gets the cool paper on next paint. */
  themeColor: "#0e0f10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* dark is the default, so only an explicit stored "light" adds a class;
           this keeps the stored choice out of the first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("agenthub.theme");if(t&&JSON.parse(t)==="light")document.documentElement.classList.add("light");}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
