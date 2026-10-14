"use client";
/* ══ /tools/[category]/[subcategory] - the shelves, with real filters ══ */
import { Link } from "@/lib/router";
import { Eyebrow } from "@/components/ui";
import type { ToolCategoryId } from "@/lib/tools/types";
import { findCategory, findSubcategory } from "@/lib/tools/types";
import { countOfSub, toolsOfSub } from "@/lib/tools/data";
import { Bread, FilterBar, ShowMore, ToolGrid, useFavs, useFinder } from "./shared";

export default function ToolsSubcategory({ catId, subId }: { catId: ToolCategoryId; subId: string }) {
  const cat = findCategory(catId)!;
  const sub = findSubcategory(catId, subId)!;
  const all = toolsOfSub(catId, subId);
  const f = useFinder(all);
  const { favs, toggle, mounted } = useFavs();

  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-10 pb-24">
      <Bread items={[{ label: "Home", to: "/" }, { label: "Artifacts", to: "/tools" }, { label: cat.label, to: `/tools/${cat.id}` }, { label: sub.label }]} />
      <div className="mt-5">
        <Eyebrow>{cat.label}</Eyebrow>
        <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(26px,3.6vw,40px)] leading-[1.08] mt-1.5">{sub.label}</h1>
        <p className="text-cocoa text-[15px] leading-[1.6] mt-2 max-w-[620px]">{sub.blurb}</p>
      </div>

      <div className="mt-7">
        <FilterBar f={f} searchLabel={`Search ${sub.label}`}>
          {cat.subcategories.length > 1 && (
            <div className="flex gap-1.5 flex-wrap pb-3 mb-3 border-b border-line">
              {cat.subcategories.map((s) => (
                <Link key={s.id} to={`/tools/${cat.id}/${s.id}`}
                  className={`text-[12.5px] font-semibold rounded-full px-3.5 py-[7px] border transition-colors ${s.id === subId ? "bg-peach text-rust border-ember" : "bg-card text-cocoa border-line hover:border-accent"}`}>
                  {s.label} <span className="font-mono text-[10px] opacity-70">{countOfSub(cat.id, s.id)}</span>
                </Link>
              ))}
            </div>
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
          {all.length === 0 ? (
            <>
              <p className="text-[15px] font-semibold">These shelves are being stocked.</p>
              <p className="text-[13.5px] text-cocoa mt-1.5">Meanwhile <Link to={`/tools/${cat.id}`} className="text-rust font-semibold hover:underline">{cat.label} has more</Link> or try the <Link to="/tools/builder" className="text-rust font-semibold hover:underline">prompt builder</Link>.</p>
            </>
          ) : (
            <>
              <p className="text-[15px] font-semibold">Nothing here matches those filters.</p>
              <p className="text-[13.5px] text-cocoa mt-1.5">Clear the search or <button className="text-rust font-semibold hover:underline" onClick={f.reset}>reset filters</button>. <Link to={`/tools/${cat.id}`} className="text-rust font-semibold hover:underline">Back to {cat.label}</Link></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
