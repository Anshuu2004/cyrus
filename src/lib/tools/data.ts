/* ══ tools data index ════════════════════════════════════════════════
   One import surface over the seven category datasets. Everything the
   Artifacts pages need: lookups, counts and alias-aware search. ════ */
import type { Tool, ToolCategoryId } from "./types";
import { TOOL_CATEGORIES, findCategory } from "./types";
import { UI_DESIGN_TOOLS } from "../../data/tools/ui-design";
import { TYPOGRAPHY_COLOUR_TOOLS } from "../../data/tools/typography-colour";
import { FRONTEND_TOOLS } from "../../data/tools/frontend";
import { BACKEND_DATA_TOOLS } from "../../data/tools/backend-data";
import { AUTH_PAYMENTS_SECURITY_TOOLS } from "../../data/tools/auth-payments-security";
import { DEPLOY_LAUNCH_TOOLS } from "../../data/tools/deploy-launch";
import { AI_PROMPTING_TOOLS } from "../../data/tools/ai-prompting";

export const ALL_TOOLS: Tool[] = [
  ...UI_DESIGN_TOOLS,
  ...TYPOGRAPHY_COLOUR_TOOLS,
  ...FRONTEND_TOOLS,
  ...BACKEND_DATA_TOOLS,
  ...AUTH_PAYMENTS_SECURITY_TOOLS,
  ...DEPLOY_LAUNCH_TOOLS,
  ...AI_PROMPTING_TOOLS,
];

const BY_ID = new Map(ALL_TOOLS.map((t) => [t.id, t]));

export const toolById = (id: string) => BY_ID.get(id) ?? undefined;

export const toolsOfCategory = (catId: string) =>
  ALL_TOOLS.filter((t) => t.category === catId);

export const toolsOfSub = (catId: string, subId: string) =>
  ALL_TOOLS.filter((t) => t.category === catId && t.subcategory === subId);

export const countOfCategory = (catId: string) =>
  toolsOfCategory(catId).length;

export const countOfSub = (catId: string, subId: string) =>
  toolsOfSub(catId, subId).length;

/* tool path for <Link> */
export const toolPath = (t: Tool) => `/tools/${t.category}/${t.subcategory}/${t.id}`;
export const subPath = (catId: string, subId: string) => `/tools/${catId}/${subId}`;

export const isToolCategory = (id: string): id is ToolCategoryId =>
  TOOL_CATEGORIES.some((c) => c.id === id);

/* ══ search: matches name, aliases, tags, summary - "frosted glass"
   must find Glassmorphism. Score: name > alias > everything else. ══ */
export interface ToolHit { tool: Tool; score: number }

export function searchTools(query: string, limit = 24): ToolHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: ToolHit[] = [];
  for (const t of ALL_TOOLS) {
    let score = 0;
    const name = t.name.toLowerCase();
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.includes(q)) score = 60;
    else if (t.aliases.some((a) => a.toLowerCase().includes(q))) score = 55;
    else if (t.tags.some((g) => g.toLowerCase().includes(q))) score = 30;
    else if (t.summary.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) score = 20;
    else if (t.id.includes(q)) score = 40;
    if (score > 0) hits.push({ tool: t, score });
  }
  hits.sort((a, b) => b.score - a.score || b.tool.tags.length - a.tool.tags.length);
  return hits.slice(0, limit);
}

/* related tools resolved across categories; missing ids are skipped */
export const relatedTools = (t: Tool) =>
  t.related.map((id) => BY_ID.get(id)).filter((x): x is Tool => Boolean(x));

export const categoryOf = (id: string) => findCategory(id);

export const TOOLS_TOTAL = ALL_TOOLS.length;
export const SUBS_TOTAL = TOOL_CATEGORIES.reduce((n, c) => n + c.subcategories.length, 0);
