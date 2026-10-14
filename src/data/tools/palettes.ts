/* ══ palettes.ts — named colour systems as artifacts ════════════════
   Original, hand-tuned palettes written for this catalog. Each one is
   a complete artifact: six working hex values, a live swatch demo with
   a radius control, and exact values baked into every prompt.        ═ */
import type { Tool } from "../../lib/tools/types";

/* [id, name, mood, useCase, avoidCase, bg, surface, ink, muted, accent, accentSoft] */
type P = [string, string, string, string, string, string, string, string, string, string, string];

const PALETTES: P[] = [
  ["pal-espresso-dark", "Espresso Console", "warm dark", "developer dashboards and reading apps that run late", "public-facing pages that must feel fresh and airy", "#1b1410", "#2a201a", "#f3e9dd", "#b39c88", "#e0913f", "#4a3526"],
  ["pal-cafe-light", "Café Light", "warm light", "bookings menus and small-business sites that should feel handwritten-warm", "high-density data tables where surfaces blur together", "#faf5ec", "#ffffff", "#2f2418", "#8a7a68", "#c96f3a", "#f2e3d0"],
  ["pal-ocean-deep", "Ocean Deep", "navy trust", "fintech and analytics products that need calm authority", "playful consumer apps - it reads corporate", "#0b1f33", "#14324a", "#eaf2f8", "#8fa9bd", "#38b6ff", "#1d4b6e"],
  ["pal-mint-ledger", "Mint Ledger", "fintech light", "savings, budgeting and health apps where green means good", "dark rooms and OLED-heavy UIs", "#f4faf7", "#ffffff", "#143024", "#6b8d7f", "#10a56c", "#d9efe4"],
  ["pal-sunset-studio", "Sunset Studio", "creative loud", "agency and portfolio pages that want warmth and volume", "long-form dashboards - the peach surfaces fatigue", "#fff5ec", "#ffe8d6", "#3a1f14", "#a4796a", "#ff6b4a", "#ffd9c2"],
  ["pal-orchid-night", "Orchid Night", "nightlife", "event, music and community pages after dark", "legal, medical or anything that needs institutional trust", "#160b1e", "#261533", "#f2e9fa", "#a58cb8", "#c56cff", "#3d2154"],
  ["pal-forest-print", "Forest Print", "ecological", "climate nonprofits, gardening and outdoor gear catalogs", "neon gaming aesthetics", "#f2f5ee", "#ffffff", "#1f2d1c", "#71836a", "#3e7d3a", "#dbe7d2"],
  ["pal-slate-atlas", "Slate Atlas", "cartographic", "map tools, telemetry and logistics consoles", "consumer shopping flows - it feels like infrastructure", "#10151c", "#1b232e", "#e6ecf3", "#8b9cb0", "#f4b942", "#2c3a4d"],
  ["pal-rose-ceramic", "Rose Ceramic", "boutique soft", "ceramics, skincare and small boutique storefronts", "data-dense admin panels", "#fdf4f3", "#f9e4e0", "#40202a", "#a07e84", "#d96b77", "#f6d3cd"],
  ["pal-indigo-lab", "Indigo Lab", "academic", "research tools, notebooks and scientific dashboards", "party or nightlife brands - too buttoned-up", "#f6f7fc", "#ffffff", "#1c2340", "#6f7694", "#4a5cd6", "#dde2f7"],
  ["pal-amber-workshop", "Amber Workshop", "maker dark", "hardware, tools and crafts sites that should smell like sawdust", "minimal luxury brands", "#1c1712", "#2b231b", "#f5ead8", "#b09a78", "#f2a541", "#443524"],
  ["pal-glacier-cool", "Glacier Cool", "clinical calm", "health, wellness and medical booking flows", "entertainment and games", "#f1f7fb", "#ffffff", "#17303f", "#6d8b9c", "#2f9ed0", "#d7ecf7"],
  ["pal-terracotta-table", "Terracotta Table", "appetite", "restaurants, recipes and food delivery pages", "corporate decks - it looks artisanal on purpose", "#fbf3ea", "#f4e2d1", "#3c2318", "#9c7a66", "#cf6a3c", "#efcdb2"],
  ["pal-midnight-docs", "Midnight Docs", "developer dark", "documentation sites and code-heavy product pages", "print-first content - dark inks waste paper", "#0d1117", "#161b22", "#e8edf3", "#8d97a5", "#58a6ff", "#21283b"],
  ["pal-paper-study", "Paper Study", "quiet reading", "essay sites, newsletters and anything text-first", "vibrant product launches", "#f7f4ee", "#fffdf8", "#26221c", "#857d70", "#b3552e", "#ece4d5"],
  ["pal-neon-grid", "Neon Grid", "arcade", "games, leaderboards and streaming overlays", "banking and health records", "#0a0e14", "#121a26", "#e9f1fb", "#7f93ab", "#35f2b1", "#1a2a3f"],
  ["pal-coral-summer", "Coral Summer", "getaway", "travel, events and summer campaign pages", "winter or somber institutional content", "#fff7f2", "#ffe3d3", "#40231c", "#a37e70", "#ff7a59", "#ffd0bb"],
  ["pal-plum-office", "Plum Office", "advisory", "law, consulting and advisory practices with some character", "youth brands - it wears a blazer", "#f7f4f8", "#ffffff", "#2a1e33", "#7c6b85", "#7b4fa6", "#e7dcf0"],
  ["pal-sand-dunes", "Sand Dunes", "photographic", "photography studios and travel journals", "fintech dashboards - too muted to signal urgency", "#f6efe3", "#efe3cf", "#33291c", "#8f8069", "#d8a24a", "#e8d7b4"],
  ["pal-steel-factory", "Steel Factory", "industrial", "B2B manufacturing, logistics and equipment catalogs", "luxury retail", "#f2f4f6", "#ffffff", "#20262c", "#727d87", "#d64545", "#e2e6ea"],
  ["pal-lagoon-fintech", "Lagoon Fintech", "teal money", "payments, wallets and crypto dashboards", "children's products - too slick", "#072a2e", "#0d3d43", "#e4f5f5", "#83b3b3", "#2ee6a8", "#14535c"],
  ["pal-bloom-wedding", "Bloom Wedding", "celebration", "weddings, invitations and gift shops", "tech documentation", "#fdf6f7", "#f9e8ee", "#43262f", "#a3818c", "#e07a9b", "#f3d5df"],
  ["pal-graphite-pro", "Graphite Pro", "monochrome", "portfolios and pro tools that let content be the color", "kids brands and festivals - zero playfulness", "#111112", "#1d1e20", "#f4f4f5", "#a1a1aa", "#f5f5f4", "#2c2d30"],
  ["pal-chalk-line", "Chalk Line", "classroom", "education, workshops and teaching materials", "luxury price points", "#232a25", "#2f3831", "#f2efe4", "#adb0a0", "#ffd166", "#3d4a3f"],
  ["pal-citrus-tech", "Citrus Tech", "devtool dark", "CLI tools, scaffolders and hacker-facing products", "medical and legal - too loud", "#111116", "#1b1b22", "#f6f7fb", "#a0a0b2", "#d6f446", "#26291f"],
  ["pal-cobalt-bank", "Cobalt Bank", "institutional blue", "banks, insurers and enterprise onboarding", "indie creative tools", "#f3f6fd", "#ffffff", "#10233f", "#5f7393", "#1f5eff", "#dbe6ff"],
  ["pal-cactus-mead", "Cactus Meadow", "outdoors", "hiking apps, parks and sustainability dashboards", "night-mode-first products", "#f5f2e8", "#ffffff", "#2c3324", "#7d8471", "#5f9e4f", "#e4e8d5"],
  ["pal-sapphire-noir", "Sapphire Noir", "luxury", "jewelry, watches and premium membership pages", "everyday utility apps", "#0a1226", "#142038", "#e9eefc", "#8394b8", "#d4af37", "#223052"],
  ["pal-apricot-press", "Apricot Press", "publishing", "indie publishers, zines and author sites", "corporate compliance training", "#fff8f0", "#ffe9d2", "#33231a", "#997a66", "#e2603b", "#f8d8b8"],
  ["pal-arctic-health", "Arctic Health", "clinical cool", "clinics, telehealth and lab results portals", "entertainment and games", "#f5fbfc", "#ffffff", "#1b3236", "#6f9096", "#19b5c4", "#d8f0f3"],
  ["pal-burgundy-archive", "Burgundy Archive", "heritage", "museums, archives and literary institutions", "crypto and hype brands", "#2a0d14", "#3c1520", "#f6e9dd", "#c19a93", "#e0b15e", "#55232f"],
  ["pal-matcha-dev", "Matcha Calm", "focus light", "productivity tools, journals and planning apps", "high-energy launch pages", "#f6f7f2", "#ffffff", "#2c3326", "#7f8a76", "#6aa84f", "#e3ecd8"],
  ["pal-voltage-purple", "Voltage Purple", "streaming", "music, AI products and streaming dashboards", "government and civic services", "#12081f", "#1e1033", "#f1e8ff", "#9d8bc0", "#8b5cf6", "#2d1b4d"],
  ["pal-linen-legal", "Linen Legal", "warm paper", "law firms, notaries and heritage craftsmanship", "Gen-Z consumer apps", "#faf7f0", "#ffffff", "#2b2620", "#8b8274", "#9c6b3f", "#efe6d4"],
];

const REL = ["hsl-color-system", "semantic-color-tokens", "accessible-contrast", "dark-mode-palette"];

function build(p: P): Tool {
  const [id, name, mood, useCase, avoidCase, bg, surface, ink, muted, accent, soft] = p;
  const dark = parseInt(bg.slice(1, 3), 16) < 96;
  const values = `background ${bg}, surfaces ${surface}, body text ${ink}, secondary text ${muted}, accent ${accent}, accent tint ${soft}`;
  const prompt = `Adopt this exact palette as the design tokens of the project: ${values}. Define them as CSS variables (--bg, --surface, --ink, --muted, --accent, --accent-soft) or the equivalent tokens in my config, and use the accent only for primary actions and highlights - never for body text. The palette should read "${mood}".`;
  return {
    id, name, category: "typography-colour", subcategory: "colour",
    aliases: [`${name} palette`, `${mood} color scheme`, `${mood} palette`],
    summary: `A ${mood} six-color system for ${useCase.toLowerCase()}.`,
    description: `Six values that cover a whole interface: ${bg} sits behind everything, ${surface} builds cards and inputs, ${ink} carries the text and ${muted} handles labels. ${accent} is reserved for the one thing you want clicked, softened by ${soft} for selected states and tints.${dark ? " As a dark palette, keep at least two steps between surface and background so depth reads." : ""}`,
    whenToUse: [`You want a decided system, not five minutes of picking hexes - ${useCase}`, "New projects where tokens should exist before components do"],
    whenNotToUse: [`A brand already has colours locked in - ${avoidCase.toLowerCase()} is a warning sign`, "Accessibility-critical flows you have not contrast-tested yet"],
    difficulty: "beginner",
    tags: ["palette", "tokens", mood.split(" ")[0], dark ? "dark" : "light"],
    controls: [{ id: "radius", label: "Corner radius", type: "slider", def: 14, min: 0, max: 28, step: 2, unit: "px" }],
    cssTemplate: `.demo-root { background: ${bg}; color: ${ink}; padding: 4px; }
.demo-root .pal-card {
  background: ${surface}; color: ${ink};
  border-radius: {radius}; padding: 18px;
  box-shadow: 0 18px 36px -20px rgba(0,0,0,.35);
  max-width: 320px;
}
.demo-root .pal-swatches { display: flex; gap: 8px; margin-bottom: 14px; }
.demo-root .pal-sw { width: 34px; height: 34px; border-radius: calc({radius} / 2); border: 1px solid rgba(128,128,128,.25); }
.demo-root .pal-t { margin: 0 0 6px; font-size: 17px; font-weight: 700; letter-spacing: -.01em; }
.demo-root .pal-p { margin: 0 0 12px; font-size: 12.5px; line-height: 1.55; color: ${muted}; }
.demo-root .pal-btn { background: ${accent}; color: ${dark ? "#101010" : "#ffffff"}; border-radius: calc({radius} / 2); padding: 8px 14px; font-size: 12.5px; font-weight: 700; display: inline-block; }
.demo-root .pal-chip { background: ${soft}; color: ${ink}; border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 600; margin-left: 8px; display: inline-block; }`,
    demoHtml: `<div class="pal-card">
  <div class="pal-swatches">
    <span class="pal-sw" style="background:${bg}"></span><span class="pal-sw" style="background:${surface}"></span><span class="pal-sw" style="background:${ink}"></span><span class="pal-sw" style="background:${muted}"></span><span class="pal-sw" style="background:${accent}"></span><span class="pal-sw" style="background:${soft}"></span>
  </div>
  <p class="pal-t">${name} <span class="pal-chip">${mood}</span></p>
  <p class="pal-p">Every surface, text and accent step in this card uses the palette's six values.</p>
  <span class="pal-btn">Primary action</span>
</div>`,
    prompts: {
      cursor: `You are working inside my repository; follow its conventions. ${prompt} Update the existing theme file in one pass and replace hard-coded colors in components with the new tokens.`,
      claude: `Think step by step, state assumptions, then do this. ${prompt} Then audit one representative page and list every place a hard-coded color should become a token.`,
      chatgpt: `Help me set this up and explain each choice in plain English. ${prompt} Also tell me what to check with a contrast tool before shipping.`,
      lovable: `Build this app with the following design tokens: ${values}. Use the accent only for primary actions. The mood: ${mood}.`,
      generic: `Set up a design-token system with these exact values: ${values}. Show the variable definitions, where each value is applied (page, card, text, label, action, selected state) and the mood it should convey: ${mood}.`,
    },
    mistakes: ["Painting body text with the accent - accents are for actions, not reading", "Shipping without contrast-checking ink on surface and muted on surface"],
    tips: ["Put all six values in CSS variables or config tokens on day one", dark ? "Reserve the accent for at most two elements per screen in dark UIs" : "In light UIs, lean on the soft tint for hover and selected states instead of new colors"],
    related: REL,
    learnMore: [{ label: "Generate a matching ramp", url: `https://mycolor.space/?hex=${accent.slice(1)}&sub=1` }],
  };
}

export const PALETTE_TOOLS: Tool[] = PALETTES.map(build);
