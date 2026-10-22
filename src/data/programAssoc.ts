/* ══ programAssoc.ts — which open-source programs each org really runs.
   Built from data already in the repo, no fabrication:
   - PROGRAM_REPOS carries the programs field (GSoC / LFX / Outreachy /
     GSSoc) scraped from each flagship repo's GitHub topics;
   - the catalog REPOS carry the "hacktoberfest" topic where GitHub does.
   Keyed by lowercased GitHub login; n is the number of tracked repos that
   advertise the program, so the badge can say how deep the habit runs. ═ */
import { REPOS } from "./repos";
import { PROGRAM_REPOS } from "./programRepos";

export type Assoc = { id: string; label: string; tone: "blue" | "green" | "cat" | "purple" | "stars"; n: number };

const PROGRAM_BY_KEY: Record<string, { id: string; label: string; tone: Assoc["tone"] }> = {
  GSoC:        { id: "gsoc",      label: "GSoC",      tone: "blue" },
  LFX:         { id: "lfx",       label: "LFX",       tone: "green" },
  Outreachy:   { id: "outreachy", label: "Outreachy", tone: "cat" },
  GSSoc:       { id: "gssoc",     label: "GSSoC",     tone: "purple" },
  Hacktoberfest: { id: "oct",     label: "Hacktoberfest", tone: "stars" },
};

/* login -> program key -> repo count */
const acc = new Map<string, Map<string, number>>();
const bump = (owner: string, key: string) => {
  const byKey = acc.get(owner) ?? new Map<string, number>();
  byKey.set(key, (byKey.get(key) ?? 0) + 1);
  acc.set(owner, byKey);
};

for (const r of PROGRAM_REPOS) {
  const owner = r.repo.split("/")[0].toLowerCase();
  for (const p of r.programs) if (PROGRAM_BY_KEY[p]) bump(owner, p);
}
for (const r of REPOS) {
  const owner = r.repo.split("/")[0].toLowerCase();
  for (const t of r.tags) {
    const tl = t.toLowerCase();
    if (tl === "hacktoberfest") bump(owner, "Hacktoberfest");
    else if (tl === "gsoc") bump(owner, "GSoC");
    else if (tl === "lfx" || tl === "lf-mentoring") bump(owner, "LFX");
    else if (tl === "outreachy") bump(owner, "Outreachy");
  }
}

/* stable order: biggest commitment first, then name */
export function programsOf(login: string): Assoc[] {
  const byKey = acc.get(login.toLowerCase());
  if (!byKey) return [];
  return [...byKey.entries()]
    .map(([key, n]) => ({ ...PROGRAM_BY_KEY[key], n }))
    .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label));
}

/* every program key some tracked org actually runs, in badge order */
export const PROGRAM_FILTERS: Assoc[] = Object.values(PROGRAM_BY_KEY).map((p) => ({ ...p, n: 0 }));
