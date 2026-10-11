"use client";
/* ══ /tools/[category] - the subcategory list for one shelf ══════════ */
import { Link } from "@/lib/router";
import { SectionHead, Eyebrow, btn } from "@/components/ui";
import type { ToolCategoryId } from "@/lib/tools/types";
import { findCategory } from "@/lib/tools/types";
import { toolsOfSub, subPath } from "@/lib/tools/data";
import { Bread, CatIcon, ToolCard, useFavs } from "./shared";

export default function ToolsCategory({ catId }: { catId: ToolCategoryId }) {
  const cat = findCategory(catId)!;
  const { favs, toggle, mounted } = useFavs();

  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-10 pb-24">
      <Bread items={[{ label: "Home", to: "/" }, { label: "Artifacts", to: "/tools" }, { label: cat.label }]} />
      <div className="flex items-start gap-4 mt-5">
        <span className="w-[52px] h-[52px] shrink-0 rounded-[15px] bg-peach text-rust grid place-items-center"><CatIcon d={cat.icon} /></span>
        <div>
          <Eyebrow>{cat.subcategories.length} sub-areas</Eyebrow>
          <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(26px,3.6vw,40px)] leading-[1.08] mt-1.5">{cat.label}</h1>
          <p className="text-cocoa text-[15px] leading-[1.6] mt-2 max-w-[620px]">{cat.blurb}</p>
        </div>
      </div>
      <div className="flex gap-2.5 mt-8 flex-wrap">
        <Link to="/tools/builder" className={btn("dark", "sm")}>Master prompt builder ›</Link>
        {cat.subcategories.map((s) => (
          <Link key={s.id} to={subPath(cat.id, s.id)} className="text-[12.5px] font-semibold text-cocoa bg-card border border-line rounded-full px-3.5 py-[6px] hover:border-accent hover:text-rust transition-all">
            {s.label}
          </Link>
        ))}
      </div>

      {cat.subcategories.map((s) => {
        const tools = toolsOfSub(cat.id, s.id);
        return (
          <section key={s.id} id={s.id} className="mt-14 scroll-mt-24">
            <SectionHead
              tag={`${tools.length} tools`}
              title={s.label}
              sub={s.blurb}
              side={<Link to={subPath(cat.id, s.id)} className="text-[13px] font-semibold text-rust hover:underline shrink-0">Browse all ›</Link>}
            />
            {tools.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {tools.map((t) => (
                  <ToolCard key={t.id} tool={t} fav={mounted ? { toggle, isFav: favs.includes(t.id), mounted } : undefined} />
                ))}
              </div>
            ) : (
              <p className="mt-6 text-[13.5px] text-cocoa bg-cream border border-dashed border-line rounded-[14px] px-4 py-3.5">
                Landing soon - meanwhile the other shelves are stocked. Try the <Link to="/tools/builder" className="text-rust font-semibold hover:underline">prompt builder</Link>.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
