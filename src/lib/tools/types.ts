/* ══ tools/artifacts domain types ═══════════════════════════════════
   The Artifacts section is 100% data-driven: every page you see under
   /tools is rendered from typed entries in src/data/tools/<category>.ts.
   Nothing here talks to the backend — the whole section is client-side,
   with favourites and recent prompts kept in localStorage. ════════ */

export type ToolCategoryId =
  | "ui-design"
  | "typography-colour"
  | "frontend"
  | "backend-data"
  | "auth-payments-security"
  | "deploy-launch"
  | "ai-prompting";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type PromptTarget = "cursor" | "claude" | "chatgpt" | "lovable" | "generic";

/* ── controls: one panel drives the demo, the code and every prompt ── */

export type ControlType = "color" | "slider" | "select" | "toggle";

export interface ControlOption {
  value: string;
  label: string;
}

export interface Control {
  id: string;                 // placeholder name used in templates, e.g. "blur"
  label: string;              // shown in the panel
  type: ControlType;
  def: string | number | boolean;
  min?: number;               // slider
  max?: number;               // slider
  step?: number;              // slider
  unit?: string;              // slider suffix appended to the value, e.g. "px"
  options?: ControlOption[];  // select
  onValue?: string;           // toggle: CSS value when on
  offValue?: string;          // toggle: CSS value when off
}

export type ControlValues = Record<string, string | number | boolean>;

/* ── the tool itself ═══════════════════════════════════════════════ */

export interface ToolSource { url: string; licence: string; author: string }

export interface Tool {
  id: string;
  name: string;
  category: ToolCategoryId;
  subcategory: string;        // subcategory id within the category
  aliases: string[];          // plain-English names, e.g. "frosted glass"
  summary: string;            // one line, used on cards and in meta descriptions
  description: string;        // 2-3 plain-English sentences
  whenToUse: string[];
  whenNotToUse: string[];
  difficulty: Difficulty;
  tags: string[];
  controls: Control[];        // empty for conceptual tools
  cssTemplate?: string;       // visual tools: CSS with {placeholder} tokens
  demoHtml?: string;          // sample markup shown inside the live demo
  codeSnippets?: Record<string, string>; // extra tabs, e.g. "Tailwind"
  prompts: Record<PromptTarget, string>; // same {placeholders} inside
  mistakes: string[];
  tips: string[];
  related: string[];          // tool ids
  learnMore: { label: string; url: string }[];
  source?: ToolSource;        // only MIT/CC0/CC-BY material, always attributed
}

/* ── category + subcategory registry ═══════════════════════════════ */

export interface Subcategory { id: string; label: string; blurb: string }

export interface ToolCategory {
  id: ToolCategoryId;
  label: string;
  blurb: string;
  icon: string;               // 24x24 stroke path, MenuIcon style
  subcategories: Subcategory[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: "ui-design", label: "UI design", icon: "M4 5h16v14H4zM4 10h16M9 10v9",
    blurb: "Styles, components, layouts, motion and effects explained in plain English.",
    subcategories: [
      { id: "styles", label: "Styles", blurb: "The overall look of a surface: glass, brutalism, neumorphism and friends." },
      { id: "components", label: "Components", blurb: "Cards, navbars, modals, tables and other building blocks." },
      { id: "layouts-and-pages", label: "Layouts & pages", blurb: "How a whole page is arranged: hero, bento, sidebar, landing." },
      { id: "motion", label: "Motion", blurb: "Transitions and animation that feel intentional, not decorative noise." },
      { id: "effects", label: "Effects", blurb: "Shadows, gradients, grain, glow - the finishing layer." },
    ],
  },
  {
    id: "typography-colour", label: "Typography & colour", icon: "M5 18 12 5l7 13M8 13h8",
    blurb: "Pick fonts and palettes without knowing the words designers use.",
    subcategories: [
      { id: "typography", label: "Typography", blurb: "Font pairing, scale, spacing and readability." },
      { id: "colour", label: "Colour", blurb: "Palettes, contrast, semantic colours and accessible combinations." },
    ],
  },
  {
    id: "frontend", label: "Frontend", icon: "m8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14",
    blurb: "The machinery of a web app: frameworks, data, forms, speed, accessibility.",
    subcategories: [
      { id: "frameworks", label: "Frameworks", blurb: "React, Next.js, Vue, Svelte - which one and why." },
      { id: "state-and-data", label: "State & data", blurb: "Keeping data around: local state, fetching, caching, stores." },
      { id: "forms", label: "Forms", blurb: "Inputs, validation and submission without misery." },
      { id: "performance", label: "Performance", blurb: "Make it load fast and stay smooth." },
      { id: "accessibility", label: "Accessibility", blurb: "Screens, keyboards and screen readers included." },
    ],
  },
  {
    id: "backend-data", label: "Backend & data", icon: "M12 4c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 6v7c0 1.7-3.6 3-8 3s-8-1.3-8-3V10m16 4c0 1.7-3.6 3-8 3s-8-1.3-8-3",
    blurb: "APIs, databases, storage and background jobs for AI-built apps.",
    subcategories: [
      { id: "apis", label: "APIs", blurb: "REST, tRPC, server actions - how your front talks to your back." },
      { id: "databases", label: "Databases", blurb: "Postgres, SQLite, Mongo, vectors - where the data lives." },
      { id: "storage", label: "Storage", blurb: "Files, images and uploads without managing a server." },
      { id: "jobs-and-webhooks", label: "Jobs & webhooks", blurb: "Work that happens after the request ends." },
    ],
  },
  {
    id: "auth-payments-security", label: "Auth, payments & security", icon: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5zm7 3v3",
    blurb: "Logins, checkout and not getting hacked, minus the jargon.",
    subcategories: [
      { id: "auth", label: "Auth", blurb: "Sign-in with Google, GitHub, magic links and sessions." },
      { id: "payments", label: "Payments", blurb: "Subscriptions and checkouts with Stripe and friends." },
      { id: "security", label: "Security", blurb: "Secrets, headers and the basics that stop most attacks." },
    ],
  },
  {
    id: "deploy-launch", label: "Deploy & launch", icon: "M12 19V8m-5 11h10M12 5 7 12h10L12 5Zm-4 3V4m8 4V4",
    blurb: "Getting your site live and found: hosting, pipelines, SEO, launch day.",
    subcategories: [
      { id: "hosting", label: "Hosting", blurb: "Where your app runs: Vercel, Netlify, Cloudflare, VPS." },
      { id: "ci-cd", label: "CI/CD", blurb: "Ship on every push without breaking things." },
      { id: "seo-analytics", label: "SEO & analytics", blurb: "Get found on Google and know who visited." },
      { id: "launch-checklist", label: "Launch checklist", blurb: "The pre-flight checks before you tell everyone." },
    ],
  },
  {
    id: "ai-prompting", label: "AI prompting", icon: "M12 3v3m0 12v3M3 12h3m12 0h3M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1m0-11.4-2.1 2.1m-7.2 7.2-2.1 2.1M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
    blurb: "Talk to coding AI so it gives you what you actually meant.",
    subcategories: [
      { id: "prompt-patterns", label: "Prompt patterns", blurb: "Roles, examples, step-by-step asks that get better output." },
      { id: "context-files", label: "Context files", blurb: "AGENTS.md, rules files and project memory for AI." },
      { id: "ai-features", label: "AI features", blurb: "Adding chat, search and generation to your own app." },
      { id: "model-picker", label: "Model picker", blurb: "Which model for which job, in plain tradeoff terms." },
    ],
  },
];

export const CATEGORY_IDS = TOOL_CATEGORIES.map((c) => c.id) as ToolCategoryId[];

export const findCategory = (id: string) => TOOL_CATEGORIES.find((c) => c.id === id);
export const findSubcategory = (catId: string, subId: string) =>
  findCategory(catId)?.subcategories.find((s) => s.id === subId);
