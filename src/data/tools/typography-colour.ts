/* ══ typography-colour tools ══════════════════════════════════════════════════
   Original, plain-English entries. See src/lib/tools/types.ts for the
   contract and ui-design.ts (glassmorphism) for the reference shape. */
import type { Tool } from "../../lib/tools/types";

export const TYPOGRAPHY_COLOUR_TOOLS: Tool[] = [
  /* ────────────────────────── typography ────────────────────────── */
  {
    id: "font-pairing",
    name: "Font pairing",
    category: "typography-colour",
    subcategory: "typography",
    aliases: ["which fonts go together", "font combo", "typeface pairing", "headline and body font"],
    summary: "Pick one expressive font for titles and one quiet font for text.",
    description:
      "A pairing works when the two fonts are different enough to create contrast but share a similar skeleton. The easiest reliable recipe: a characterful display serif for headings plus a clean sans for body text. Load only the weights you actually use so the page stays fast.",
    whenToUse: [
      "Any page with headings and paragraphs - you need exactly two families, not six",
      "You want a mood (editorial, technical, friendly) without writing custom CSS",
      "Landing pages where the headline should carry personality",
    ],
    whenNotToUse: [
      "UI chrome inside apps - one neutral family (system-ui or Inter) is usually honest",
      "When the 'display' font hurts readability at small sizes",
      "More than two families on one page: it stops reading as design and starts reading as noise",
    ],
    difficulty: "beginner",
    tags: ["fonts", "google fonts", "css", "hero"],
    controls: [
      { id: "displayFont", label: "Display font", type: "select", def: "Fraunces", options: [
        { value: "Fraunces", label: "Fraunces (warm serif)" },
        { value: "Newsreader", label: "Newsreader (editorial serif)" },
        { value: "Syne", label: "Syne (quirky geometric)" },
        { value: "Archivo", label: "Archivo (bold grotesque)" },
        { value: "Unbounded", label: "Unbounded (wide futuristic)" },
      ] },
      { id: "bodyFont", label: "Body font", type: "select", def: "Inter", options: [
        { value: "Inter", label: "Inter (neutral workhorse)" },
        { value: "Manrope", label: "Manrope (soft geometric)" },
        { value: "Lora", label: "Lora (readable serif)" },
        { value: "Figtree", label: "Figtree (friendly grotesque)" },
        { value: "Sora", label: "Sora (technical sans)" },
      ] },
      { id: "heading", label: "Heading size", type: "slider", def: 32, min: 22, max: 52, step: 2, unit: "px" },
      { id: "bg", label: "Page colour", type: "color", def: "#f7f2ea" },
      { id: "text", label: "Text colour", type: "color", def: "#241b12" },
    ],
    cssTemplate: `@import url("https://fonts.googleapis.com/css2?family={displayFont}:wght@500;700&family={bodyFont}:wght@400;500&display=swap");

.demo-root {
  background: {bg};
  color: {text};
  font-family: "{bodyFont}", system-ui, sans-serif; /* quiet workhorse */
}
.demo-root .fp-eyebrow {
  font-family: "{bodyFont}", system-ui, sans-serif;
  font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase;
  opacity: .55;
}
.demo-root .fp-head {
  font-family: "{displayFont}", Georgia, serif; /* expressive voice */
  font-weight: 700;
  font-size: {heading};
  line-height: 1.08;
  letter-spacing: -0.015em;
  margin: 8px 0 10px;
}
.demo-root .fp-body { font-size: 14px; line-height: 1.65; max-width: 46ch; margin: 0 0 14px; opacity: .85; }
.demo-root .fp-btn {
  display: inline-block; font-family: "{bodyFont}", sans-serif; font-weight: 500; font-size: 13px;
  padding: 9px 16px; border-radius: 999px; background: {text}; color: {bg};
}`,
    demoHtml: `<div style="max-width:440px">
  <div class="fp-eyebrow">Live preview</div>
  <h3 class="fp-head">Type with a point of view</h3>
  <p class="fp-body">The display font speaks; the body font serves. Swap either select above and watch the relationship between headline and paragraph change - that contrast is the whole trick.</p>
  <span class="fp-btn">Start a project</span>
</div>`,
    codeSnippets: {
      "@font-face alternative": `/* Self-hosted, no external request: download the woff2 files first. */
@font-face {
  font-family: "{displayFont}";
  src: url("/fonts/{displayFont}-bold.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
}`,
      "Tailwind v4": `@theme {
  --font-display: "{displayFont}", Georgia, serif;
  --font-sans: "{bodyFont}", system-ui, sans-serif;
}
/* then: <h1 class="font-display"> and body inherits font-sans */`,
    },
    prompts: {
      cursor: `# Font pairing for this project

Use exactly these two families - do not substitute your own favourites:
- display: "{displayFont}" for headings, weight 700, size {heading}, letter-spacing -0.015em
- body: "{bodyFont}" for everything else, weights 400/500, line-height 1.65
- palette: page {bg}, text {text}
Load them from Google Fonts with an @import or link tag using only the weights above, with display=swap.
Add --font-display and --font-sans variables (or the repo's equivalent tokens) and apply them to headings vs body copy.`,
      claude: `Act as a typography-aware front-end developer.

Set up a two-font system on this page:
- headings: "{displayFont}" (700, {heading}, tight tracking)
- body/UI: "{bodyFont}" (400/500, line-height 1.65)
- colours: background {bg}, text {text}

Requirements: load from Google Fonts with display=swap and only the weights used, expose both as CSS variables, and show a heading + paragraph + button so the pairing is visible. Explain in one short paragraph why this pair works (contrast of roles, similarity of skeleton).`,
      chatgpt: `Write the HTML and CSS for a small landing-page block that pairs "{displayFont}" (headings, weight 700, size {heading}) with "{bodyFont}" (body, line-height 1.65) on a {bg} background with {text} text. Include the Google Fonts <link> with only the needed weights and display=swap. Comment each choice briefly.`,
      lovable: `{bg} page, {text} text. Headlines in "{displayFont}" bold at {heading}, body and buttons in "{bodyFont}". Editorial, calm, premium. One hero block: eyebrow, large headline, short paragraph, pill button.`,
      generic: `Create a typography setup pairing the display font "{displayFont}" (headings, 700, {heading}) with the body font "{bodyFont}" (400/500, 1.65 line-height), colours {bg}/{text}. Load via Google Fonts with display=swap, expose as CSS variables, apply to a heading, paragraph and button example.`,
    },
    mistakes: [
      "Pairing two fonts that are almost identical - no contrast, it looks like an accident",
      "Loading every weight 'just in case': 6 weights x 2 fonts is often 400KB of downloads",
      "Using the display font for body copy because it 'looks nice' - test at 14px first",
      "Skipping fallbacks: always write font-family: \"{displayFont}\", Georgia, serif so the page works while fonts load",
    ],
    tips: [
      "Change the role, not the genre: expressive serif + neutral sans almost always works",
      "Two weights of the body font (400 + 500/600) is enough for a whole site",
      "letter-spacing: -0.01 to -0.02em on big display type tightens gaps the size exposes",
      "font-display: swap stops invisible text ('FOIT') while the font downloads",
    ],
    related: ["display-vs-body", "type-scale", "variable-fonts", "hero-section"],
    learnMore: [
      { label: "Google Fonts: getting started", url: "https://developers.google.com/fonts/docs/getting_started" },
      { label: "MDN: font-display", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display" },
      { label: "web.dev: font loading strategies", url: "https://web.dev/articles/font-best-practices" },
    ],
  },
  {
    id: "type-scale",
    name: "Type scale",
    category: "typography-colour",
    subcategory: "typography",
    aliases: ["heading sizes", "modular scale", "font size system", "how big should h1 be"],
    summary: "A fixed set of sizes for every heading, so your page never looks random.",
    description:
      "Instead of choosing sizes by eye, multiply a base size (usually 16px) by one ratio to get every step: body is 1x, small heading 1.25x, next 1.56x, and so on. A smaller ratio (1.125) feels calm and app-like; a big one (1.5) feels editorial and loud. The ratio, not the sizes, is the decision.",
    whenToUse: [
      "Any page with more than two heading levels",
      "When your design looks 'almost right' but sizes feel inconsistent",
      "Setting up tokens/CSS variables before writing component CSS",
    ],
    whenNotToUse: [
      "Single-screen pages with one heading - overkill",
      "Dense dashboards where a large ratio wastes vertical space; keep it at 1.125 or less",
      "As an excuse for huge hero text on mobile - cap your top step with clamp()",
    ],
    difficulty: "beginner",
    tags: ["css", "typography", "tokens", "layout"],
    controls: [
      { id: "ratio", label: "Ratio", type: "select", def: "1.25", options: [
        { value: "1.125", label: "1.125 - Major third (calm)" },
        { value: "1.2", label: "1.2 - Minor third (app-like)" },
        { value: "1.25", label: "1.25 - Major third (balanced)" },
        { value: "1.333", label: "1.333 - Perfect fourth (marketing)" },
        { value: "1.414", label: "1.414 - Aug fourth (bold)" },
        { value: "1.5", label: "1.5 - Perfect fifth (editorial)" },
      ] },
      { id: "base", label: "Base size", type: "slider", def: 16, min: 14, max: 20, step: 1, unit: "px" },
    ],
    cssTemplate: `.demo-root {
  --ts-base: {base};   /* body text */
  --ts-r: {ratio};     /* the one number that decides everything */
  background: #f7f2ea; color: #241b12;
  font-family: system-ui, sans-serif;
}
.demo-root .t5 { font-size: calc(var(--ts-base) * var(--ts-r) * var(--ts-r) * var(--ts-r) * var(--ts-r)); }
.demo-root .t4 { font-size: calc(var(--ts-base) * var(--ts-r) * var(--ts-r) * var(--ts-r)); }
.demo-root .t3 { font-size: calc(var(--ts-base) * var(--ts-r) * var(--ts-r)); }
.demo-root .t2 { font-size: calc(var(--ts-base) * var(--ts-r)); }
.demo-root .t1 { font-size: var(--ts-base); }
.demo-root [class^="t"] { line-height: 1.12; margin: 0 0 .45em; font-weight: 700; letter-spacing: -0.015em; }
.demo-root .t1 { font-weight: 400; line-height: 1.6; letter-spacing: 0; max-width: 52ch; }
.demo-root .ts-tag {
  font-family: ui-monospace, monospace; font-size: 10.5px; color: #8a7a66;
  margin-right: 8px; letter-spacing: .04em;
}`,
    demoHtml: `<div style="max-width:480px">
  <h3 class="t5"><span class="ts-tag">step 5</span>Display</h3>
  <h4 class="t4"><span class="ts-tag">step 4</span>Page title</h4>
  <h5 class="t3"><span class="ts-tag">step 3</span>Section</h5>
  <h6 class="t2"><span class="ts-tag">step 2</span>Card title</h6>
  <p class="t1"><span class="ts-tag">base</span>Body copy sits exactly one place in the scale - every other size is this number multiplied by the ratio.</p>
</div>`,
    codeSnippets: {
      "CSS variables": `:root {
  --text-base: {base};
  --text-sm:   calc(var(--text-base) / {ratio});
  --text-lg:   calc(var(--text-base) * {ratio});
  --text-xl:   calc(var(--text-base) * {ratio} * {ratio});
  --text-2xl:  calc(var(--text-base) * {ratio} * {ratio} * {ratio});
  --text-3xl:  calc(var(--text-base) * {ratio} * {ratio} * {ratio} * {ratio});
}
/* responsive cap for the top step:
   font-size: clamp(var(--text-xl), 4vw, var(--text-3xl)); */`,
      "Tailwind v4": `@theme {
  /* ratio {ratio} on a {base} base - compute once, paste the numbers */
  --text-xs:   0.8rem;   /* {base} / {ratio} */
  --text-sm:   0.889rem;
  --text-base: 1rem;
  --text-lg:   1.25rem;  /* {base} x {ratio} */
  --text-xl:   1.563rem;
  --text-2xl:  1.953rem;
  --text-3xl:  2.441rem;
}
/* the rounded numbers above assume 16px base - recompute for your {base} */`,
    },
    prompts: {
      cursor: `# Type scale for this project

Build the type ramp from ONE ratio, no hand-picked sizes:
- base (body): {base}
- ratio: {ratio} (every step multiplies the previous one)
- steps: sm, base, lg, xl, 2xl, 3xl (3xl = base x {ratio}^4)
Define them as CSS variables (or update the repo's text tokens) and make headings use them. Cap the largest step with clamp({base}, 4vw, 3xl-value) so mobile heroes do not overflow.`,
      claude: `Act as a design-system engineer.

Create a modular type scale: base {base}, ratio {ratio}. Show the computed px values for sm through 3xl, then implement them as tokens (CSS custom properties or Tailwind theme text sizes - match the repo). Apply the scale to a sample page with h1-h3, body and caption text. Line-heights: 1.1-1.2 for headings, 1.6 body. Note which step each heading should use.`,
      chatgpt: `Compute a modular type scale with base {base} and ratio {ratio}: list sm, base, lg, xl, 2xl, 3xl in px (show the math once), then give me CSS variables for them plus a clamp() for the largest size on mobile. Finally show h1/h2/h3/body using the variables.`,
      lovable: `{base} base text with a type scale at ratio {ratio}. Headings step up cleanly from that scale; calm, editorial rhythm; body capped around 60 characters per line.`,
      generic: `Generate a type scale from base {base} multiplied by ratio {ratio} for each step (sm to 3xl). Provide the numeric ramp, CSS variables, a responsive clamp for the top size, and example usage on headings and body text.`,
    },
    mistakes: [
      "Jumping two steps between neighbouring headings - the hierarchy breaks and the page screams",
      "Scaling h1 to hero size on mobile - always clamp your top step",
      "Forgetting line-height must shrink as size grows (0.55-0.65 x font-size for big headings)",
      "Recomputing per-component instead of defining tokens once",
    ],
    tips: [
      "1.2 for apps, 1.25-1.333 for marketing pages, 1.414+ for editorial - pick by content density",
      "Use at most 5 of the steps in any real page; more is invisible complexity",
      "Measure paragraph width in ch units (45-75ch) - the scale controls height, ch controls width",
      "Write the ratio into a comment next to the tokens so future-you does not 'eyeball' new sizes",
    ],
    related: ["font-pairing", "reading-line-height", "hero-section", "pricing-compare"],
    learnMore: [
      { label: "MDN: font-size", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-size" },
      { label: "MDN: clamp()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp" },
    ],
  },
  {
    id: "reading-line-height",
    name: "Comfortable reading",
    category: "typography-colour",
    subcategory: "typography",
    aliases: ["line height", "paragraph spacing", "text is cramped", "reading measure"],
    summary: "Three dials that make any paragraph easy to read: size, line spacing, line length.",
    description:
      "Long text is readable when the eye can find the start of the next line. That needs roughly 1.5-1.75 line-height for body copy, a line length of 45-75 characters, and a gap between paragraphs bigger than the extra space inside them. Get these three right and almost any font reads well; get them wrong and no font saves you.",
    whenToUse: [
      "Blog posts, docs, about pages - anywhere a person reads more than two sentences",
      "Fixing text that feels 'tight' or 'floaty' without changing the font",
      "Setting defaults for a prose style before content exists",
    ],
    whenNotToUse: [
      "UI chrome (buttons, labels, table cells): keep those lines tight, around 1.2-1.4",
      "Display headings: 1.0-1.15, never 1.6",
      "As a substitute for writing shorter sentences",
    ],
    difficulty: "beginner",
    tags: ["css", "typography", "readability", "blog"],
    controls: [
      { id: "fsize", label: "Text size", type: "slider", def: 16, min: 14, max: 22, step: 1, unit: "px" },
      { id: "lh", label: "Line spacing", type: "slider", def: 1.65, min: 1.2, max: 2.2, step: 0.05, unit: "" },
      { id: "measure", label: "Line length", type: "slider", def: 62, min: 35, max: 90, step: 1, unit: "" },
      { id: "gap", label: "Paragraph gap", type: "slider", def: 1.1, min: 0.4, max: 2, step: 0.1, unit: "" },
      { id: "ink", label: "Ink", type: "color", def: "#2b2119" },
      { id: "paper", label: "Paper", type: "color", def: "#faf6ef" },
    ],
    cssTemplate: `.demo-root {
  background: {paper}; color: {ink};
  font-family: Georgia, "Times New Roman", serif;
}
.demo-root .rd {
  font-size: {fsize};
  line-height: {lh};                 /* inside the paragraph */
  max-width: {measure}ch;            /* how long one line runs */
}
.demo-root .rd p { margin: 0 0 calc({gap} * {fsize}); }  /* between paragraphs */
.demo-root .rd h4 { font-size: calc({fsize} * 1.4); line-height: 1.15; margin: 0 0 .5em; }
.demo-root .rd .lede { opacity: .78; font-style: italic; }`,
    demoHtml: `<div class="rd" style="max-width:100%">
  <h4>Why measure matters more than font</h4>
  <p class="lede">The eye returns to the start of the next line by memory. The longer the line, the more often it loses its place - and it never tells you, it just reads worse.</p>
  <p>Drag line length past 80 characters and this paragraph becomes work; bring it back to 60 and the same words feel free. Then loosen line spacing until the lines almost float apart - around 1.65 is the quiet sweet spot for text this size, and anything under 1.5 starts to climb on itself.</p>
</div>`,
    codeSnippets: {
      "Prose class": `article {
  font-size: {fsize};
  line-height: {lh};
  max-width: {measure}ch;
  margin-inline: auto;
  color: {ink};
  background: {paper};
}
article p { margin-block-end: calc({gap} * {fsize}); }
article h2 { line-height: 1.15; }`,
    },
    prompts: {
      cursor: `# Readable prose styles

Apply reading settings to all long-form text (article/prose containers) in this repo:
- font-size {fsize}, line-height {lh}, max-width {measure}ch, centred
- paragraph spacing calc({gap} * {fsize})
- colours ink {ink} on paper {paper}
- keep UI text (buttons, tables, labels) on tight line-height around 1.3 so it is unaffected
Do not change the font family unless the repo has none set.`,
      claude: `Act as a typography engineer. Create a prose style for long-form content with exact values: size {fsize}, line-height {lh}, measure {measure}ch centred, paragraph gap calc({gap} * {fsize}), colour {ink} on {paper}. Separate heading rules at line-height 1.15. Explain why line-height is unitless and why ch is used for measure in two short sentences.`,
      chatgpt: `Give me a CSS block for readable article text with: font-size {fsize}, line-height {lh}, max-width {measure}ch centered, paragraph margins of {gap} ems, text colour {ink} on background {paper}. Add small notes on what each property does for readability. Keep UI text separate.`,
      lovable: `{paper} reading page, {ink} long-form text at {fsize} with generous {lh} line spacing and comfortable {measure} character lines; paragraphs breathe apart. Blog/doc look, distraction-free.`,
      generic: `Style a readable text block: {fsize} size, line-height {lh}, line length limited to {measure} characters, paragraph spacing {gap} times the font size, {ink} text on {paper}. Show CSS and note which values suit dense UIs versus prose.`,
    },
    mistakes: [
      "Setting line-height on headings the same as body - 1.6 on a 40px h1 turns a page into soup",
      "Full-width text on desktop: the eye cannot track 120-character lines; always cap the measure",
      "Paragraph gaps smaller than the internal line gaps - blocks blur into one grey wall",
      "Pure black (#000) on pure white for long reading: slightly softened ink reduces glare",
    ],
    tips: [
      "Rule of thumb: gap between paragraphs >= (line-height - 1) x 2 x font-size looks balanced",
      "Larger text needs less line-height; smaller text more. 1.65 at 16px, 1.4 at 24px is a fine curve",
      "max-width: 65ch plus margin-inline:auto beats any fancy column grid for prose",
      "Test your settings at 320px width on a real phone - that is where cramped reading shows",
    ],
    related: ["type-scale", "font-pairing", "editorial-serif", "semantic-color-tokens"],
    learnMore: [
      { label: "MDN: line-height", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height" },
      { label: "MDN: ch unit", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_values_and_units/Units#ch" },
    ],
  },
  {
    id: "variable-fonts",
    name: "Variable fonts",
    category: "typography-colour",
    subcategory: "typography",
    aliases: ["adjustable font weight", "one font file many styles", "font dial", "opsz axis"],
    summary: "One font file with dials inside it - weight and optical size tuned like sliders.",
    description:
      "A variable font stores a continuous range of styles in a single file. Instead of loading four separate weights (four downloads), you load one and dial any value between 300 and 900. The optical-size axis even redraws the letterforms finer at large sizes, so your hero headline and your caption can share one family and still look drawn for their size.",
    whenToUse: [
      "You want many weight steps (editorial hierarchy) without many downloads",
      "Expressive display type you want to tune live, like the sliders here",
      "Responsive typography: heavier and tighter on small screens, lighter on big",
    ],
    whenNotToUse: [
      "When you need exactly two static weights - a static file can be smaller",
      "Very old browser targets (all modern browsers support them, but test your floor)",
      "Tuning axes you cannot see: stick to wght and opsz, esoteric axes are a rabbit hole",
    ],
    difficulty: "intermediate",
    tags: ["fonts", "css", "performance", "google fonts"],
    controls: [
      { id: "wght", label: "Weight dial", type: "slider", def: 620, min: 300, max: 900, step: 10, unit: "" },
      { id: "opsz", label: "Optical size", type: "slider", def: 60, min: 9, max: 144, step: 1, unit: "" },
      { id: "size", label: "Text size", type: "slider", def: 44, min: 20, max: 84, step: 2, unit: "px" },
    ],
    cssTemplate: `@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&display=swap");

.demo-root { background: #221a13; color: #f5efe7; }
.demo-root .vf-line {
  font-family: "Fraunces", Georgia, serif;
  font-size: {size};
  font-variation-settings: "opsz" {opsz}, "wght" {wght};
  line-height: 1.02;
  margin: 0 0 10px;
}
.demo-root .vf-small {
  font-family: "Fraunces", Georgia, serif;
  font-size: 15px;
  font-variation-settings: "opsz" 12, "wght" {wght};
  line-height: 1.5;
  max-width: 44ch;
  opacity: .85;
  margin: 0;
}
.demo-root .vf-meta { font-family: ui-monospace, monospace; font-size: 10.5px; color: #a4907a; margin-top: 14px; }`,
    demoHtml: `<div>
  <div class="vf-line">One file, every weight</div>
  <p class="vf-small">This caption uses the same downloaded file - only the dials differ. Notice the large line above redraws more delicately when you lower the optical-size dial to 9 and raise it again.</p>
  <div class="vf-meta">font-variation-settings: "opsz" {opsz}, "wght" {wght};</div>
</div>`,
    codeSnippets: {
      "Responsive dialing": `/* same file, different personality per screen */
.hero { font-variation-settings: "opsz" 144, "wght" 650; }
@media (max-width: 640px) {
  .hero { font-variation-settings: "opsz" 24, "wght" 750; } /* heavier, sturdier when small */
}`,
      "Standard weights": `/* simpler and animatable: use the normal property for weight only */
h1 { font-weight: {wght}; }        /* browsers map this onto the wght axis */
p  { font-weight: 400; }`,
    },
    prompts: {
      cursor: `# Variable font usage

This project should use a variable font (Fraunces or the repo's display family) with these exact settings:
- @import from Google Fonts requesting full ranges: family=Fraunces:opsz,wght@9..144,300..900&display=swap
- hero line: font-size {size}, font-variation-settings "opsz" {opsz} "wght" {wght}
- small text shares the file with "opsz" 12
- prefer font-weight for weight-only needs (it animates and transitions; font-variation-settings does not transition in all browsers)
Add a media-query step so mobile gets a heavier, lower-opsz setting.`,
      claude: `Act as a web-typography specialist. Load the variable font Fraunces (opsz 9..144, wght 300..900) from Google Fonts, then build a hero line at font-size {size} using font-variation-settings: "opsz" {opsz}, "wght" {wght}, plus a paragraph reusing the same file at "opsz" 12. Explain the difference between font-weight mapping and font-variation-settings, and when each is correct, in under five sentences.`,
      chatgpt: `Explain and implement a variable font setup: import "Fraunces" with the opsz (9 to 144) and wght (300 to 900) axes from Google Fonts. Show a headline at {size} with opsz {opsz} and wght {wght}, a body snippet at opsz 12, and one responsive media query that changes the dials on mobile. Comment every line.`,
      lovable: `{size} display headline in the variable font Fraunces, tuned to weight {wght} and optical size {opsz} - warm, editorial, ink-on-espresso palette (#221a13 background, #f5efe7 text). Same file used for small text.`,
      generic: "Set up one variable font file with the optical-size and weight axes (opsz {opsz}, wght {wght} at {size} for the display line, opsz 12 for small text), loaded from Google Fonts with full axis ranges, plus a mobile variant of the dial values.",
    },
    mistakes: [
      "Requesting the full axis range when you need two values: pin exact instances (wght@400;700) for a smaller download",
      "Animating font-variation-settings and expecting buttery transitions - support varies; font-weight is safer",
      "Dialing weight past 800 on a dense layout - it fills in at small sizes",
      "Forgetting the static fallback family in font-stack order",
    ],
    tips: [
      "On Google Fonts, tick 'Variable' and type a range like 300..900 to request exactly your instances",
      "Heavier optical trick: at small sizes add weight (around +100), at hero sizes let the thin contrast do the work",
      "font-optical-sizing: auto applies the opsz axis automatically from font-size - often better than manual settings",
      "One variable file (around 100-200KB) usually beats 4 static weights on both size and flexibility",
    ],
    related: ["font-pairing", "display-vs-body", "type-scale"],
    learnMore: [
      { label: "MDN: variable fonts", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide" },
      { label: "Google Fonts: using variable fonts", url: "https://github.com/google/fonts/blob/main/ofl/fraunces/FRAUNCES%20VARIABLES.md" },
    ],
  },
  {
    id: "display-vs-body",
    name: "Display type that works",
    category: "typography-colour",
    subcategory: "typography",
    aliases: ["headline font settings", "big title", "hero type treatment", "all caps headers"],
    summary: "The size, tracking and case tricks that make a big headline look drawn, not enlarged.",
    description:
      "Fonts are drawn for reading size. Blow one up and its letterspacing stays while the gaps between letters grow - so big type looks loose and amateur unless you tighten it (negative tracking). ALL CAPS needs the opposite: extra positive tracking. This tool lets you feel those two rules with live sliders.",
    whenToUse: [
      "Setting hero or poster-sized headlines",
      "Styling small-caps or uppercase eyebrows and labels",
      "Any time text goes above roughly 32px or below 12px",
    ],
    whenNotToUse: [
      "Body copy at normal sizes - leave tracking alone (0)",
      "Long paragraphs in caps - reading speed drops and screen readers shout",
      "Cramming a 200-character headline into negative tracking - at extreme sizes gaps need real space",
    ],
    difficulty: "beginner",
    tags: ["typography", "hero", "css", "headline"],
    controls: [
      { id: "size", label: "Headline size", type: "slider", def: 54, min: 28, max: 96, step: 2, unit: "px" },
      { id: "track", label: "Letter fit", type: "slider", def: -0.025, min: -0.05, max: 0.02, step: 0.005, unit: "" },
      { id: "caps", label: "ALL CAPS mode", type: "toggle", def: false, onValue: "uppercase", offValue: "none" },
      { id: "capTrack", label: "Caps letter space", type: "slider", def: 0.06, min: 0, max: 0.14, step: 0.01, unit: "" },
      { id: "ink", label: "Ink", type: "color", def: "#1f1710" },
      { id: "paper", label: "Paper", type: "color", def: "#f3ede3" },
    ],
    cssTemplate: `@import url("https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&display=swap");

.demo-root { background: {paper}; color: {ink}; }
.demo-root .dt-head {
  font-family: "Fraunces", Georgia, serif;
  font-weight: 600;
  font-size: {size};
  line-height: 0.98;
  letter-spacing: {track}em;              /* big type: tighten */
  text-transform: {caps};
  margin: 0 0 12px;
  max-width: 12ch;
}
/* when caps is on, browsers still apply the base tracking; combine with the caps dial */
.demo-root .dt-head { letter-spacing: calc({track}em + {capTrack}em); }
.demo-root .dt-eyebrow {
  font-family: system-ui, sans-serif; font-size: 11px; font-weight: 600;
  letter-spacing: .14em; text-transform: uppercase; opacity: .6; margin-bottom: 10px;
}
.demo-root .dt-note { font-family: ui-monospace, monospace; font-size: 10.5px; opacity: .5; }`,
    demoHtml: `<div style="max-width:100%">
  <div class="dt-eyebrow">live headline lab</div>
  <div class="dt-head">Make the big type sit closer</div>
  <p class="dt-note">letter-spacing: calc({track}em + {capTrack}em) at {size}</p>
</div>`,
    codeSnippets: {
      "Rule of thumb": `/* tracking curve you can reuse */
h1 { font-size: {size}; letter-spacing: -0.03em; line-height: 1; }
h2 { font-size: calc({size} * 0.6); letter-spacing: -0.02em; line-height: 1.1; }
h3 { font-size: 20px; letter-spacing: -0.01em; }
p  { font-size: 16px; letter-spacing: 0; }
.eyebrow { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; }`,
    },
    prompts: {
      cursor: `# Display headline treatment

Style the main hero headline with exact values:
- size {size}, line-height around 1, letter-spacing calc({track}em + {capTrack}em), transform: {caps}
- colours: {ink} on {paper}
- if the repo headline is serif, keep the family; only fix the metrics
Also add an uppercase eyebrow rule (11px, letter-spacing .14em, opacity .6) and make h2/h3 follow the same tightening curve (less negative as size shrinks).`,
      claude: `Act as a display typographer. Given a hero headline at {size} on {paper} with ink {ink}: apply line-height ~1, letter-spacing {track}em, and optional uppercase mode {caps} with {capTrack}em extra tracking. Explain the two rules (large type needs negative tracking; capitals need positive) in three sentences, then produce the CSS plus a matching small-caps eyebrow style.`,
      chatgpt: `Why does big text look loose and ALL CAPS look cramped? Explain briefly, then write CSS for a {size} headline with letter-spacing {track}em (text-transform: {caps}, and if uppercase add {capTrack}em), line-height 1, colour {ink} on {paper}, plus an 11px uppercase eyebrow at .14em tracking.`,
      lovable: `Poster-like hero headline at {size}, letter-spacing tuned ({track}em, {caps}), ink {ink} on warm {paper}, with a tiny uppercase eyebrow above it. Editorial, confident, Fraunces-style serif if available.`,
      generic: `Treat a display headline: size {size}, letter-spacing {track}em plus {capTrack}em when uppercase ({caps}), line-height 1, {ink} on {paper}, and a matching uppercase eyebrow. Explain why tracking must change with size and case.`,
    },
    mistakes: [
      "Zero tracking at 72px - the headline looks like Scrabble tiles",
      "Positive tracking on mixed-case body text - it reads drunk",
      "Whole paragraphs in uppercase: slower to read, and screen-reader behaviour varies",
      "Applying the same tracking at every size - the curve should flatten to 0 as size approaches body",
    ],
    tips: [
      "A safe curve: -0.02em under 24px never needed; -0.05 to -0.03em at 48-96px; -0.01em around 32px",
      "ALL CAPS almost always wants +0.05 to +0.12em",
      "Check the gap between the two closest letters (like 'rn'); if it reads as 'm', tighten more",
      "line-height under 1 is fine for single-line display type; keep multi-line titles at 1.05+",
    ],
    related: ["font-pairing", "variable-fonts", "hero-section", "type-scale"],
    learnMore: [
      { label: "MDN: letter-spacing", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing" },
      { label: "MDN: text-transform", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform" },
    ],
  },

  /* ──────────────────────────── colour ──────────────────────────── */
  {
    id: "hsl-color-system",
    name: "One hue, whole palette",
    category: "typography-colour",
    subcategory: "colour",
    aliases: ["hsl", "color ramp", "shades of a color", "tints and shades"],
    summary: "Turn one hue slider into a full 50-900 colour ramp you can token-ise.",
    description:
      "HSL stores colour as hue (which colour), saturation (how intense) and lightness (how bright) - which maps exactly onto how people describe palettes: 'make it a bit lighter, less angry'. Pick one hue and one saturation, then generate the ramp by changing lightness alone. Every derived colour stays visibly family-related.",
    whenToUse: [
      "Choosing a brand colour by feel instead of hunting hex codes",
      "Generating the 50-900 scale for a theme token",
      "Keeping hover/active/disabled states consistent (same hue, different lightness)",
    ],
    whenNotToUse: [
      "Accessibility targets: equal lightness numbers across hues are NOT equal contrast - verify pairs separately",
      "Photographic or data colours where hue meaning matters more than ramp aesthetics",
      "As one hue for everything - neutrals need their own, much desaturated, hue",
    ],
    difficulty: "beginner",
    tags: ["colour", "tokens", "css", "palette"],
    controls: [
      { id: "hue", label: "Hue", type: "slider", def: 22, min: 0, max: 360, step: 1, unit: "deg" },
      { id: "sat", label: "Intensity", type: "slider", def: 78, min: 0, max: 100, step: 2, unit: "" },
    ],
    cssTemplate: `.demo-root { background: #f4efe8; color: #241b12; }
.demo-root .sw {
  display: grid; grid-template-columns: repeat(9, 1fr); gap: 6px;
  border-radius: 10px; overflow: hidden;
}
.demo-root .sw div { padding: 18px 6px 10px; text-align: center; font-family: ui-monospace, monospace; font-size: 10px; }
.demo-root .s50  { background: hsl({hue} {sat}% 96%); }
.demo-root .s100 { background: hsl({hue} {sat}% 90%); }
.demo-root .s200 { background: hsl({hue} {sat}% 82%); }
.demo-root .s300 { background: hsl({hue} {sat}% 72%); }
.demo-root .s400 { background: hsl({hue} {sat}% 62%); }
.demo-root .s500 { background: hsl({hue} {sat}% 52%); color: #fff; }
.demo-root .s600 { background: hsl({hue} {sat}% 42%); color: #fff; }
.demo-root .s700 { background: hsl({hue} {sat}% 33%); color: #fff; }
.demo-root .s900 { background: hsl({hue} {sat}% 20%); color: #fff; }
.demo-root .cap { font-size: 12px; opacity: .7; margin: 10px 2px 0; }`,
    demoHtml: `<div style="max-width:460px">
  <div class="sw">
    <div class="s50">50</div><div class="s100">100</div><div class="s200">200</div><div class="s300">300</div>
    <div class="s400">400</div><div class="s500">500</div><div class="s600">600</div><div class="s700">700</div><div class="s900">900</div>
  </div>
  <p class="cap">hsl({hue} {sat}% ...): one hue, one intensity, nine lightness stops. The 500 is your brand colour; everything else is derived.</p>
</div>`,
    codeSnippets: {
      "CSS tokens": `:root {
  /* hue {hue}, intensity {sat}% - derived ramp */
  --brand-50:  hsl({hue} {sat}% 96%);
  --brand-100: hsl({hue} {sat}% 90%);
  --brand-300: hsl({hue} {sat}% 72%);
  --brand-500: hsl({hue} {sat}% 52%);  /* buttons, links */
  --brand-600: hsl({hue} {sat}% 42%);  /* hover */
  --brand-700: hsl({hue} {sat}% 33%);  /* pressed, on-white text */
  --brand-900: hsl({hue} {sat}% 20%);  /* dark surfaces */
}`,
      "Modern CSS": `/* or dial ONE custom property and reuse it everywhere */
:root { --h: {hue}; --s: {sat}%; }
.btn      { background: hsl(var(--h) var(--s) 52%); }
.btn:hover{ background: hsl(var(--h) var(--s) 42%); }
.tint-box { background: hsl(var(--h) var(--s) 96%); }`,
    },
    prompts: {
      cursor: `# Brand ramp from one hue

Generate the theme ramp using HSL with hue {hue} and saturation {sat}%:
- steps 50/100/300/500/600/700/900 at lightness 96/90/72/52/42/33/20
- define as tokens in the repo's convention (--brand-* or theme extend); 500 = base, 600 = hover, 700 = text-on-white, 900 = dark surface
- derive a neutral: same hue, saturation 12%
- keep all existing semantic names; map them onto the new ramp
Replace hardcoded hex values in components with the tokens.`,
      claude: `Act as a design-system engineer. Create a colour ramp from hue {hue}, saturation {sat}% at lightness stops 96/90/72/52/42/33/20 (names 50-900). Output: CSS custom properties, a neutral version (saturation 12%), and usage rules (500 interactive, 700 text on white, 900 dark backgrounds). Verify which steps pass 4.5:1 contrast as text on white and say so; adjust recommendations, not the ramp.`,
      chatgpt: `Using HSL with hue {hue} and saturation {sat}%, build me a 50-900 colour ramp (lightness 96 down to 20), give me the CSS variables, a matching neutral grey at saturation 12%, and tell me which step is safe for button text on white versus links on the colour itself.`,
      lovable: `Brand colour hsl({hue} {sat}% 52%) with a derived ramp for surfaces, borders, hover and text. Neutrals share the same hue at low saturation. Warm, cohesive, token-driven.`,
      generic: `Generate a full colour palette from one hue ({hue}) and saturation ({sat}%) by varying lightness from 96% to 20%. Provide named tokens (50-900), a desaturated neutral family, and usage guidance per stop with contrast notes.`,
    },
    mistakes: [
      "Judging lightness numbers instead of contrast numbers - hsl(x y 45%) on one hue can fail where another passes",
      "100% saturation on a whole UI - it looks like a highlighter convention; the demo's 78% is already loud",
      "Neutral greys with hue 0 at full sat, or with no hue at all (they look dead next to your brand)",
      "Recomputing the ramp by hand per colour instead of keeping one lightness table",
    ],
    tips: [
      "Give your neutrals a hint of the brand hue (saturation 8-15%) - the page suddenly feels designed",
      "Text-on-brand is decided by contrast, not vibes: test 700-ish steps against white and off-white",
      "Hover = same colour, lightness minus ~8-10 points; pressed = minus ~15. One table, every component.",
      "DevTools colour pickers show HSL - drag hue/sat here, note the numbers, done",
    ],
    related: ["semantic-color-tokens", "tailwind-color-tokens", "dark-mode-palette", "accessible-contrast"],
    learnMore: [
      { label: "MDN: hsl()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl" },
      { label: "CSS-Tricks: HSL colours", url: "https://css-tricks.com/hsl-in-css/" },
    ],
  },
  {
    id: "accessible-contrast",
    name: "Text you can actually read",
    category: "typography-colour",
    subcategory: "colour",
    aliases: ["contrast", "wcag", "text too light", "can blind people read this"],
    summary: "The 4.5:1 rule for normal text and the fast way to check any colour pair.",
    description:
      "Accessibility rules express readability as a contrast ratio between text colour and background: 4.5:1 for normal text, 3:1 for large text (24px+, or 19px bold), and 3:1 for UI shapes like input borders and icon buttons. Light greys on white fail constantly - not because grey is banned, but because 'dim' is usually too dim. Tune the pair here, then verify the exact ratio with the checker linked below.",
    whenToUse: [
      "Choosing any text colour, especially muted/secondary text",
      "Buttons: both the fill and the label on it need 4.5:1",
      "Reviewing AI-generated UI code, which loves #999 on #fff",
    ],
    whenNotToUse: [
      "As an excuse to make everything black on white - contrast is a floor, not the goal",
      "Decorative gradients and images (exempt), unless text sits on them - then the text still counts",
      "Chasing 21:1: beyond about 10:1 you mainly add glare",
    ],
    difficulty: "beginner",
    tags: ["accessibility", "colour", "wcag", "css"],
    controls: [
      { id: "fg", label: "Text colour", type: "color", def: "#6f6152" },
      { id: "bg", label: "Background", type: "color", def: "#f7f2ea" },
      { id: "demo", label: "Demo text size", type: "slider", def: 15, min: 12, max: 32, step: 1, unit: "px" },
    ],
    cssTemplate: `.demo-root { background: {bg}; }
.demo-root .ac-rows { display: flex; flex-direction: column; gap: 14px; }
.demo-root .ac-line { color: {fg}; font-size: {demo}; line-height: 1.4; font-family: system-ui, sans-serif; max-width: 44ch; }
.demo-root .ac-large { font-weight: 700; font-size: calc({demo} * 1.6); line-height: 1.15; color: {fg}; }
.demo-root .ac-pill {
  align-self: flex-start; background: {fg}; color: {bg};
  font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 999px;
}
.demo-root .ac-input {
  font-size: 14px; padding: 8px 10px; border-radius: 8px;
  border: 2px solid {fg}; color: {fg}; background: transparent; font-family: system-ui;
}`,
    demoHtml: `<div class="ac-rows" style="padding:4px">
  <div class="ac-large">Large heading (3:1 bar)</div>
  <div class="ac-line">Normal body text needs 4.5 to 1. This sentence is set in the exact pair you picked - if you are squinting at it here, users will too.</div>
  <div class="ac-pill">Button label</div>
  <div class="ac-input">input with 2px border (UI shape: 3:1)</div>
</div>`,
    codeSnippets: {
      "Safe muted text": `/* the classic fix: keep opacity out of text colour math */
:root {
  --ink: #241b12;                    /* on {bg}: strong */
  --ink-muted: color-mix(in srgb, #241b12 72%, {bg}); /* still ~4.5:1 on {bg} */
}
.muted { color: var(--ink-muted); }  /* instead of opacity: .6 on full ink */`,
    },
    prompts: {
      cursor: `# Contrast pass

Audit and fix text/background pairs in this repo. The pair under review is {fg} on {bg} at {demo}.
Rules: normal text 4.5:1, large text (>=24px or 19px bold) 3:1, UI shapes and focus rings 3:1.
- compute the ratio for each pair used in components; darken or lighten until it passes
- never use opacity on coloured text - mix toward the background with color-mix instead
- buttons: label-on-fill must ALSO pass; check the pill and input styles
List every failing pair you fixed with before/after hex values.`,
      claude: `Act as a WCAG auditor. Evaluate the pair {fg} on {bg} at {demo} and give its exact contrast ratio (show the calculation steps: relative luminance per channel). Then state whether it passes AA for normal text (4.5), large text (3), and UI shapes (3). If it fails, propose the minimal lightness adjustment to the text colour that passes, and rewrite a sample button, input border, and muted paragraph label with the fixed values.`,
      chatgpt: `What is the contrast ratio between {fg} and {bg}? Show the math (relative luminance formula), tell me if it passes WCAG AA for normal text at {demo}, large text, and button/UI borders, and if it fails, give me the closest passing replacement hex for the text colour.`,
      lovable: `Text colour {fg} on {bg} - readable, high enough contrast for body copy at {demo}, matching pill button ({bg} text on {fg}) and outlined inputs. Quiet, warm, accessible.`,
      generic: "Check and fix the contrast between {fg} text and {bg} background for {demo} body copy, large headings, button labels and input borders against WCAG AA (4.5:1 / 3:1). Provide the ratio, the pass/fail verdict, and corrected hex values if needed.",
    },
    mistakes: [
      "Grey placeholder text at opacity 0.5 - the number that fails most first-pass designs",
      "Checking body text but forgetting the button label, nav links, and disabled-looking-but-required labels",
      "Light-on-light hover states: the resting state passes, the hover fails",
      "Using pure black text on pure white everywhere - harsh for many readers; softened ink with passing contrast is kinder",
    ],
    tips: [
      "The quick eyeball test: squint hard - if the text blurs away, contrast is likely failing",
      "WCAG maths is deterministic: any checker (link below) or a 10-line function gives the exact number",
      "For coloured backgrounds, adjust lightness of the text hue, not saturation - it preserves the vibe",
      "Focus rings are UI shapes: 3:1 against whatever surrounds them, not against the brand colour",
    ],
    related: ["semantic-color-tokens", "dark-mode-palette", "hsl-color-system", "modal-dialog"],
    learnMore: [
      { label: "WebAIM contrast checker", url: "https://webaim.org/resources/contrastchecker/" },
      { label: "W3C: WCAG 2.1 contrast (SC 1.4.3)", url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" },
      { label: "MDN: color-mix()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix" },
    ],
  },
  {
    id: "semantic-color-tokens",
    name: "Named colours, not hexes",
    category: "typography-colour",
    subcategory: "colour",
    aliases: ["design tokens", "color roles", "primary success danger", "css variables for colors"],
    summary: "Give colours jobs - primary, danger, surface - so components never hardcode a hex.",
    description:
      "A semantic token names what a colour is FOR, not what it IS: --color-danger says 'the colour for destructive things'. Components use roles, so recolouring the brand, adding dark mode, or softening red means editing one file, not hunting hexes through 200 components. The colours below are just placeholders you can retune live.",
    whenToUse: [
      "Starting any project bigger than one page",
      "Before asking an AI to 'make a dashboard' - hand it the token list",
      "When dark mode is even a maybe",
    ],
    whenNotToUse: [
      "One-off static pages with a single surface - three hexes are fine, ceremony is not",
      "Data visualisation scales, which need their own sequential/categorical system",
      "Naming by appearance (--angry-red) - that is a hex with extra steps; name by role",
    ],
    difficulty: "intermediate",
    tags: ["tokens", "css", "architecture", "colour"],
    controls: [
      { id: "primary", label: "Primary", type: "color", def: "#b4602c" },
      { id: "success", label: "Success", type: "color", def: "#3f7d4f" },
      { id: "warning", label: "Warning", type: "color", def: "#c9932a" },
      { id: "danger", label: "Danger", type: "color", def: "#b0362b" },
      { id: "surface", label: "Surface", type: "color", def: "#faf6ef" },
      { id: "ink", label: "Ink", type: "color", def: "#241b12" },
    ],
    cssTemplate: `.demo-root { background: {surface}; color: {ink}; font-family: system-ui, sans-serif; }
.demo-root {
  --c-primary: {primary}; --c-success: {success}; --c-warning: {warning};
  --c-danger: {danger}; --c-surface: {surface}; --c-ink: {ink};
}
.demo-root .st-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 460px; }
.demo-root .st-tile { border-radius: 10px; padding: 12px; font-size: 11.5px; border: 1px solid color-mix(in srgb, var(--c-ink) 12%, transparent); }
.demo-root .st-role { font-weight: 700; letter-spacing: .04em; text-transform: uppercase; font-size: 10px; opacity: .65; }
.demo-root .st-val { font-family: ui-monospace, monospace; font-size: 10.5px; margin-top: 2px; }
.demo-root .st-demo { margin-top: 16px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.demo-root .st-btn { background: var(--c-primary); color: #fff; border: 0; font-size: 13px; font-weight: 600; padding: 9px 14px; border-radius: 9px; }
.demo-root .st-del { background: transparent; color: var(--c-danger); border: 1px solid color-mix(in srgb, var(--c-danger) 40%, transparent); font-size: 13px; padding: 8px 12px; border-radius: 9px; }
.demo-root .st-banner { background: color-mix(in srgb, var(--c-warning) 14%, var(--c-surface)); color: color-mix(in srgb, var(--c-warning) 60%, var(--c-ink)); border: 1px solid color-mix(in srgb, var(--c-warning) 35%, transparent); font-size: 12.5px; padding: 8px 12px; border-radius: 9px; margin-top: 10px; max-width: 460px; }`,
    demoHtml: `<div>
  <div class="st-grid">
    <div class="st-tile"><div class="st-role">primary</div><div class="st-val">{primary}</div></div>
    <div class="st-tile"><div class="st-role">success</div><div class="st-val">{success}</div></div>
    <div class="st-tile"><div class="st-role">warning</div><div class="st-val">{warning}</div></div>
    <div class="st-tile"><div class="st-role">danger</div><div class="st-val">{danger}</div></div>
    <div class="st-tile"><div class="st-role">surface</div><div class="st-val">{surface}</div></div>
    <div class="st-tile"><div class="st-role">ink</div><div class="st-val">{ink}</div></div>
  </div>
  <div class="st-demo">
    <button class="st-btn">Save changes</button>
    <button class="st-del">Delete</button>
  </div>
  <div class="st-banner">Warning banner built from color-mix of the warning token and the surface - no new hex invented.</div>
</div>`,
    codeSnippets: {
      "Token file": `:root {
  /* roles, not colours: component CSS may ONLY use these */
  --color-primary: {primary};
  --color-success: {success};
  --color-warning: {warning};
  --color-danger:  {danger};
  --color-surface: {surface};
  --color-ink:     {ink};
  /* derived, allowed: */
  --color-primary-soft: color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
}`,
      "Tailwind v4": `@theme {
  --color-primary: {primary};
  --color-success: {success};
  --color-warning: {warning};
  --color-danger: {danger};
  --color-surface: {surface};
  --color-ink: {ink};
}
/* components then read: bg-primary text-ink border-danger/40 */`,
    },
    prompts: {
      cursor: `# Semantic colour tokens

Introduce a token layer in this repo and migrate components onto it. Exact role values:
- primary {primary}, success {success}, warning {warning}, danger {danger}, surface {surface}, ink {ink}
Rules:
- components use ONLY token names (--color-* or the repo's theme keys), never raw hex
- soft/emphasised variants must use color-mix against surface, not new hexes
- migrate existing hardcoded hexes to the nearest role and list any you had to round
Add the tokens in the repo's existing convention (CSS variables or @theme).`,
      claude: `Act as a design-system architect. Define semantic colour tokens with roles primary={primary}, success={success}, warning={warning}, danger={danger}, surface={surface}, ink={ink}, in the repo's convention. Then: (1) rules for what may reference raw colours (nobody) and how derived shades must be made (color-mix), (2) rewrite one example card, one button pair (primary + destructive), and one warning banner using only the tokens, (3) name the failure modes this prevents. Keep it under 40 lines.`,
      chatgpt: `Explain design colour tokens to a beginner, then write a :root CSS variable set with exactly these roles and values: primary {primary}, success {success}, warning {warning}, danger {danger}, surface {surface}, ink {ink}. Show one button and one alert banner that use only the variables, plus a derived 'soft' background made with color-mix. Why is naming by role better than naming by colour?`,
      lovable: `Clean role-based palette: primary {primary}, success {success}, warning {warning}, danger {danger}, surfaces {surface}, text {ink}. Token-driven components: buttons, an alert, badges. No raw hexes in components.`,
      generic: `Create a semantic colour token system (roles, not hexes) using: primary {primary}, success {success}, warning {warning}, danger {danger}, surface {surface}, ink {ink}. Include CSS variables, one derived soft tint via color-mix, example button/banner usage, and a rule that component styles reference tokens only.`,
    },
    mistakes: [
      "Naming by appearance (--blue-strong): it blocks rebranding and dark mode",
      "Token soup: 40 tokens where 8 roles and color-mix do the job",
      "Half-migration: some components use tokens, others hex - the hex ones win by accident at review time",
      "Treating 'primary' as the only text colour on dark surfaces - roles need background-aware variants",
    ],
    tips: [
      "Minimum honest set: ink, surface, elevated surface, line, primary, plus success/warning/danger",
      "One accent does it: danger reds and success greens rarely appear on the same screen",
      "Add dark mode later as a second values file under the same role names - components never change",
      "Lint raw colours out of component files; a grep for # in src/components is your CI tripwire",
    ],
    related: ["hsl-color-system", "tailwind-color-tokens", "dark-mode-palette", "accessible-contrast"],
    learnMore: [
      { label: "MDN: using color-mix()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix" },
      { label: "Tailwind v4 theme variables", url: "https://tailwindcss.com/docs/theme" },
    ],
  },
  {
    id: "dark-mode-palette",
    name: "Dark mode without mud",
    category: "typography-colour",
    subcategory: "colour",
    aliases: ["night theme", "dark version of my site", "why does dark mode look cheap", "inverted colors"],
    summary: "Dark themes are designed, not inverted: lifted surfaces, calmer accents, soft black.",
    description:
      "Naive dark mode (swap white to black, text to white) fails because light behaves differently on dark surfaces: pure white text on pure black glares, borders vanish, and saturated brand colours vibrate. The fixes are mechanical: ink at ~87% white, surfaces as a dark hue-tinted ramp, accents desaturated slightly, borders as low-opacity white instead of grey.",
    whenToUse: [
      "Adding a dark option to an existing light token set",
      "When your dark mode 'looks cheap' and you cannot say why",
      "Design docs/media pages where night reading matters",
    ],
    whenNotToUse: [
      "When your brand colours cannot reach contrast in the dark ramp - redesign the ramp, do not force white text",
      "Content with colour-critical visuals (photo editing, maps): test before trusting",
      "As a full second design: if you maintain two hardcoded palettes, you have two bugs",
    ],
    difficulty: "intermediate",
    tags: ["colour", "dark mode", "tokens", "css"],
    controls: [
      { id: "accent", label: "Brand accent", type: "color", def: "#d98a4e" },
      { id: "neutral", label: "Neutral base", type: "color", def: "#1c1713" },
      { id: "lift", label: "Surface lift", type: "slider", def: 8, min: 2, max: 18, step: 1, unit: "" },
    ],
    cssTemplate: `.demo-root { background: #efe9df; padding: 12px; }
.demo-root {
  --n: {neutral};
  --surface: color-mix(in srgb, var(--n) 96%, white calc({lift} * 1%));   /* card */
  --sunken: var(--n);
  --hairline: rgba(255, 255, 255, calc((6 + {lift} * 0.4) / 100));
  --txt: rgba(255,255,255,.87);
  --txt-dim: rgba(255,255,255,.55);
  --acc: {accent};
}
.demo-root .dm-phone { background: var(--sunken); color: var(--txt); border-radius: 14px; padding: 16px; max-width: 380px; border: 1px solid var(--hairline); }
.demo-root .dm-card { background: var(--surface); border: 1px solid var(--hairline); border-radius: 10px; padding: 12px; margin-top: 10px; }
.demo-root .dm-title { font-size: 15px; font-weight: 700; }
.demo-root .dm-sub { font-size: 12.5px; color: var(--txt-dim); line-height: 1.5; margin-top: 3px; }
.demo-root .dm-btn { background: var(--acc); color: color-mix(in srgb, var(--acc) 30%, black); font-size: 12.5px; font-weight: 700; border: 0; border-radius: 8px; padding: 7px 12px; margin-top: 10px; }
.demo-root .dm-tag { display:inline-block; font-size: 10.5px; font-weight: 600; color: color-mix(in srgb, var(--acc) 75%, white); border: 1px solid color-mix(in srgb, var(--acc) 40%, transparent); border-radius: 999px; padding: 3px 9px; }`,
    demoHtml: `<div class="dm-phone">
  <div style="display:flex; justify-content:space-between; align-items:center">
    <span class="dm-title">Tonight's queue</span>
    <span class="dm-tag">live</span>
  </div>
  <div class="dm-card">
    <div class="dm-title" style="font-size:13.5px">Deploy the docs refresh</div>
    <div class="dm-sub">Surfaces lift {lift}% above the base with a 1px low-opacity white hairline - that is the whole 'layered' feeling.</div>
    <button class="dm-btn">Ship it</button>
  </div>
</div>`,
    codeSnippets: {
      "prefers-color-scheme": `:root { /* light values */ }
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: var(--dark-base);
    --color-elevated: color-mix(in srgb, var(--dark-base) 96%, white {lift}%);
    --color-ink: rgba(255, 255, 255, .87);
    --color-line: rgba(255, 255, 255, calc((6 + {lift} * 0.4) / 100));
    --color-primary: {accent}; /* desaturated sibling of the light accent */
  }
}
/* user override wins over the media query: */
[data-theme="dark"] { /* same block */ }`,
    },
    prompts: {
      cursor: `# Dark mode ramp

Add a dark theme to the existing token layer - roles stay identical, only values change. Dark values:
- base surface: {neutral}
- elevated surfaces: that lifted by {lift}% toward white (color-mix)
- ink: rgba(255,255,255,.87); secondary .55; NEVER pure #fff body text
- borders: rgba(255,255,255,.06-.10), not grey hexes
- accent: {accent}, button text on accent: color-mix({accent} 30%, black)
Support prefers-color-scheme plus a manual data-theme override. Check every text/background pair still hits 4.5:1.`,
      claude: `Act as a theming engineer. Convert this repo's light tokens to a dark theme without changing role names: base {neutral}, elevation +{lift}% via color-mix, text at .87/.55 alpha white, hairline borders as low-alpha white, accent {accent} with near-black derived button text. Show the dark token block, one component proof (card + primary button), and list three contrast risks to verify. Do not invert or reuse light-theme hexes directly.`,
      chatgpt: `Why does simply inverting a light palette look cheap, and what are the standard fixes? Then write dark-theme CSS variables using: surface {neutral}, cards lifted {lift}% toward white, text rgba(255,255,255,.87), borders rgba(255,255,255,.08), accent {accent}. Show a card and button in the dark theme and note one contrast check I should run.`,
      lovable: `Dark UI built from {neutral} surfaces lifted {lift}% for cards, 87% white text, subtle white hairline borders, and a warm {accent} accent. Layered, calm, no pure black or pure white.`,
      generic: "Design a dark mode palette from a light one: keep role names, set base {neutral}, elevate surfaces by {lift}%, use alpha-white text (.87/.55) and hairline borders, desaturate the accent to {accent}. Explain glare, elevation and contrast reasons for each choice.",
    },
    mistakes: [
      "#000000 background with #ffffff text: maximum glare, no sense of material",
      "Reusing the light accent at full saturation on dark - thin strokes vibrate; pull saturation down a notch",
      "Grey hex borders on dark surfaces disappear or look like smudges - alpha-white hairlines are visible AND quiet",
      "Only testing dark mode on your monitor: OLED phones crush blacks differently",
    ],
    tips: [
      "Elevation by lightness, not shadow: each layer +{lift}% or so toward white",
      "Big areas of colour on dark should drop ~10-20% saturation; small accents can stay",
      "Images look loud on dark pages - a gentle brightness: .9 on media normalises them",
      "Ship the toggle only when BOTH themes are tested on empty, loading and error states",
    ],
    related: ["semantic-color-tokens", "accessible-contrast", "glassmorphism", "hsl-color-system"],
    learnMore: [
      { label: "MDN: prefers-color-scheme", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme" },
      { label: "WCAG: contrast (dark themes)", url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" },
    ],
  },
  {
    id: "tailwind-color-tokens",
    name: "Brand colour in Tailwind",
    category: "typography-colour",
    subcategory: "colour",
    aliases: ["tailwind v4 theme", "custom tailwind colors", "brand color utility", "@theme"],
    summary: "Expose your palette as utilities: write @theme once, use bg-brand-500 everywhere.",
    description:
      "Tailwind v4 reads design decisions from CSS: declare --color-brand-500 inside @theme and the bg-brand-500, text-brand-500 and border-brand-500 utilities appear automatically - including opacity modifiers like /40. This is the smallest possible bridge between 'I picked a palette here' and 'every component uses it'. The demo ramps live; the snippet is copy-ready.",
    whenToUse: [
      "Starting a Tailwind project with a brand colour",
      "Replacing scattered bg-[#hex] arbitrary values with real utilities",
      "Sharing one theme across a design and a codebase",
    ],
    whenNotToUse: [
      "Non-Tailwind projects - same idea, different files (plain CSS variables)",
      "Masses of one-off colours: if every page needs its own accent, fix the design system instead",
      "Tailwind v3 projects (no @theme): the equivalent lives in tailwind.config.js",
    ],
    difficulty: "beginner",
    tags: ["tailwind", "tokens", "colour", "css"],
    controls: [
      { id: "name", label: "Token name", type: "select", def: "brand", options: [
        { value: "brand", label: "brand" },
        { value: "accent", label: "accent" },
        { value: "ink", label: "ink" },
        { value: "clay", label: "clay" },
      ] },
      { id: "hue", label: "Hue", type: "slider", def: 24, min: 0, max: 360, step: 1, unit: "deg" },
      { id: "sat", label: "Saturation", type: "slider", def: 62, min: 10, max: 100, step: 2, unit: "" },
    ],
    cssTemplate: `.demo-root { background: #f4efe8; color: #241b12; font-family: ui-monospace, monospace; }
.demo-root .tw-ramp { display: flex; border-radius: 10px; overflow: hidden; max-width: 460px; }
.demo-root .tw-ramp div { flex: 1; padding: 16px 0 8px; text-align: center; font-size: 10px; }
.demo-root .tw-a { background: hsl({hue} {sat}% 90%); }
.demo-root .tw-b { background: hsl({hue} {sat}% 76%); }
.demo-root .tw-c { background: hsl({hue} {sat}% 62%); }
.demo-root .tw-d { background: hsl({hue} {sat}% 48%); color: #fff; }
.demo-root .tw-e { background: hsl({hue} {sat}% 34%); color: #fff; }
.demo-root .tw-usage { margin-top: 14px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.demo-root .tw-btn { background: hsl({hue} {sat}% 48%); color: #fff; font-family: system-ui; font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 8px; }
.demo-root .tw-soft { background: hsl({hue} {sat}% 90%); color: hsl({hue} {sat}% 26%); font-family: system-ui; font-size: 12.5px; padding: 8px 12px; border-radius: 8px; }
.demo-root .tw-cap { font-size: 11.5px; opacity: .7; margin-top: 12px; font-family: system-ui; }`,
    demoHtml: `<div>
  <div class="tw-ramp">
    <div class="tw-a">100</div><div class="tw-b">300</div><div class="tw-c">500</div><div class="tw-d">700</div><div class="tw-e">900</div>
  </div>
  <div class="tw-usage">
    <span class="tw-btn">bg-{name}-700</span>
    <span class="tw-soft">bg-{name}-100 text-{name}-900</span>
  </div>
  <p class="tw-cap">Declare --color-{name}-* in @theme and every utility above exists: including {name}-500/40 opacity variants.</p>
</div>`,
    codeSnippets: {
      "@theme block": `/* app.css - Tailwind v4 */
@theme {
  /* hue {hue}, sat {sat}% */
  --color-{name}-100: hsl({hue} {sat}% 90%);
  --color-{name}-300: hsl({hue} {sat}% 76%);
  --color-{name}-500: hsl({hue} {sat}% 62%);
  --color-{name}-700: hsl({hue} {sat}% 48%);
  --color-{name}-900: hsl({hue} {sat}% 34%);
}
/* instantly available: bg-{name}-500, text-{name}-900, border-{name}-300, ring-{name}-500/40 */`,
      "v3 config": `/* tailwind.config.js (v3) - same ramp, JS object */
module.exports = {
  theme: {
    extend: {
      colors: {
        {name}: {
          100: "hsl({hue}, {sat}%, 90%)",
          300: "hsl({hue}, {sat}%, 76%)",
          500: "hsl({hue}, {sat}%, 62%)",
          700: "hsl({hue}, {sat}%, 48%)",
          900: "hsl({hue}, {sat}%, 34%)",
        },
      },
    },
  },
};`,
    },
    prompts: {
      cursor: `# Brand colour as Tailwind utilities

Register a "{name}" colour scale in @theme (Tailwind v4; if this repo is v3, extend tailwind.config.js instead) using hue {hue} and saturation {sat}%:
- 100/300/500/700/900 at lightness 90/76/62/48/34
Then sweep the repo and replace arbitrary values like bg-[#...] and inline styles with bg-{name}-*, text-{name}-*, border-{name}-* utilities. Report any pair where the new token visibly changes contrast.`,
      claude: `Act as a Tailwind specialist. Add a colour scale named {name} (hsl hue {hue}, saturation {sat}%, lightness stops 90/76/62/48/34 for 100-900) using Tailwind v4 @theme syntax - and show the v3 config equivalent. Then: (1) which utilities and opacity modifiers this unlocks, (2) a button (bg-{name}-700 on {name}-100 tint) and a badge example, (3) two contrast warnings a reviewer should check.`,
      chatgpt: `In Tailwind CSS v4, how do I add my own brand colours? Write an @theme block defining --color-{name}-100 through -900 using hsl({hue}, {sat}% , lightnesses 90/76/62/48/34), show three component classes that use them (button, soft card, badge), and mention how v3 differs (tailwind.config.js).`,
      lovable: `Use a brand scale named {name}: hsl({hue} {sat}%) from light 100 to deep 900. Buttons in {name}-700 with white text, soft tints in {name}-100 for backgrounds, borders in {name}-300. Consistent, token-driven, no raw hexes anywhere.`,
      generic: `Define a Tailwind-usable brand palette named {name} from hue {hue} and saturation {sat}% with five steps (100-900). Show v4 @theme and v3 config forms, example utilities (background, text, border, ring with opacity), and guidance on which step suits buttons versus tints.`,
    },
    mistakes: [
      "Declaring only one --color-brand and using /50, /80 opacity hacks for every state - lightness stops read better than alpha hacks on surfaces",
      "Leaving dozens of bg-[#hex] arbitrary values - the theme exists the day you sweep them out",
      "Name collisions: --color-{name} overriding an existing utility name unexpectedly",
      "Tailwind v3 repo with v4 syntax (or vice versa): check the project's actual version before pasting",
    ],
    tips: [
      "Odd numbers only (50-950 is Tailwind's own convention) - keep one lightness table, copy it per colour",
      "@theme variables also emit as plain CSS custom properties: use var(--color-{name}-500) in custom CSS",
      "For dark mode, override the same names inside .dark or a media query - utilities stay untouched",
      "text-{name}-700 on bg-{name}-100 is the classic accessible 'soft' combo; 500-on-white usually fails 4.5:1",
    ],
    related: ["hsl-color-system", "semantic-color-tokens", "font-pairing", "glassmorphism"],
    learnMore: [
      { label: "Tailwind v4: theme variables", url: "https://tailwindcss.com/docs/theme" },
      { label: "Tailwind: Colours", url: "https://tailwindcss.com/docs/colors" },
    ],
  },
];
