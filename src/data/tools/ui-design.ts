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
    related: ["gradient-mesh", "soft-shadow-layers", "backdrop-scenes", "modal-dialog"],
    learnMore: [
      { label: "MDN: backdrop-filter", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter" },
      { label: "MDN: @supports", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@supports" },
      { label: "Can I use: backdrop-filter", url: "https://caniuse.com/mdn-css_properties_backdrop-filter" },
    ],
  },
];
