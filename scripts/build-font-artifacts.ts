/* ══ build-font-artifacts.ts ════════════════════════════════════════
   Generates src/data/tools/fonts.ts from the live Google Fonts
   metadata feed (fonts.google.com/metadata/fonts). Every font page is
   a real artifact: real weights, real line-height, designer credit,
   OFL licence, a live specimen demo and five tailored prompts.
   Re-run any time: npx tsx scripts/build-font-artifacts.ts          ═ */
import { writeFileSync } from "fs";

type Axis = { tag: string; min: number; max: number; defaultValue: number };
type Meta = {
  family: string; category: string; subsets: string[];
  fonts: Record<string, { lineHeight: number | null }>;
  axes: Axis[]; designers: string[]; dateAdded: string;
  popularity: number; isBrandFont: boolean; isOpenSource: boolean;
};

const PER_CAT: Record<string, number> = { "Sans Serif": 140, Serif: 70, Display: 55, Monospace: 15, Handwriting: 20 };
/* pairings: [display, body, vibe, when] - all validated against the feed */
const PAIRS: [string, string, string, string][] = [
  ["Playfair Display", "Source Sans 3", "editorial elegance", "magazine-style hero over calm, readable body text"],
  ["Fraunces", "Inter", "warm modern", "quirky display headings with a neutral workhorse body"],
  ["Space Grotesk", "IBM Plex Sans", "tech studio", "product and dev-tool pages that want a sharp but friendly voice"],
  ["DM Serif Display", "DM Sans", "gallery minimal", "large serif titles with quiet geometric body text"],
  ["Unbounded", "Manrope", "bold launch", "startup landings that need a loud headline and a tidy page"],
  ["Bricolage Grotesque", "Karla", "craft editorial", "portfolio and zine layouts with personality in the headings"],
  ["Instrument Serif", "Geist", "understated premium", "one-accent marketing pages with a literary touch"],
  ["Hubot Sans", "Figtree", "github-adjacent", "developer tools that want GitHub's newer sans vibes"],
  ["Big Shoulders", "Barlow", "american poster", "city guides, sports and industrial brands"],
  ["Caveat", "Nunito", "handwritten margin notes", "journals, teaching pages and friendly annotation call-outs"],
  ["Shantell Sans", "Work Sans", "playful maker", "community and kids products where headings can dance"],
  ["Walter Turncoat", "Karla", "school zine", "informal event flyers and camp handouts"],
  ["Onest", "Inter", "quiet corporate", "B2B sites that need a neutral sans with a little warmth"],
  ["Wix Madefor Display", "Wix Madefor Text", "web-tool coherent", "startup pages that want one friendly system"],
  ["Schibsted Grotesk", "Source Serif 4", "nordic news", "editorial products with a clean grotesk over a serious serif"],
  ["Syne", "Work Sans", "creative agency", "art-directed microsites where the heading is the design"],
  ["Newsreader", "Public Sans", "newsroom", "long-form articles and documentation with a print feel"],
  ["Poppins", "Inter", "rounded startup", "product pages that need approachability over edge"],
  ["Archivo Black", "Archivo", "poster punch", "brutalist blocks and big CTA pages built on one superfamily"],
  ["Cormorant Garamond", "Lato", "wedding stationery", "invitation, gallery and boutique pages that need air and thin serifs"],
  ["Sora", "Inter", "fintech calm", "dashboards and pricing pages with a geometric headline"],
  ["Outfit", "Nunito Sans", "friendly SaaS", "approachable product marketing with round, open letterforms"],
  ["Anton", "Roboto", "sports headline", "matchday pages, ticket shops and anything loud and condensed"],
  ["Libre Baskerville", "Open Sans", "classic blog", "personal essays and newsletters that read like a book"],
  ["Epilogue", "Figtree", "startup neutral", "clean B2B pages where the type should not get in the way"],
  ["Gabarito", "Public Sans", "rounded display", "playful event pages and community sites"],
  ["Anybody", "Space Grotesk", "variable flex", "experimental pages that stretch and squeeze their headlines"],
  ["Young Serif", "Plus Jakarta Sans", "warm editorial", "food, culture and lifestyle magazines on the web"],
  ["Gloock", "Nunito", "art nouveau heading", "poster-like section titles with a soft readable body"],
  ["Instrument Sans", "Newsreader", "reverse classic", "crisp UI with serif reading columns in between"],
  ["Darker Grotesque", "Karla", "tight and moody", "music, nightlife and dark-mode landing pages"],
  ["Bodoni Moda", "Jost", "high fashion", "lookbooks and boutique storefronts with dramatic thin/thick contrast"],
  ["Familjen Grotesk", "Lora", "scandinavian", "calm studio sites mixing a neutral grotesk with a warm serif"],
  ["Caprasimo", "Quicksand", "party type", "events, games and kids products that can be a little silly"],
  ["Kalam", "Nunito Sans", "handwritten note", "sidebars and call-outs that should feel written by a person"],
  ["Major Mono Display", "Space Grotesk", "terminal retro", "side-project and hacker-aesthetic pages"],
  ["Lora", "Inter", "reading default", "a safe, beautiful serif for article bodies with UI in Inter"],
  ["Merriweather", "Source Sans 3", "long-form trust", "documentation, terms pages and dense blogs"],
  ["Petrona", "Manrope", "latin warmth", "Spanish and Portuguese content sites with a human serif"],
  ["Rozha One", "Mukta", "dramatic condensed", "bold one-word heroes with an airy Devanagari-designed body"],
  ["Albert Sans", "Albert Sans", "one-family system", "minimal sites run entirely on one geometric grotesk"],
];

async function main() {
  const res = await fetch("https://fonts.google.com/metadata/fonts");
  if (!res.ok) throw new Error("metadata fetch failed: " + res.status);
  const json = (await res.json()) as { familyMetadataList: Meta[] };
  const all = json.familyMetadataList
    .filter((f) => !f.isBrandFont && f.isOpenSource && f.subsets.includes("latin"))
    .sort((a, b) => a.popularity - b.popularity);
  const byFam = new Map(all.map((f) => [f.family, f]));

  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const enc = (s: string) => s.replace(/ /g, "+");
  const used = new Set<string>();

  /* one artifact per selected family, top-N per category */
  const picked: Meta[] = [];
  for (const [cat, n] of Object.entries(PER_CAT)) {
    picked.push(...all.filter((f) => f.category === cat).slice(0, n));
  }

  const cssQuery = (f: Meta) => {
    const wght = f.axes.find((a) => a.tag === "wght");
    const keys = Object.keys(f.fonts).filter((k) => /^\d+$/.test(k)).map(Number).sort((a, b) => a - b);
    if (wght && keys.length > 1) return `:wght@${wght.min}..${wght.max}`;
    if (keys.length > 1) return `:wght@${keys.join(";")}`;
    return "";
  };

  const CAT_FALLBACK: Record<string, string> = {
    "Sans Serif": "system-ui, sans-serif", Serif: "Georgia, serif",
    Display: "system-ui, sans-serif", Monospace: "ui-monospace, monospace",
    Handwriting: "cursive",
  };

  const lines: string[] = [];
  for (const f of picked) {
    const id = `font-${slug(f.family)}`;
    if (used.has(id)) continue; used.add(id);
    const keys = Object.keys(f.fonts).filter((k) => /^\d+$/.test(k)).map(Number).sort((a, b) => a - b);
    const hasItalic = Object.keys(f.fonts).some((k) => k.endsWith("i"));
    const wght = f.axes.find((a) => a.tag === "wght");
    const lh = Object.values(f.fonts).map((v) => v.lineHeight).find((x): x is number => typeof x === "number") ?? 1.4;
    const designer = f.designers.join(", ") || "Google Fonts";
    const cred = f.designers.length > 1 ? `${f.designers.slice(0, 2).join(" and ")}${f.designers.length > 2 ? " et al." : ""}` : designer;
    const varNote = wght && keys.length > 1 ? ` It is a variable font: the weight axis runs from ${wght.min} to ${wght.max}, so one file covers every step.` : "";
    const wNote = keys.length > 1
      ? ` It ships ${keys.length} static weights (${keys.join(", ")})${hasItalic ? " with italics" : ""}.`
      : ` It ships a single ${keys[0] ?? 400} weight${hasItalic ? " plus italic" : " only"}.`;
    const cat = f.category === "Sans Serif" ? "sans" : f.category.toLowerCase();
    const year = f.dateAdded.slice(0, 4);
    const desc = `${f.family} is a ${cat} face from ${cred}, on Google Fonts since ${year}.${wNote}${varNote} Its own recommended line-height is about ${lh.toFixed(2)}, so give it slightly more air than your default if body copy looks cramped.`;
    const summary = `Use ${f.family} - ${cat === "sans" ? "a clean sans" : cat === "serif" ? "a readable serif" : cat === "display" ? "a display face for headlines" : cat === "mono" ? "a monospace for code and labels" : "a handwritten accent face"} - in your next build.`;
    const when = cat === "display"
      ? [`Headlines, posters and hero numbers where a loud ${cat} face is the point`, "One size, one job - display faces are seasoning, not the meal"]
      : cat === "handwriting"
      ? ["A single accent moment: a signature, a note, a caption - never whole paragraphs", "Invitations, journals and personal pages that should look written by hand"]
      : cat === "mono"
      ? ["Code blocks, terminals, tabular data and technical labels", `Pairing ${f.family} labels with a plain sans body`]
      : [`Body text and UI across a whole product, at ${keys.length > 1 ? "several weights" : "its single weight"}`, `${cat === "serif" ? "Long-form articles and reading columns" : "Dashboards, marketing pages and app UI"} that need ${cat === "serif" ? "a printed feel" : "quiet legibility"}`];
    const whenNot = cat === "display"
      ? ["Paragraphs and small UI - display cuts get unreadable below hero sizes", "Two display faces on one page; they fight"]
      : cat === "handwriting"
      ? ["Anything a screen reader user must parse: buttons, forms, nav", "Dense layouts - script faces need room to breathe"]
      : ["A page where the font choice is not allowed to matter (system fonts will do)", `As the only ${cat} face across 15 weights of UI - test at 13px first`];
    const prompt = `Use the Google Font "${f.family}" (${cat}, by ${cred}) in this project. Load it from https://fonts.googleapis.com/css2?family=${enc(f.family)}${cssQuery(f)}&display=swap, set the font stack "'${f.family}', ${CAT_FALLBACK[f.category] ?? "sans-serif"}", and use it for ${cat === "display" || cat === "handwriting" ? "headings and accents only, with a neutral body font underneath" : "body text, with clear weight steps for headings"}. Respect its natural line-height of about ${lh.toFixed(2)}. Keep weights to the ${wght ? `${wght.min}-${wght.max} variable axis` : `set it actually ships (${keys.join(", ") || "400"})`}.`;
    const T = (lead: string) => `${lead} ${prompt} Common mistake to avoid: ${cat === "display" || cat === "handwriting" ? "setting it at body sizes" : "loading every weight and italic you do not use"} - keep it to two weights and display=swap.`;
    const json = {
      id, name: f.family, category: "typography-colour" as const, subcategory: "typography",
      aliases: [`${f.family} font`, cat + " font", cred.toLowerCase()],
      summary, description: desc,
      whenToUse: when, whenNotToUse: whenNot,
      difficulty: "beginner" as const,
      tags: ["font", cat, ...(wght && keys.length > 1 ? ["variable"] : []), "google fonts"],
      controls: [
        { id: "size", label: "Size", type: "slider" as const, def: cat === "display" || cat === "handwriting" ? 44 : 30, min: 16, max: 72, step: 2, unit: "px" },
        { id: "weight", label: "Weight", type: "slider" as const, def: Math.min(Math.max(400, keys[0] ?? 400), keys[keys.length - 1] ?? 700), min: keys[0] ?? 100, max: keys[keys.length - 1] ?? 900, step: 100, unit: "" },
        { id: "tracking", label: "Letter spacing", type: "slider" as const, def: cat === "display" ? -1 : 0, min: -3, max: 4, step: 0.5, unit: "px" },
      ],
      cssTemplate: `@import url('https://fonts.googleapis.com/css2?family=${enc(f.family)}${cssQuery(f)}&display=swap');

.demo-root { background: #fbf7f1; color: #33261d; }
.demo-root .spec {
  font-family: '${f.family}', ${CAT_FALLBACK[f.category] ?? "sans-serif"};
  font-size: {size};
  font-weight: {weight};
  letter-spacing: {tracking};
  line-height: ${lh.toFixed(2)};
  margin: 0;
}`,
      demoHtml: `<p class="spec">Type the rainbow<br />0123456789<br />cyrus.ai</p>`,
      prompts: {
        cursor: T("You are working inside my repository; match its conventions."),
        claude: T("Think step by step, state assumptions, then write the code:"),
        chatgpt: T("Explain what you change as you go:"),
        lovable: "Build this app:",
        generic: T("Be explicit about every choice:"),
      },
      mistakes: [
        "Importing every weight and the italic \"just in case\" - each one is another download",
        `Forgetting the fallback stack - if ${f.family} fails, the page must degrade to ${CAT_FALLBACK[f.category] ?? "sans-serif"}`,
      ],
      tips: [
        "Always load with display=swap so text shows instantly in the fallback",
        `${cat === "display" || cat === "handwriting" ? "Use it for headings only" : "Test it at your smallest real size (13px UI text)"} before committing the whole site`,
      ],
      related: ["font-pairing", "variable-fonts", "reading-line-height"],
      learnMore: [
        { label: "Google Fonts specimen", url: `https://fonts.google.com/specimen/${enc(f.family)}` },
        { label: "CSS API request", url: `https://fonts.googleapis.com/css2?family=${enc(f.family)}${cssQuery(f)}&display=swap` },
      ],
      source: { url: `https://fonts.google.com/specimen/${enc(f.family)}`, licence: "SIL Open Font License 1.1", author: f.designers.join(", ") || "Google Fonts" },
    };
    lines.push(JSON.stringify(json));
  }

  /* font pairing artifacts, validated against the live feed */
  for (const [disp, body, vibe, use] of PAIRS) {
    const a = byFam.get(disp); const b = byFam.get(body);
    if (!a || !b) { console.log(`skip pair, not in feed: ${disp} + ${body}`); continue; }
    const id = `pair-${slug(disp)}-${slug(body)}`;
    if (used.has(id)) continue; used.add(id);
    const da = a.axes.find((x) => x.tag === "wght"); const db = b.axes.find((x) => x.tag === "wght");
    const qa = da ? `:wght@${da.min}..${da.max}` : ""; const qb = db ? `:wght@${db.min}..${db.max}` : "";
    const json = {
      id, name: `${disp} + ${body}`, category: "typography-colour" as const, subcategory: "typography",
      aliases: [`${vibe} fonts`, `${disp} with ${body}`, `${vibe} pairing`],
      summary: `A ${vibe} pairing: ${disp} for the loud parts, ${body} for everything people actually read.`,
      description: `${disp} (designed by ${a.designers[0] ?? "Google Fonts"}) brings the personality; ${body} (${b.designers[0] ?? "Google Fonts"}) keeps paragraphs comfortable. The trick with any pairing is contrast in shape but agreement in tone - this one reads ${vibe}.`,
      whenToUse: [`Pages that should feel ${vibe}: ${use}`, "Hero titles and section headings in the display face, body and UI in the text face"],
      whenNotToUse: ["When your brand already has a locked type system - do not mix two voices", "Never run both faces at the same sizes; one will look broken"],
      difficulty: "beginner" as const,
      tags: ["font", "pairing", "typography", vibe.replace(/ .*/, "")],
      controls: [
        { id: "headsize", label: "Heading size", type: "slider" as const, def: 46, min: 24, max: 84, step: 2, unit: "px" },
        { id: "bodysize", label: "Body size", type: "slider" as const, def: 17, min: 14, max: 22, step: 1, unit: "px" },
        { id: "headweight", label: "Heading weight", type: "slider" as const, def: 700, min: 400, max: (da?.max ?? 900), step: 100, unit: "" },
      ],
      cssTemplate: `@import url('https://fonts.googleapis.com/css2?family=${enc(disp)}${qa}&family=${enc(body)}${qb}&display=swap');

.demo-root { background: #fbf7f1; color: #33261d; }
.demo-root .pair-h {
  font-family: '${disp}', ${CAT_FALLBACK[a.category] ?? "sans-serif"};
  font-size: {headsize};
  font-weight: {headweight};
  line-height: 1.05;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}
.demo-root .pair-b {
  font-family: '${body}', ${CAT_FALLBACK[b.category] ?? "sans-serif"};
  font-size: {bodysize};
  font-weight: 400;
  line-height: ${(Object.values(b.fonts).map((v) => v.lineHeight).find((x): x is number => typeof x === "number") ?? 1.5).toFixed(2)};
  margin: 0;
  max-width: 52ch;
}`,
      demoHtml: `<div><h4 class="pair-h">Design that reads</h4><p class="pair-b">Good typography is invisible until it is wrong. This paragraph runs in the text face while the title takes the display cut - resize and feel where it breaks.</p></div>`,
      prompts: {
        cursor: `You are working inside my repository. Set up this exact font pairing: headings in '${disp}', body and UI in '${body}'. Load https://fonts.googleapis.com/css2?family=${enc(disp)}${qa}&family=${enc(body)}${qb}&display=swap once, define --font-display and --font-body variables, and apply the display face only at 24px and above. The pairing should feel ${vibe}.`,
        claude: `Think step by step, state assumptions, then implement. Pair '${disp}' (display) with '${body}' (text) across this site: shared CSS variables, display face on h1-h3 and big stats only, body face everywhere else, sensible fallback stacks. Target feel: ${vibe}.`,
        chatgpt: `Help me build this the way pair programming would, explaining each choice: use '${disp}' for headings and '${body}' for body text, load both from Google Fonts with display=swap, and show the CSS variables and one example section that proves the ${vibe} tone.`,
        lovable: `Build this app: typography pairing '${disp}' for headings with '${body}' for body text, ${vibe} tone, Google Fonts loaded once with display=swap.`,
        generic: `Build a typography system for this project. Display face: ${disp}. Text face: ${body}. Show the @import or link tag, the CSS variables, the size where the display face takes over, and the fallback stacks. The pairing should read ${vibe}.`,
      },
      mistakes: ["Using both faces for the same text size - pairing works by role, not decoration", "Loading the full weight range of both families on every page"],
      tips: ["Keep one set of CSS variables (--font-display, --font-body) and never hand-pick families in components", `Start the display face around 32px+; below that, ${disp} loses its charm`],
      related: ["font-pairing", `font-${slug(disp)}`, `font-${slug(body)}`],
      learnMore: [
        { label: `${disp} specimen`, url: `https://fonts.google.com/specimen/${enc(disp)}` },
        { label: `${body} specimen`, url: `https://fonts.google.com/specimen/${enc(body)}` },
      ],
      source: { url: `https://fonts.google.com/specimen/${enc(disp)}`, licence: "SIL Open Font License 1.1", author: [a.designers[0], b.designers[0]].filter(Boolean).join(" and ") || "Google Fonts" },
    };
    lines.push(JSON.stringify(json));
  }

  const ts = `/* ══ fonts.ts — real Google Fonts artifacts ═════════════════════════
   Generated by scripts/build-font-artifacts.ts from the public
   fonts.google.com/metadata/fonts feed. Every entry carries the
   family's real weights, designer and OFL licence. Regenerate with:
   npx tsx scripts/build-font-artifacts.ts. Do not hand-edit.     ═ */
import type { Tool } from "../../lib/tools/types";

export const FONT_TOOLS: Tool[] = [
${lines.join(",\n")}
];
`;
  writeFileSync("src/data/tools/fonts.ts", ts.replace(/,\n]/g, "\n]"));
  console.log(`fonts.ts: ${lines.length} artifacts (${picked.length} fonts + ${lines.length - picked.length} pairings)`);
}

void main();
