"use client";
/* ══ /tools - Artifacts home: 7 shelves + alias-aware search ════════ */
import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { Eyebrow, SectionHead, btn } from "@/components/ui";
import { TOOL_CATEGORIES } from "@/lib/tools/types";
import { TOOLS_TOTAL, countOfCategory, searchTools, toolById, toolPath } from "@/lib/tools/data";
import { CatIcon, useFavs, FavBtn } from "./shared";

export default function ToolsHome() {
  const [q, setQ] = useState("");
  const { favs, toggle, mounted } = useFavs();
  const hits = useMemo(() => searchTools(q), [q]);

  return (
    <div className="max-w-[1180px] mx-auto px-5 md:px-8 pt-14 pb-24">
      <Eyebrow>Artifacts</Eyebrow>
      <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(30px,4.6vw,52px)] leading-[1.04] mt-3">
        Every design and build trick, <span className="text-accent">in plain English</span>
      </h1>
      <p className="text-cocoa text-[16.5px] leading-[1.65] mt-4 max-w-[640px]">
        {TOOLS_TOTAL} artifacts across {TOOL_CATEGORIES.length} areas - each one explained without jargon, with a live demo you can
        touch, code you can copy, and a ready-made prompt for Cursor, Claude, ChatGPT or Lovable that already contains your exact values.
      </p>

      {/* global search, aliases included */}
      <div className="mt-9 max-w-[560px]">
        <div className="flex items-center gap-2 bg-card border border-line rounded-full py-[6px] pl-[16px] pr-[6px] shadow-soft focus-within:border-accent transition-colors">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-dim shrink-0"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder='Try "frosted glass", "dark mode", "webhook"…'
            aria-label="Search artifacts"
            className="flex-1 min-w-0 border-0 outline-none bg-transparent text-[14.5px] placeholder:text-dim py-2"
            autoComplete="off"
          />
        </div>
        {q.trim().length >= 2 && (
          <div className="mt-3 bg-card border border-line rounded-[16px] shadow-lift overflow-hidden">
            {hits.length === 0 ? (
              <p className="px-4 py-3.5 text-[13.5px] text-cocoa">Nothing matches "{q}" yet - browse the shelves below, or ask the <Link to="/tools/builder" className="text-rust font-semibold hover:underline">prompt builder</Link>.</p>
            ) : (
              hits.slice(0, 8).map((h) => (
                <Link key={h.tool.id} to={toolPath(h.tool)} className="flex items-center gap-3 px-4 py-3 border-b border-liness last:border-0 hover:bg-peach transition-colors">
                  <b className="text-[14px]">{h.tool.name}</b>
                  <span className="text-[12.5px] text-cocoa truncate">{h.tool.summary}</span>
                  <span className="ml-auto font-mono text-[10px] uppercase text-dim shrink-0">{h.tool.subcategory.replace(/-/g, " ")}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* favourites */}
      {mounted && favs.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-display font-bold text-[19px]">Your saved artifacts</h2>
            <span className="font-mono text-[11px] text-dim">{favs.length} on this device</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {favs.map((id) => {
              const t = toolById(id);
              if (!t) return null;
              return (
                <span key={id} className="inline-flex items-center gap-2 bg-card border border-line rounded-full pl-3.5 pr-1.5 py-1.5">
                  <Link to={toolPath(t)} className="text-[13px] font-semibold hover:text-rust">{t.name}</Link>
                  <FavBtn compact tool={t} isFav onToggle={() => toggle(id)} />
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* the seven shelves */}
      <div className="mt-14">
        <SectionHead tag="The shelves" title="Pick where you are stuck" sub="Seven areas, from 'make this card look nice' to 'my site is live and found'." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
          {TOOL_CATEGORIES.map((c) => (
            <Link key={c.id} to={`/tools/${c.id}`} className="group bg-card border border-line rounded-[20px] p-5.5 pb-5 shadow-soft hover:shadow-lift hover:border-ember transition-all flex flex-col">
              <div className="flex items-start justify-between">
                <span className="w-11 h-11 rounded-[13px] bg-peach text-rust grid place-items-center group-hover:bg-coffee group-hover:text-foam transition-colors">
                  <CatIcon d={c.icon} />
                </span>
                <span className="font-mono text-[11px] text-dim">{countOfCategory(c.id)} tools</span>
              </div>
              <b className="font-display font-bold text-[17.5px] mt-4 group-hover:text-rust transition-colors">{c.label}</b>
              <p className="text-[13px] text-cocoa leading-[1.55] mt-1.5 flex-1">{c.blurb}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {c.subcategories.map((s) => (
                  <span key={s.id} className="font-mono text-[10px] uppercase tracking-[.06em] text-dim border border-liness rounded-full px-2 py-[3px]">{s.label}</span>
                ))}
              </div>
            </Link>
          ))}
          {/* builder card */}
          <Link to="/tools/builder" className="group bg-coffee text-foam border border-coffee rounded-[20px] p-5.5 pb-5 shadow-soft hover:shadow-dark transition-all flex flex-col">
            <span className="w-11 h-11 rounded-[13px] bg-roast text-ember grid place-items-center"><CatIcon d="M12 4l1.7 4.9L18.6 10l-4.9 1.7L12 16.6l-1.7-4.9L5.4 10l4.9-1.4zM18 16l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /></span>
            <b className="font-display font-bold text-[17.5px] mt-4">Master prompt builder</b>
            <p className="text-[13px] text-steam leading-[1.55] flex-1">Pick a style, layout, type, palette, backend, auth and host - get one combined prompt in your AI tool's format, ready to paste or download.</p>
            <span className={btn("primary", "sm") + " mt-4 self-start"}>Build my prompt ›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
