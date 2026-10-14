"use client";
/* ══ /tools/browse - every artifact in one filterable list ══════════ */
import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { Eyebrow } from "@/components/ui";
import { TOOL_CATEGORIES, findCategory, findSubcategory } from "@/lib/tools/types";
import { ALL_TOOLS, TOOLS_TOTAL, countOfCategory, countOfSub, toolsOfSub } from "@/lib/tools/data";
import { Bread, FilterBar, ShowMore, ToolGrid, useFavs, useFinder } from "./shared";

const chip = "text-[12.5px] font-semibold rounded-full px-3.5 py-[7px] border transition-colors";
const chipOn = "bg-coffee text-foam border-coffee";
const chipOff = "bg-card text-cocoa border-line hover:border-accent";

export default function ToolsBrowse() {
  const [cat, setCat] = useState("all");
  const [sub, setSub] = useState("all");
  const f = useFinder(useMemo(() => (cat === "all" ? ALL_TOOLS : sub === "all" ? undefined : toolsOfSub(cat, sub)) ?? [], [cat, sub]));
  const { favs, toggle, mounted } = useFavs();
  const catObj = findCategory(cat);

  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-10 pb-24">
      <Bread items={[{ label: "Home", to: "/" }, { label: "Artifacts", to: "/tools" }, { label: "Browse all" }]} />
      <div className="mt-5">
        <Eyebrow>Artifacts</Eyebrow>
        <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(26px,3.6vw,40px)] leading-[1.08] mt-1.5">
          All {TOOLS_TOTAL} artifacts, one list
        </h1>
        <p className="text-cocoa text-[15px] leading-[1.6] mt-2 max-w-[640px]">
          Filter by area, level, tag or plain words. Each card opens a page with the idea explained, the code to copy and a prompt that already carries your values.
        </p>
      </div>

      <div className="mt-7">
        <FilterBar f={f} searchLabel="Search all artifacts">
          <div className="flex gap-1.5 flex-wrap pb-3">
            <button onClick={() => { setCat("all"); setSub("all"); }} aria-pressed={cat === "all"} className={`${chip} ${cat === "all" ? chipOn : chipOff}`}>
              Every area <span className="font-mono text-[10px] opacity-70">{TOOLS_TOTAL}</span>
            </button>
            {TOOL_CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => { setCat(c.id); setSub("all"); }} aria-pressed={cat === c.id} className={`${chip} ${cat === c.id ? chipOn : chipOff}`}>
                {c.label} <span className="font-mono text-[10px] opacity-70">{countOfCategory(c.id)}</span>
              </button>
            ))}
          </div>
          {catObj && catObj.subcategories.length > 1 && (
            <div className="flex gap-1.5 flex-wrap pb-3 mb-3 border-b border-line">
              <button onClick={() => setSub("all")} aria-pressed={sub === "all"} className={`${chip} ${sub === "all" ? chipOn : chipOff}`}>All of {catObj.label.toLowerCase()}</button>
              {catObj.subcategories.map((s) => (
                <button key={s.id} onClick={() => setSub(s.id)} aria-pressed={sub === s.id} className={`${chip} ${sub === s.id ? chipOn : chipOff}`}>
                  {s.label} <span className="font-mono text-[10px] opacity-70">{countOfSub(catObj.id, s.id)}</span>
                </button>
              ))}
            </div>
          )}
          {cat !== "all" && sub !== "all" && (
            <p className="pb-3 text-[13px] text-cocoa">
              Showing the {findSubcategory(cat, sub)?.label.toLowerCase()} shelf of {findCategory(cat)?.label}.{" "}
              <Link to={`/tools/${cat}/${sub}`} className="text-rust font-semibold hover:underline">Open that shelf on its own page</Link>.
            </p>
          )}
        </FilterBar>
      </div>

      {f.shown.length > 0 ? (
        <>
          <ToolGrid f={f} fav={{ toggle, isFav: (id) => favs.includes(id), mounted }} />
          <ShowMore f={f} />
        </>
      ) : (
        <div className="mt-10 text-center bg-cream border border-dashed border-line rounded-[18px] py-12 px-6">
          <p className="text-[15px] font-semibold">No artifact matches that combination.</p>
          <p className="text-[13.5px] text-cocoa mt-1.5">
            <button className="text-rust font-semibold hover:underline" onClick={() => { f.reset(); setCat("all"); setSub("all"); }}>Start over</button> or ask the{" "}
            <Link to="/tools/builder" className="text-rust font-semibold hover:underline">prompt builder</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
