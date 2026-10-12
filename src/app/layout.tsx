/* ══ layout.tsx — root server layout: metadata, fonts, shell ═══════════ */
import type { Metadata, Viewport } from "next";
import Shell from "@/components/Shell";
import PaletteLab from "@/components/PaletteLab";
import "./globals.css";

const SITE = "https://cyrus-agent.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "cyrus.ai - find your open-source contribution",
    template: "%s · cyrus.ai",
  },
  description:
    "Developer programs, organizations and 1,528 GitHub projects for AI coding agents - skills, Cursor rules, AGENTS.md configs and MCP servers, ranked by stars, with a timeline of every contribution window.",
  keywords: ["open source", "GSoC", "hackathons", "AI agents", "MCP servers", "Cursor rules", "AGENTS.md", "agent skills"],
  openGraph: {
    type: "website",
    siteName: "cyrus.ai",
    title: "cyrus.ai - the developer-program platform",
    description: "1,528 AI-agent repos, 6,682 open-source program projects and 161 live hackathons in one self-refreshing catalog.",
    url: SITE,
  },
  twitter: { card: "summary_large_image", title: "cyrus.ai", description: "The developer-program platform." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1a1f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* keep the stored theme out of the first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("agenthub.theme");if(t&&JSON.parse(t)==="dark")document.documentElement.classList.add("dark");}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Shell>{children}</Shell>
        <PaletteLab />
      </body>
    </html>
  );
}
