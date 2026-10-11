/* Token-fill sweep: every tool renders with its defaults and no unresolved {tokens}. */
import { ALL_TOOLS } from "../src/lib/tools/data";
import { fillTool, defaultValues } from "../src/lib/tools/fill";

let bad = 0;
for (const t of ALL_TOOLS) {
  const { missing } = fillTool(t, defaultValues(t));
  if (missing.length) {
    bad++;
    console.log(`MISSING ${t.category}/${t.id}: ${[...new Set(missing)].join(", ")}`);
  }
}

// subcategory coverage per category file
const byCat = new Map<string, Map<string, number>>();
for (const t of ALL_TOOLS) {
  const m = byCat.get(t.category) ?? new Map<string, number>();
  m.set(t.subcategory, (m.get(t.subcategory) ?? 0) + 1);
  byCat.set(t.category, m);
}
for (const [cat, m] of byCat) console.log(cat, [...m.entries()].map(([s, n]) => `${s}=${n}`).join(" "));
console.log(`TOTAL ${ALL_TOOLS.length} tools, ${bad} with missing tokens`);
process.exit(bad ? 1 : 0);
