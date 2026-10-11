/* ══ template-fill unit tests ═══════════════════════════════════════
   Run: npm test          (vitest, node environment, no browser)   ══ */
import { describe, expect, it } from "vitest";
import { controlValue, defaultValues, escapeHtml, fill, fillTool, toolValues } from "./fill";
import type { Tool } from "./types";

const demoTool: Tool = {
  id: "demo-tool",
  name: "Demo Tool",
  category: "ui-design",
  subcategory: "styles",
  aliases: ["demo"],
  summary: "A {opacity}% test card",
  description: "Used only by fill.test.ts",
  whenToUse: ["tests"],
  whenNotToUse: ["production"],
  difficulty: "beginner",
  tags: ["test"],
  controls: [
    { id: "tint", label: "Tint", type: "color", def: "#ffffff" },
    { id: "opacity", label: "Frost", type: "slider", def: 55, min: 10, max: 95, unit: "" },
    { id: "blur", label: "Blur", type: "slider", def: 14, min: 0, max: 40, step: 2, unit: "px" },
    { id: "edge", label: "Edge", type: "toggle", def: true, onValue: "1px solid", offValue: "none" },
    { id: "radius", label: "Radius", type: "select", def: "sm", options: [{ value: "sm", label: "Small" }, { value: "lg", label: "Large" }] },
  ],
  cssTemplate: ".demo-root .card { background: {tint}; opacity: {opacity}%; filter: blur({blur}); border: {edge}; }",
  demoHtml: `<div class="card">{name}</div>`,
  codeSnippets: { Tailwind: "bg-[{tint}] blur-[{blur}]" },
  prompts: {
    cursor: "Use {tint} at {opacity}% with {blur} blur and {edge} edge. {tags}",
    claude: "Build {name}: {summary}; blur {blur}.",
    chatgpt: "Make a {radius} card with tint {tint}.",
    lovable: "{name}, {blur} frost, {tint} tint.",
    generic: "{name} - {radius} corners, blur {blur}.",
  },
  mistakes: ["m"],
  tips: ["t"],
  related: [],
  learnMore: [],
};

describe("fill()", () => {
  it("replaces known placeholders", () => {
    const r = fill("a {x} b {y} c", { x: "1", y: "two" });
    expect(r.text).toBe("a 1 b two c");
    expect(r.missing).toEqual([]);
  });

  it("leaves unknown placeholders visible and reports them once", () => {
    const r = fill("{ok} {oops} {oops}", { ok: "yes" });
    expect(r.text).toBe("yes {oops} {oops}");
    expect(r.missing).toEqual(["oops"]);
  });

  it("handles templates with no placeholders", () => {
    const r = fill("plain text", { x: 1 });
    expect(r.text).toBe("plain text");
    expect(r.missing).toEqual([]);
  });

  it("only treats brace-wrapped, letter-first names as tokens", () => {
    const r = fill("{2bad} {ok} x{not}", { ok: "v" });
    expect(r.text).toBe("{2bad} v x{not}");
    expect(r.missing).toEqual(["not"]); // {2bad} is not a token; {not} is, and is missing
  });

  it("fills numeric values without stringifying oddly", () => {
    expect(fill("{n}px", { n: 12.5 }).text).toBe("12.5px");
  });
});

describe("controlValue()", () => {
  const slider = demoTool.controls[2]; // blur, unit px
  const toggle = demoTool.controls[3];
  it("appends slider units", () => {
    expect(controlValue(slider, 20)).toBe("20px");
  });
  it("maps toggles to css values", () => {
    expect(controlValue(toggle, true)).toBe("1px solid");
    expect(controlValue(toggle, false)).toBe("none");
  });
});

describe("defaultValues / toolValues", () => {
  it("starts from control defaults", () => {
    expect(defaultValues(demoTool)).toEqual({ tint: "#ffffff", opacity: 55, blur: 14, edge: true, radius: "sm" });
  });
  it("formats values for templates and exposes name/summary/tags", () => {
    const v = toolValues(demoTool, defaultValues(demoTool));
    expect(v.blur).toBe("14px");
    expect(v.edge).toBe("1px solid");
    expect(v.opacity).toBe("55");
    expect(v.name).toBe("Demo Tool");
    expect(v.tags).toBe("test");
  });
});

describe("fillTool()", () => {
  it("fills css, demo, snippets and all five prompt tabs", () => {
    const cur = { ...defaultValues(demoTool), blur: 30, edge: false };
    const f = fillTool(demoTool, cur);
    expect(f.css).toContain("filter: blur(30px)");
    expect(f.css).toContain("border: none");
    expect(f.demoHtml).toContain("<div class=\"card\">Demo Tool</div>");
    expect(f.snippets["Tailwind"]).toBe("bg-[#ffffff] blur-[30px]");
    expect(f.prompts.lovable).toBe("Demo Tool, 30px frost, #ffffff tint.");
    expect(f.missing).toEqual([]);
  });
  it("reports missing tokens instead of blanking them", () => {
    const broken: Tool = { ...demoTool, cssTemplate: ".demo-root { color: {nope}; }" };
    const f = fillTool(broken, defaultValues(broken));
    expect(f.css).toContain("{nope}");
    expect(f.missing).toContain("nope");
  });
});

describe("escapeHtml()", () => {
  it("escapes markup characters", () => {
    expect(escapeHtml(`<script>"hi" & 'bye'</script>`)).toBe(
      "&lt;script&gt;&quot;hi&quot; &amp; &#39;bye&#39;&lt;/script&gt;",
    );
  });
});
