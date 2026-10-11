/* ══ template fill ═══════════════════════════════════════════════════
   Every visual tool stores CSS, code snippets and AI prompts as
   templates with {placeholder} tokens named after its controls.
   Changing a control re-fills the demo, the code and all five prompt
   tabs with the exact chosen values. ═══════════════════════════════ */
import type { Control, ControlValues, Tool } from "./types";

const TOKEN = /\{([a-zA-Z][a-zA-Z0-9_]*)\}/g;

export interface FillResult { text: string; missing: string[] }

/* Replace {tokens}. Unknown placeholders are LEFT ALONE (so a typo is
   visible in the output) and reported in `missing`. */
export function fill(template: string, values: Record<string, string | number>): FillResult {
  const missing: string[] = [];
  const text = template.replace(TOKEN, (whole, key: string) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) return String(values[key]);
    if (!missing.includes(key)) missing.push(key);
    return whole;
  });
  return { text, missing };
}

/* The CSS/Tailwind snippets are shown as text; the demo HTML is
   injected, so escape values that end up inside markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function defaultValues(tool: Tool): ControlValues {
  const out: ControlValues = {};
  for (const c of tool.controls) out[c.id] = c.def;
  return out;
}

/* Turn one control's raw value into the string its templates want. */
export function controlValue(c: Control, raw: string | number | boolean): string {
  switch (c.type) {
    case "slider":
      return `${raw}${c.unit ?? ""}`;
    case "toggle":
      return raw ? (c.onValue ?? "true") : (c.offValue ?? "false");
    case "select":
    case "color":
      return String(raw);
  }
}

/* Full placeholder map for a tool: every control plus {name}, {summary}
   and {tags} for prompt text. */
export function toolValues(tool: Tool, current: ControlValues): Record<string, string> {
  const values: Record<string, string> = {
    name: tool.name,
    summary: tool.summary,
    tags: tool.tags.join(", "),
  };
  for (const c of tool.controls) {
    const raw = current[c.id] ?? c.def;
    values[c.id] = controlValue(c, raw);
  }
  return values;
}

export interface FilledTool {
  css: string;
  snippets: Record<string, string>;
  prompts: Record<string, string>;
  demoHtml: string;
  missing: string[];
}

export function fillTool(tool: Tool, current: ControlValues): FilledTool {
  const values = toolValues(tool, current);
  const missing: string[] = [];
  const run = (tpl: string) => {
    const r = fill(tpl, values);
    for (const m of r.missing) if (!missing.includes(m)) missing.push(m);
    return r.text;
  };
  const prompts: Record<string, string> = {};
  for (const [key, tpl] of Object.entries(tool.prompts)) prompts[key] = run(tpl);
  const snippets: Record<string, string> = {};
  for (const [key, tpl] of Object.entries(tool.codeSnippets ?? {})) snippets[key] = run(tpl);
  return {
    css: tool.cssTemplate ? run(tool.cssTemplate) : "",
    snippets,
    prompts,
    demoHtml: tool.demoHtml ? run(tool.demoHtml) : "",
    missing,
  };
}
