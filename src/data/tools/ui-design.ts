/* ══ ui-design tools ════════════════════════════════════════════════
   Original, plain-English explanations written for this site. Where an
   entry borrows an open-licensed recipe we record source{url,licence,
   author} and show attribution; otherwise "Learn more" points at the
   official documentation instead of copying it. ═══════════════════ */
import type { Tool } from "../../lib/tools/types";

export const UI_DESIGN_TOOLS: Tool[] = [
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    category: "ui-design",
    subcategory: "styles",
    aliases: ["frosted glass", "glass cards", "blur panel", "Apple glass effect"],
    summary: "Cards that look like frosted glass floating over your background.",
    description:
      "A panel becomes 'glass' when three things work together: it is semi-transparent, the content behind it is blurred (backdrop-filter), and it has a thin light border so you can feel its edge. The blur samples what is actually behind the card, so the effect only reads as glass when there is something colourful or textured underneath.",
    whenToUse: [
      "Over photos, gradients or busy hero sections where you want a floating panel",
      "Modals, command palettes and tooltips that sit above the page",
      "Apple-style marketing pages that want a soft, premium feel",
    ],
    whenNotToUse: [
      "Forms and long text blocks - transparency hurts readability and contrast",
      "Whole-page layouts: glass is an accent, five glass cards in a row looks like fog",
      "Old browsers without backdrop-filter support, unless you add a solid fallback",
    ],
    difficulty: "beginner",
    tags: ["css", "visual", "hero", "modal"],
    controls: [
      { id: "tint", label: "Glass tint", type: "color", def: "#ffffff" },
      { id: "opacity", label: "Frost amount", type: "slider", def: 55, min: 10, max: 95, step: 5, unit: "" },
      { id: "blur", label: "Blur", type: "slider", def: 14, min: 0, max: 40, step: 1, unit: "px" },
      { id: "radius", label: "Corner radius", type: "slider", def: 18, min: 0, max: 40, step: 2, unit: "px" },
      { id: "borderOn", label: "Light edge", type: "toggle", def: true, onValue: "1px solid rgba(255,255,255,0.45)", offValue: "none" },
      { id: "bg", label: "Scene colour", type: "color", def: "#3f2d5f" },
      { id: "accent", label: "Accent", type: "color", def: "#d98546" },
      { id: "text", label: "Text", type: "color", def: "#fbf7f1" },
    ],
    cssTemplate: `.demo-root { background: linear-gradient(140deg, {bg}, color-mix(in srgb, {accent} 35%, {bg})); }

.demo-root .glass-card {
  /* 1. tint + frost: the card itself */
  background: color-mix(in srgb, {tint} {opacity}%, transparent);

  /* 2. blur what is behind the card */
  -webkit-backdrop-filter: blur({blur}) saturate(1.4);
  backdrop-filter: blur({blur}) saturate(1.4);

  /* 3. shape + the light edge that makes the glass feel real */
  border-radius: {radius};
  border: {borderOn};
  box-shadow: 0 24px 48px -24px rgba(0, 0, 0, 0.45);

  padding: 24px;
  color: {text};
}

.demo-root .glass-card .chip.accent { background: {accent}; color: #fff; }
.demo-root .glass-card .blob { position: absolute; border-radius: 9999px; filter: blur(6px); }
.demo-root .glass-card .blob.b1 { width: 130px; height: 130px; left: -30px; top: -40px; background: {accent}; opacity: .8; }
.demo-root .glass-card .blob.b2 { width: 170px; height: 170px; right: -45px; bottom: -60px; background: {tint}; opacity: .35; }

/* fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .demo-root .glass-card { background: color-mix(in srgb, {tint} 88%, transparent); }
}`,
    demoHtml: `<div class="glass-card" style="position:relative; overflow:hidden; max-width:340px">
  <div class="blob b1"></div><div class="blob b2"></div>
  <div style="display:flex; align-items:center; justify-content:space-between; position:relative">
    <span class="chip accent" style="font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px">Live card</span>
    <span style="width:8px;height:8px;border-radius:99px;background:{accent}"></span>
  </div>
  <h4 style="margin:14px 0 6px; font-size:18px">Frosted panel</h4>
  <p style="margin:0; font-size:13px; line-height:1.55; opacity:.85">The blur samples the colourful scene behind me - drag the controls and watch both update.</p>
  <div style="display:flex; gap:8px; margin-top:16px">
    <span class="chip accent" style="font-size:12px; font-weight:700; padding:6px 12px; border-radius:999px">Upgrade ›</span>
    <span style="font-size:12px; padding:6px 12px; border-radius:999px; border:1px solid rgba(255,255,255,.4)">Learn more</span>
  </div>
</div>`,
    codeSnippets: {
      Tailwind: `<div class="bg-{tint}/[{opacity}] backdrop-blur-[{blur}] backdrop-saturate-150 rounded-[{radius}] border-white/40 shadow-2xl p-6 text-{text}">
  <!-- glass content -->
</div>
<!-- parent needs a colourful background, e.g. class="bg-[{bg}] relative overflow-hidden" -->`,
      "CSS variables": `:root {
  --glass-tint: {tint};
  --glass-frost: {opacity}%;
  --glass-blur: {blur};
  --glass-radius: {radius};
  --glass-edge: {borderOn};
}`,
    },
    prompts: {
      cursor: `# Glassmorphism card for this project

Add a reusable glass card component in the repo's existing style. Exact values (do not substitute your defaults):
- glass tint: {tint} at {opacity}% opacity, mixed over the scene colour {bg}
- backdrop-filter: blur({blur}) saturate(1.4) (include the -webkit- prefix)
- corner radius: {radius}, border: {borderOn}
- text colour: {text}, accent chip: {accent}
- large soft shadow: 0 24px 48px -24px rgba(0,0,0,.45)
- add an @supports fallback: if backdrop-filter is unavailable, raise opacity to 88%
Place the card over a colourful gradient hero so the blur is visible.`,
      claude: `Act as a meticulous front-end developer. Build one glassmorphism card component.

Requirements, with exact values:
- background: {tint} at {opacity}% transparency on a scene of {bg}
- frost: backdrop-filter blur({blur}) saturate(1.4), plus -webkit- prefix
- shape: border-radius {radius}; edge {borderOn}
- palette: text {text}, accent {accent}
- must degrade gracefully (solid-ish fallback without backdrop-filter support)
- accessibility: keep text contrast ≥ 4.5:1 against the frosted surface

Show the CSS and the markup, then explain in one short paragraph why the border matters.`,
      chatgpt: `Write the CSS and HTML for a frosted-glass "glassmorphism" card. Use exactly these values: tint {tint} at {opacity}% opacity, blur {blur}, radius {radius}, edge {borderOn}, scene background {bg}, text {text}, accent {accent}. Include the webkit prefix and a fallback for browsers without backdrop-filter. Keep it beginner-friendly: comment every line.`,
      lovable: `A hero section with a floating frosted-glass card: translucent {tint} panel, soft blur, rounded {radius} corners, thin light border, text {text} and an {accent} button, over a rich {bg} gradient background. Premium, Apple-like feel.`,
      generic: `Create a glassmorphism UI card: a semi-transparent {tint} panel at {opacity}% over a {bg} background, blurred with backdrop-filter ({blur}), rounded {radius}, with a subtle light edge ({borderOn}), {text} text and {accent} accents. Include a no-backdrop-filter fallback and keep contrast readable.`,
    },
    mistakes: [
      "Putting glass over a flat, single-colour background - there is nothing to frost, so it just looks like a washed-out box",
      "Reading text straight off a busy backdrop: raise the frost amount or add a tint until contrast passes 4.5:1",
      "Forgetting the fallback: without @supports, users on old browsers get an invisible card",
      "Glass everywhere at once - the effect is a highlight, not a theme",
    ],
    tips: [
      "saturate(1.3-1.5) next to the blur is what makes the frost look colourful instead of grey",
      "A top-light border (rgba white around 40%) sells the material more than any shadow",
      "Keep radius ≥ 12px; sharp corners read as acrylic, not glass",
      "Test in dark mode: a 55% white tint turns milky; try tinting with the scene colour instead",
    ],
    related: ["gradient-mesh", "soft-shadow-layers", "grain-texture", "modal-dialog"],
    learnMore: [
      { label: "MDN: backdrop-filter", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter" },
      { label: "MDN: @supports", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@supports" },
      { label: "Can I use: backdrop-filter", url: "https://caniuse.com/mdn-css_properties_backdrop-filter" },
    ],
  },

  /* ────────────────────────── styles ────────────────────────── */
  {
    id: "neumorphism",
    name: "Neumorphism (soft UI)",
    category: "ui-design",
    subcategory: "styles",
    aliases: ["soft ui", "pillowy buttons", "extruded plastic look", "double shadow"],
    summary: "Elements that look pressed out of the same clay as the background.",
    description:
      "One background colour plus two opposite shadows: a soft light from the top-left and a soft dark from the bottom-right. The element appears to bulge out of the page (or be pressed into it, using inset shadows). It feels calm and tactile - but because everything shares one colour, contrast is its eternal weakness.",
    whenToUse: [
      "Playful, tactile controls: toggles, sliders, media buttons",
      "Single-colour surfaces where you want depth without borders",
      "Widgets and dashboards aimed at a soft, physical feel",
    ],
    whenNotToUse: [
      "Anywhere text contrast matters - light-on-light neumorphic labels frequently fail 4.5:1",
      "Complex layouts: extruded everything reads as one blob of porridge",
      "Dark mode without redesigning the shadow colours (alpha-black alone disappears)",
    ],
    difficulty: "intermediate",
    tags: ["css", "shadows", "buttons", "visual"],
    controls: [
      { id: "base", label: "Clay colour", type: "color", def: "#e8e3da" },
      { id: "depth", label: "Softness", type: "slider", def: 12, min: 6, max: 24, step: 1, unit: "px" },
      { id: "radius", label: "Roundness", type: "slider", def: 18, min: 6, max: 36, step: 2, unit: "px" },
      { id: "accent", label: "Accent", type: "color", def: "#b4602c" },
      { id: "text", label: "Text", type: "color", def: "#4a4034" },
    ],
    cssTemplate: `.demo-root { background: {base}; }
.demo-root .neu {
  background: {base};
  border-radius: {radius};
  box-shadow:
    calc({depth} * -1) calc({depth} * -1) calc({depth} * 2) rgba(255,255,255,.75),
    {depth} {depth} calc({depth} * 2) rgba(90,70,40,.22);
}
.demo-root .neu.in {
  box-shadow:
    inset calc({depth} * -0.6) calc({depth} * -0.6) {depth} rgba(255,255,255,.6),
    inset {depth} {depth} {depth} rgba(90,70,40,.2);
}
.demo-root .neu-btn {
  padding: 12px 22px; font-weight: 600; font-size: 14px; color: {text};
  background: {base}; border: 0; border-radius: 999px;
  box-shadow: -6px -6px 12px rgba(255,255,255,.75), 6px 6px 12px rgba(90,70,40,.22);
}
.demo-root .neu-btn.on {
  box-shadow: inset -4px -4px 8px rgba(255,255,255,.6), inset 4px 4px 8px rgba(90,70,40,.22);
  color: {accent};
}
.demo-root .neu-row { display: flex; gap: 18px; align-items: center; }
.demo-root .neu-knob { width: 66px; height: 66px; border-radius: 50%; display: grid; place-items: center; }
.demo-root .neu-knob i { width: 22px; height: 22px; border-radius: 50%; background: {accent}; box-shadow: 0 0 0 6px color-mix(in srgb, {accent} 18%, {base}); }`,
    demoHtml: `<div style="display:flex; flex-direction:column; gap:20px; padding:6px; max-width:380px">
  <div class="neu" style="padding:18px 20px; display:flex; justify-content:space-between; align-items:center">
    <span style="font-size:13.5px; font-weight:600; color:{text}">Soft panel · pressed toggle</span>
    <span class="neu in" style="width:52px;height:28px;border-radius:999px;display:block;position:relative">
      <span style="position:absolute; right:4px; top:4px; width:20px;height:20px;border-radius:50%;background:{accent}"></span>
    </span>
  </div>
  <div class="neu-row">
    <div class="neu neu-knob"><i></i></div>
    <button class="neu-btn">Extruded</button>
    <button class="neu-btn on">Pressed</button>
  </div>
</div>`,
    codeSnippets: {
      "Reusable pair": `:root {
  --clay: {base};
  --neu-out: -{depth} -{depth} calc({depth} * 2) rgba(255,255,255,.75),
              {depth} {depth} calc({depth} * 2) rgba(90,70,40,.22);
  --neu-in: inset -{depth} -{depth} {depth} rgba(255,255,255,.6),
             inset {depth} {depth} {depth} rgba(90,70,40,.2);
}
.card  { background: var(--clay); box-shadow: var(--neu-out); border-radius: {radius}; }
.slot  { background: var(--clay); box-shadow: var(--neu-in);  border-radius: {radius}; }`,
    },
    prompts: {
      cursor: `# Neumorphism controls

Build neumorphic (soft UI) controls on a {base} clay background with exact values:
- extruded shadow: -{depth} -{depth} blur {depth}*2 light rgba(255,255,255,.75) + {depth} {depth} dark rgba(90,70,40,.22)
- pressed state: inset version at 60% strength
- radius {radius}, accent {accent}, text {text}
- deliver a toggle switch and a round knob; make the toggle's ON state use the pressed shadow
IMPORTANT: keep every text/label pair at 4.5:1 contrast - if {text} on {base} fails, darken the text only.`,
      claude: `Act as a careful UI engineer. Implement neumorphism with clay {base}: extruded and inset double shadows at {depth} depth, radius {radius}, accent {accent}. Build a toggle and a card. Then audit contrast: measure {text} on {base}; if under 4.5:1, state the adjusted text colour and add a visible focus ring (neumorphic surfaces swallow outlines). Explain both risks briefly.`,
      chatgpt: `Write CSS for a neumorphic button and toggle on background {base} using paired shadows (light rgba(255,255,255,.75) from top-left, warm rgba(90,70,40,.22) from bottom-right, offset {depth}). Show extruded and inset states, radius {radius}, accent {accent}. Then tell me the two accessibility problems with neumorphism and how you mitigated them in the code.`,
      lovable: `Soft-UI neumorphic widget set on {base} clay: a card, a toggle, and a round knob with {accent} centre. Double-shadow depth {depth}, roundness {radius}. Calm, tactile, one-colour world.`,
      generic: `Create a neumorphism (soft UI) style sheet: single clay {base}, extruded and inset shadow pairs at {depth}, radius {radius}, accent {accent}, text {text}. Include toggle, knob, card. Add contrast safeguards for text and focus visibility.`,
    },
    mistakes: [
      "Muted grey text on grey clay - the signature neumorphism contrast fail",
      "Using it for whole dashboards: extrusion everywhere removes all hierarchy",
      "Alpha-black shadows only - on coloured clay you need a coloured (warm/cool) shadow too",
      "No focus ring: default outlines disappear against same-colour surfaces",
    ],
    tips: [
      "Match the dark shadow to a hue in the clay (warm clay, brown shadow) - pure grey looks dusty",
      "Reserve the pressed (inset) state for 'on' and 'active' - that is the whole language",
      "Add 1px near-white border top-left if the light side fades on dim screens",
      "Keep accents saturated; everything else is one colour, so the accent carries the brand",
    ],
    related: ["soft-flat", "glassmorphism", "soft-shadow-layers", "button-press-feedback"],
    learnMore: [
      { label: "MDN: box-shadow", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow" },
      { label: "WCAG: contrast minimum", url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" },
    ],
  },
  {
    id: "brutalism",
    name: "Digital brutalism",
    category: "ui-design",
    subcategory: "styles",
    aliases: ["raw ugly style", "neo-brutalism", "thick black borders", "anti-design"],
    summary: "Deliberately raw: hard black borders, flat acid colours, no rounding apology.",
    description:
      "Neo-brutalism drops the polish: thick solid borders, offset hard shadows (no blur), loud fills, default-looking type set extra large. It signals confidence and poster energy, and it photographs brilliantly. The trick is that the rawness is precise: alignment is perfect even when the style says otherwise.",
    whenToUse: [
      "Creative portfolios, indie product launches, anything needing loud personality",
      "Poster-like sections that want to break a calm page at one point",
      "Stickers, badges, pricing tiles where chunky reads as honest",
    ],
    whenNotToUse: [
      "Enterprise tools, finance, health: trust signals point the other way",
      "Dense data screens - hard borders eat the space your numbers need",
      "Everywhere at once: brutalism is a shout, pages need whispers too",
    ],
    difficulty: "beginner",
    tags: ["css", "bold", "trend", "cards"],
    controls: [
      { id: "border", label: "Border weight", type: "slider", def: 3, min: 1, max: 6, step: 1, unit: "px" },
      { id: "offset", label: "Shadow punch", type: "slider", def: 8, min: 0, max: 16, step: 2, unit: "px" },
      { id: "bg", label: "Fill", type: "color", def: "#ffd94c" },
      { id: "page", label: "Page", type: "color", def: "#f3eee4" },
      { id: "ink", label: "Ink", type: "color", def: "#141414" },
    ],
    cssTemplate: `.demo-root { background: {page}; color: {ink}; }
.demo-root .br-card {
  background: {bg};
  border: {border} solid {ink};
  border-radius: 0;
  box-shadow: {offset} {offset} 0 {ink};          /* zero blur - that's the point */
  padding: 20px;
  max-width: 330px;
  transition: transform .12s ease, box-shadow .12s ease;
}
.demo-root .br-card:hover { transform: translate(2px, 2px); box-shadow: calc({offset} - 2px) calc({offset} - 2px) 0 {ink}; }
.demo-root .br-tag {
  display: inline-block; border: {border} solid {ink}; background: {page};
  font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase;
  padding: 3px 9px; margin-bottom: 12px;
}
.demo-root .br-head { font-size: 24px; font-weight: 900; line-height: 1.05; margin: 0 0 8px; letter-spacing: -0.01em; }
.demo-root .br-body { font-size: 13.5px; line-height: 1.5; margin: 0 0 14px; }
.demo-root .br-btn {
  font-family: inherit; font-weight: 800; font-size: 13px; text-transform: uppercase;
  border: {border} solid {ink}; background: {ink}; color: {bg};
  padding: 10px 16px; box-shadow: calc({offset} / 2) calc({offset} / 2) 0 {page}, calc({offset} / 2) calc({offset} / 2) 0 1px {ink};
}`,
    demoHtml: `<div class="br-card">
  <span class="br-tag">no mercy</span>
  <div class="br-head">Ship the loud version</div>
  <p class="br-body">Borders, hard shadows, acid fill. Hover me - the card leans into its own shadow instead of floating away from it.</p>
  <button class="br-btn">Do it live</button>
</div>`,
    codeSnippets: {
      "Tailwind": `<div class="bg-[{bg}] border-[{border}] border-[{ink}] rounded-none shadow-[{offset}_{offset}_0_{ink}] p-5 max-w-[330px]">
  <h3 class="text-2xl font-black leading-none">{ink} text</h3>
</div>`,
    },
    prompts: {
      cursor: `# Neo-brutalist section

Restyle this component in strict neo-brutalism, exact values:
- {border} solid {ink} borders EVERYWHERE, border-radius 0
- hard offset shadow: {offset}px {offset}px 0 {ink} (zero blur)
- fill {bg} on page {page}, ink {ink}
- uppercase 800-weight labels, 900-weight headline, letter-spacing tightened
- hover: translate(2px,2px) and shrink shadow by the same 2px (it presses INTO the page)
Keep alignment pixel-perfect and text contrast (it is usually fine: {ink} on {bg}) - verify anyway.`,
      claude: `Act as a bold UI designer. Build one neo-brutalist card: fill {bg}, {border} solid {ink} border, radius 0, hard shadow {offset}px offset with no blur, uppercase heavy labels, hover that translates toward the shadow. Then: (a) which WCAG aspects still need checking in this style, (b) why 'raw' still requires perfect grid alignment. Answer in under eight lines total, code first.`,
      chatgpt: `Give me the CSS for a neo-brutalist card: background {bg}, {border}px solid {ink} border, no border radius, box-shadow {offset}px {offset}px 0px {ink}, a hover state that nudges the element toward its shadow. Explain in two sentences why brutalist UIs need flawless alignment to look intentional rather than broken.`,
      lovable: `Neo-brutalist block: {bg} cards with {border} black borders, sharp corners, {offset}px hard offset shadows, huge black 900-weight headlines, uppercase stickers. Loud poster energy on {page}.`,
      generic: `Design a neo-brutalist UI card: flat {bg} fill, {border} solid {ink} borders, zero radius, {offset}px hard shadow without blur, very heavy uppercase type, press-in hover. Note where this style is appropriate and where it destroys trust.`,
    },
    mistakes: [
      "Rawness as sloppiness: misaligned grid, random paddings - brutalism must be exact to read as a choice",
      "Squint-test colours: acid fills at full saturation behind body copy make paragraphs illegible",
      "Tiny tap targets behind huge borders - chunky chrome can shrink usable area without anyone noticing",
      "Using it for forms users fill daily; personality fatigues where efficiency lives",
    ],
    tips: [
      "One shout per page: brutalist card inside a calm layout beats a fully brutal site",
      "Hover toward the shadow (translate + shrink shadow), not away - floating breaks the sticker illusion",
      "Keep type enormous and sparse; brutalism with dense small text is just an old spreadsheet",
      "Dither/scanline textures at 4-6% opacity add print flavour without hurting contrast",
    ],
    related: ["soft-flat", "border-gradient", "hero-section", "feature-card"],
    learnMore: [
      { label: "MDN: box-shadow (no blur)", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow" },
      { label: "wuhcag: colour and contrast", url: "https://www.wuhcag.com/color-contrast/" },
    ],
  },
  {
    id: "soft-flat",
    name: "Soft flat 2.0",
    category: "ui-design",
    subcategory: "styles",
    aliases: ["clean modern look", "flat design", "minimal cards", "notion-style ui"],
    summary: "Flat colours plus ONE whisper of shadow - the safe, professional default.",
    description:
      "Flat design removed gradients and bevels; flat 2.0 quietly re-admitted a single, very soft shadow and generous whitespace to say 'this is above that'. This is the Notion/Linear look: no visual effects, colours do the talking, depth is two steps maximum. It is boring for exactly the right reason: nothing competes with your content.",
    whenToUse: [
      "Products where content or data is the hero: docs, dashboards, editors",
      "You want 'trustworthy' without spending design budget on trends",
      "Foundations for a dark theme - flat surfaces convert cleanly",
    ],
    whenNotToUse: [
      "Marketing heroes that need emotional punch - add an accent moment elsewhere",
      "When your cards all sit on the same colour and the shadow is doing hierarchy work it cannot hold",
      "As an excuse for zero type craft: flat + default fonts = template smell",
    ],
    difficulty: "beginner",
    tags: ["css", "minimal", "dashboard", "cards"],
    controls: [
      { id: "surface", label: "Card", type: "color", def: "#ffffff" },
      { id: "page", label: "Page", type: "color", def: "#f6f5f3" },
      { id: "shadow", label: "Depth", type: "slider", def: 6, min: 0, max: 20, step: 1, unit: "px" },
      { id: "line", label: "Border tint", type: "slider", def: 8, min: 0, max: 24, step: 1, unit: "" },
      { id: "accent", label: "Accent", type: "color", def: "#3d64d6" },
    ],
    cssTemplate: `.demo-root { background: {page}; font-family: system-ui, sans-serif; }
.demo-root .sf-card {
  background: {surface};
  border: 1px solid rgba(20, 20, 25, calc({line} / 100));
  border-radius: 12px;
  box-shadow: 0 calc({shadow} / 3) {shadow} rgba(20, 20, 25, .05);
  padding: 18px 20px;
  max-width: 340px;
}
.demo-root .sf-title { font-size: 15px; font-weight: 650; color: #1c1d21; margin: 0 0 4px; }
.demo-root .sf-text { font-size: 13px; line-height: 1.55; color: #6b6f76; margin: 0 0 14px; }
.demo-root .sf-row { display: flex; gap: 8px; }
.demo-root .sf-a { background: {accent}; color: #fff; font-size: 12.5px; font-weight: 600; border: 0; padding: 8px 14px; border-radius: 8px; }
.demo-root .sf-b { background: transparent; color: #45484f; font-size: 12.5px; font-weight: 550; border: 1px solid rgba(20,20,25,.16); padding: 7px 13px; border-radius: 8px; }
.demo-root .sf-badge { font-size: 10.5px; font-weight: 700; color: {accent}; background: color-mix(in srgb, {accent} 10%, {surface}); padding: 3px 8px; border-radius: 999px; margin-bottom: 10px; display: inline-block; }`,
    demoHtml: `<div class="sf-card">
  <span class="sf-badge">Quarterly review</span>
  <div class="sf-title">Depth is measured in millimetres</div>
  <p class="sf-text">A {shadow}px soft shadow and a {line}% border tint are the entire recipe. Two layers, no drama - the text stays the protagonist.</p>
  <div class="sf-row"><button class="sf-a">Open</button><button class="sf-b">Share</button></div>
</div>`,
    codeSnippets: {
      "Elevation ladder": `:root {
  /* three stops, that's the whole ladder */
  --e-0: none;                                        /* page */
  --e-1: 0 calc({shadow} / 3) {shadow} rgba(20,20,25,.05);   /* cards */
  --e-2: 0 calc({shadow} / 2) calc({shadow} * 1.6) rgba(20,20,25,.10); /* menus, modals */
  --hairline: rgba(20,20,25, calc({line} / 100));
}`,
    },
    prompts: {
      cursor: `# Flat 2.0 surface system

Apply a minimal elevation system in this repo, exact values:
- page {page}, card {surface}, hairline border rgba(20,20,25,{line}%), shadow 0 {shadow}/3 {shadow} rgba(20,20,25,.05)
- one second stop for overlays at double blur/alpha; NOTHING higher (no third level)
- radius 12px on cards, 8px on buttons; accent {accent} used only for primary actions and badges
- remove any existing gradients or heavy shadows inside affected components`,
      claude: `Act as a minimal-UI specialist. Define a two-stop elevation system: {page} background, {surface} cards with a {line}%-alpha hairline and a {shadow}-blur whisper shadow, overlays at one stop higher, radius 12/8, accent {accent} reserved for primary. Write the CSS variables, a card + button pair, and state the two rules that keep flat design from looking flat-and-dead (type contrast + whitespace). Keep under 30 lines.`,
      chatgpt: `How do I get the clean Notion/Linear look in CSS? Write card styles with background {surface} on {page}, a {line}%-strength border, a soft {shadow}px shadow, 12px radius, accent {accent}. Explain why only two elevation levels and how buttons differ (primary filled, secondary outlined).`,
      lovable: `Minimal flat product UI: {page} background, {surface} cards, hairline borders at {line}, a single soft shadow of {shadow}, radius 12, one {accent} for primary actions only. Calm, professional, content-first.`,
      generic: "Create a flat-2.0 interface style: two surfaces ({page}/{surface}), hairline borders at {line}% alpha, one whisper shadow ({shadow}), 12px radius, accent {accent} only for primary actions. Give variables, a card example, and the two-stops-max rule with reasons.",
    },
    mistakes: [
      "Shadow creep: every component team adds 'their' blur - suddenly six elevations and a muddy page",
      "Card border and shadow both strong: pick one signal per pair, the other should whisper",
      "Using the accent for decoration, not meaning - then primary buttons cannot stand out",
      "Pure white on pure grey-less page with no borders - everything floats without order",
    ],
    tips: [
      "The border tint should derive from your ink at 6-10% alpha, never a beige hex someone liked",
      "Same shadow everywhere is what makes real products feel expensive; consistency > intensity",
      "Quiet design lives on type contrast: 600+ weights for titles, muted grey for secondary text",
      "In dark mode, elevation flips to lighter surfaces, not stronger shadows",
    ],
    related: ["brutalism", "neumorphism", "feature-card", "data-table"],
    learnMore: [
      { label: "MDN: box-shadow", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow" },
      { label: "Material: elevation (for contrast)", url: "https://m3.material.io/styles/color/system/overview" },
    ],
  },
  {
    id: "editorial-serif",
    name: "Editorial serif",
    category: "ui-design",
    subcategory: "styles",
    aliases: ["magazine look", "newspaper style", "serif headings", "substack vibe"],
    summary: "Big serif headlines, hairline rules, ink on newsprint - a page that reads printed.",
    description:
      "The editorial look borrows print typography: a high-contrast serif at display size, small uppercase eyebrows, thin rules separating sections, and lots of paper colour. It signals 'written by a human, worth reading'. The discipline: serif owns headlines only; keeping UI chrome sans stops it turning into a wedding invitation.",
    whenToUse: [
      "Blogs, essays, newsletters, long-form product writing",
      "About pages that should feel authored rather than generated",
      "Any calm, text-led brand (coffee, books, research)",
    ],
    whenNotToUse: [
      "Dense app UIs where 3-character labels live in tight cells",
      "When the serif's italic is your only emphasis - pair weights, not just slants",
      "Screens under 14px everywhere: serifs lose detail when tiny",
    ],
    difficulty: "beginner",
    tags: ["typography", "blog", "css", "serif"],
    controls: [
      { id: "serif", label: "Serif family", type: "select", def: "Fraunces", options: [
        { value: "Fraunces", label: "Fraunces (warm, modern)" },
        { value: "Newsreader", label: "Newsreader (newspaper)" },
        { value: "Lora", label: "Lora (soft book serif)" },
      ] },
      { id: "paper", label: "Paper", type: "color", def: "#f7f3ec" },
      { id: "ink", label: "Ink", type: "color", def: "#231c14" },
      { id: "rule", label: "Rule strength", type: "slider", def: 22, min: 8, max: 60, step: 2, unit: "" },
      { id: "head", label: "Headline size", type: "slider", def: 40, min: 28, max: 64, step: 2, unit: "px" },
    ],
    cssTemplate: `@import url("https://fonts.googleapis.com/css2?family={serif}:wght@400;600;700&display=swap");

.demo-root { background: {paper}; color: {ink}; }
.demo-root .ed-head {
  font-family: "{serif}", Georgia, serif;
  font-weight: 700; font-size: {head}; line-height: 1.04;
  letter-spacing: -0.02em; margin: 6px 0 0;
  max-width: 14ch;
}
.demo-root .ed-eyebrow {
  font-family: system-ui, sans-serif; font-size: 10.5px; font-weight: 600;
  letter-spacing: .16em; text-transform: uppercase; opacity: .6;
}
.demo-root .ed-rule { border: 0; border-top: 1px solid color-mix(in srgb, {ink} {rule}%, {paper}); margin: 14px 0; }
.demo-root .ed-body { font-family: "{serif}", Georgia, serif; font-size: 14.5px; line-height: 1.7; max-width: 40em; margin: 0; }
.demo-root .ed-body em { font-style: italic; }
.demo-root .ed-meta { font-family: ui-monospace, monospace; font-size: 11px; opacity: .55; margin-top: 12px; }`,
    demoHtml: `<div style="max-width:460px">
  <div class="ed-eyebrow">Field notes · No. 14</div>
  <h3 class="ed-head">Print manners for screens</h3>
  <hr class="ed-rule" />
  <p class="ed-body">The headline wears the serif at {head}; the paragraph below it keeps the same family but drops to reading size - <em>italic does the emphasis</em>, never bold. A rule at {rule}% ink strength separates the sections the way a newspaper column would.</p>
  <div class="ed-meta">{serif} · {paper} · 1px rule</div>
</div>`,
    codeSnippets: {
      "Section rules": `.section { border-top: 1px solid color-mix(in srgb, {ink} {rule}%, {paper}); padding: 40px 0; }
.section h2 { font-family: "{serif}", Georgia, serif; font-size: {head}; letter-spacing: -0.02em; line-height: 1.05; }
.eyebrow  { font-size: .68em; letter-spacing: .16em; text-transform: uppercase; opacity: .6; }`,
    },
    prompts: {
      cursor: `# Editorial serif treatment

Restyle the writing pages of this repo as print-editorial, exact values:
- headline: "{serif}" (Google Fonts, weights 400/600/700), size {head}, line-height ~1.05, letter-spacing -0.02em
- eyebrow labels: system sans, 10-11px, uppercase, .16em tracking, 60% opacity
- section dividers: 1px solid rules at {rule}% of {ink} mixed into {paper} (use color-mix)
- body prose stays "{serif}" at reading size, line-height 1.7, measure <= 40em
- emphasis via italic, never bold, in prose; ink {ink} on paper {paper}`,
      claude: `Act as an editorial web designer. Build a blog section header in print style: "{serif}" headline at {head} (tight leading and -0.02em tracking), uppercase tracked eyebrow in a sans, 1px section rules at {rule}% ink strength on {paper} with {ink} text, serif body at 1.7 line-height under a 40em measure. Explain the serif/sans role split (headings vs chrome) and why italic-not-bold for prose emphasis, in four sentences.`,
      chatgpt: `Create the HTML/CSS for a magazine-style article header: serif font "{serif}" headline at {head}, small uppercase eyebrow label with wide letter-spacing, thin horizontal rules made of {ink} at {rule}% opacity on {paper}, and one serif paragraph with line-height 1.7. Two sentences on what makes this 'editorial' rather than 'default browser serif'.`,
      lovable: `Editorial writing page: {paper} paper, {ink} ink, "{serif}" headlines at {head} with tight leading, hairline section rules at {rule}%, tiny uppercase eyebrows, serif prose with generous leading. Authored, calm, print-flavoured.`,
      generic: "Design an editorial (print-inspired) section: {serif} headline at {head}, uppercase eyebrow micro-labels, 1px rules at {rule}% ink on {paper}, serif prose 1.7 leading, 40em measure, ink {ink}. Explain heading-vs-chrome font roles and italic-emphasis etiquette.",
    },
    mistakes: [
      "Serif for every UI label - small serif hinting turns buttons into fuzz",
      "Rule-happy: six hairlines per screen reads as a form, not a magazine",
      "Body serif with default 1.15 leading - editorial prose lives or dies at 1.6-1.8",
      "Mixing three serifs; editorial is one voice at different sizes",
    ],
    tips: [
      "Reserve bold for headlines only; in prose, weight breaks the reading line while italic bends it",
      "Rules feel printed when they stop short of full width (max-content or column width)",
      "A drop-cap or numbered 'No. 14' eyebrow sells the format more than any ornament",
      "Warm off-white (like {paper}) + near-black beats white/black for the newsprint feel",
    ],
    related: ["reading-line-height", "font-pairing", "display-vs-body", "glassmorphism"],
    learnMore: [
      { label: "MDN: font-family", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-family" },
      { label: "Google Fonts: Fraunces specimen", url: "https://fonts.google.com/specimen/Fraunces" },
    ],
  },

  /* ──────────────────────── components ──────────────────────── */
  {
    id: "feature-card",
    name: "Feature card",
    category: "ui-design",
    subcategory: "components",
    aliases: ["icon card", "what we do card", "service card", "three-up cards"],
    summary: "Icon tile + title + two lines of text: the workhorse block of every landing page.",
    description:
      "A feature card packs one idea into a scan-friendly box: a small icon or number tile, a title that states the benefit, and body text that stays under three lines. The craft is in restraint - one hover change, one accent, aligned baselines across the row so three cards read as a set, not three widgets.",
    whenToUse: [
      "'What you get' sections with 3-6 parallel items",
      "Dashboards surfacing one metric or action per tile",
      "Any grid where items share the same shape of information",
    ],
    whenNotToUse: [
      "Items with wildly different content lengths - ragged cards make a grid look broken; use a list",
      "One single CTA: a full-width band beats a lonely card",
      "When the 'feature' needs a screenshot to explain - that wants a split layout, not a card",
    ],
    difficulty: "beginner",
    tags: ["css", "cards", "landing", "grid"],
    controls: [
      { id: "pad", label: "Inner padding", type: "slider", def: 20, min: 12, max: 32, step: 2, unit: "px" },
      { id: "radius", label: "Corner radius", type: "slider", def: 14, min: 0, max: 28, step: 2, unit: "px" },
      { id: "lift", label: "Hover lift", type: "slider", def: 4, min: 0, max: 10, step: 1, unit: "px" },
      { id: "tint", label: "Icon tile tint", type: "slider", def: 12, min: 4, max: 30, step: 1, unit: "" },
      { id: "accent", label: "Accent", type: "color", def: "#b4602c" },
      { id: "card", label: "Card face", type: "color", def: "#ffffff" },
    ],
    cssTemplate: `.demo-root { font-family: system-ui, sans-serif; }
.demo-root .fc {
  background: {card}; border: 1px solid rgba(30,25,18,.1);
  border-radius: {radius}; padding: {pad};
  max-width: 300px;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.demo-root .fc:hover {
  transform: translateY(-{lift});
  box-shadow: 0 calc({lift} * 2) calc({lift} * 4) rgba(30,25,18,.10);
  border-color: color-mix(in srgb, {accent} 40%, transparent);
}
.demo-root .fc-tile {
  width: 38px; height: 38px; border-radius: calc({radius} * .6);
  background: color-mix(in srgb, {accent} {tint}%, {card});
  display: grid; place-items: center; margin-bottom: 14px;
}
.demo-root .fc-tile svg { width: 19px; height: 19px; stroke: {accent}; fill: none; stroke-width: 1.8; }
.demo-root .fc h4 { margin: 0 0 6px; font-size: 15px; font-weight: 650; color: #231d15; }
.demo-root .fc p { margin: 0; font-size: 13px; line-height: 1.55; color: #6d655a; }
.demo-root .fc-link { display: inline-block; margin-top: 12px; font-size: 12.5px; font-weight: 600; color: {accent}; border-bottom: 1px solid transparent; }
.demo-root .fc:hover .fc-link { border-bottom-color: {accent}; }`,
    demoHtml: `<div class="fc">
  <div class="fc-tile"><svg viewBox="0 0 24 24"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M7 7l2 2m6 6 2 2m0-10-2 2m-6 6-2 2"/><circle cx="12" cy="12" r="3"/></svg></div>
  <h4>Everything in one place</h4>
  <p>Hover me. The lift, the tinted tile and the underline all come from the same accent - that coherence is what makes a card row feel designed.</p>
  <span class="fc-link">Learn more ›</span>
</div>`,
    codeSnippets: {
      "Grid row": `.fc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
/* auto-fit + minmax: 3 across on desktop, never squashed, never orphan-wrapped */`,
    },
    prompts: {
      cursor: `# Feature card component

Build/restyle the feature cards here with exact values:
- card face {card}, border rgba(30,25,18,.1), radius {radius}, padding {pad}
- icon tile 38px, background = accent {accent} tinted to {tint}% over the card face, radius {radius}*0.6
- hover: translateY(-{lift}), soft shadow, border shifts to 40% accent, link underline appears - ONE coordinated change, .18s ease
- title 15px/650 ink #231d15, body 13px #6d655a, max three lines of copy
- grid: repeat(auto-fit, minmax(240px,1fr))`,
      claude: `Act as a landing-page craftsman. Create a feature card: face {card}, radius {radius}, padding {pad}, {tint}% accent-tinted icon tile, accent {accent}; a single coordinated hover (lift {lift}px + shadow + border tint + link underline). Show the card plus its auto-fit grid. Then list the three copy rules that keep a card ROW aligned (parallel titles, ~same length bodies, one action each).`,
      chatgpt: `Write HTML/CSS for a feature card like modern SaaS sites: {card} background, {radius} corners, {pad} padding, a soft {tint}% tinted icon square in {accent}, 15px semibold title, 13px grey text, hover lift of {lift}px with a matching shadow. Also give the CSS grid line that shows 3 per row on desktop and stacks cleanly on mobile, and say why bodies should be the same length.`,
      lovable: `A three-up feature section: white {card} cards, {radius} corners, {tint}% {accent}-tinted icon tiles, short benefit titles, 2-3 line bodies, gentle {lift}px hover lift. Airy grid, one accent colour, nothing else shouting.`,
      generic: "Design a feature card component: {card} face, radius {radius}, padding {pad}, icon tile in {tint}% tint of accent {accent}, coordinated hover ({lift}px lift + shadow + border tint). Include the responsive grid rule and the copy constraints that make rows of cards look aligned.",
    },
    mistakes: [
      "Five hover changes per card (scale + glow + rotate + colour + parallax) - it reads as a toy",
      "Card bodies of 1 line next to 5 lines: the grid becomes a sawtooth; cut the copy instead of hiding it",
      "Icons in five different styles - pick one stroke width and one grid for the whole set",
      "Link text 'Click here' - say what happens: 'See the checklist ›'",
    ],
    tips: [
      "Title = benefit, body = how; if the body repeats the title, delete a card",
      "Icon tile tint between 10-14% keeps the row quiet; 30% turns icons into lollipops",
      "Keep max-width per card around 320px - measure beats stretching",
      "On mobile, prefer a 2-up grid of short cards or a single column of wide rows - 1 tall card per screen scans slowly",
    ],
    related: ["soft-flat", "bento-grid", "hero-section", "sticky-navbar"],
    learnMore: [
      { label: "MDN: CSS grid layout", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout" },
      { label: "MDN: color-mix()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix" },
    ],
  },
  {
    id: "modal-dialog",
    name: "Modal dialog",
    category: "ui-design",
    subcategory: "components",
    aliases: ["popup", "overlay", "lightbox", "confirm box"],
    summary: "A focused panel over dimmed page - and the keyboard rules that make it not trap anyone.",
    description:
      "A modal dims the page behind it, takes keyboard focus, and gives one decision. The visible part is easy; the professional part is behaviour: focus moves into the dialog, Tab cycles inside it, Escape closes it, and when it closes focus returns to the button that opened it. The HTML has all of this built in - <dialog> - use it before inventing a div.",
    whenToUse: [
      "One decision that interrupts the flow: confirm delete, quick edit, permission ask",
      "Lightbox image zoom where context disappears anyway",
      "Short forms you want filled without leaving the list you came from",
    ],
    whenNotToUse: [
      "Multi-step flows - use a page with a URL people can share and come back to",
      "Content people might want to read while working on something else",
      "On mobile when the keyboard will cover your inputs - a bottom sheet or route is kinder",
    ],
    difficulty: "intermediate",
    tags: ["html", "dialog", "keyboard", "accessibility"],
    controls: [
      { id: "dim", label: "Backdrop dim", type: "slider", def: 45, min: 20, max: 80, step: 5, unit: "" },
      { id: "blur", label: "Backdrop blur", type: "slider", def: 3, min: 0, max: 12, step: 1, unit: "px" },
      { id: "width", label: "Dialog width", type: "slider", def: 320, min: 240, max: 480, step: 20, unit: "px" },
      { id: "radius", label: "Corners", type: "slider", def: 14, min: 0, max: 24, step: 2, unit: "px" },
      { id: "accent", label: "Accent", type: "color", def: "#b0362b" },
    ],
    cssTemplate: `.demo-root { position: relative; background: #e9e2d6; min-height: 210px; overflow: hidden; }
.demo-root .md-page { padding: 16px; opacity: .5; }
.demo-root .md-page div { height: 10px; border-radius: 4px; background: #b9ae9c; margin-bottom: 8px; }
.demo-root .md-scrim {
  position: absolute; inset: 0;
  background: rgba(24, 18, 10, calc({dim} / 100));
  backdrop-filter: blur({blur});
  display: grid; place-items: center;
}
.demo-root .md-box {
  width: {width}; background: #fffdf9; color: #26201a;
  border-radius: {radius}; padding: 18px;
  box-shadow: 0 24px 60px -18px rgba(0,0,0,.45);
  font-family: system-ui, sans-serif;
}
.demo-root .md-title { font-size: 15px; font-weight: 650; margin: 0 0 6px; }
.demo-root .md-text { font-size: 12.5px; line-height: 1.55; color: #6b6256; margin: 0 0 16px; }
.demo-root .md-actions { display: flex; justify-content: flex-end; gap: 8px; }
.demo-root .md-cancel { background: none; border: 1px solid rgba(30,25,18,.2); border-radius: calc({radius} - 4px); font-size: 12.5px; font-weight: 550; padding: 8px 13px; color: #4a4338; }
.demo-root .md-ok { background: {accent}; color: #fff; border: 0; border-radius: calc({radius} - 4px); font-size: 12.5px; font-weight: 600; padding: 8px 13px; }`,
    demoHtml: `<div class="md-page"><div style="width:55%"></div><div style="width:80%"></div><div style="width:70%"></div><div style="width:62%"></div></div>
<div class="md-scrim">
  <div class="md-box" role="dialog" aria-modal="true" aria-labelledby="mdh">
    <h4 class="md-title" id="mdh">Delete this draft?</h4>
    <p class="md-text">The scrim dims and blurs the context so the decision is unmistakable. Escape closes; focus starts on Cancel, the safe button.</p>
    <div class="md-actions"><button class="md-cancel">Cancel</button><button class="md-ok">Delete</button></div>
  </div>
</div>`,
    codeSnippets: {
      "Native <dialog>": `<!-- the browser gives you: top layer, inert background, ESC to close -->
<dialog id="del">
  <form method="dialog">
    <h3>Delete this draft?</h3>
    <p>This cannot be undone.</p>
    <menu><button value="cancel">Cancel</button><button value="ok" autofocus>Delete</button></menu>
  </form>
</dialog>
<style>
dialog::backdrop { background: rgba(24,18,10, calc({dim} / 100)); }
dialog { border-radius: {radius}; width: min({width}, 92vw); padding: 18px; }
</style>
<script>
  del.showModal();                 // not show() - showModal makes the page behind inert
  del.addEventListener('close', () => openerButton.focus()); // return the focus
</script>`,
    },
    prompts: {
      cursor: `# Accessible modal using native <dialog>

Convert/build the delete-confirmation modal with <dialog> + method="dialog" form:
- ::backdrop rgba(24,18,10,{dim}%) with {blur} blur; panel width min({width}, 92vw), radius {radius}, on #fffdf9
- destructive action colour {accent}
- initial focus lands on Cancel; Escape closes; on close, return focus to the element that opened it
- labels: h1-equivalent aria-labelledby on the dialog; never rely on the dim alone to communicate mode
No custom focus-trap library unless the repo already has one.`,
      claude: `Act as an accessibility engineer. Implement a confirm-deletion modal with the native <dialog> element: backdrop {dim}% dim + {blur}px blur, panel {width} wide, radius {radius}, destructive accent {accent}. Handle: showModal vs show, autofocus on the safe action, Escape, focus return, and labelling via aria-labelledby. Show complete HTML/CSS/JS, then bullet what <dialog> gives you for free versus what you must still wire.`,
      chatgpt: `Write a modal dialog for 'Delete item?' using HTML's native <dialog> element with show(). Style: backdrop at {dim}% opacity with {blur}px blur, white panel {width} wide with {radius} corners, red {accent} for the destructive button. Then explain in five short points: focus in, focus trap, Escape, focus return, and why the cancel button should get first focus.`,
      lovable: `A centered confirmation modal over a dimmed {dim}%, lightly blurred ({blur}) page: white rounded ({radius}) card, {width} wide, quiet title, one grey Cancel and one {accent} Delete button. Serious, calm, keyboard-first.`,
      generic: "Build a keyboard-accessible modal (prefer native <dialog>): dim {dim}% blurred {blur} backdrop, {width} panel, radius {radius}, destructive {accent}. Cover focus entry, trap, Escape, return-focus, and safe-button-first autofocus with a short rationale per behaviour.",
    },
    mistakes: [
      "Custom div-modal without a focus trap: Tab walks into the invisible page behind it",
      "Initial focus on the destructive button - Enter-Enter deletes the thing",
      "Scroll lock missing: the page behind scrolls when the user tabs past the dialog",
      "Nesting modals (confirm inside confirm) - redesign the flow instead",
    ],
    tips: [
      "<dialog>.showModal() makes everything else inert for free - use it before any library",
      "Title in an h-level, dialog labelled by it; screen readers announce mode on entry",
      "Cancel-left / confirm-right matches reading order; keep that order consistent site-wide",
      "If your modal has a form with more than 4 fields, it is a page wearing a trench coat",
    ],
    related: ["glassmorphism", "toast-notification", "sticky-navbar", "accessible-contrast"],
    learnMore: [
      { label: "MDN: <dialog>", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog" },
      { label: "MDN: ::backdrop", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop" },
    ],
  },
  {
    id: "sticky-navbar",
    name: "Sticky navbar",
    category: "ui-design",
    subcategory: "components",
    aliases: ["fixed header", "top bar on scroll", "floating pill nav", "glass header"],
    summary: "The header that stays - with a blur or border that appears only once content scrolls under it.",
    description:
      "position: sticky keeps a nav in flow until it reaches the top edge, then pins it without the overlap tricks of fixed. The quality signal is the transition: at rest the bar is invisible (no border, no fill); the moment content slides under it, a hairline or a blur switches on. That single state change tells users 'you have left the top' better than any scroll bar.",
    whenToUse: [
      "Content pages longer than two screens where section jumps matter",
      "App shells where the primary action lives in the header",
      "Mobile: sticky beats scroll-to-top gestures every time",
    ],
    whenNotToUse: [
      "Short pages: a bar that pins on a one-screen page pins nothing",
      "When it eats half the phone viewport - shrink it or hide-on-scroll-down instead",
      "Marketing heroes that want the bar to vanish completely (portfolio-style auto-hide)",
    ],
    difficulty: "beginner",
    tags: ["css", "navigation", "scroll", "layout"],
    controls: [
      { id: "height", label: "Bar height", type: "slider", def: 52, min: 40, max: 72, step: 2, unit: "px" },
      { id: "blur", label: "Frost when stuck", type: "slider", def: 10, min: 0, max: 20, step: 2, unit: "px" },
      { id: "fill", label: "Fill opacity", type: "slider", def: 72, min: 0, max: 100, step: 4, unit: "" },
      { id: "radius", label: "Pill radius", type: "slider", def: 16, min: 0, max: 26, step: 2, unit: "px" },
      { id: "ink", label: "Ink", type: "color", def: "#26201a" },
    ],
    cssTemplate: `.demo-root { background: #efe8dc; position: relative; min-height: 200px; overflow: hidden; }
.demo-root .sk-nav {
  position: sticky; top: 8px;
  height: {height};
  display: flex; align-items: center; gap: 14px;
  padding: 0 16px; margin: 0 10px;
  color: {ink}; font-family: system-ui, sans-serif; font-size: 13px; font-weight: 550;
  border-radius: {radius};
  background: rgba(255,253,249, calc({fill} / 100));
  -webkit-backdrop-filter: blur({blur}); backdrop-filter: blur({blur});
  border: 1px solid rgba(38,32,26,.08);
  box-shadow: 0 6px 20px -8px rgba(38,32,26,.25);
  z-index: 2;
}
.demo-root .sk-nav .brand { font-weight: 750; letter-spacing: -.01em; margin-right: auto; }
.demo-root .sk-nav .cta { background: {ink}; color: #fdf9f2; padding: 7px 12px; border-radius: calc({radius} * .55); font-weight: 600; }
.demo-root .sk-scroll { padding: 12px 26px 20px; }
.demo-root .sk-line { height: 9px; border-radius: 5px; background: rgba(38,32,26,.12); margin-bottom: 10px; }`,
    demoHtml: `<nav class="sk-nav"><span class="brand">cyrus</span><span>Work</span><span>Journal</span><span class="cta">Sign in</span></nav>
<div class="sk-scroll">
  <div class="sk-line" style="width:88%"></div><div class="sk-line" style="width:70%"></div>
  <div class="sk-line" style="width:82%"></div><div class="sk-line" style="width:60%"></div>
  <div class="sk-line" style="width:76%"></div><div class="sk-line" style="width:66%"></div>
</div>`,
    codeSnippets: {
      "Scroll-aware state": `/* CSS-only: an IntersectionObserver sentinel adds .stuck */
header { position: sticky; top: 0; background: transparent; border-bottom: 1px solid transparent; transition: .25s ease; }
header.stuck { background: rgba(255,253,249, calc({fill} / 100)); backdrop-filter: blur({blur}); border-bottom-color: rgba(38,32,26,.1); }
/* js: new IntersectionObserver(([e]) => header.classList.toggle('stuck', e.intersectionRatio < 1), { threshold: [1] }).observe(sentinel); */`,
      "Reserve space": `/* sticky vs fixed: sticky keeps its slot, so NO offset hacks needed.
   if you do use fixed, pad the page: */
body { padding-top: {height}; }`,
    },
    prompts: {
      cursor: `# Sticky header with stuck-state

Make the site header position: sticky, height {height}, pill radius {radius}, ink {ink}:
- at rest: transparent fill, no border
- once stuck (IntersectionObserver sentinel with threshold [1] toggling .stuck): fill rgba(255,253,249,{fill}%), backdrop blur {blur}, 1px bottom hairline
- include -webkit-backdrop-filter
- z-index above content, and on mobile keep total height under 64px
No position: fixed unless the repo already depends on it.`,
      claude: `Act as a detail-obsessed front-end dev. Implement a sticky navbar (height {height}, radius {radius}, ink {ink}) whose frosted state ({fill}% fill, {blur}px blur, hairline) turns on ONLY when stuck, via an IntersectionObserver sentinel - explain why sticky+observer beats scroll listeners. Provide CSS + 8 lines of JS, plus the reduced-motion note for the transition.`,
      chatgpt: `What is the difference between position: sticky and fixed for a navbar? Then write a sticky header ({height} tall, {radius} pill) that is transparent at the top of the page and gains a {fill}% frosted fill with {blur}px blur plus a hairline once scrolled, using an IntersectionObserver. Comment the key lines.`,
      lovable: `Floating pill navbar: {height} tall, {radius} rounded, {ink} text, translucent frosted ({blur}) over the page at {fill}% fill, hairline edge, subtle shadow only after scroll. App-like, quiet.`,
      generic: "Explain sticky vs fixed navbars, then build one at {height}/{radius} with ink {ink}: transparent at rest, frosted ({fill}% + {blur}px blur + hairline) when stuck, detected with an IntersectionObserver sentinel rather than scroll events.",
    },
    mistakes: [
      "Blur at 0% opacity fill: backdrop-filter with a transparent background is invisible - the fill and blur are a pair",
      "Z-index wars: dropdowns, toasts and modals each +1 - set a scale (nav 10, overlays 40, modals 50) once",
      "Forgetting safe-area on notched phones: padding-top: env(safe-area-inset-top)",
      "iOS Safari + backdrop-filter on the root scroller can stutter under scroll; prefer an opaque fill there",
    ],
    tips: [
      "One hairline + 4% shadow sells 'stuck' cheaper than a heavy drop shadow",
      "Animate the border/background, not the transform - moving the bar breaks targeting",
      "Active-section highlighting: IntersectionObserver on sections, aria-current='true' on the match",
      "Test zoom at 200%: a sticky bar that overlaps its own content is a fixed-height bug",
    ],
    related: ["glassmorphism", "modal-dialog", "landing-page-flow", "hero-section"],
    learnMore: [
      { label: "MDN: position: sticky", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky_positioning" },
      { label: "MDN: IntersectionObserver", url: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" },
    ],
  },
  {
    id: "data-table",
    name: "Data table",
    category: "ui-design",
    subcategory: "components",
    aliases: ["table design", "rows of data", "admin table", "spreadsheet look"],
    summary: "Rows that scan: numbers right-aligned, zebra or hairlines (not both), one sticky header.",
    description:
      "Tables win when the eye can run a column like a ruler. That means: tabular figures so digits align vertically, right-aligned numbers and left-aligned labels, row height driven by density not decoration, and ONE separator strategy - hairlines or zebra stripes, never both. Header sticks; sorting and selection get visible affordances, not hover magic.",
    whenToUse: [
      "Comparable records with the same fields: orders, runs, deployments, budgets",
      "Admin/dashboard screens where scanning beats reading",
      "Exportable data people will want to select and copy",
    ],
    whenNotToUse: [
      "Mobile-first marketing: a card list of the same data almost always reads better below ~640px",
      "Fewer than three attributes per row - use a definition list",
      "When 'rows' are really paragraphs with links - that is a list, not a table",
    ],
    difficulty: "intermediate",
    tags: ["html", "dashboard", "css", "data"],
    controls: [
      { id: "density", label: "Row height", type: "slider", def: 34, min: 24, max: 52, step: 2, unit: "px" },
      { id: "fs", label: "Text size", type: "slider", def: 12.5, min: 11, max: 15, step: 0.5, unit: "px" },
      { id: "zebra", label: "Zebra stripes", type: "toggle", def: true, onValue: "rgba(38,32,26,.04)", offValue: "transparent" },
      { id: "head", label: "Header tint", type: "color", def: "#efe7da" },
      { id: "accent", label: "Accent", type: "color", def: "#b4602c" },
    ],
    cssTemplate: `.demo-root { font-family: system-ui, sans-serif; }
.demo-root table { border-collapse: collapse; width: 100%; max-width: 460px; background: #fffdf9; border: 1px solid rgba(38,32,26,.12); border-radius: 10px; overflow: hidden; font-size: {fs}; color: #33291d; }
.demo-root th {
  background: {head}; text-align: left; font-weight: 650; font-size: calc({fs} - 1px);
  letter-spacing: .04em; text-transform: uppercase; color: #6d6151;
  height: calc({density} + 4px); padding: 0 12px;
}
.demo-root td { height: {density}; padding: 0 12px; border-top: 1px solid rgba(38,32,26,.07); }
.demo-root tbody tr:nth-child(even) { background: {zebra}; }
.demo-root .num { text-align: right; font-variant-numeric: tabular-nums; }   /* digits stack like a ruler */
.demo-root td:first-child { font-weight: 600; }
.demo-root .up { color: #3f7d4f; font-weight: 600; } .demo-root .down { color: #b0362b; font-weight: 600; }
.demo-root tr:hover td { background: color-mix(in srgb, {accent} 7%, #fffdf9); }`,
    demoHtml: `<table>
  <thead><tr><th>Run</th><th>Started</th><th class="num">Duration</th><th class="num">Δ</th></tr></thead>
  <tbody>
    <tr><td>nightly-index</td><td>02:00</td><td class="num">8m 41s</td><td class="num up">+2.1%</td></tr>
    <tr><td>imports-eu</td><td>02:14</td><td class="num">41m 07s</td><td class="num down">-0.8%</td></tr>
    <tr><td>vector-sweep</td><td>03:30</td><td class="num">6m 03s</td><td class="num up">+5.4%</td></tr>
    <tr><td>digest-mail</td><td>06:00</td><td class="num">1m 52s</td><td class="num">+0.0%</td></tr>
  </tbody>
</table>`,
    codeSnippets: {
      "Sticky header": `thead th { position: sticky; top: 0; z-index: 1; background: {head}; }
/* wrapper needs: max-height + overflow-y: auto for the stick to have something to scroll in */
.tablewrap { max-height: 60vh; overflow: auto; }`,
      "Semantics + sort": `<table>
  <caption class="sr-only">Recent runs</caption>
  <th scope="col"><button aria-sort="descending">Duration ▾</button></th>
  <td headers="duration">8m 41s</td>
</table>
<!-- aria-sort tells screen readers the order; th scope + headers wire each cell to its column -->`,
    },
    prompts: {
      cursor: `# Scannable data table

Restyle the data tables in this app:
- row height {density}, font {fs}, header {head} tint with uppercase 650-weight labels
- numbers and deltas: text-align right + font-variant-numeric: tabular-nums; labels left
- separator: zebra stripes via {zebra} XOR row hairlines at rgba(38,32,26,.07) - implement ONLY the one the toggle chooses (currently {zebra})
- hover row: 7% {accent} wash; sticky thead inside a scrollable wrapper
- keep real <table> semantics with scope="col", th scope="row" where row headers exist, and aria-sort on sorted columns
Provide a card-list fallback under 640px.`,
      claude: `Act as a data-dense UI engineer. Style a runs table: {density} rows, {fs} text, {head} sticky header, tabular-nums right-aligned numerics, and exactly one row-separator system (choose {zebra}-stripes or hairlines and say why you chose it). Keep full table semantics (caption, scope, aria-sort) and give the <640px card-list pattern. List the three alignment rules of scannable tables.`,
      chatgpt: `Why do designers say 'never zebra AND gridlines'? Then write CSS for a table: {density} row height, {fs} text, {head} header, zebra {zebra}, right-aligned numbers using font-variant-numeric: tabular-nums, hover wash in {accent} at 7%, sticky header. Add two accessibility notes about <th scope> and sort announcement.`,
      lovable: `Admin data table: {head} uppercase headers, {density} tall airy rows, zebra at {zebra}, tabular right-aligned numbers, green/red deltas, soft {accent} hover wash. Dashboard-grade, scannable, sticky header.`,
     generic: "Design a scannable data table ({density} rows, {fs} text, {head} sticky header, {zebra} zebra or hairlines - pick ONE, tabular-nums right-aligned numerics, {accent} hover) with proper th/scope/aria-sort semantics and a mobile card fallback. State the alignment rules for labels vs numbers and why.",
    },
    mistakes: [
      "Proportional digits in numeric columns - '1' and '8' widths differ and the column ripples",
      "Centred everything: hierarchy dies; labels left, numbers right, statuses where they fit",
      "Zebra + full grid + heavy borders stacked - pick one separator system, thin as possible",
      "Clickable rows whose only hint is a cursor change: add hover wash and a visible target",
    ],
    tips: [
      "Density slider maps to real audiences: 28px ops dashboards, 34-40px mixed users, 48+ touch",
      "Put the sort affordance IN the th text (▾) plus aria-sort - invisible sorting is undiscovered sorting",
      "Empty cells lie: show 0 / — / 'pending' explicitly so column scan has rhythm",
      "If one column wraps to two lines often, that column has a design problem, not a width problem",
    ],
    related: ["soft-flat", "semantic-color-tokens", "toast-notification", "sidebar-app-shell"],
    learnMore: [
      { label: "MDN: table accessibility", url: "https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML#table_content" },
      { label: "MDN: font-variant-numeric", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric" },
    ],
  },
  {
    id: "toast-notification",
    name: "Toast notification",
    category: "ui-design",
    subcategory: "components",
    aliases: ["snackbar", "saved! popup", "little black box", "temporary alert"],
    summary: "The small corner confirmation that says 'it worked' - then gets out of the way.",
    description:
      "A toast reports something that already happened: saved, uploaded, failed. It appears in a consistent corner, never covers content the user is actively reading, disappears on its own (4-6 seconds), pauses on hover, and for errors, waits until told otherwise. Dark pill on light UI, one line of text, at most one action link. If it needs two actions or a paragraph, it is not a toast.",
    whenToUse: [
      "Confirmations for actions the user just took (save, copy, publish)",
      "Background completion notices (export ready)",
      "Short failures with a fix-it action (Retry)",
    ],
    whenNotToUse: [
      "Anything requiring a decision now - that is a modal or inline banner",
      "Marketing nudges; users resent being advertised to by system chrome",
      "Stacking >3: batch into one toast or move to a notification centre",
    ],
    difficulty: "beginner",
    tags: ["css", "feedback", "ux", "animation"],
    controls: [
      { id: "bg", label: "Pill colour", type: "color", def: "#221a13" },
      { id: "txt", label: "Text", type: "color", def: "#f7f1e6" },
      { id: "radius", label: "Corners", type: "slider", def: 10, min: 4, max: 22, step: 1, unit: "px" },
      { id: "life", label: "Visible for", type: "slider", def: 4.5, min: 2, max: 10, step: 0.5, unit: "s" },
      { id: "ok", label: "Status green", type: "color", def: "#5fd08a" },
    ],
    cssTemplate: `.demo-root { position: relative; min-height: 170px; background: #efe8dc; overflow: hidden; }
.demo-root .ts-page { padding: 16px; font-family: system-ui; color: #5a5348; font-size: 12.5px; }
.demo-root .ts-toast {
  position: absolute; right: 14px; bottom: 14px;
  background: {bg}; color: {txt};
  border-radius: {radius}; padding: 11px 14px;
  display: flex; align-items: center; gap: 10px;
  font-family: system-ui, sans-serif; font-size: 12.5px; font-weight: 500;
  box-shadow: 0 12px 30px -8px rgba(20,14,8,.5);
  animation: ts-in .28s cubic-bezier(.21,1.02,.73,1) both;
  max-width: 280px;
}
@keyframes ts-in { from { transform: translateY(14px); opacity: 0; } to { transform: none; opacity: 1; } }
.demo-root .ts-dot { width: 8px; height: 8px; border-radius: 50%; background: {ok}; flex: none; }
.demo-root .ts-act { margin-left: auto; color: {ok}; font-weight: 650; white-space: nowrap; cursor: pointer; }
.demo-root .ts-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: {ok}; opacity: .55;
  transform-origin: left; animation: ts-life {life} linear both; }
@keyframes ts-life { from { transform: scaleX(1); } to { transform: scaleX(0); } }`,
    demoHtml: `<div class="ts-page">Settings page behind the toast. One corner, one line, self-timed.</div>
<div class="ts-toast" role="status">
  <span class="ts-dot"></span>
  Changes saved
  <span class="ts-act">Undo</span>
  <span class="ts-bar"></span>
</div>`,
    codeSnippets: {
      "Behaviour JS": `const t = show("Changes saved", { ttl: ${"{life}"} }); // seconds
function show(msg, { ttl }) {
  const el = render(msg);
  const timer = setTimeout(close, ttl * 1000);
  el.addEventListener("mouseenter", () => clearTimeout(timer)); // pause on hover
  el.addEventListener("focusin",   () => clearTimeout(timer)); // pause for keyboard users
  return el;
}
/* region so screen readers announce it: */
<div aria-live="polite" aria-atomic="true" class="toast-zone"></div>
/* errors: aria-live="assertive" region + no auto-dismiss */`,
    },
    prompts: {
      cursor: `# Toast component

Build a toast system with exact styling/behaviour:
- pill: {bg} background, {txt} text, radius {radius}, bottom-right stack, max 3 visible
- entry: translateY(14px)+fade in .28s cubic-bezier(.21,1.02,.73,1); exit fade only
- auto-dismiss after {life}s with a bottom progress bar; hover or focus pauses the timer
- success dot {ok}; ONE optional action (Undo/Retry), right-aligned
- container: aria-live="polite" region; errors get assertive region and NO auto-dismiss
- never cover the bottom input bar on mobile - top placement there`,
      claude: `Act as a UX-systems engineer. Create a toast: {bg}/{txt} pill, {radius} radius, {life}s life with visible progress + hover/focus pause, one action slot, entry animation {short note on easing}. Explain the aria-live placement (polite container vs assertive for errors) and the mobile anchoring rule. Keep code under 60 lines, no libraries.`,
      chatgpt: `Design a 'toast' notification in CSS/HTML: dark pill {bg}, text {txt}, {radius} corners, slide-up fade-in, auto hide after {life}s with a thin {ok} progress bar, an Undo action, pause on hover. Then explain: when toasts should NOT auto-dismiss, what aria-live value the container needs, and max stack size.`,
      lovable: `Toast stack bottom-right: {bg} pills, {txt} text, {radius} corners, {ok} status dot, thin draining progress line over {life}s, subtle lift-in animation. Undo action in {ok}. Understated and fast.`,
      generic: "Specify a toast system: {bg}/{txt} pill, {radius}, {life}s timed with progress and hover-pause, single action, success {ok}; stack rules, corner placement, mobile re-anchoring, and the polite-vs-assertive live-region split for success vs error.",
    },
    mistakes: [
      "Toast for errors that auto-dismisses: the message nobody finished reading is a message that never appeared",
      "Firing three toasts for one save - batch into one line with the real count",
      "Live region per toast instead of one persistent container: announcements fire inconsistently",
      "Placing bottom-center on mobile above the keyboard or tab bar",
    ],
    tips: [
      "The progress bar is a courtesy timer: users forgive 4s when they can SEE 4s",
      "Undo inside the toast beats a confirm-dialog-before-action every time",
      "role=status = polite announcement without interrupting; use it for confirmations",
      "Cap the stack at 3 and collapse repeats of the same message instead of stacking clones",
    ],
    related: ["modal-dialog", "button-press-feedback", "stagger-entrance", "soft-flat"],
    learnMore: [
      { label: "MDN: aria-live", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live" },
      { label: "WAI-ARIA: status role", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role" },
    ],
  },

  /* ─────────────────────── layouts & pages ─────────────────────── */
  {
    id: "hero-section",
    name: "Hero section",
    category: "ui-design",
    subcategory: "layouts-and-pages",
    aliases: ["top of page", "landing header", "big headline block", "above the fold"],
    summary: "The first screen: one sentence of promise, one action, zero competing voices.",
    description:
      "A hero answers three questions in five seconds - what is this, who is it for, what do I do next. The layout that never fails: eyebrow (optional context), one large sentence (the promise), one supporting line (the how), one primary button plus one quiet link. Everything else - badges, logos, videos - is seasoning that must not outnumber the main course.",
    whenToUse: [
      "Any landing or product page's first screen",
      "Campaign pages where one offer needs one action",
      "Portfolio intros stating who you are in a single breath",
    ],
    whenNotToUse: [
      "App screens users return to daily - they want the workspace, not the pitch",
      "When you have two equally-important actions: pick one, defer the other below",
      "Full-viewport heroes on mobile: content hidden below the fold feels like a trap",
    ],
    difficulty: "beginner",
    tags: ["layout", "landing", "css", "conversion"],
    controls: [
      { id: "align", label: "Alignment", type: "select", def: "center", options: [
        { value: "center", label: "Centered (classic)" },
        { value: "start", label: "Left (product/SaaS)" },
      ] },
      { id: "head", label: "Headline size", type: "slider", def: 44, min: 30, max: 64, step: 2, unit: "px" },
      { id: "gap", label: "Breathing room", type: "slider", def: 56, min: 28, max: 96, step: 4, unit: "px" },
      { id: "bg", label: "Background", type: "color", def: "#f6f1e7" },
      { id: "ink", label: "Ink", type: "color", def: "#241c12" },
      { id: "accent", label: "Button", type: "color", def: "#b4602c" },
    ],
    cssTemplate: `.demo-root {
  background: {bg}; color: {ink}; font-family: system-ui, sans-serif;
  padding: {gap} 24px; text-align: {align};
  display: flex; flex-direction: column;
  align-items: {align}; justify-content: center;
}
.demo-root .h-eyebrow {
  font-size: 10.5px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
  color: {accent}; margin-bottom: 12px;
}
.demo-root .h-head {
  font-size: {head}; line-height: 1.06; font-weight: 750; letter-spacing: -0.025em;
  max-width: 17ch; margin: 0 0 12px;
}
.demo-root .h-sub { font-size: 14.5px; line-height: 1.6; color: color-mix(in srgb, {ink} 62%, {bg}); max-width: 46ch; margin: 0 0 calc({gap} * .45); }
.demo-root .h-acts { display: flex; gap: 12px; align-items: center; justify-content: {align}; flex-wrap: wrap; }
.demo-root .h-btn {
  background: {accent}; color: #fff; font-weight: 650; font-size: 14px;
  padding: 12px 22px; border-radius: 10px; border: 0;
  box-shadow: 0 10px 24px -10px color-mix(in srgb, {accent} 60%, transparent);
}
.demo-root .h-link { font-size: 13.5px; font-weight: 600; color: {ink}; opacity: .75; border-bottom: 1px dashed; padding-bottom: 1px; }`,
    demoHtml: `<div class="h-eyebrow">cyrus · artifacts</div>
<h1 class="h-head">Design words, explained in plain English</h1>
<p class="h-sub">Every style, component and layout catalogued with a live demo, copy-ready code and a prompt tuned for your AI tool. No jargon gatekeeping.</p>
<div class="h-acts"><button class="h-btn">Browse artifacts</button><span class="h-link">or open the builder</span></div>`,
    codeSnippets: {
      "Responsive headline": `h1 { font-size: clamp(28px, 6.5vw, {head}); line-height: 1.08; letter-spacing: -0.025em; max-width: 17ch; }
.hero { padding: clamp(32px, 9vh, {gap}px) 20px; min-height: min(88svh, 720px); display: grid; place-items: center; }
/* svh = small viewport height: the mobile-browser-chrome-safe unit */`,
    },
    prompts: {
      cursor: `# Hero section

Build the page hero with exact values:
- background {bg}, ink {ink}, {align} alignment
- eyebrow: 10-11px uppercase, .16em tracking, {accent}
- h1: {head} (clamp down for mobile), weight 700+, -0.025em tracking, max-width ~17ch, line-height 1.06
- subline 14.5px at 62% ink, max 46ch
- ONE primary button ({accent} filled, 12x22 padding, radius 10, soft accent-tinted shadow) + one quiet dashed link
- vertical padding {gap}; min-height min(88svh, 720px) on desktop, auto on mobile
No carousels, no third action, no countdown badges.`,
      claude: `Act as a conversion-minded designer. Build a hero: {align} on {bg}/ink {ink}; accented eyebrow; {head} headline with tight tracking capped around 17ch; 46ch subline at 62% ink; one {accent} CTA plus one quiet link; {gap} vertical rhythm. Then give the two sentences on why one action beats two, and the svh min-height note for mobile. Code compact and dependency-free.`,
      chatgpt: `Write an HTML/CSS hero section: {bg} background, centered/left ({align}) content, small uppercase accent eyebrow in {accent}, a {head} bold headline (tight letter-spacing, max 17ch), a grey supporting line, one filled {accent} button and one subtle text link, {gap} vertical padding. Explain which element answers which visitor question (what/who/next) in three bullets.`,
      lovable: `A hero on {bg} aligned {align}: {accent} eyebrow, huge {head} headline in {ink} with tight tracking, one calm subline, single {accent} button with soft glow plus a quiet secondary link. Generous {gap} breathing room. Confident, uncluttered.`,
      generic: "Compose a hero section (background {bg}, ink {ink}, {align} aligned, {head} headline at ~17ch, 46ch subline, one {accent} primary action + quiet link, {gap} padding). State the what/who/next rule and the mobile height handling.",
    },
    mistakes: [
      "Four CTAs, a video, three trust badges: the fold became a lobby",
      "Headline describing the feature instead of the outcome users want",
      "64px headline without a clamp - on a 360px phone it is a line-wrap disaster",
      "Hero image first, promise buried: people scroll past what they cannot parse in 3 seconds",
    ],
    tips: [
      "Read the hero as a stranger: if you cannot answer 'what is this' from headline+subline alone, rewrite",
      "max-width in ch on the headline (15-20ch) shapes a nicer block than any column grid",
      "The quiet secondary link lifts conversions when the primary asks for a commitment",
      "Above the fold means the BUTTON is above the fold on a phone, not just the words",
    ],
    related: ["landing-page-flow", "pricing-compare", "display-vs-body", "glassmorphism"],
    learnMore: [
      { label: "MDN: clamp()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp" },
      { label: "MDN: viewport units svh/dvh", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_units" },
    ],
  },
  {
    id: "bento-grid",
    name: "Bento grid",
    category: "ui-design",
    subcategory: "layouts-and-pages",
    aliases: ["apple widget layout", "sticker grid", "uneven cards", "feature mosaic"],
    summary: "Mixed-size tiles that fit like a lunch box - one grid, several stories.",
    description:
      "Bento is a grid where cells span different columns and rows: a big statement tile plus small detail tiles, all flush. It shows off many facets of a product without a boring four-across row of identical cards. The craft: consistent gaps and radii make the uneven sizes feel deliberate; the big cell carries the headline idea, small cells prove it.",
    whenToUse: [
      "Feature showcases with 4-8 unequal facts",
      "Dashboards where widgets genuinely differ in importance",
      "Portfolio and product tour pages that need visual rhythm",
    ],
    whenNotToUse: [
      "Truly equal items (pricing tiers, team members): identical cards are honest there",
      "When every tile needs the same text length - you have a card row in bento clothing",
      "Very dense numeric data: bento thrives on imagery and short statements",
    ],
    difficulty: "intermediate",
    tags: ["css", "grid", "layout", "showcase"],
    controls: [
      { id: "gap", label: "Gutters", type: "slider", def: 12, min: 6, max: 24, step: 1, unit: "px" },
      { id: "radius", label: "Tile radius", type: "slider", def: 16, min: 6, max: 26, step: 2, unit: "px" },
      { id: "big", label: "Hero tile share", type: "select", def: "2", options: [
        { value: "2", label: "2 columns wide" },
        { value: "3", label: "3 columns wide (dramatic)" },
      ] },
      { id: "bg", label: "Page", type: "color", def: "#f1ebe0" },
      { id: "t1", label: "Tile warm", type: "color", def: "#b4602c" },
      { id: "t2", label: "Tile deep", type: "color", def: "#3f2d5f" },
    ],
    cssTemplate: `.demo-root { background: {bg}; }
.demo-root .b-grid {
  display: grid; gap: {gap};
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 74px;
  max-width: 520px;
}
.demo-root .b-tile {
  border-radius: {radius}; padding: 14px 16px;
  font-family: system-ui, sans-serif; color: #fff;
  display: flex; flex-direction: column; justify-content: flex-end;
}
.demo-root .b-hero { grid-column: span {big}; grid-row: span 2; background: {t1}; }
.demo-root .b-a { grid-row: span 2; background: {t2}; }  /* auto-placed into the columns the hero leaves */
.demo-root .b-tall { grid-row: span 2; background: #2e5d46; }
.demo-root .b-wide { grid-column: span 2; background: #7a4a2f; }
.demo-root .b-sm { background: #46403a; }
.demo-root .b-t { font-size: 13.5px; font-weight: 700; letter-spacing: -.01em; }
.demo-root .b-s { font-size: 11px; opacity: .75; margin-top: 2px; }
@media (max-width: 560px) { .demo-root .b-grid { grid-template-columns: repeat(2, 1fr); } .demo-root .b-hero, .demo-root .b-a, .demo-root .b-wide { grid-column: span 2; } }`,
    demoHtml: `<div class="b-grid">
  <div class="b-tile b-hero"><div class="b-t">Everything ships from one board</div><div class="b-s">the statement tile - biggest cell, one sentence only</div></div>
  <div class="b-tile b-a"><div class="b-t">Live demos</div><div class="b-s">a proof tile beside it</div></div>
  <div class="b-tile b-tall"><div class="b-t">Prompts</div></div>
  <div class="b-tile b-wide"><div class="b-t">Fifteen hundred repos</div></div>
  <div class="b-tile b-sm"><div class="b-t">Fast</div></div>
  <div class="b-tile b-sm"><div class="b-t">Calm</div></div>
</div>`,
    codeSnippets: {
      "Span vocabulary": `.hero-tile { grid-column: span {big}; grid-row: span 2; }
side-tile  { grid-row: span 2; } /* auto-placement eats the columns the hero leaves */
tall-tile  { grid-row: span 2; }
wide-tile  { grid-column: span 2; }
/* keep ONE gap ({gap}) and ONE radius ({radius}) across every tile - that is what makes uneven feel ordered */`,
    },
    prompts: {
      cursor: `# Bento layout section

Build a bento grid: 4 columns, auto-rows around 74px, gap {gap}, all tiles radius {radius}.
- one hero tile spanning {big} columns x 2 rows (background {t1}), one side tile filling the remainder (background {t2}),
  one 1x2 tall, one 2x1 wide, two 1x1 - flush edges, no orphan gaps
- each tile: bottom-anchored bold 13-14px title + 11px supporting line at 75% opacity
- mobile 560px: collapse to 2 columns with hero/side/wide spanning both
Uniform gap and radius everywhere; uneven sizes are the only variation.`,
      claude: `Act as a layout engineer. Compose a 4-column bento grid (gap {gap}, radius {radius}) with tiles spanning {big}/remainder x 2 rows (colors {t1}, {t2}), a 1x2 tall, 2x1 wide and two squares - perfectly flush. Give the CSS grid (no frameworks) plus the 2-column mobile collapse. State the two invariants (gap, radius, typography anchor) that make unequal tiles look intentional.`,
      chatgpt: `Explain what a bento grid is and when it beats equal cards. Then write CSS grid code: 4 columns, {gap} gutters, a hero tile spanning {big} columns and 2 rows on {t1}, a {t2} side tile, one tall, one wide, two small tiles, {radius} corners, and a sensible 2-column mobile fallback.`,
      lovable: `Bento feature board: uneven tiles on one flush grid, {gap}px gutters, {radius} rounded corners, warm {t1} hero tile with a {t2} proof tile beside it, smaller stat tiles in deep earth tones, white bottom-anchored labels. Apple-keynote energy.`,
     generic: "Design a bento grid (4 cols, {gap} gap, {radius} radius): hero tile {big}x2 in {t1}, remainder tile in {t2}, tall/wide/small tiles, all flush, mobile 2-col collapse. Note when bento beats equal card rows and which invariants sell the look.",
    },
    mistakes: [
      "Mixed radii and gaps per tile - the grid instantly looks like a sticker accident",
      "Text-heavy small tiles: a 1x1 square is a caption, not an essay",
      "Spans that do not divide evenly into the column count - flushness is the contract",
      "Using bento for a table of equal things; inequality must encode importance",
    ],
    tips: [
      "Grid-template-areas reads better than spans for 6-tile arrangements; use spans when tiles are data-driven",
      "One sentence per tile, always: bento is a visual summary, the detail lives behind the link",
      "Vary tile colour, not effects: flat distinct fills + shared radius is the calm version of bento",
      "Add :has() or a span class so the last tile can absorb odd-count leftovers on mobile",
    ],
    related: ["feature-card", "hero-section", "glassmorphism", "sidebar-app-shell"],
    learnMore: [
      { label: "MDN: grid-column span", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column" },
      { label: "MDN: grid-auto-rows", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows" },
    ],
  },
  {
    id: "sidebar-app-shell",
    name: "App shell with sidebar",
    category: "ui-design",
    subcategory: "layouts-and-pages",
    aliases: ["dashboard layout", "admin panel frame", "left menu layout", "two pane app"],
    summary: "The frame under every dashboard: fixed nav rail, scrolling content, one header.",
    description:
      "An app shell is the non-content furniture: sidebar (or rail) for places, a top bar for the current thing, and a content column that scrolls independently. Two rules keep it sane: the sidebar is a fixed width so content never reflows when labels change, and inner scroll lives in the content pane, not the whole page.",
    whenToUse: [
      "Tools with 5+ destinations users memorise (dashboards, editors, admin)",
      "Sessions measured in hours where keyboard navigation matters",
      "Products that will grow sections - the shell absorbs them without redesign",
    ],
    whenNotToUse: [
      "Marketing sites: top nav is enough, sidebars compete with content",
      "Single-purpose tools with 2-3 screens - tabs are cheaper",
      "Content-heavy reading apps where the sidebar steals the measure",
    ],
    difficulty: "intermediate",
    tags: ["layout", "dashboard", "css", "app"],
    controls: [
      { id: "rail", label: "Sidebar width", type: "slider", def: 210, min: 64, max: 280, step: 10, unit: "px" },
      { id: "head", label: "Top bar height", type: "slider", def: 46, min: 36, max: 64, step: 2, unit: "px" },
      { id: "active", label: "Active item tint", type: "slider", def: 14, min: 4, max: 30, step: 2, unit: "" },
      { id: "bg", label: "Shell colour", type: "color", def: "#221a13" },
      { id: "accent", label: "Accent", type: "color", def: "#d98546" },
    ],
    cssTemplate: `.demo-root { font-family: system-ui, sans-serif; }
.demo-root .sh {
  display: grid;
  grid-template-columns: {rail} 1fr;
  grid-template-rows: {head} 1fr;
  grid-template-areas: "side head" "side main";
  height: 300px; border-radius: 12px; overflow: hidden;
  border: 1px solid rgba(30,24,16,.2); background: #faf7f1;
}
.demo-root .sh-side {
  grid-area: side; background: {bg}; color: rgba(255,250,240,.85);
  padding: 10px 8px; display: flex; flex-direction: column; gap: 2px; font-size: 12.5px;
}
.demo-root .sh-brand { font-weight: 750; color: #fff; padding: 6px 10px 10px; letter-spacing: -.01em; }
.demo-root .sh-item { padding: 7px 10px; border-radius: 8px; cursor: default; }
.demo-root .sh-item:hover { background: rgba(255,255,255,.07); }
.demo-root .sh-item.on { background: color-mix(in srgb, {accent} {active}%, transparent); color: #fff; }
.demo-root .sh-head {
  grid-area: head; border-bottom: 1px solid rgba(30,24,16,.1);
  display: flex; align-items: center; padding: 0 14px; gap: 10px; font-size: 12.5px; color: #6b6154;
}
.demo-root .sh-main { grid-area: main; overflow-y: auto; padding: 14px; }
.demo-root .sh-card { background: #fff; border: 1px solid rgba(30,24,16,.1); border-radius: 10px; padding: 12px; margin-bottom: 10px; font-size: 12px; color: #5c5347; }
.demo-root .sh-card b { color: #2a2117; font-size: 12.5px; display:block; margin-bottom: 3px; }`,
    demoHtml: `<div class="sh">
  <aside class="sh-side"><div class="sh-brand">◆ cyrus</div>
    <div class="sh-item on">Overview</div><div class="sh-item">Runs</div><div class="sh-item">Artifacts</div><div class="sh-item">Settings</div>
  </aside>
  <header class="sh-head">Overview <span style="margin-left:auto">⌕ search</span><span>Aditya</span></header>
  <main class="sh-main">
    <div class="sh-card"><b>Only the content column scrolls</b>drag-test: the sidebar and top bar hold still while this pane moves.</div>
    <div class="sh-card"><b>Fixed rail width</b>{rail} regardless of label length; it collapses to an icon rail, not a shrinking guess.</div>
    <div class="sh-card"><b>Active state</b>{accent} at {active}% tint - quiet highlight, no shouting.</b></div>
  </main>
</div>`,
    codeSnippets: {
      "Grid skeleton": `.app {
  display: grid;
  grid-template: "{head}px 1fr" / {rail} 1fr;
  grid-template-areas: "head head" "side main";
  height: 100dvh;                     /* dvh: correct under mobile browser chrome */
}
aside { grid-area: side; overflow-y: auto; }
main  { grid-area: main; overflow-y: auto; } /* inner scroll, one scroller */
@media (max-width: 900px) { .app { grid-template-columns: 64px 1fr; } /* icon rail */ }`,
    },
    prompts: {
      cursor: `# App shell layout

Lay out the dashboard shell with CSS grid: top bar {head}px full width, sidebar {rail}px fixed, content scrolls independently (overflow-y per region, body does not scroll), height 100dvh.
- sidebar {bg} with rgba(255,255,255,.07) hover, active item = {accent} at {active}% tint + white text
- at 900px the sidebar collapses to a 64px icon rail (tooltips + aria-labels required), at 640px it becomes a drawer
- keep destinations in a nav with aria-current="page" on the active one
Do not use position:fixed hacks for the sidebar - grid areas only.`,
      claude: `Act as an app-shell architect. Build the grid layout ({head}px header, {rail}px sidebar, independent scrolling regions, 100dvh): sidebar {bg} with {accent}/{active}% active tint. Specify the responsive contract (icon rail at 900, drawer at 640), and the accessibility wiring (nav landmarks, aria-current, focus-visible). Code first, then a five-line rationale for inner-scroll over page-scroll.`,
      chatgpt: `How do I build a dashboard layout where the sidebar and header stay put and only the content scrolls? Write CSS grid code with {head} header height, {rail} sidebar width, 100dvh page, overflow-y on main. Colors: sidebar {bg}, active item {accent} at {active}%. Also explain how the sidebar should behave on mobile.`,
      lovable: `Classic two-pane app shell: {bg} sidebar {rail} wide with {accent}-tinted active rows, {head}px top bar, white content column scrolling on its own. Dense but calm admin-tool energy.`,
      generic: "Design an app shell: CSS grid with {head}px header, fixed {rail}px sidebar ({bg}, {accent} active at {active}%), independently scrolling regions, 100dvh. Cover responsive rail/drawer breakpoints and landmark accessibility wiring.",
    },
    mistakes: [
      "Whole-page scroll instead of inner scroll: header drifts, sticky hacks stack, spinners lie",
      "Sidebar width fitting today's labels only - a 'Integrations' rename reflows the app",
      "Hiding the sidebar on mobile without a drawer: destinations become undiscoverable",
      "100vh on mobile: browser chrome eats 60-120px; use 100dvh or svh",
    ],
    tips: [
      "grid-template-areas makes the shell readable: 'head head' / 'side main' - future edits stay sane",
      "Icon-rail mode needs tooltips AND aria-labels; icons alone are a scavenger hunt",
      "One accent, used for: active row, primary button, focus rings - nowhere else",
      "Put the scroll container on main, and give overscroll-behavior: contain so chains don't hijack the page",
    ],
    related: ["data-table", "sticky-navbar", "bento-grid", "semantic-color-tokens"],
    learnMore: [
      { label: "MDN: grid-template-areas", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas" },
      { label: "MDN: overscroll-behavior", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior" },
    ],
  },
  {
    id: "landing-page-flow",
    name: "Landing page flow",
    category: "ui-design",
    subcategory: "layouts-and-pages",
    aliases: ["page structure", "section order", "how to order my landing page", "wireframe skeleton"],
    summary: "The six beats every long landing page dances to: promise, proof, shape, details, risk, ask.",
    description:
      "A landing page is an argument in order. Hero makes the promise; a logos/numbers band proves others care; a 'how it works' trio gives the shape; a features grid handles depth; a testimonial or demo defuses risk; the closing band asks for the action. Each section exists because of the doubt that arises at that exact scroll depth - reorder them and you reorder the doubts.",
    whenToUse: [
      "Product, service or launch pages that must convert cold visitors",
      "When feedback says 'nice but I don't get it' - structure, not style, is the complaint",
      "As a shared vocabulary to agree sections with your AI or designer before building",
    ],
    whenNotToUse: [
      "Docs and reference pages: those want navigation, not persuasion",
      "Very familiar audiences (returning users): straight to the tool",
      "As a cage - if a section has nothing true to say, cut it; six beats minimum, not law",
    ],
    difficulty: "beginner",
    tags: ["structure", "landing", "conversion", "planning"],
    controls: [
      { id: "space", label: "Section gap", type: "slider", def: 56, min: 32, max: 96, step: 4, unit: "px" },
      { id: "band", label: "Alt band tint", type: "slider", def: 6, min: 0, max: 20, step: 2, unit: "" },
      { id: "ink", label: "Ink", type: "color", def: "#241c12" },
      { id: "bg", label: "Page", type: "color", def: "#f6f1e7" },
      { id: "accent", label: "Accent", type: "color", def: "#b4602c" },
    ],
    cssTemplate: `.demo-root { font-family: system-ui, sans-serif; color: {ink}; }
.demo-root .lp { max-width: 420px; border: 1px solid color-mix(in srgb, {ink} 16%, {bg}); border-radius: 12px; overflow: hidden; background: {bg}; }
.demo-root .lp-sec {
  padding: calc({space} / 3) 16px;
  border-bottom: 1px dashed color-mix(in srgb, {ink} 12%, {bg});
  position: relative;
}
.demo-root .lp-sec:nth-child(even) { background: color-mix(in srgb, {ink} {band}%, {bg}); }
.demo-root .lp-n {
  position: absolute; left: 16px; top: 8px;
  font-family: ui-monospace, monospace; font-size: 9px; color: {accent}; letter-spacing: .1em;
}
.demo-root .lp-t { font-size: 12.5px; font-weight: 700; margin: 12px 0 3px; }
.demo-root .lp-d { font-size: 11px; line-height: 1.5; opacity: .65; margin: 0; }
.demo-root .lp-cta { background: {accent}; color: #fff; display:inline-block; font-size: 10px; font-weight: 700; padding: 5px 10px; border-radius: 6px; margin-top: 8px; }`,
    demoHtml: `<div class="lp">
  <div class="lp-sec"><span class="lp-n">01 · HERO</span><div class="lp-t">The promise</div><p class="lp-d">What it is, who it is for, one action.</p></div>
  <div class="lp-sec"><span class="lp-n">02 · PROOF</span><div class="lp-t">Others care</div><p class="lp-d">Logos, counts, ratings - one line, no paragraphs.</p></div>
  <div class="lp-sec"><span class="lp-n">03 · SHAPE</span><div class="lp-t">How it works</div><p class="lp-d">Three steps, verb first.</p></div>
  <div class="lp-sec"><span class="lp-n">04 · DEPTH</span><div class="lp-t">Feature cards</div><p class="lp-d">Benefit titles, short hows.</p></div>
  <div class="lp-sec"><span class="lp-n">05 · RISK</span><div class="lp-t">Voices + FAQ</div><p class="lp-d">Defuse the exact doubt at this depth.</p></div>
  <div class="lp-sec" style="border-bottom:0"><span class="lp-n">06 · ASK</span><div class="lp-t">Closing band</div><p class="lp-d">Same promise, bigger button.</p><span class="lp-cta">Start free</span></div>
</div>`,
    codeSnippets: {
      "Rhythm CSS": `section { padding-block: {space}; }                    /* the ONE section padding */
section:nth-child(even) { background: color-mix(in srgb, {ink} {band}%, {bg}); } /* alternating tint bands */
.wrap { max-width: 1080px; margin-inline: auto; padding-inline: 20px; }
h2 { font-size: clamp(22px, 3.2vw, 34px); max-width: 22ch; }`,
    },
    prompts: {
      cursor: `# Landing page skeleton

Restructure this page into six ordered sections with {space} vertical rhythm and even-section tint bands at {band}% of {ink} over {bg}:
01 hero (promise + single CTA) - 02 proof strip (one line, logos or counts) - 03 how-it-works (3 steps, verbs) - 04 feature grid (benefit-titled cards) - 05 risk reducers (testimonial + 4-item FAQ accordion) - 06 closing band (reprise of the promise, primary CTA in {accent}).
Each section gets an id for jump links and a single h2 (max 22ch). Reuse the repo's existing components; change order and copy slots, not the design system.`,
      claude: `Act as a landing-page strategist. Lay out six sections in persuasion order (promise, proof, shape, depth, risk, ask), styling rhythm: {space} section padding, {band}% alternating tint, ink {ink} on {bg}, CTA accent {accent}. For EACH section write: the doubt it answers, the one content format that fits, and a 1-line sample heading. Then list two reorderings that backfire and why.`,
      chatgpt: `What order should landing page sections go in and why? Give the six-beat structure (hero, proof, how-it-works, features, testimonials/FAQ, closing CTA), each with the visitor doubt it addresses, then produce semantic HTML skeleton tags (<section id> + h2) for all six with {space}px padding rhythm and alternating background tint of {band}%.`,
      lovable: `Long-scroll landing in warm {bg}/ink {ink}: promise hero, one-line proof strip, three-step how-it-works with numbers, feature card grid, testimonial plus FAQ, dark closing CTA band with {accent} button. {space}-like vertical rhythm, alternating {band}% tint bands.`,
      generic: "Plan a landing page flow: six beats in order (promise/proof/shape/depth/risk/ask), the doubt each answers, content formats per beat, and CSS rhythm rules ({space} padding, {band}% alternating bands, ink {ink}/{bg}, accent {accent}). Include section ids for navigation.",
    },
    mistakes: [
      "Features before proof: depth-sections land flat when nobody believes anyone uses it yet",
      "Six different background treatments - rhythm dies, scroll feels like a flea market",
      "The closing band asking something different than the hero promised (free trial became demo call)",
      "FAQ without real questions: write the five you actually hear in support",
    ],
    tips: [
      "Alternate a faint tint every other section ({band}% ink wash) - free rhythm without design work",
      "One message per section; if it needs 'also', it is two sections or a cut",
      "Section 02 can be numbers if logos are a lie; 12,000 developers beats three vanity logos",
      "Put the FAQ accordion right above the closing band - it answers objections at the moment of decision",
    ],
    related: ["hero-section", "feature-card", "pricing-compare", "stagger-entrance"],
    learnMore: [
      { label: "MDN: <section> semantics", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section" },
      { label: "MDN: nth-child tinting", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child" },
    ],
  },
  {
    id: "pricing-compare",
    name: "Pricing comparison",
    category: "ui-design",
    subcategory: "layouts-and-pages",
    aliases: ["plans table", "tiers", "how much page", "good better best"],
    summary: "Three columns, one highlighted, differences you can scan in ten seconds.",
    description:
      "Pricing pages fail when every tier looks equally important and features are listed by module rather than by outcome. The working pattern: three tiers maximum visible, the middle (or your target tier) visually pushed forward with an accent and a badge, features written as escalating outcomes, and a check/dash grid so the DIFFERENCES pop - identical rows are filler.",
    whenToUse: [
      "SaaS tiers where the decision is 'which plan', not 'whether'",
      "Add-on or seat comparisons inside an app",
      "Any good-better-best choice including hardware and services",
    ],
    whenNotToUse: [
      "Custom-quote-only enterprise: a blank 3-column table erodes confidence - use a capabilities page",
      "Single plan - there is nothing to compare; sell the plan instead",
      "When price changes weekly - put numbers elsewhere and link a live quote",
    ],
    difficulty: "beginner",
    tags: ["layout", "conversion", "cards", "commerce"],
    controls: [
      { id: "highlight", label: "Recommended colour", type: "color", def: "#b4602c" },
      { id: "lift", label: "Pop scale", type: "slider", def: 4, min: 0, max: 10, step: 1, unit: "px" },
      { id: "radius", label: "Card radius", type: "slider", def: 14, min: 0, max: 24, step: 2, unit: "px" },
      { id: "bg", label: "Page", type: "color", def: "#f4efe6" },
      { id: "ink", label: "Ink", type: "color", def: "#261d12" },
    ],
    cssTemplate: `.demo-root { font-family: system-ui, sans-serif; background: {bg}; padding: 10px; }
.demo-root .p-row { display: flex; gap: 10px; align-items: stretch; justify-content: center; }
.demo-root .p-card {
  background: #fffdf9; border: 1px solid color-mix(in srgb, {ink} 14%, {bg});
  border-radius: {radius}; padding: 14px 14px 12px; width: 132px;
  display: flex; flex-direction: column; color: {ink};
}
.demo-root .p-card.best {
  border: 2px solid {highlight};
  transform: translateY(-{lift});
  box-shadow: 0 16px 34px -14px color-mix(in srgb, {highlight} 55%, transparent);
  background: color-mix(in srgb, {highlight} 5%, #fffdf9);
}
.demo-root .p-badge {
  align-self: flex-start; background: {highlight}; color: #fff; font-size: 8.5px; font-weight: 800;
  letter-spacing: .08em; padding: 3px 7px; border-radius: 999px; margin-bottom: 7px; text-transform: uppercase;
}
.demo-root .p-name { font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; opacity: .6; }
.demo-root .p-price { font-size: 21px; font-weight: 800; letter-spacing: -.02em; margin: 3px 0 1px; }
.demo-root .p-per { font-size: 9.5px; opacity: .55; margin-bottom: 9px; }
.demo-root .p-feat { font-size: 10px; line-height: 1.5; padding: 3.5px 0; border-top: 1px solid color-mix(in srgb, {ink} 8%, {bg}); }
.demo-root .p-feat.no { opacity: .38; text-decoration: line-through; }
.demo-root .p-cta { margin-top: auto; padding-top: 10px; }
.demo-root .p-btn { width: 100%; text-align: center; font-size: 10.5px; font-weight: 700; padding: 8px 0; border-radius: calc({radius} * .55); background: color-mix(in srgb, {ink} 8%, {bg}); color: {ink}; }
.demo-root .best .p-btn { background: {highlight}; color: #fff; }`,
    demoHtml: `<div class="p-row">
  <div class="p-card"><div class="p-name">Hobby</div><div class="p-price">£0</div><div class="p-per">forever</div>
    <div class="p-feat">✓ 3 artifacts</div><div class="p-feat">✓ Live demos</div><div class="p-feat no">Team seats</div><div class="p-feat no">Priority prompts</div>
    <div class="p-cta"><div class="p-btn">Start free</div></div></div>
  <div class="p-card best"><span class="p-badge">Most picked</span><div class="p-name">Studio</div><div class="p-price">£12</div><div class="p-per">per month</div>
    <div class="p-feat">✓ Unlimited artifacts</div><div class="p-feat">✓ Live demos</div><div class="p-feat">✓ 5 team seats</div><div class="p-feat no">Priority prompts</div>
    <div class="p-cta"><div class="p-btn">Choose Studio</div></div></div>
  <div class="p-card"><div class="p-name">Agency</div><div class="p-price">£39</div><div class="p-per">per month</div>
    <div class="p-feat">✓ Unlimited artifacts</div><div class="p-feat">✓ Live demos</div><div class="p-feat">✓ 25 team seats</div><div class="p-feat">✓ Priority prompts</div>
    <div class="p-cta"><div class="p-btn">Go Agency</div></div></div>
</div>`,
    codeSnippets: {
      "Mobile stacking": `@media (max-width: 720px) {
  .p-row { flex-direction: column; align-items: stretch; }
  .p-card { width: auto; }
  .p-card.best { transform: none; order: -1; }   /* recommended FIRST on phones, no translate */
}`,
    },
    prompts: {
      cursor: `# Pricing comparison section

Build three tier cards (132px min, flex row): card face #fffdf9 on page {bg}, ink {ink}, radius {radius}, 1px {ink}14% borders.
- middle tier 'best': 2px {highlight} border, {lift}px upward translate, {highlight}-tinted fill and shadow, uppercase badge 'Most picked', filled {highlight} CTA; others ghost CTA
- features as ✓ / struck-dim rows with hairline separators; keep the FEATURE ORDER IDENTICAL across tiers so rows align - differences must pop
- price 21px 800-weight, period beneath at 55% opacity
- mobile: stack with .best via order:-1 (no transform), full-width cards
Copy: benefit-oriented feature names, no more than 5 rows per tier.`,
      claude: `Act as a pricing-page optimizer. Build a 3-tier flex comparison (radius {radius}, page {bg}, ink {ink}, recommended tier: {highlight} border/badge/CTA + {lift}px lift + 5% tint): identical feature-row order so differences scan, ✓/struck-dim pattern, mobile stack with the recommended card first via order, not translate. Then give three copy rules for tier names and feature lines that reduce comparison anxiety.`,
      chatgpt: `Design a pricing comparison section: three cards on {bg}, the middle one visually 'picked' with {highlight} border, badge, {lift}px raised position and tinted shadow, rows of features that align across tiers so only the differences stand out, and radius {radius} cards in ink {ink}. Give the HTML/CSS and then the mobile stacking behaviour, explaining why the highlighted card should still lead on phones.`,
      lovable: `Pricing trio on {bg}: quiet {ink} outline cards and one {highlight} recommended card raised {lift}px with a 'Most picked' pill, aligned feature rows with ✓ and faded strike-throughs, filled CTA only on the picked tier. Clean, decisive, ten-second scannable.`,
      generic: "Create a pricing comparison (3 tiers, {radius} cards on {bg}/{ink}): highlight the target tier with {highlight} (border, badge, CTA, {lift}px lift, tint), identical aligned feature rows where only differences pop, mobile stack preserving highlight order, plus copy rules for tier and feature naming.",
    },
    mistakes: [
      "Five visible tiers: choice paralysis arrives before the first price is read",
      "Per-tier feature lists in different orders - comparisons become archaeology",
      "Recommended tier highlighted by tiny text change; highlight costs real pixels (lift, border, fill)",
      "Annual toggle buried in grey when annual is the margin - default the toggle where you want the click",
    ],
    tips: [
      "Name tiers by who they're for (Hobby/Studio/Agency), not size (Small/Medium/Large)",
      "Five feature rows beat fifteen: the rest belongs on a comparison table below the fold",
      "Struck-through absent features outperform empty cells - absence must be unambiguous",
      "Put the money-back or cancel-anytime line INSIDE the best card's CTA zone, not a footer",
    ],
    related: ["landing-page-flow", "feature-card", "accessible-contrast", "hero-section"],
    learnMore: [
      { label: "MDN: flexbox ordering", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Ordering_flex_items" },
      { label: "MDN: color-mix()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix" },
    ],
  },

  /* ────────────────────────── motion ────────────────────────── */
  {
    id: "easing-basics",
    name: "Easing that feels right",
    category: "ui-design",
    subcategory: "motion",
    aliases: ["transition timing", "ease out", "animation feels robotic", "cubic bezier"],
    summary: "Things in real life speed up and slow down - linear motion is what makes UI feel cheap.",
    description:
      "An easing curve decides how speed changes across an animation. linear = constant, machine-like. ease-out = fast start, gentle landing: the workhorse for things ENTERING the screen (they arrive with energy, then settle). ease-in = gentle start, fast exit: only for things LEAVING. Pick the curve by physics, not taste: entering → out, exiting → in, both → the 'natural' cubic-bezier.",
    whenToUse: [
      "Every transition and keyframe animation you write - it is a two-word decision",
      "UI elements appearing: toasts, modals, dropdowns, page-enter (ease-out)",
      "Elements leaving: fading dialogs, collapsing panels (ease-in, shorter duration)",
    ],
    whenNotToUse: [
      "progress bars, spinners and marquees: those ARE constant-rate; linear is correct there",
      "Duration over ~400ms for UI: the curve stops mattering and waiting begins",
      "Bounce/elastic on anything users click repeatedly - novelty tax",
    ],
    difficulty: "beginner",
    tags: ["animation", "css", "timing", "ux"],
    controls: [
      { id: "curve", label: "Curve", type: "select", def: "cubic-bezier(.21,1.02,.73,1)", options: [
        { value: "linear", label: "linear (robot)" },
        { value: "ease", label: "ease (browser default)" },
        { value: "ease-out", label: "ease-out (arriving)" },
        { value: "ease-in", label: "ease-in (departing)" },
        { value: "cubic-bezier(.21,1.02,.73,1)", label: "natural (recommended)" },
        { value: "cubic-bezier(.7,0,.84,0)", label: "swift out (strong decel)" },
      ] },
      { id: "dur", label: "Duration", type: "slider", def: 0.6, min: 0.15, max: 1.2, step: 0.05, unit: "s" },
      { id: "dist", label: "Travel", type: "slider", def: 120, min: 40, max: 220, step: 10, unit: "px" },
      { id: "bg", label: "Track", type: "color", def: "#e8e0d2" },
      { id: "ball", label: "Object", type: "color", def: "#b4602c" },
    ],
    cssTemplate: `.demo-root { background: {bg}; padding: 18px 14px; }
.demo-root .eb-track { position: relative; height: 44px; margin-bottom: 14px; }
.demo-root .eb-ball {
  position: absolute; left: 4px; top: 8px; width: 28px; height: 28px; border-radius: 50%;
  background: {ball};
  animation: eb-slide {dur} {curve} infinite alternate;
}
@keyframes eb-slide { from { left: 4px; } to { left: {dist}; } }
.demo-root .eb-label { font-family: ui-monospace, monospace; font-size: 10.5px; color: #6b6152; margin: 0 0 4px; }
.demo-root .eb-note { font-family: system-ui; font-size: 11.5px; color: #6b6152; margin-top: 12px; max-width: 44ch; line-height: 1.5; }`,
    demoHtml: `<div>
  <p class="eb-label">animation: eb-slide {dur} {curve} infinite alternate;</p>
  <div class="eb-track"><div class="eb-ball"></div></div>
  <div class="eb-track" style="height:14px"><div style="height:6px;border-radius:3px;background:color-mix(in srgb,{ball} 35%, {bg});width:100%"></div></div>
  <p class="eb-note">Watch where the ball spends its time. linear glides evenly; ease-out rockets then settles - that settling IS the 'arrived' feeling. Compare against linear in ten seconds and you will never default to it again.</p>
</div>`,
    codeSnippets: {
      "Per-role curves": `:root {
  --ease-enter: cubic-bezier(.21, 1.02, .73, 1);  /* arriving: quick start, soft landing */
  --ease-exit:  cubic-bezier(.7, 0, .84, 0);      /* leaving:  lazy start, decisive exit */
  --ease-move:  cubic-bezier(.4, 0, .2, 1);       /* changing shape in place */
  --t-ui: 180ms;                                   /* hover/toggles: 120-220ms */
  --t-panel: 280ms;                                /* modals, drawers: 240-320ms */
}
.toast  { transition: transform var(--t-panel) var(--ease-enter), opacity var(--t-panel) var(--ease-enter); }
.dialog.closing { transition: opacity 160ms var(--ease-exit); }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }`,
    },
    prompts: {
      cursor: `# Motion timing rules

Normalise easing/durations in this repo to exactly:
- entering elements: cubic-bezier(.21,1.02,.73,1); leaving: cubic-bezier(.7,0,.84,0); in-place changes: cubic-bezier(.4,0,.2,1); linear ONLY for spinners/progress/marquees
- durations: micro 150ms, UI state {dur}s for panel-scale moves - define tokens --t-ui/--t-panel/--t-page
- sweep transitions/animations and replace bare 'ease' defaults with the role-based curve
- honour prefers-reduced-motion with a global duration kill-down
Report every place a leave-animation currently uses an enter curve (the classic wrong-direction move).`,
      claude: `Act as a motion designer. Codify an easing system: enter cubic-bezier(.21,1.02,.73,1), exit cubic-bezier(.7,0,.84,0), move cubic-bezier(.4,0,.2,1), durations {dur}s panels / 150ms micro, linear reserved for spinners. Output CSS tokens, one enter+exit transition pair for a toast, and the reduced-motion block. Then explain in four sentences why ease-out reads as 'arriving' and ease-in as 'departing' (physics of deceleration).`,
      chatgpt: `Explain CSS easing to a beginner: linear vs ease vs ease-out vs ease-in vs a cubic-bezier, and which to use for elements appearing vs disappearing vs loading bars. Give example transition declarations at {dur} duration with cubic-bezier(.21,1.02,.73,1) for a toast entering and cubic-bezier(.7,0,.84,0) for it leaving, and include the prefers-reduced-motion CSS.`,
      lovable: `Animations in this app should use one house curve: a natural cubic-bezier(.21,1.02,.73,1) for anything entering around {dur}, the mirrored swift-out for exits, linear only on spinners. Motion is how the interface says 'I got it', never decoration.`,
      generic: "Define a UI easing system: enter curve cubic-bezier(.21,1.02,.73,1), exit cubic-bezier(.7,0,.84,0), durations ({dur} panels, 150ms micro), linear only for continuous motion, reduced-motion fallback. Explain the arrival-vs-departure physics per curve.",
    },
    mistakes: [
      "ease-in on entering elements: the UI hesitates then slams - it feels laggy even when it is not",
      "ease-out on exits: the element crawls out of view and keeps you waiting at the door",
      "Same duration everywhere: 300ms on a hover AND a modal makes both wrong",
      "Forgetting reduced motion: vestibular users get sick of your beautiful slides",
    ],
    tips: [
      "Memory aid: ENTERS decelerate (ease-out), EXITS accelerate (ease-in) - opposite of intuition",
      "The 'natural' bezier slightly overshoots 1.0 - a 1-2px settle reads as physical weight",
      "Duration and easing are a pair: strong decel curves tolerate shorter times than linear",
      "Auditing tool: DevTools Animations pane shows each run on a timeline - watch the spacing of frames",
    ],
    related: ["stagger-entrance", "scroll-reveal", "button-press-feedback", "toast-notification"],
    learnMore: [
      { label: "MDN: cubic-bezier()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function" },
      { label: "MDN: prefers-reduced-motion", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion" },
    ],
  },
  {
    id: "stagger-entrance",
    name: "Staggered entrance",
    category: "ui-design",
    subcategory: "motion",
    aliases: ["items appear one by one", "cascade animation", "cards fade in sequence", "list animation"],
    summary: "Same animation, offset starts: a row arrives like a wave, not a slammed door.",
    description:
      "When several items appear together, giving each a small extra delay (40-80ms) turns a stack into a choreography. The eye gets a cheap sense of order and speed - the last card arrives before it can feel slow, because the FIRST one already explained what it is. The two rules: the step must be small, and the total (last delay + duration) must stay under ~500ms.",
    whenToUse: [
      "Grids and lists loading for the first time (search results, dashboards)",
      "Hero sections with stacked elements (eyebrow, headline, sub, CTA)",
      "Menu/drawer contents expanding",
    ],
    whenNotToUse: [
      "Anything the user triggers repeatedly - a stagger on every hover-state render is tax day",
      "Long lists (>20 items): stagger first ~8 then batch, or none",
      "When content is already cached on revisit - show it at once; the wave is a first-impression tool",
    ],
    difficulty: "beginner",
    tags: ["animation", "css", "lists", "loading"],
    controls: [
      { id: "step", label: "Delay per item", type: "slider", def: 60, min: 20, max: 140, step: 10, unit: "ms" },
      { id: "dur", label: "Each takes", type: "slider", def: 320, min: 150, max: 600, step: 10, unit: "ms" },
      { id: "rise", label: "Rise distance", type: "slider", def: 14, min: 4, max: 40, step: 2, unit: "px" },
      { id: "bg", label: "Backdrop", type: "color", def: "#f3ecdf" },
      { id: "card", label: "Cards", type: "color", def: "#ffffff" },
    ],
    cssTemplate: `.demo-root { background: {bg}; padding: 16px; }
.demo-root .sg-row { display: flex; gap: 10px; }
.demo-root .sg {
  flex: 1; background: {card}; border-radius: 10px; height: 74px;
  border: 1px solid rgba(40,30,16,.1);
  box-shadow: 0 8px 18px -12px rgba(40,30,16,.35);
  padding: 10px 12px; font-family: system-ui; font-size: 11.5px; color: #6a5f4e;
  animation: sg-in {dur} cubic-bezier(.21,1.02,.73,1) both;
}
.demo-root .sg:nth-child(1) { animation-delay: calc(0 * {step}); }
.demo-root .sg:nth-child(2) { animation-delay: calc(1 * {step}); }
.demo-root .sg:nth-child(3) { animation-delay: calc(2 * {step}); }
.demo-root .sg:nth-child(4) { animation-delay: calc(3 * {step}); }
@keyframes sg-in {
  from { opacity: 0; transform: translateY({rise}); }
  to   { opacity: 1; transform: none; }
}
.demo-root .sg b { display: block; color: #2c2417; font-size: 12.5px; margin-bottom: 2px; }
.demo-root .sg-cap { font-family: ui-monospace, monospace; font-size: 10px; color: #8a7c62; margin-top: 12px; }`,
    demoHtml: `<div>
  <div class="sg-row">
    <div class="sg"><b>Runs</b>3 active</div>
    <div class="sg"><b>Saves</b>128 today</div>
    <div class="sg"><b>Artifacts</b>961 indexed</div>
    <div class="sg"><b>Uptime</b>99.98%</div>
  </div>
  <div class="sg-cap">delay = index x {step} · duration {dur} · rise {rise}</div>
</div>`,
    codeSnippets: {
      "One line, any count": `/* the modern one-liner: no nth-child chain needed */
.item {
  animation: sg-in {dur} cubic-bezier(.21,1.02,.73,1) both;
  animation-delay: calc(var(--i) * {step});
}
<!-- <div class="item" style="--i:0"> ... --i:1 ... --i:2 -->

/* or in JS: children.forEach((el, i) => el.style.setProperty('--i', i)); */`,
      "Pure CSS chain": `@media (prefers-reduced-motion: no-preference) {
  .grid > *:nth-child(1) { animation-delay: 0ms; }
  .grid > *:nth-child(2) { animation-delay: {step}ms; }
  .grid > *:nth-child(3) { animation-delay: calc(2 * {step}); }
  .grid > *:nth-child(4) { animation-delay: calc(3 * {step}); }
}`,
    },
    prompts: {
      cursor: `# Staggered entrance on first paint

Animate the {bg}-backed card row / results grid once on mount:
- per item: opacity 0→1 + translateY({rise}), {dur} cubic-bezier(.21,1.02,.73,1), animation-delay calc(var(--i) * {step})
- set --i via style attribute or a one-line forEach; cap stagger at the first 8 items (rest 0 delay)
- 'both' fill mode so nothing flashes visible before its turn
- wrap in @media (prefers-reduced-motion: no-preference); only animate on FIRST render / new result sets, never on re-renders from interaction
Replay button not needed; refresh is the replay.`,
      claude: `Act as a motion engineer. Implement a staggered grid entrance: rise {rise}, duration {dur}, per-index delay calc(var(--i) * {step}) with a cap of 8 staggered items, fill-mode both, gated by prefers-reduced-motion, and only triggered on first render (not on every data change - say exactly how you gate that in the repo's framework). Keep it under 45 lines and list the two bugs (flash-of-visible, animation-replay) your solution prevents.`,
      chatgpt: `How do I make a row of cards fade in one after another instead of all at once? Write CSS using animation-delay: calc(var(--i) * {step}) with translateY({rise}) and {dur} duration, plus the tiny JS that sets --i per child. Explain why the delay step must stay under ~80ms and why re-animating on every update is bad.`,
      lovable: `First-load choreography on {bg}: cards rise {rise}px and bloom in over {dur}, each one {step} behind the last, wave limited to the first eight, instant afterwards. Same calm as a well-set hero fade.`,
      generic: "Build a staggered entrance: {dur} rise of {rise} with delays of {step} per index via CSS custom property, capped at 8 items, fill both, reduced-motion gated, first-render only. Explain the math of total time and the two classic bugs.",
    },
    mistakes: [
      "Delay steps of 150-200ms: the last card lands like it is stuck in traffic",
      "Re-running the stagger on every state update - users click a filter and watch fireworks again",
      "Missing 'both' fill: items render visible, then snap back to invisible, then animate - a triple flash",
      "Staggering infinite loops/progress elements: the wave is an entrance tool, not a permanent state",
    ],
    tips: [
      "Sweet spot: step 40-70ms with duration 250-350ms - total under 500ms for the last finish",
      "Animate opacity + transform only (GPU-friendly); never stagger layout properties like margin",
      "Reverse stagger for exits (last leaves first) if you animate out at all - or skip exits entirely for lists",
      "Set the container's height/min-height so the stagger causes zero layout shift (CLS)",
    ],
    related: ["easing-basics", "scroll-reveal", "skeleton-loading", "hero-section"],
    learnMore: [
      { label: "MDN: animation-delay", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-delay" },
      { label: "MDN: calc() with custom properties", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/calc" },
    ],
  },
  {
    id: "scroll-reveal",
    name: "Scroll reveal",
    category: "ui-design",
    subcategory: "motion",
    aliases: ["animate on scroll", "fade in when visible", "aos", "sections appear on scroll"],
    summary: "Sections introduce themselves as they enter view - once, quietly, without a library.",
    description:
      "Reveal-on-scroll defers an element's entrance animation until IntersectionObserver says it is on screen. Done well it is invisible craft: one small rise, ~400ms, fires once, never replays, never hides content from users with JS disabled or reduced-motion. Done badly (huge slides, every element twice, scroll-jacking) it is the single most reliable tell of an AI-generated template page.",
    whenToUse: [
      "Long marketing pages where sections genuinely arrive in order",
      "Image-heavy blocks where animating pre-viewport content wastes first paint",
      "Any reveal that improves the arrival of a page's argument beats a static wall",
    ],
    whenNotToUse: [
      "Above the fold - that entrance belongs to page-load stagger, not scroll",
      "App interfaces: operators see the same sections daily; a daily animation is a daily tax",
      "When the pattern is applied to EVERYTHING: reveals are punctuation, not punctuation marks on every word",
    ],
    difficulty: "intermediate",
    tags: ["animation", "javascript", "observer", "landing"],
    controls: [
      { id: "rise", label: "Rise", type: "slider", def: 24, min: 8, max: 60, step: 2, unit: "px" },
      { id: "dur", label: "Duration", type: "slider", def: 420, min: 200, max: 800, step: 20, unit: "ms" },
      { id: "at", label: "Trigger at", type: "select", def: "0.15", options: [
        { value: "0.05", label: "barely peeking (10%)" },
        { value: "0.15", label: "first bite (15%)" },
        { value: "0.35", label: "confident (35%)" },
      ] },
      { id: "bg", label: "Page", type: "color", def: "#efe7d9" },
    ],
    cssTemplate: `.demo-root { background: {bg}; position: relative; min-height: 190px; overflow: hidden; padding: 12px; }
.demo-root .sr-window { position: relative; height: 168px; overflow: hidden; border-radius: 12px; border: 1px dashed rgba(50,38,20,.3); }
.demo-root .sr-section {
  position: absolute; left: 12px; right: 12px; padding: 12px 14px;
  background: #fffdf8; border-radius: 10px; border: 1px solid rgba(50,38,20,.12);
  font-family: system-ui; font-size: 11.5px; color: #6b5f4c;
  animation: sr-cycle 3.4s ease-in-out infinite;
}
@keyframes sr-cycle {
  0%   { opacity: 0; transform: translateY({rise}); top: 118px; }
  22%  { opacity: 1; transform: none; top: 62px; }
  70%  { opacity: 1; transform: none; top: 38px; }
  92%, 100% { opacity: 0; transform: translateY(calc({rise} / -2)); top: 8px; }
}
.demo-root .sr-section b { display: block; font-size: 12.5px; color: #2e2517; margin-bottom: 3px; }
.demo-root .sr-edge { position:absolute; left:0; right:0; top: calc(168px * {at} * 3); height: 0; border-top: 2px solid rgba(180,96,44,.5); }
.demo-root .sr-cap { font-family: ui-monospace, monospace; font-size: 9.5px; color: #8a7a5e; position: absolute; bottom: 16px; left: 18px; }`,
    demoHtml: `<div class="sr-window">
  <div class="sr-edge"></div>
  <div class="sr-section"><b>The section scrolls up</b>the marker line is where {at} of it entering triggers .in - once.</div>
  <div class="sr-cap">transform: translateY({rise}) → none · {dur}ms</div>
</div>`,
    codeSnippets: {
      "The whole library": `<!-- CSS: the resting state must be the ANIMATED-away state only when JS runs -->
.js [data-reveal] { opacity: 0; transform: translateY({rise}); }
.js [data-reveal].in { opacity: 1; transform: none; transition: {dur} cubic-bezier(.21,1.02,.73,1); }

<script>
document.documentElement.classList.add('js');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) {
      e.target.classList.add('in'); io.unobserve(e.target);   // fires ONCE, never replays
    }
  }, { threshold: {at} });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
</script>`,
    },
    prompts: {
      cursor: `# Scroll reveal, no library

Wire [data-reveal] sections: initial hidden state applied ONLY under a html.js class AND @media (prefers-reduced-motion: no-preference), so no-JS/reduced-motion users see everything immediately.
- reveal: opacity+translateY({rise}) → none, {dur}ms cubic-bezier(.21,1.02,.73,1)
- IntersectionObserver threshold {at}, unobserve after firing (once, no replay on scroll-up)
- mark only section-level blocks (max ~8 per page), never form fields, never above-the-fold
- zero layout properties animated; observe rootMargin '0px 0px -10% 0px' if sections are tall`,
      claude: `Act as a performance-minded motion dev. Implement reveal-on-scroll with IntersectionObserver (threshold {at}, rise {rise}, duration {dur}, unobserve-once) and the no-JS/reduced-motion escape hatches (html.js gating, media query). Show CSS + 15 lines of JS. Then answer: why does once-only matter, and why is the .js class gate the difference between craft and broken-page-without-JS?`,
      chatgpt: `How do I animate sections in as the user scrolls WITHOUT a library like AOS? Write the CSS (hidden state gated by a .js class and prefers-reduced-motion) and ~12 lines of IntersectionObserver JS with threshold {at}, translateY({rise}), {dur}ms, firing once per element. List the three mistakes that make scroll-reveal feel like a template.`,
      lovable: `Sections on {bg} pages drift up {rise}px into place over {dur} as soon as they are {at} visible on screen - once, gently, never again on scroll back. The page assembles itself while reading.`,
      generic: "Design scroll-reveal: IntersectionObserver at {at} threshold, translateY({rise})/{dur}ms, once-only, gated for no-JS and reduced motion, applied to section blocks only. Explain the replay and invisible-content pitfalls it avoids.",
    },
    mistakes: [
      "Hiding content in plain CSS (opacity: 0 with no .js gate): users with JS off, or crawlers without rendering, see an empty page",
      "Re-triggering on scroll up: the page becomes a wind-up toy; reveals are one-shot",
      "60px rises and 800ms durations: that is a slideshow, not a reveal",
      "Revealing above-the-fold content: it starts off-screen-positioned and stutters on first frame",
    ],
    tips: [
      "Test with JS disabled: the page must still read complete - the animation is progressive enhancement",
      "threshold {at} with a slightly negative rootMargin feels earlier than raw threshold math",
      "Batch: one observer instance, many targets - do not create an observer per section",
      "The trend is fading reveals entirely in favour of instant content; use only when the scroll story deserves beats",
    ],
    related: ["stagger-entrance", "easing-basics", "landing-page-flow", "skeleton-loading"],
    learnMore: [
      { label: "MDN: IntersectionObserver", url: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" },
      { label: "web.dev: scroll-driven animations", url: "https://web.dev/articles/scroll-driven-animations" },
    ],
  },
  {
    id: "skeleton-loading",
    name: "Skeleton loading",
    category: "ui-design",
    subcategory: "motion",
    aliases: ["loading placeholder", "shimmer", "gray boxes while loading", "spinner alternative"],
    summary: "Show the shape of what is coming, not a spinner that says 'trust me'.",
    description:
      "A skeleton is the grey silhouette of the real content - same row heights, same circle for the avatar, same width bars - gently shimmering. It beats spinners because it answers the two questions users actually have: what will appear, and roughly where. The shimmer should loop softly at ~1.2-1.8s; skeletons should match final layout closely enough that the swap feels like ink drying, not a re-arrangement.",
    whenToUse: [
      "Content-shaped loads under ~2s (feeds, lists, cards, profile pages)",
      "First paint of app shells where layout is known but data is not",
      "Replacing a spinner-then-jump-layout flow that causes layout shift",
    ],
    whenNotToUse: [
      "Long jobs (>5s): skeletons imply 'nearly there' - use progress with real status text instead",
      "Tiny instant loads: a skeleton that flashes 120ms is worse than nothing (add a 300ms delay threshold)",
      "Unknown final layout: a skeleton that gets replaced by different geometry is negative information",
    ],
    difficulty: "beginner",
    tags: ["loading", "css", "ux", "animation"],
    controls: [
      { id: "base", label: "Skeleton tint", type: "color", def: "#e0d8c8" },
      { id: "shine", label: "Shine", type: "color", def: "#f4eede" },
      { id: "speed", label: "Shimmer speed", type: "slider", def: 1.4, min: 0.8, max: 2.4, step: 0.1, unit: "s" },
      { id: "row", label: "Row height", type: "slider", def: 12, min: 8, max: 20, step: 1, unit: "px" },
      { id: "bg", label: "Page", type: "color", def: "#faf6ee" },
    ],
    cssTemplate: `.demo-root { background: {bg}; padding: 14px; }
.demo-root .sk-line, .demo-root .sk-avatar {
  background: {base};
  position: relative; overflow: hidden;
}
.demo-root .sk-line { height: {row}; border-radius: calc({row} / 2); margin-bottom: calc({row} * .7); }
.demo-root .sk-avatar { width: calc({row} * 3.6); height: calc({row} * 3.6); border-radius: 50%; flex: none; }
.demo-root .sk-line::after, .demo-root .sk-avatar::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(100deg, transparent 30%, {shine} 50%, transparent 70%);
  transform: translateX(-100%);
  animation: sk-shine {speed} ease-in-out infinite;
}
@keyframes sk-shine { to { transform: translateX(100%); } }
.demo-root .sk-row { display: flex; gap: 12px; align-items: flex-start; max-width: 340px; }
.demo-root .sk-col { flex: 1; }
.demo-root .sk-note { font-family: ui-monospace, monospace; font-size: 9.5px; color: #9a8b6e; margin-top: 10px; }
@media (prefers-reduced-motion: reduce) { .demo-root .sk-line::after, .demo-root .sk-avatar::after { animation: none; opacity: .35; } }`,
    demoHtml: `<div class="sk-row" role="status" aria-label="Loading article preview">
  <div class="sk-avatar" aria-hidden="true"></div>
  <div class="sk-col">
    <div class="sk-line" style="width:70%" aria-hidden="true"></div>
    <div class="sk-line" style="width:100%" aria-hidden="true"></div>
    <div class="sk-line" style="width:92%" aria-hidden="true"></div>
    <div class="sk-line" style="width:55%" aria-hidden="true"></div>
  </div>
</div>
<div class="sk-note">shapes match the final card: avatar 3.6 rows, ragged widths like real sentences</div>`,
    codeSnippets: {
      "Anti-flash rule": `/* only show a skeleton if the wait is actually visible */
const timer = setTimeout(() => setShowing(true), 300); // don't flash for instant loads
await data; clearTimeout(timer);
/* in React: <Suspense fallback={<CardSkeleton/>}> with the same idea via useDeferredValue or a delay hook */
/* real content swap: same DOM positions => zero layout shift (CLS 0) */`,
    },
    prompts: {
      cursor: `# Skeleton loaders

Replace spinner states in this app with layout-matched skeletons:
- bars {row} tall with radius {row}/2, ragged widths per real content (70/100/92/55%), circle avatar block at 3.6x row height
- shimmer: gradient sweep {shine} over {base}, {speed} ease-in-out infinite; reduced-motion: static, no sweep
- skeleton container: role="status" + aria-label 'Loading…', every bar aria-hidden
- mount skeletons only after a 300ms delay threshold (no flash on fast responses)
- the final layout must occupy the SAME box - swap without layout shift`,
      claude: `Act as an UX perf engineer. Build a skeleton card matching a known final layout: {row} bars, ragged widths, {base}/{shine} shimmer at {speed}, reduced-motion fallback, role=status labelling, and a 300ms show-delay to prevent flashes on quick responses. Explain in three sentences the CLS argument for skeletons over spinners. Keep code <50 lines, no library.`,
      chatgpt: `What is a skeleton loading screen and when should I NOT use one? Write CSS for a shimmering skeleton list: {base} bars of {row} with a sweeping {shine} gradient every {speed}, a circle avatar, ragged widths, plus the prefers-reduced-motion version and an aria role=status wrapper. Mention the anti-flash delay trick.`,
      lovable: `Content-shaped loading on {bg}: soft {base} silhouette bars ({row}) and avatar circle, a calm {shine} shimmer gliding every {speed}, widths matching the real article lines so the swap feels like ink drying.`,
      generic: "Design a skeleton loader: {base}/{shine} shimmer at {speed}, {row} bars with ragged real-content widths, matching avatar geometry, role=status, 300ms delay before showing, reduced-motion static variant, zero layout shift on swap. Cover the spinner-vs-skeleton tradeoffs.",
    },
    mistakes: [
      "Skeleton flashing for 150ms on cached loads - jitter, not polish (the 300ms delay rule)",
      "Uniform full-width bars: reads as 'system broken' because nothing matches real text ragged widths",
      "Skeleton as a lie: showing a 4-card grid when 12 items will land - the swap re-scrolls the page",
      "Bold infinite shimmer under 1s: anxious pulsing; the sweep should be slower than your blink",
    ],
    tips: [
      "Build one skeleton component per real component (CardSkeleton next to Card) and let them drift apart - accuracy is the point",
      "Wrap in role=status with aria-label='Loading' and hide the bars from AT; polite announcements only",
      "Tint skeletons as ~8% of your ink over the surface - not a hard-coded grey",
      "Under ~1.5s median load, skeletons earn their keep; over 5s add real progress text instead",
    ],
    related: ["stagger-entrance", "scroll-reveal", "soft-flat", "feature-card"],
    learnMore: [
      { label: "web.dev: skeleton vs spinner", url: "https://web.dev/articles/verify-content-delay" },
      { label: "MDN: role=status", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role" },
    ],
  },
  {
    id: "button-press-feedback",
    name: "Button press feedback",
    category: "ui-design",
    subcategory: "motion",
    aliases: ["click feel", "active state", "buttons feel dead", "hover pressed states"],
    summary: "The four states every button must have: rest, hover, press, and a visible focus ring.",
    description:
      "A button feels alive when each state acknowledges reality: hover lifts or darkens slightly, press compresses (scale ~0.97 or a shadow shrink) so the click has a physical echo, and keyboard users see a focus ring that matches the button's personality. The press must be instant - the whole point is acknowledging the input the moment it happens, under 120ms.",
    whenToUse: [
      "Every clickable thing that submits, confirms, or commits (not navigation links)",
      "Touch buttons that need a pressed state because hover does not exist there",
      "Ghost/soft buttons where shadow shrink is the only available feedback",
    ],
    whenNotToUse: [
      "Elements that are not buttons (cards as links want subtler hover, no press-squish)",
      "Destructive holds - those want a deliberate two-step, not a satisfying squish",
      "Scale-press on iOS Safari text-selection buttons (interacts oddly with long-press menus)",
    ],
    difficulty: "beginner",
    tags: ["interaction", "css", "buttons", "states"],
    controls: [
      { id: "press", label: "Press squash", type: "slider", def: 0.96, min: 0.9, max: 1, step: 0.01, unit: "" },
      { id: "lift", label: "Hover lift", type: "slider", def: 2, min: 0, max: 6, step: 1, unit: "px" },
      { id: "ms", label: "Response time", type: "slider", def: 90, min: 40, max: 250, step: 10, unit: "ms" },
      { id: "fill", label: "Button", type: "color", def: "#b4602c" },
      { id: "ring", label: "Focus ring", type: "color", def: "#241c12" },
    ],
    cssTemplate: `.demo-root { background: #efe7d9; padding: 22px; display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
.demo-root .bp {
  font-family: system-ui; font-size: 13.5px; font-weight: 650;
  background: {fill}; color: #fff; border: 0; border-radius: 10px; padding: 11px 20px;
  box-shadow: 0 6px 14px -6px rgba(120,60,20,.55);
  transition: transform {ms} ease, box-shadow {ms} ease, filter {ms} ease;
  cursor: pointer;
}
.demo-root .bp:hover { transform: translateY(-{lift}); filter: brightness(1.06); box-shadow: 0 calc(6px + {lift} * 2) 16px -6px rgba(120,60,20,.5); }
.demo-root .bp:active { transform: translateY(0) scale({press}); box-shadow: 0 2px 6px -4px rgba(120,60,20,.5); transition-duration: 40ms; }
.demo-root .bp:focus-visible { outline: 2px solid {ring}; outline-offset: 3px; }
.demo-root .bp.ghost { background: transparent; color: {fill}; box-shadow: inset 0 0 0 1.5px {fill}; }
.demo-root .bp.ghost:hover { background: color-mix(in srgb, {fill} 8%, transparent); }
.demo-root .bp-note { width: 100%; font-family: ui-monospace, monospace; font-size: 10px; color: #7a6b52; }`,
    demoHtml: `<button class="bp">Hover · press me</button><button class="bp ghost">Ghost</button>
<span class="bp-note">:active squashes to scale({press}) in 40ms · release springs back in {ms} · Tab shows the {ring} ring</span>`,
    codeSnippets: {
      "State ladder": `button {
  transition: transform {ms} ease, box-shadow {ms} ease;
}
button:hover  { transform: translateY(-{lift}); }
button:active { transform: translateY(0) scale({press}); transition-duration: 40ms; } /* press is FASTER than hover */
button:focus-visible { outline: 2px solid {ring}; outline-offset: 3px; } /* never remove outlines without replacing */
@media (hover: none) { button:hover { transform: none; } } /* kill sticky hover on touch */
`,
    },
    prompts: {
      cursor: `# Button state system

Normalise interactive states on all buttons in this repo:
- rest → hover: translateY(-{lift}) + shadow spread, {ms} ease
- :active: scale({press}) with transition-duration 40ms (press acknowledgment MUST be faster than hover)
- :focus-visible: 2px {ring} outline, offset 3px (keep any existing radius feel)
- @media (hover: none) guard so touch devices do not keep stuck hover styles
- disabled: 45% opacity + cursor:not-allowed + NO transforms
Do not add ripple effects or loading spinners here; keep the four states only.`,
      claude: `Act as an interaction designer. Specify a button's four states with exact numbers: hover -{lift}px lift at {ms}ms, :active scale({press}) at 40ms, focus-visible 2px {ring} outline offset 3, disabled treatment; plus the hover:none touch guard. Implement for filled ({fill}) and ghost variants, then explain why the press transition must be faster than the hover one and what 'sticky hover' means. Under 40 lines.`,
      chatgpt: `My buttons feel dead when clicked. Write CSS giving a {fill} button a proper feel: hover lift {lift} over {ms}, active squash to scale {press} in 40ms, focus-visible ring in {ring}, disabled state, and a (hover: none) media guard for touch. Explain in one paragraph why faster :active than hover-out feels physical.`,
      lovable: `Buttons with a pulse: {fill} pills that hover-lift {lift}px over {ms}, squash to {press} the instant you press, and show a {ring} focus ring on Tab. Ghost twins with the same behaviour. Physical, not decorative.`,
      generic: "Define button micro-interactions: hover -{lift}px ({ms}ms), :active scale({press}) (40ms), focus-visible 2px {ring}, disabled, touch hover guard. Justify the timing asymmetry between press and release.",
    },
    mistakes: [
      "Removing outlines with outline: none and replacing nothing - keyboard users lose the plot entirely",
      "300ms ease on :active: the acknowledgment arrives after the next click already happened",
      "Hover transform on touch screens: the button stays lifted after tap (sticky hover)",
      "Scale-press on fixed-height containers causing subpixel jitter on text - use will-change sparingly or translateY only",
    ],
    tips: [
      "40ms in / 90-120ms out is the physical rhythm; equal parts both directions feels mushy",
      "Shadow must shrink WITH the press - lifting the element but keeping the far shadow breaks the physics",
      "Ghost/outline buttons can squash too; they just trade shadow for border-opacity warmth",
      "Pair :active feedback with the result: press-feel means nothing if the action takes 2s - then add loading state",
    ],
    related: ["easing-basics", "toast-notification", "feature-card", "soft-flat"],
    learnMore: [
      { label: "MDN: :focus-visible", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible" },
      { label: "MDN: (hover: none) media query", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover" },
    ],
  },

  /* ────────────────────────── effects ────────────────────────── */
  {
    id: "gradient-mesh",
    name: "Gradient mesh background",
    category: "ui-design",
    subcategory: "effects",
    aliases: ["aurora background", "soft color blobs", "apple gradient", "mesh gradient"],
    summary: "Several blurred colour blobs over a base - depth without a single image file.",
    description:
      "A mesh is just stacked radial-gradients: a base colour with three or four soft, overlapping pools of hue. Blur comes from large transparent stops, not filters. It gives heroes and dark panels an expensive, lit-from-within glow, costs zero network requests, and stays smooth at any screen size. The craft is restraint: low saturation, wide falloff, and light 'sources' that agree on where the sun is.",
    whenToUse: [
      "Hero backgrounds that need mood without photography",
      "Dark sections that feel flat - one warm pool of light fixes it",
      "Card/panel accents where the gradient only shows at the edges",
    ],
    whenNotToUse: [
      "Behind body text without a scrim - mesh contrast varies per pixel, so reading zones need a solid card",
      "Full-site backgrounds: the mesh is the painting, sections are the frames",
      "As a six-colour rainbow: beyond three hues it reads as a screensaver",
    ],
    difficulty: "beginner",
    tags: ["css", "background", "hero", "gradient"],
    controls: [
      { id: "base", label: "Base", type: "color", def: "#221a13" },
      { id: "glow1", label: "Glow A", type: "color", def: "#b4602c" },
      { id: "glow2", label: "Glow B", type: "color", def: "#3f2d5f" },
      { id: "spread", label: "Softness", type: "slider", def: 62, min: 25, max: 90, step: 1, unit: "" },
      { id: "strength", label: "Glow power", type: "slider", def: 55, min: 10, max: 100, step: 5, unit: "" },
    ],
    cssTemplate: `.demo-root {
  background:
    radial-gradient(circle at 18% 22%, color-mix(in srgb, {glow1} {strength}%, transparent) 0, transparent {spread}%),
    radial-gradient(circle at 82% 12%, color-mix(in srgb, {glow2} calc({strength} * 0.7)%, transparent) 0, transparent calc({spread} * 1.2%)),
    radial-gradient(circle at 60% 95%, color-mix(in srgb, {glow1} calc({strength} * 0.45)%, transparent) 0, transparent 55%),
    {base};
  min-height: 180px; padding: 24px;
  font-family: system-ui, sans-serif; color: #f6efe3;
  display: flex; align-items: center; justify-content: center;
}
.demo-root .gm-card {
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12);
  border-radius: 16px; padding: 18px 22px; max-width: 300px; text-align: center;
}
.demo-root .gm-card h4 { margin: 0 0 6px; font-size: 16px; letter-spacing: -.01em; }
.demo-root .gm-card p { margin: 0; font-size: 12px; line-height: 1.55; opacity: .7; }
.demo-root .gm-dot { width: 8px; height: 8px; border-radius: 50%; background: {glow1}; display: inline-block; margin-bottom: 8px; box-shadow: 0 0 14px 2px color-mix(in srgb, {glow1} 70%, transparent); }`,
    demoHtml: `<div class="gm-card">
  <span class="gm-dot"></span>
  <h4>Lit from within</h4>
  <p>Three radial-gradients and a base colour. The blobs are placed like stage lights - one key, one fill, one bounce.</p>
</div>`,
    codeSnippets: {
      "Layer order notes": `/* first listed gradient paints ON TOP - order matters for overlaps */
.mesh {
  background:
    radial-gradient(600px 400px at 15% 20%, {glow1}8c 0%, transparent 70%), /* key light */
    radial-gradient(500px 500px at 85% 10%, {glow2}6b 0%, transparent 65%), /* fill */
    {base};                                     /* the canvas, last */
}
/* fixed-size ellipses (600px 400px) scale differently than % circles:
   ellipses read designed at desktop; % circles survive every aspect ratio */`,
    },
    prompts: {
      cursor: `# Mesh gradient hero backdrop

Build the hero background from stacked radial-gradients ONLY (no images, no canvas):
- base {base}; key glow {glow1} at ~18% 22%, fill glow {glow2} at ~82% 12%, a weak bounce of {glow1} at 60% 95%
- each glow uses color-mix alpha at {strength}% fading to transparent by {spread}%
- percentage circle positions so it survives every aspect ratio; no blur filters (the falloff IS the blur)
- reading content sits in a translucent card (#fff 5% fill + 12% border, radius 16) so contrast is constant over varying glow
- verify text contrast against the WEAKEST and STRONGEST glow points`,
      claude: `Act as a background artist working in CSS. Compose a mesh (stacked radial-gradients, percentage-placed): base {base}, glows {glow1} and {glow2} at {strength}% power fading by {spread}%. Give the layer order rationale (key/fill/bounce like stage lighting), a translucent reading card so text contrast stays stable, and one note on performance vs filter: blur. Code under 30 lines.`,
      chatgpt: `Create a dark hero background that glows like an Apple keynote using only CSS radial-gradients over {base}: a {glow1} pool top-left, a {glow2} pool top-right at 70% strength, a faint warm bounce at the bottom. Explain how transparent color stops create the blur effect, then write the CSS with a small centered glass card on top.`,
      lovable: `Hero on a {base} mesh: a {glow1} glow pooling top-left, a {glow2} cool light top-right, soft bounce under content, all fading at {spread}% softness. Content sits on a whisper-glass card. Cinematic, warm, uncluttered.`,
      generic: "Design a CSS mesh-gradient backdrop: base {base}, glows {glow1}/{glow2} at {strength}% with {spread}% falloff, stage-light placement (key, fill, bounce), percentage positioning for responsiveness, a reading card with stable contrast, and a performance note about falloff vs blur filters.",
    },
    mistakes: [
      "Saturated glow at full power: neon pools read as a screensaver from 2004",
      "Mesh behind bare text: contrast changes mid-sentence because the background does",
      "Hard stops (transparent 100% too close to 0%): visible rings instead of light - spread is the whole effect",
      "Rotating hues with keyframes 'for life': subtle drift is fine, rave cycles are a loading indicator gone rogue",
    ],
    tips: [
      "Think in lighting, not colour: one key (strong), one fill (70% of key), one bounce (45%)",
      "A 0.5deg/sec hue-rotate on the glow layers adds life at near-zero cost - keep it under prefers-reduced-motion",
      "color-mix with the base instead of raw hex stops keeps every glow family-related",
      "Screenshots look flat without noise - pair mesh with a 3% grain layer (see grain-texture)",
    ],
    related: ["grain-texture", "glassmorphism", "spotlight-hover", "hero-section"],
    learnMore: [
      { label: "MDN: radial-gradient()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient" },
      { label: "MDN: gradient order & stops", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-image" },
    ],
  },
  {
    id: "soft-shadow-layers",
    name: "Layered soft shadows",
    category: "ui-design",
    subcategory: "effects",
    aliases: ["nice drop shadow", "elevated card", "shadow looks harsh", "realistic shadow"],
    summary: "Real shadows are three stacked blurs, not one dark smudge - here is the recipe.",
    description:
      "A single box-shadow at 30% black looks like a dirty sticker. Real light makes shadows that stack: a tight dark one that defines the edge, a mid one for body, and a wide faint one for ambience. Same offset direction, increasing blur, decreasing alpha. Three lines of CSS turn any card from template to premium, and the sliders show exactly how the layers build.",
    whenToUse: [
      "Cards, popovers, floating panels over light backgrounds",
      "Fixing a design that 'looks cheap' and you cannot say why",
      "Any elevation system that needs to survive a screenshot zoom",
    ],
    whenNotToUse: [
      "Dark mode: alpha-black shadows vanish - elevation there comes from lighter surfaces",
      "Brutalist/flat systems where the shadow IS the border - one hard offset is the style",
      "Shadows heavier than the content hierarchy they describe (floating nav over floating card over floating button...)",
    ],
    difficulty: "beginner",
    tags: ["css", "shadow", "cards", "depth"],
    controls: [
      { id: "strength", label: "Shadow density", type: "slider", def: 100, min: 30, max: 180, step: 10, unit: "" },
      { id: "tint", label: "Shadow hue", type: "color", def: "#4a3520" },
      { id: "lift", label: "Elevation", type: "slider", def: 12, min: 2, max: 32, step: 2, unit: "px" },
      { id: "surface", label: "Card", type: "color", def: "#fffdf8" },
      { id: "bg", label: "Page", type: "color", def: "#f0e9dc" },
    ],
    cssTemplate: `.demo-root { background: {bg}; padding: 28px; display: grid; place-items: center; }
.demo-root .sl-card {
  width: 270px; background: {surface}; border-radius: 14px; padding: 18px;
  font-family: system-ui, sans-serif; color: #3a3122;
  box-shadow:
    0 1px 2px        color-mix(in srgb, {tint} calc({strength} * 0.14), transparent),  /* edge: tight, dark */
    0 calc({lift} * 0.35) calc({lift})   color-mix(in srgb, {tint} calc({strength} * 0.12), transparent),  /* body: medium */
    0 {lift} calc({lift} * 2.4) calc({lift} * .5) color-mix(in srgb, {tint} calc({strength} * 0.10), transparent); /* ambient: wide, faint */
}
.demo-root .sl-card h4 { margin: 0 0 5px; font-size: 14.5px; }
.demo-root .sl-card p { margin: 0; font-size: 12px; line-height: 1.55; color: #7b6f57; }
.demo-root .sl-caption { text-align: center; font-family: ui-monospace, monospace; font-size: 9.5px; color: #97896c; margin-top: 18px; max-width: 300px; line-height: 1.6; }`,
    demoHtml: `<div>
  <div class="sl-card"><h4>Three layers, one light source</h4><p>Edge shadow defines the bottom line, body shadow gives distance, ambient shadow tells the room the card exists.</p></div>
  <div class="sl-caption">0 1 2 @{strength}*0.14<br/>0 {lift}*0.35 {lift}@0.12<br/>0 {lift} {lift}*2.4 .5@0.10</div>
</div>`,
    codeSnippets: {
      "Elevation scale": `:root {
  /* tinted, three-part shadows; density scales with elevation */
  --sh-1: 0 1px 2px color-mix(in srgb, {tint} 10%, transparent),
          0 2px 6px color-mix(in srgb, {tint} 8%, transparent),
          0 6px 16px -4px color-mix(in srgb, {tint} 8%, transparent);
  --sh-2: 0 1px 2px color-mix(in srgb, {tint} 12%, transparent),
          0 calc({lift} * 0.35) calc({lift}) color-mix(in srgb, {tint} 10%, transparent),
          0 {lift} calc({lift} * 2.4) calc({lift} * .5) color-mix(in srgb, {tint} 10%, transparent);
}
.card  { box-shadow: var(--sh-1); }
.float { box-shadow: var(--sh-2); }`,
    },
    prompts: {
      cursor: `# Layered shadow system

Replace all single-layer box-shadows in this repo with a tinted three-layer recipe:
- layers: (0 1 2) edge @ ~14% alpha, (0 {lift}*.35 {lift}) body @ 12%, (0 {lift} {lift}*2.4 .5) ambient @ 10%
- shadow tint {tint} (drawn from the palette's darkest warm, never pure black), density multiplier {strength}
- define two named elevations (--sh-1 cards, --sh-2 overlays) and use them everywhere; NO per-component ad-hoc shadows
- hover states move up exactly one step, never invent a third number set`,
      claude: `Act as a visual-craft engineer. Build a two-step elevation system from tinted 3-layer shadows (edge/body/ambient, alphas ~14/12/10%, tint {tint}, base offset {lift}, density {strength}). Give the CSS variables, show card + popover usage, and explain in three sentences why single black shadows look cheap and why dark mode must use surface lightness instead. Under 45 lines.`,
      chatgpt: `Why do designers stack three box-shadows instead of one? Write the CSS for a card using a tight edge shadow (0 1px 2px), a medium one (0 {lift}*.35 {lift}), and a wide ambient (0 {lift} {lift}*2.4 blur {lift}*.5) in a tinted {tint} at ~{strength}% density. Show before (single 30% black) and after.`,
      lovable: `Cards on {bg} that float like ceramic: {surface} surfaces with layered warm shadows tinted {tint} - a tight edge line, a soft body, a wide ambient at elevation {lift}. Two steps only, hover rises one step.`,
      generic: "Create a layered-shadow elevation system: three stacked shadows per level (edge/body/ambient) tinted {tint} at {strength}% density, {lift} base offset, two named levels for cards and overlays, hover = one step up. Explain the tint-not-black and dark-mode caveats.",
    },
    mistakes: [
      "rgba(0,0,0,0.35) single smudge: reads as a photocopy edge, not depth",
      "Shadow offsets pointing different directions: implies multiple light sources and looks broken when zoomed",
      "Elevation inflation: nav, card, button, tooltip all 'floating' at max blur - nothing feels above anything",
      "Rounding the corner but squaring the shadow: heavy blur needs spread/offset tuned or the edge shows a grey box",
    ],
    tips: [
      "Pull the shadow tint 10-20% toward the page's warm/cool hue - instant premium tell",
      "The ambient layer's blur should be at least 2x its offset; that ratio is what sells distance",
      "Hover: keep the edge shadow, grow the other two; swapping recipes mid-transition flickers",
      "Screenshot at 200% zoom: if shadow banding or a grey halo appears, drop alpha and add blur",
    ],
    related: ["soft-flat", "neumorphism", "glassmorphism", "feature-card"],
    learnMore: [
      { label: "MDN: box-shadow", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow" },
      { label: "MDN: color-mix()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix" },
    ],
  },
  {
    id: "grain-texture",
    name: "Grain texture",
    category: "ui-design",
    subcategory: "effects",
    aliases: ["noise overlay", "film grain", "textured background", "flat looks too clean"],
    summary: "A 3-6% speckle of noise that makes flat CSS feel printed instead of rendered.",
    description:
      "Flat gradients look digital because real materials are never flat. A grain overlay - an inline SVG turbulence noise at low opacity sitting on top of your background - adds microscopic texture that makes screens look like paper, film, or vinyl. It is one line of CSS, scales infinitely, and dies quietly under reduced budgets (it is decoration, not content).",
    whenToUse: [
      "Gradient or mesh backgrounds that screenshot too 'clean'",
      "Warm/editorial brands that want a printed-matter feel",
      "Dark heroes needing a hint of film instead of pure black",
    ],
    whenNotToUse: [
      "Under text at high opacity - it lowers contrast unpredictably; keep grain at or below 6%",
      "On top of imagery that already has film grain: texture stacking looks dirty",
      "Full-viewport fixed layers on low-end devices without will-change and a paint budget check",
    ],
    difficulty: "intermediate",
    tags: ["css", "svg", "texture", "background"],
    controls: [
      { id: "bg", label: "Colour under", type: "color", def: "#2e2a24" },
      { id: "amount", label: "Grain", type: "slider", def: 5, min: 0, max: 14, step: 1, unit: "" },
      { id: "scale", label: "Speckle size", type: "slider", def: 2, min: 1,  step: 0.25, max: 6, unit: "" },
      { id: "accent", label: "Content", type: "color", def: "#e9d9b8" },
    ],
    cssTemplate: `.demo-root {
  position: relative; background: {bg}; min-height: 170px;
  display: grid; place-items: center; overflow: hidden;
  font-family: Georgia, serif; color: {accent};
}
.demo-root .gr-layer {
  position: absolute; inset: 0; pointer-events: none;
  opacity: calc({amount} / 100);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='{scale}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
.demo-root .gr-copy { position: relative; text-align: center; padding: 20px; }
.demo-root .gr-copy h4 { font-size: 21px; margin: 0 0 6px; letter-spacing: -.01em; }
.demo-root .gr-copy p { font-size: 12.5px; margin: 0; opacity: .75; font-family: system-ui; }`,
    demoHtml: `<div class="gr-layer" aria-hidden="true"></div>
<div class="gr-copy"><h4>Texture you feel, not notice</h4><p>{amount}% turbulence at {scale} scale over {bg}. Below 8% it reads as material; above, as dirt.</p></div>`,
    codeSnippets: {
      "Inline SVG noise": `/* the whole recipe: one data-URI, zero requests */
.grain::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  opacity: calc({amount} / 100);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='{scale}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* baseFrequency ~0.9 = fine film, 1.6+ = coarse paper; numOctaves 3 balances detail/size */`,
    },
    prompts: {
      cursor: `# Grain overlay

Add a decorative noise layer to the [hero/section] without any image files:
- absolutely-positioned ::after, inset 0, pointer-events: none, aria-hidden semantics (it is pure CSS), opacity {amount}%
- background-image: inline data-URI SVG feTurbulence (fractalNoise, baseFrequency {scale}, numOctaves 3, stitchTiles stitch), 140x140 tile
- parent needs position: relative and isolation: isolate so z-stacking stays sane
- keep text contrast measured WITHOUT the grain (it is under 8% - but verify), and gate a heavier 10%+ variant behind prefers-reduced-motion: no-preference only for any animated drift (no animation here otherwise)`,
      claude: `Act as a texture-minded CSS dev. Implement a film-grain overlay via inline SVG feTurbulence data-URI: {amount}% opacity, baseFrequency {scale}, octaves 3, non-interactive (pointer-events none), on an isolated layer above a {bg} gradient. Explain why data-URI SVG beats a PNG here (scaling, requests), why the layer must not steal clicks, and the one accessibility check after. Code under 25 lines.`,
      chatgpt: `How do I add subtle film grain to a CSS background without downloading any images? Write the ::after overlay using an inline SVG data-URI with feTurbulence at baseFrequency {scale}, opacity {amount}%, pointer-events none. Explain what numOctaves and stitchTiles do, and what opacity is too much.`,
      lovable: `A {bg} hero with real texture: a fine {amount}% SVG grain veil over the surface, serif headline in {accent} floating on it. It should feel like a printed poster, not a screensaver.`,
      generic: "Add a grain effect to a background with a single CSS layer: inline feTurbulence SVG ({scale} frequency, 3 octaves) at {amount}% opacity, pointer-events none, isolated stacking, tile stitched seamlessly. Note contrast, performance, and decoration-vs-content considerations.",
    },
    mistakes: [
      "Grain above 10%: the texture becomes the subject and text contrast drops unpredictably",
      "Animated grain on huge viewports without prefers-reduced-motion - and it is a constant repaint",
      "Forgetting pointer-events: none: an invisible full-size overlay silently eats every click",
      "High baseFrequency with high octaves: the 140px tile grows enormous as a data-URI; 3 octaves is the sweet spot",
    ],
    tips: [
      "Duplicate the layer at a different scale/offset for an organic, non-repeating feel (two 4% layers beat one 8%)",
      "Mix-blend-mode: overlay on the grain layer integrates it with coloured backgrounds instead of dusting them",
      "Fine film ≈ 0.9, paper ≈ 1.5, vinyl ≈ 2+ baseFrequency",
      "Screenshot the result: grain nearly vanishes in compressed previews - if it does not show at 100%, it is not doing its job anyway",
    ],
    related: ["gradient-mesh", "editorial-serif", "spotlight-hover", "soft-shadow-layers"],
    learnMore: [
      { label: "MDN: SVG feTurbulence", url: "https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence" },
      { label: "MDN: mix-blend-mode", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode" },
    ],
  },
  {
    id: "spotlight-hover",
    name: "Spotlight hover",
    category: "ui-design",
    subcategory: "effects",
    aliases: ["glow follows cursor", "mouse spotlight", "cards light up near pointer", "cursor torch"],
    summary: "A soft pool of light that tracks the cursor across a card - the premium interaction.",
    description:
      "The card hides a radial-gradient whose centre follows the mouse via two CSS custom properties (--mx/--my) updated by a pointermove handler. Nothing moves, nothing resizes - only a background position changes, which is one of the cheapest visual effects a browser can paint. It makes flat dark grids feel touchable.",
    whenToUse: [
      "Dark feature grids that feel lifeless under the cursor",
      "Card borders that light up nearest-edge (border variant of the same trick)",
      "Any 'the site feels expensive' request with a small budget",
    ],
    whenNotToUse: [
      "Touch devices where pointermove does not exist: ship without it, never fake it with taps",
      "Light themes where the glow is invisible - use a border-warm variant instead",
      "On text-dense cards: the moving sheen competes with reading",
    ],
    difficulty: "intermediate",
    tags: ["css", "javascript", "hover", "glow"],
    controls: [
      { id: "glow", label: "Glow colour", type: "color", def: "#d98546" },
      { id: "size", label: "Pool size", type: "slider", def: 160, min: 60, max: 320, step: 10, unit: "px" },
      { id: "power", label: "Brightness", type: "slider", def: 22, min: 5, max: 60, step: 1, unit: "" },
      { id: "bg", label: "Card", type: "color", def: "#241c14" },
    ],
    cssTemplate: `.demo-root { background: #16110b; padding: 16px; }
.demo-root .sp-card {
  position: relative; overflow: hidden;
  background: {bg}; color: #e7dcc6; border-radius: 14px; padding: 20px;
  border: 1px solid rgba(255,255,255,.07);
  max-width: 330px; font-family: system-ui, sans-serif;
  --mx: 50%; --my: 40%;
}
.demo-root .sp-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient({size} circle at var(--mx) var(--my),
    color-mix(in srgb, {glow} {power}%, transparent), transparent 70%);
  opacity: 0; transition: opacity .3s ease;
}
.demo-root .sp-card:hover::before { opacity: 1; }
.demo-root .sp-card h4 { margin: 0 0 5px; font-size: 15px; position: relative; }
.demo-root .sp-card p { margin: 0; font-size: 12.5px; line-height: 1.55; opacity: .7; position: relative; }
.demo-root .sp-hint { font-size: 11px; color: #6f6350; font-family: ui-monospace, monospace; margin-top: 10px; }`,
    demoHtml: `<div>
  <div class="sp-card" onmousemove="const r=this.getBoundingClientRect();this.style.setProperty('--mx',event.clientX-r.left+'px');this.style.setProperty('--my',event.clientY-r.top+'px');">
    <h4>Move your cursor over me</h4>
    <p>The pool follows without the card moving: only two custom properties update, and the gradient repaints in place.</p>
  </div>
  <p class="sp-hint">radial-gradient({size} at var(--mx) var(--my), {glow} {power}%, transparent)</p>
</div>`,
    codeSnippets: {
      "The JS, all of it": `card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", e.clientX - r.left + "px");
  card.style.setProperty("--my", e.clientY - r.top + "px");
});
/* rAF-gate on slow devices; skip entirely when matchMedia("(hover: none)") matches */`,
      "Border variant": `/* glow only on the edge: a second masked layer */
.sp-card::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: radial-gradient({size} at var(--mx) var(--my), {glow}, transparent 60%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .3s; pointer-events: none;
}
.sp-card:hover::after { opacity: .8; }`,
    },
    prompts: {
      cursor: `# Cursor spotlight on cards

Add the pointer-tracked glow to grid cards ({bg} faces):
- ::before layer: radial-gradient({size} at var(--mx) var(--my), {glow} at {power}%, transparent 70%), opacity 0→1 on hover only, transition .3s
- pointermove writes --mx/--my from getBoundingClientRect; guard with matchMedia('(hover: hover)') so touch is skipped entirely
- text sits position: relative above the glow; the layer is pointer-events: none
- optional border-only twin using the padding-box mask-composite recipe
No transforms, no tilt, no parallax - the pool moves, the card does not.`,
      claude: `Act as an interaction perf engineer. Implement cursor-tracking spotlight ({size} pool, {glow} at {power}%) with two custom properties + pointermove, hover-only opacity, touch guard via matchMedia, and the mask-composite border variant. State why updating a gradient position beats transform/tilt for paint cost, and why skipping touch is correct rather than faking it. Code < 45 lines.`,
      chatgpt: `Write the code for a card whose soft glow follows the mouse. CSS: a radial-gradient({size}) positioned at var(--mx)/var(--my) in {glow} at {power}% opacity, shown on hover. JS: a few lines of pointermove setting the two variables from getBoundingClientRect. Explain why we skip touch devices and why no rAF is strictly needed for a background position change.`,
      lovable: `Dark {bg} cards with a torch: hover reveals a {size} pool of {glow} light at {power}% that glides under the cursor via CSS variables - the card itself never moves or tilts. Subtle premium, not gimmick.`,
      generic: "Design a cursor spotlight effect: radial pool {size} in {glow}/{power}% driven by --mx/--my custom properties on pointermove, hover-fade only, touch guard, optional masked border variant. Justify the paint-cheapness vs transform-tilt alternatives.",
    },
    mistakes: [
      "Faking it on touch with touchmove: sticky glow blobs after every tap",
      "Glow power over 40%: the card becomes a lava lamp under the cursor",
      "Recomputing getBoundingClientRect on every event inside heavy handlers - cache it on pointerenter",
      "Animating opacity AND position per frame: only position should change per frame; opacity is the hover transition",
    ],
    tips: [
      "Fade the pool in over .3s and it reads as light arriving; snap it and it reads as a bug",
      "Pair with a 1px border variant and you get the full 'Linear/RESOUND' grid look for 10 lines of code",
      "Keep the pool larger than the card's radius of interest - soft edges are the effect",
      "Respect reduced-motion by keeping the static hover glow and killing only any animated drift",
    ],
    related: ["gradient-mesh", "glassmorphism", "feature-card", "border-gradient"],
    learnMore: [
      { label: "MDN: radial-gradient()", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient" },
      { label: "MDN: custom properties", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties" },
    ],
  },
  {
    id: "border-gradient",
    name: "Gradient border",
    category: "ui-design",
    subcategory: "effects",
    aliases: ["colorful outline", "rainbow ring", "gradient border radius", "glowing edge card"],
    summary: "A border that flows between colours - and the mask trick that keeps rounded corners honest.",
    description:
      "You cannot gradient a border directly: border-image ignores border-radius. The professional recipe is a padding trick - a gradient background on the element, a second solid background clipped to the content box, and background-clip: padding-box cutting the inner one so only the padding ring shows the gradient. Corners, radius, width: all real. This demo tunes the ring live.",
    whenToUse: [
      "Highlighting the recommended pricing card or active nav item",
      "Avatar rings and focus states that should glow rather than outline",
      "One accent moment per screen on otherwise quiet cards",
    ],
    whenNotToUse: [
      "Every card: rainbow borders are shouting matches, not conversation",
      "Print/low-colour contexts where the effect degrades to mush",
      "As the ONLY difference signal in a comparison - colour-blind users need a label too",
    ],
    difficulty: "intermediate",
    tags: ["css", "border", "gradient", "cards"],
    controls: [
      { id: "c1", label: "Start colour", type: "color", def: "#b4602c" },
      { id: "c2", label: "End colour", type: "color", def: "#3f2d5f" },
      { id: "w", label: "Ring width", type: "slider", def: 2, min: 1, max: 6, step: 0.5, unit: "px" },
      { id: "radius", label: "Corner radius", type: "slider", def: 14, min: 0, max: 28, step: 1, unit: "px" },
      { id: "bg", label: "Card face", type: "color", def: "#fffdf8" },
      { id: "page", label: "Page", type: "color", def: "#f1ebdf" },
    ],
    cssTemplate: `.demo-root { background: {page}; padding: 20px; display: grid; place-items: center; }
.demo-root .gb {
  /* gradient shows only in the {w} ring: outer = gradient, inner = face, clipped inside */
  background:
    linear-gradient({bg}, {bg}) padding-box,
    linear-gradient(135deg, {c1}, {c2}) border-box;
  border: {w} solid transparent;      /* the ring IS the transparent border */
  border-radius: {radius};
  padding: 16px 18px; max-width: 290px;
  font-family: system-ui, sans-serif; color: #3a3225;
}
.demo-root .gb h4 { margin: 0 0 5px; font-size: 15px; }
.demo-root .gb p { margin: 0; font-size: 12px; line-height: 1.5; color: #776c58; }
.demo-root .gb-pill {
  display: inline-block; margin-bottom: 8px; padding: 3px 10px;
  border-radius: 999px; font-size: 10.5px; font-weight: 700; color: {c1};
  background: linear-gradient({bg}, {bg}) padding-box,
              linear-gradient(90deg, {c1}, {c2}) border-box;
  border: 1.5px solid transparent;
}`,
    demoHtml: `<div class="gb">
  <span class="gb-pill">recommended</span>
  <h4>The ring follows the radius</h4>
  <p>Two backgrounds, one transparent border: {c1} flows into {c2} around a {radius} corner at {w} thick. border-image could never do that.</p>
</div>`,
    codeSnippets: {
      "Animated ring": `/* rotating gradient: animate the angle via @property */
@property --ang { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
.gb.spin {
  background:
    linear-gradient({bg}, {bg}) padding-box,
    conic-gradient(from var(--ang), {c1}, {c2}, {c1}) border-box;
  border: {w} solid transparent;
  animation: gb-turn 4s linear infinite;
}
@keyframes gb-turn { to { --ang: 360deg; } }
@media (prefers-reduced-motion: reduce) { .gb.spin { animation: none; } }`,
      "Focus ring version": `button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 {w} {page}, 0 0 0 calc({w} * 2) {c1}; /* gap then ring - simpler than gradients for focus */
}`,
    },
    prompts: {
      cursor: `# Gradient border component

Apply a two-background gradient ring, exact recipe:
background: linear-gradient({bg},{bg}) padding-box, linear-gradient(135deg, {c1},{c2}) border-box; border: {w} solid transparent; border-radius: {radius}.
- use it on: the recommended pricing card, small pill labels, and the active nav chip ONLY
- provide a conic-gradient rotating variant behind --ang @property, gated by prefers-reduced-motion
- gradient-only signals must be paired with text (a 'recommended' label): never colour alone
- NO border-image (it breaks radius) and NO extra wrapper divs`,
      claude: `Act as a CSS craftsperson. Explain why border-image + border-radius are incompatible, then give the padding-box/border-box two-background technique for a {w} gradient ring ({c1}→{c2}) on a {radius} card ({bg} face). Add the @property conic rotation snippet with reduced-motion gate, and state the accessibility pairing rule for using a gradient as the sole highlight. Code under 40 lines.`,
      chatgpt: `How do I make a gradient border that follows rounded corners? Show the double-background CSS (padding-box face {bg} over border-box gradient {c1} to {c2}, transparent border {w}, radius {radius}), then an optional rotating conic version with @property. Why doesn't border-image work with border-radius?`,
      lovable: `One highlighted card with a {w} ring flowing {c1} into {c2} around {radius} corners ({bg} face on {page}), plus matching tiny gradient pills. The single shout on a quiet page.`,
      generic: "Create a rounded gradient border ({w} ring, {c1}→{c2}, radius {radius}, {bg} face) using the padding-box/border-box background-clip method, a conic @property animation gated for reduced motion, and a rule that colour-only highlights need a text signal. Note why border-image fails here.",
    },
    mistakes: [
      "border-image on a rounded element: corners square off and the effort looks like a bug",
      "Wrapping divs for the ring: the background-clip method needs zero extra markup",
      "Full rainbow (three+ hues) at full saturation: circus ring, not design accent",
      "Highlighting the recommended plan by ring alone - the label carries the meaning for everyone",
    ],
    tips: [
      "Two adjacent hues (like {c1}→{c2}) read intentional; every-hue reads default browser",
      "For focus rings prefer gap+ring box-shadow over gradients: colour must be a single certain value",
      "The transparent border IS the ring width - keep it under 3px on cards or the effect turns costume",
      "Angle 135deg usually wins: vertical splits put the two colours' halves in competing light",
    ],
    related: ["spotlight-hover", "pricing-compare", "glassmorphism", "gradient-mesh"],
    learnMore: [
      { label: "MDN: background-clip", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip" },
      { label: "MDN: @property", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@property" },
    ],
  },
];
