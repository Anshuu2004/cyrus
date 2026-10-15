/* ══ assistant-demo.ts — offline replies for the AI assistant ═════
   Used whenever HF_TOKEN is missing or the router call fails, so
   the Co-pilot page and the builder coach are never dead ends. Same shape
   as a real answer, including the ```cyrus-plan block the builder
   can apply. Kept honest: it never pretends to be the Llama model. ═ */
import type { ChatMsg } from "./hf";

const norm = (s: string) => s.toLowerCase();

/* builder: which artifacts suit which stated need */
const PLANS: { test: RegExp; plan: Record<string, string>; why: string }[] = [
  {
    test: /dashboard|admin|analytics|internal tool|metrics/,
    plan: { style: "soft-flat", layout: "sidebar-app-shell", type: "type-scale", colour: "semantic-color-tokens", backend: "supabase-hosted-postgres", auth: "clerk-drop-in", hosting: "vercel-deploy" },
    why: "dashboards live or die on readable data type and a stable shell, so soft-flat + sidebar + semantic tokens first.",
  },
  {
    test: /portfolio|resume|personal|cv\b/,
    plan: { style: "editorial-serif", layout: "hero-section", type: "display-vs-body", colour: "hsl-color-system", hosting: "github-pages-static" },
    why: "a portfolio is a typography piece - editorial serif with a strong display/body split carries it.",
  },
  {
    test: /landing|marketing|saas|startup|pricing|launch/,
    plan: { style: "glassmorphism", layout: "landing-page-flow", type: "font-pairing", colour: "tailwind-color-tokens", backend: "nextjs-route-handlers", auth: "google-sign-in", hosting: "vercel-deploy" },
    why: "marketing flow: one hero, one pricing block, social sign-in at the door, deploy where the repo already lives.",
  },
  {
    test: /blog|content|docs|documentation|news/,
    plan: { style: "soft-flat", layout: "sidebar-app-shell", type: "reading-line-height", colour: "accessible-contrast", hosting: "cloudflare-pages" },
    why: "reading comfort is the product - line height and contrast before decoration.",
  },
  {
    test: /mobile|phone|app\b|pwa/,
    plan: { style: "soft-flat", layout: "bento-grid", type: "variable-fonts", colour: "dark-mode-palette", hosting: "vercel-deploy" },
    why: "bento grids survive narrow screens, and variable fonts keep the type scale honest when width changes.",
  },
  {
    test: /ai|llm|agent|chat|gpt|model/,
    plan: { style: "brutalism", layout: "hero-section", type: "font-pairing", backend: "rest-api-basics", hosting: "docker-one-command" },
    why: "AI products get boring fast - a plain API layer plus one loud hero is the honest scaffolding.",
  },
];

const FALLBACK_PLAN = {
  plan: { style: "glassmorphism", layout: "bento-grid", type: "font-pairing", colour: "hsl-color-system", backend: "supabase-hosted-postgres", auth: "magic-link-email", hosting: "vercel-deploy" },
  why: "no strong signal yet, so this is the safest all-round combination - swap any slot and I will re-tune.",
};

export function demoReply(mode: "assistant" | "builder", history: ChatMsg[]): string {
  const last = norm(history.filter((m) => m.role === "user").pop()?.content ?? "");

  if (mode === "builder") {
    const hit = PLANS.find((p) => p.test.test(last)) ?? FALLBACK_PLAN;
    return [
      `Here is a starter plan for that: ${hit.why}`,
      "",
      "The block below is machine-readable - apply it and tune any slot you like:",
      "",
      "```cyrus-plan",
      JSON.stringify({ slots: hit.plan }, null, 2),
      "```",
      "",
      "Two things worth adding yourself: one sentence about who the product is for, and your target AI tool (the prompt re-formats itself per tool).",
    ].join("\n");
  }

  if (/deadline|hackathon|when|calendar/.test(last)) {
    return "The hackathon calendar keeps every open window with a countdown - /hackathons lists them soonest first, and the dashboard's Deadlines page mirrors the ones you care about. Rolling programs stay open all year.";
  }
  if (/match|skill|which org|organization|find/.test(last)) {
    return "Use the org matcher on your dashboard: drop in your GitHub handle or resume and it scores every organization in the program archive against what you actually build with. The watchlist then tracks where each application stands.";
  }
  if (/prompt|artifact|builder|tools/.test(last)) {
    return "Artifacts are one-page tools with live demos and copy-paste prompts - /tools groups them by job. The master builder at /tools/builder assembles one combined prompt for Cursor, Claude or ChatGPT from the exact values you tuned.";
  }
  if (/api\b|apis|free api/.test(last)) {
    return "The API directory at /apis collects free, key-optional endpoints - weather, images, finance, fun data - each with a plain explanation and a copy-ready URL. Everything is listed without a signup wall.";
  }
  if (/sign.?in|account|login|email/.test(last)) {
    return "Sign in with Google, GitHub or an email code - all three are wired. Your board (saved projects, orgs, watchlist) lives in your browser first, and syncs to your account across devices when the backend is configured.";
  }
  if (/mentor/.test(last)) {
    return "The mentor finder caches mentor handles and contact channels straight from archived project pages - follow or watch an org and its people surface on your dashboard. Verify each channel on the org's community page before first contact.";
  }
  return [
    "I am Co-pilot, cyrus's one AI, running on an open-source Llama model when one is connected.",
    "",
    "Things you can ask me: which hackathon fits your stack, how the org matcher works, where to find free APIs, how to build a prompt for a specific AI tool, or how sign-in and sync behave.",
    "",
    "If you describe what you are building, I will point you at the exact pages and tools for it.",
  ].join("\n");
}
