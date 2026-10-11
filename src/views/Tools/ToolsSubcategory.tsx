"use client";
/* ══ /tools/[category]/[subcategory] - tool cards with filters ══════ */
import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { Eyebrow } from "@/components/ui";
import type { ToolCategoryId } from "@/lib/tools/types";
import { findCategory, findSubcategory } from "@/lib/tools/types";
import { toolsOfSub } from "@/lib/tools/data";
import { Bread, ToolCard, useFavs } from "./shared";

export default function ToolsSubcategory({ catId, subId }: { catId: ToolCategoryId; subId: string }) {
  const cat = findCategory(catId)!;
  const sub = findSubcategory(catId, subId)!;
  const all = toolsOfSub(catId, subId);
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState("all");
  const [tag, setTag] = useState("all");
  const { favs, toggle, mounted } = useFavs();

  const tags = useMemo(() => [...new Set(all.flatMap((t) => t.tags))].sort(), [all]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((t) =>
      (diff === "all" || t.difficulty === diff) &&
      (tag === "all" || t.tags.includes(tag)) &&
      (!needle || t.name.toLowerCase().includes(needle) || t.summary.toLowerCase().includes(needle) ||
        t.aliases.some((a) => a.toLowerCase().includes(needle)) || t.tags.some((g) => g.includes(needle))),
    );
  }, [all, q, diff, tag]);

  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-10 pb-24">
      <Bread items={[{ label: "Home", to: "/" }, { label: "Artifacts", to: "/tools" }, { label: cat.label, to: `/tools/${cat.id}` }, { label: sub.label }]} />
      <div className="mt-5">
        <Eyebrow>{cat.label}</Eyebrow>
        <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(26px,3.6vw,40px)] leading-[1.08] mt-1.5">{sub.label}</h1>
        <p className="text-cocoa text-[15px] leading-[1.6] mt-2 max-w-[620px]">{sub.blurb}</p>
      </div>

      {/* filter row */}
      <div className="flex flex-wrap items-center gap-2.5 mt-7">
        <input
          value={q} onChange={(e) => setQ(e.target.value)} aria-label={`Search ${sub.label}`}
          placeholder="Filter by name, alias or tag…"
          className="bg-card border border-line rounded-full px-4 py-2.5 text-[13.5px] w-[250px] outline-none focus:border-accent transition-colors placeholder:text-dim"
        />
        <div className="flex gap-1.5" role="group" aria-label="Difficulty">
          {["all", "beginner", "intermediate", "advanced"].map((d) => (
            <button key={d} onClick={() => setDiff(d)} aria-pressed={diff === d}
              className={`text-[12.5px] font-semibold rounded-full px-3.5 py-[7px] border transition-colors ${diff === d ? "bg-coffee text-foam border-coffee" : "bg-card text-cocoa border-line hover:border-accent"}`}>
              {d === "all" ? "Any level" : d}
            </button>
          ))}
        </div>
        {tags.length > 1 && (
          <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Tag filter"
            className="bg-card border border-line rounded-full px-3.5 py-[9px] text-[12.5px] font-semibold text-cocoa outline-none focus:border-accent">
            <option value="all">All tags</option>
            {tags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
        <span className="ml-auto font-mono text-[11px] text-dim">{shown.length} of {all.length}</span>
      </div>

      {shown.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {shown.map((t) => (
            <ToolCard key={t.id} tool={t} fav={mounted ? { toggle, isFav: favs.includes(t.id), mounted } : undefined} />
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center bg-cream border border-dashed border-line rounded-[18px] py-12 px-6">
          {all.length === 0 ? (
            <>
              <p className="text-[15px] font-semibold">These shelves are being stocked.</p>
              <p className="text-[13.5px] text-cocoa mt-1.5">Meanwhile <Link to={`/tools/${cat.id}`} className="text-rust font-semibold hover:underline">{cat.label} has more ›</Link> or try the <Link to="/tools/builder" className="text-rust font-semibold hover:underline">prompt builder</Link>.</p>
            </>
          ) : (
            <>
              <p className="text-[15px] font-semibold">Nothing here matches those filters.</p>
              <p className="text-[13.5px] text-cocoa mt-1.5">Clear the search or <button className="text-rust font-semibold hover:underline" onClick={() => { setQ(""); setDiff("all"); setTag("all"); }}>reset filters</button>. <Link to={`/tools/${cat.id}`} className="text-rust font-semibold hover:underline">Back to {cat.label} ›</Link></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
