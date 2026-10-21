"use client"
/* ══ Dashboard.tsx — the hub page of the split board ═══════════════
   Greeting, live archive pulse, four stats, next steps, a tile per
   feature page (each has its own /dashboard/<feature> route), then
   short previews of deadlines and reading. Full sections live in
   src/lib/dash/sections.tsx; state lives in src/lib/dash/useDash.ts. ══ */
import { Link } from "@/lib/router";
import { btn } from "../components/ui";
import { fmt } from "../lib/util";
import { TOOLS_TOTAL } from "../lib/tools/data";
import { useDash } from "../lib/dash/useDash";
import type { Dash } from "../lib/dash/useDash";
import { Card, DashGate, DashShell, Ic, featureCounts } from "../lib/dash/shell";
import { DP, FEATURES, greet } from "../lib/dash/shared";
import { DeadlinesSection, ReadingSection } from "../lib/dash/sections";

export default function Dashboard() {
  const d = useDash();
  return (
    <DashGate dash={d}>
      <DashShell dash={d} active="/dashboard">
        <Hub d={d} />
      </DashShell>
    </DashGate>
  );
}

function Hub({ d }: { d: Dash }) {
  const user = d.user!;
  const counts = featureCounts(d);
  const stats: [string, string, string][] = [
    [DP.star, String(d.savedRepos.length), "projects saved"],
    [DP.building, String(d.orgList.length), "organizations followed"],
    [DP.spark, fmt(d.stars) || "0", "combined stars on your board"],
    [DP.code, String(d.langs.length), "languages across your stack"],
  ];
  const focus = d.watch.find((w) => w.status !== "applied");

  return (
    <>
      <Card className="flex items-center gap-5 flex-wrap">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-dim mb-1.5">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h2 className="font-display font-extrabold tracking-[-.02em] text-[clamp(22px,2.6vw,30px)]">
            {greet()}, {user.name.split(" ")[0]}<span className="text-accent">.</span>
          </h2>
          <p className="text-cocoa text-[14px] mt-1.5">
            {d.due.length ? `${d.due.length} deadline${d.due.length > 1 ? "s" : ""} coming up` : "no live deadlines right now"}
            {" · "}{d.saved.length + d.savedOrgs.length} saved item{d.saved.length + d.savedOrgs.length === 1 ? "" : "s"} on the board
            {" · "}{d.watch.length} org{d.watch.length === 1 ? "" : "s"} on the watchlist
          </p>
          {d.serverUser && (
            <span className="inline-flex items-center gap-1.5 mt-2 font-mono text-[10px] font-bold uppercase tracking-[.1em] text-leaf bg-leaf/10 border border-leaf/35 rounded-full px-2.5 py-1">
              <Ic d={DP.check} size={11} /> synced across devices
            </span>
          )}
        </div>
        <div className="ml-auto flex gap-2.5 flex-wrap">
          <Link to="/hackathons" className={btn("outline", "sm")}>Hackathon calendar</Link>
          <Link to="/resources" className={btn("outline", "sm")}>Resource shelf</Link>
        </div>
      </Card>

      <section aria-label="The archive right now" className="bg-coffee text-foam border border-bean rounded-[22px] px-6 py-4 flex items-center gap-7 flex-wrap">
        <span className="font-mono text-[10px] font-bold tracking-[.16em] uppercase text-ember shrink-0">The archive now</span>
        {([[fmt(d.pulse.total), "projects indexed"], [fmt(d.pulse.orgs), "organizations"], [d.pulse.span, "program years"], [fmt(d.pulse.other), "LFX · Outreachy · SoB"]] as [string, string][]).map(([v, l], i) => (
          <span key={l} className={`flex items-baseline gap-2 ${i ? "border-l border-bean pl-7 max-[860px]:border-0 max-[860px]:pl-0" : ""}`}>
            <b className="font-mono text-[16px] text-white">{v}</b>
            <span className="text-[12px] text-foam/60">{l}</span>
          </span>
        ))}
        <Link to="/opensource" className="ml-auto font-mono text-[10px] tracking-[.1em] uppercase text-foam/70 hover:text-white underline underline-offset-4 decoration-white/25 transition-colors">Browse archive</Link>
      </section>

      <section aria-label="Board stats" className="grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
        {stats.map(([ic, v, l]) => (
          <div key={l} className="bg-card border border-line rounded-[18px] p-5 shadow-soft">
            <span className="w-[34px] h-[34px] rounded-[10px] grid place-items-center mb-3 bg-peach text-rust block"><Ic d={ic} size={16} /></span>
            <b className="block font-display text-[28px] font-extrabold tracking-[-.02em]">{v}</b>
            <span className="text-cocoa text-[12.5px]">{l}</span>
          </div>
        ))}
      </section>

      <Card>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="panel-h-lg">Next steps</h3>
          <span className="font-mono text-[11px] text-dim ml-auto">{d.stepsDone} of {d.steps.length} done</span>
        </div>
        <div className="h-1.5 rounded-full bg-clay overflow-hidden mt-3 mb-5">
          <i className="block h-full rounded-full grow-x transition-all duration-500" style={{ width: `${(d.stepsDone / d.steps.length) * 100}%`, background: "linear-gradient(90deg, var(--color-accent), var(--color-ember))" }} />
        </div>
        <div className="grid gap-1">
          {d.steps.map(([on, l, to]) => (
            <Link key={l} to={to} className="group flex items-center gap-3.5 px-2 py-2.5 rounded-xl hover:bg-cream transition-colors">
              <span className={`w-[22px] h-[22px] rounded-[7px] border grid place-items-center shrink-0 transition-colors ${on ? "bg-leaf border-leaf text-accentfg" : "border-line bg-paper text-transparent"}`}>
                <Ic d={DP.check} size={11} />
              </span>
              <span className={`text-[14px] font-semibold ${on ? "text-dim line-through decoration-line" : "text-ink"}`}>{l}</span>
              {!on && <span className="ml-auto font-mono text-[10px] uppercase tracking-[.1em] text-accent opacity-0 group-hover:opacity-100 transition-opacity">Do it</span>}
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-baseline gap-3 flex-wrap mb-4">
          <h3 className="panel-h-lg">Your board, page by page</h3>
          <span className="font-mono text-[11px] text-dim ml-auto">every feature has its own page now</span>
        </div>
        <div className="grid grid-cols-3 gap-3 max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
          {FEATURES.map((f) => (
            <Link key={f.id} to={`/dashboard/${f.id}`}
              className="group bg-cream border border-line rounded-[16px] p-4 flex flex-col gap-2 hover:border-accent/50 hover:-translate-y-px transition-all">
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="w-[30px] h-[30px] rounded-[9px] bg-card border border-line grid place-items-center text-rust shrink-0">
                  <Ic d={DP[f.icon] ?? DP.star} size={15} />
                </span>
                <b className="card-title text-[13.5px] truncate flex-1">{f.title}</b>
                {counts[f.id] && <span className="font-mono text-[10.5px] font-bold text-accent shrink-0">{counts[f.id]}</span>}
              </span>
              <span className="text-cocoa text-[12.5px] leading-[1.5] line-clamp-2">{f.desc}</span>
              <span className="mt-auto font-mono text-[10px] uppercase tracking-[.1em] text-dim group-hover:text-accent transition-colors flex items-center gap-1.5">
                Open <Ic d={DP.arrow} size={12} />
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {focus && (
        <Card>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="font-mono text-[9.5px] font-bold uppercase tracking-[.12em] text-dim mb-1">Still on the list</p>
              <b className="block card-title text-[15px] truncate">{focus.org}</b>
              <span className="font-mono text-[11px] text-dim">{focus.status}{focus.note ? ` - ${focus.note}` : ""}</span>
            </div>
            <Link to="/dashboard/watchlist" className={btn("outline", "sm") + " ml-auto shrink-0"}>Open watchlist</Link>
          </div>
        </Card>
      )}

      <DeadlinesSection d={d} limit={4} />
      <ReadingSection d={d} limit={3} />

      <Card>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="min-w-0">
            <h3 className="panel-h-lg mb-1 flex items-center gap-2.5"><Ic d={DP.gem} size={16} /> {TOOLS_TOTAL} artifacts, ready to tune</h3>
            <p className="text-cocoa text-[13.5px] max-w-[560px]">Live demos with copy-paste code and prompts, grouped by the job they do. Save one and it appears on this board.</p>
          </div>
          <div className="ml-auto flex gap-2.5 shrink-0">
            <Link to="/tools/builder" className={btn("outline", "sm")}>Prompt builder</Link>
            <Link to="/tools" className={btn("primary", "sm")}>Browse artifacts</Link>
          </div>
        </div>
      </Card>
    </>
  );
}
