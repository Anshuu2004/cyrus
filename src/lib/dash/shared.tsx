/* ══ dash/shared.tsx — constants + pure helpers shared by every dashboard page ══
   No "use client" here on purpose: the /dashboard/[feature] route reads FEATURES
   during static-param generation, and this file is pure data + math anyway.  ══ */

export const W = "max-w-[1240px] mx-auto px-6";

export interface Watch { org: string; status: "researching" | "preparing" | "applied"; note: string }
export interface Profile { gh: string; skills: string[]; resume: string; done: boolean }

/* skill vocabulary we can honestly match against org tech tags */
export const SKILL_WORDS = ["python", "javascript", "typescript", "react", "vue", "svelte", "angular", "node", "golang", "go", "rust", "java", "kotlin", "swift", "c++", "c#", "ruby", "php", "django", "flask", "fastapi", "next", "tailwind", "sql", "postgres", "mongodb", "redis", "graphql", "machine learning", "deep learning", "nlp", "computer vision", "llm", "ai", "data science", "devops", "kubernetes", "docker", "cloud", "aws", "android", "ios", "flutter", "security", "web", "frontend", "backend", "full stack", "embedded", "blockchain", "bitcoin", "cli", "testing", "documentation", "design", "ux", "wasm", "api", "ml", "numpy", "pytorch", "tensorflow", "linux", "networking", "database", "compiler", "game", "graphics", "science", "education", "accessibility"];
export function extractSkills(text: string): string[] {
  const low = " " + text.toLowerCase().replace(/[^a-z0-9+#. -]/g, " ") + " ";
  const found = SKILL_WORDS.filter((w) => low.includes(w));
  const out: string[] = [];
  for (const f of found) if (!out.some((k) => k.includes(f) || f.includes(k))) out.push(f);
  return out.slice(0, 18);
}

/* program-archive row shape for matcher / mentors / compare */
export interface ARow { y: number; u: string; t: string; o: string; s: string; tt: string[]; tp: string[]; b: string; m: string; url?: string; program?: string }
export const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
export const YEARS_AGO = Math.max(1, Math.round((Date.now() - +new Date("2026-04-20")) / 864e5 / 7));

export const daysTo = (iso: string) => Math.ceil((+new Date(iso) - Date.now()) / 864e5);
export const greet = () => {
  const h = new Date().getHours();
  return h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 22 ? "Good evening" : "Late session";
};
export const dueTone = (d: number) => (d <= 7 ? "text-brick border-brick/30 bg-brick/8" : d <= 14 ? "text-honey border-honey/30 bg-honey/8" : "text-leaf border-leaf/30 bg-leaf/8");

export const DUELS: [string, string][] = [
  ["Reviewed 3 candidate skills before your last PR", "2h ago"],
  ["Ran the palette search across the catalog", "yesterday"],
  ["Compared forks vs open issues on two MCP servers", "2 days ago"],
  ["Opened the hackathon calendar for Q4 deadlines", "4 days ago"],
  ["Saved your first repo from the Agent Skills shelf", "last week"],
];

export const STATUS_CYCLE = ["researching", "preparing", "applied"] as const;
export const STATUS_CLS: Record<Watch["status"], string> = {
  researching: "text-cocoa border-line bg-cream",
  preparing: "text-honey border-honey/40 bg-honey/10",
  applied: "text-leaf border-leaf/40 bg-leaf/10",
};

/* every dashboard feature has its own page under /dashboard/<feature> */
export type FeatureId = "saved" | "orgs" | "matcher" | "watchlist" | "mentors" | "compare" | "artifacts" | "deadlines" | "reading" | "activity" | "stack";
export const FEATURES: { id: FeatureId; title: string; icon: string; desc: string }[] = [
  { id: "saved", title: "Saved projects", icon: "star", desc: "Every repo you starred, with catalog activity and one-tap cleanup." },
  { id: "orgs", title: "Saved organizations", icon: "building", desc: "The orgs you follow - their new catalog work feeds your digest." },
  { id: "matcher", title: "Org matcher", icon: "target", desc: "Your GitHub handle and skills scored against thousands of accepted projects." },
  { id: "watchlist", title: "Watchlist", icon: "eye", desc: "Researching, preparing, applied - a pipeline for every org you care about." },
  { id: "mentors", title: "Mentor finder", icon: "user", desc: "Mentor handles and contact channels harvested from archived project pages." },
  { id: "compare", title: "Compare orgs", icon: "scale", desc: "Two or three orgs side by side: stars, footprint, program years, tier." },
  { id: "artifacts", title: "Artifact favourites", icon: "gem", desc: "The design tools you saved, one click from their live demos." },
  { id: "deadlines", title: "Deadlines ahead", icon: "flag", desc: "Open hackathons and application windows, soonest first." },
  { id: "reading", title: "Reading list", icon: "book", desc: "Learning resources picked to match the stack you actually save." },
  { id: "activity", title: "Activity", icon: "pulse", desc: "What happened on your board, in order." },
  { id: "stack", title: "Working stack", icon: "code", desc: "Languages and topics derived from your saved shelf." },
];
export const featureBy = (id: string) => FEATURES.find((f) => f.id === id);

/* icon path library - every stroke icon in the dashboard */
export const DP: Record<string, string> = {
  grid: "M4 5.5h6.5V12H4zM13.5 5.5H20V10h-6.5zM13.5 13H20v5.5h-6.5zM4 15h6.5v3.5H4z",
  star: "M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.4l6.1-.8L12 3z",
  building: "M4 21V6.5L11 3.5V21M11 21h9V10l-9-2.8M7 9.5v.1M7 13v.1M7 16.5v.1M15 13v.1M15 16.5v.1",
  pulse: "M3 12h4l2.5-7 4 14L16 12h5",
  spark: "M12 4l1.7 4.9L18.6 10l-4.9 1.7L12 16.6l-1.7-4.9L5.4 10l4.9-1.4L12 4z",
  code: "M8.5 8L3.5 13l5 5M15.5 8l5 5-5 5M13.5 4.5l-3 17",
  plus: "M12 5v14M5 12h14",
  x: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  bookmark: "M7 4h10a1 1 0 0 1 1 1v15l-6-3.6L6 20V5a1 1 0 0 1 1-1z",
  gem: "M6 3h12l4 6-10 12L2 9Zm-4 6h20M9 3 6.5 9 12 21m3-18 2.5 6L12 21",
  flag: "M5 21V4l13 3.5L5 11",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 5.5v15",
  user: "M9 11.5a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4zM3 20.5c.7-3.1 3-5 6-5s5.3 1.9 6 5M16.2 5.2a3.2 3.2 0 0 1 0 6.1M18.5 15.8c1.9.8 3.1 2.4 3.6 4.7",
  scale: "M12 4v16M6 8h12M7 8l-3 5.5h6L7 8zM17 8l-3 5.5h6L17 8z",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z",
  check: "M4 12.5 10 18.5 20 6",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  home: "M4 11 12 4l8 7M6 9.5V20h12V9.5",
  settings: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM19.4 12a7.4 7.4 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-1.7-1L15 4.6h-4l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7.4 7.4 0 0 0 0 2l-2 1.5 2 3.4 2.3-1c.5.4 1.1.8 1.7 1l.3 2.5h4l.3-2.5c.6-.2 1.2-.6 1.7-1l2.3 1 2-3.4-2-1.5c.1-.3.1-.6.1-1z",
};

