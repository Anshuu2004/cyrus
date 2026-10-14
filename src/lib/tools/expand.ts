/* ══ tools/expand.ts — compact seed rows → full Tool artifacts ═══════
   The catalog is written as one-line tuples so hundreds of entries stay
   readable; this kit fans each one out into a complete Tool with five
   tailored prompts. Pipes "|" separate list items inside a field.
   Text here must never contain {curly tokens} - the template filler
   would read them as control placeholders and the sweep would flag it. ═ */
import type { Difficulty, Tool, ToolCategoryId } from "./types";

/* [id, name, subcategory, aliases, summary, description,
   whenToUse, whenNotToUse, difficulty(b/i/a), tags, mistakes, tips,
   related, learnLabel, learnUrl] */
export type Seed = [
  string, string, string, string, string, string,
  string, string, "b" | "i" | "a", string, string, string,
  string, string, string,
];

const DIFF: Record<"b" | "i" | "a", Difficulty> = { b: "beginner", i: "intermediate", a: "advanced" };
const list = (s: string) => s.split("|").map((x) => x.trim()).filter(Boolean);

export function fromSeed(category: ToolCategoryId, s: Seed): Tool {
  const [id, name, sub, aliases, summary, description, when, whenNot, diff, tags, mistakes, tips, related, learnLabel, learnUrl] = s;
  const w = list(when); const n = list(whenNot); const m = list(mistakes); const t = list(tips);
  const brief = `${name} - ${summary}`;
  const dos = `Where it fits: ${w.join("; ")}. Where it backfires: ${n.join("; ")}.`;
  const warn = `Common mistakes to avoid: ${m.join("; ")}.`;
  const advice = `Pro tips: ${t.join("; ")}.`;
  return {
    id, name, category, subcategory: sub,
    aliases: list(aliases), summary, description,
    whenToUse: w, whenNotToUse: n,
    difficulty: DIFF[diff], tags: list(tags),
    controls: [],
    prompts: {
      cursor: `You are working inside my repository, so follow its existing conventions, file structure and styling. Implement this: ${brief} ${dos} ${warn} Ship it as one focused change with the demo or section needed to see it working.`,
      claude: `Act as a careful senior engineer. Think step by step, state your assumptions, then build this: ${brief} ${dos} ${warn} ${advice} Show the complete code, not a sketch.`,
      chatgpt: `Help me add this to my project the way pair programming would - explain each change in plain English before you make it: ${brief} ${dos} ${warn} Tell me what to look at when it renders to confirm it works.`,
      lovable: `Build this: ${brief} Keep the design tokens consistent with the rest of the app. ${dos}`,
      generic: `Add ${name} to this project. What it is: ${description} ${dos} ${warn} ${advice} Be explicit about every value you choose so I can tune it later.`,
    },
    mistakes: m, tips: t,
    related: list(related),
    learnMore: [{ label: learnLabel, url: learnUrl }],
  };
}

export const fromSeeds = (category: ToolCategoryId, seeds: Seed[]): Tool[] => seeds.map((s) => fromSeed(category, s));
