"use client"
/* ══ shell.tsx — the dashboard chrome shared by every dashboard page ══
   Dark sidebar on desktop, horizontal chip rail on phones, one sign-in gate,
   and a professional page header for each feature.                      ══ */
import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "@/lib/router";
import { Avatar, btn, Word } from "../../components/ui";
import { DP, FEATURES, W } from "./shared";
import type { Dash } from "./useDash";

const SW = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const Ic = ({ d, size = 17, filled }: { d: string; size?: number; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    {filled ? <path d={d} fill="currentColor" stroke="none" /> : <path d={d} {...SW} />}
  </svg>
);

export function Ring({ pct }: { pct: number }) {
  const R = 18, C = 2 * Math.PI * R;
  return (
    <span className="relative w-11 h-11 shrink-0 grid place-items-center">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle cx="22" cy="22" r={R} fill="none" strokeWidth="4" stroke="var(--color-roast)" />
        <circle cx="22" cy="22" r={R} fill="none" strokeWidth="4" strokeLinecap="round" stroke="var(--color-ember)"
          strokeDasharray={`${(pct / 100) * C} ${C}`} />
      </svg>
      <em className="absolute inset-0 grid place-items-center font-mono text-[10px] not-italic font-bold text-ember">{pct}%</em>
    </span>
  );
}

export function Toggle({ on, flip }: { on: boolean; flip: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={flip}
      className={`relative w-[38px] h-[22px] rounded-full shrink-0 transition-colors cursor-pointer ${on ? "bg-accent" : "bg-roast"}`}>
      <span className={`absolute top-[3px] w-4 h-4 rounded-full transition-all duration-200 ease-silk ${on ? "left-[19px] bg-white" : "left-[3px] bg-steam"}`} />
    </button>
  );
}

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`bg-card border border-line rounded-[22px] p-6 shadow-soft ${className}`}>{children}</section>
);

/* one gate for every dashboard route */
export function DashGate({ dash, children }: { dash: Dash; children: ReactNode }) {
  if (dash.user) return <>{children}</>;
  return (
    <div className={`${W} py-24 text-center`}>
      <p className="font-mono text-[10.5px] tracking-[.14em] uppercase text-dim mb-4">Dashboard</p>
      <h1 className="font-display font-extrabold text-[clamp(28px,4vw,42px)] tracking-[-.02em] mb-3">
        Your board is <Word>empty</Word> until you sign in.
      </h1>
      <p className="text-cocoa max-w-[440px] mx-auto text-[15.5px] leading-[1.65] mb-8">
        Saved repos, followed orgs, live hackathon deadlines and a reading list tuned to your stack - all behind one free sign-in.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button className={btn("primary", "lg")} onClick={dash.googleIn} disabled={dash.gBusy}>
          {dash.gBusy ? "Opening Google..." : "Continue with Google"}
        </button>
        <button className={btn("outline", "lg")} onClick={() => dash.setAuthOpen(true)}>Use email instead</button>
      </div>
    </div>
  );
}

/* sidebar rail: Overview + every feature page, with live counts */
export function featureCounts(d: Dash): Record<string, string> {
  return {
    saved: String(d.saved.length),
    orgs: String(d.savedOrgs.length),
    matcher: d.prof.done ? String(d.recs.length) : "",
    watchlist: String(d.watch.length),
    mentors: String(d.mentors.length),
    compare: String(d.cmpOrgs.length),
    artifacts: String(d.favTools.length),
    deadlines: String(d.due.length),
    reading: String(d.picks.length),
    stack: String(d.langs.length),
  };
}

export function DashShell({ dash, active, children }: { dash: Dash; active: string; children: ReactNode }) {
  const user = dash.user!;
  const counts = featureCounts(dash);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const rail: [string, string, string, string][] = [
    [DP.grid, "Overview", "/dashboard", ""],
    ...FEATURES.map((f) => [DP[f.icon] ?? DP.star, f.title, `/dashboard/${f.id}`, counts[f.id] ?? ""] as [string, string, string, string]),
  ];
  return (
    <div className={`${W} pt-8 pb-6 grid grid-cols-[272px_1fr] gap-6 items-start max-[980px]:grid-cols-1 max-[980px]:gap-4`}>
      <aside className="sticky top-[86px] max-[980px]:static bg-coffee border border-bean rounded-[24px] p-5 text-foam">
        <div className="flex items-center gap-3 pb-4 border-b border-bean">
          <Avatar name={user.name} size={44} src={user.picture} />
          <div className="min-w-0">
            <b className="block font-display text-[14.5px] text-white truncate">{user.name}</b>
            <span className="text-[11px] text-steam truncate block">
              {user.email || (user.provider === "guest" ? "Guest session" : `Signed in with ${user.provider}`)}
            </span>
          </div>
          <Ring pct={dash.pct} />
        </div>

        {/* desktop: full rail. phone: horizontally scrollable chips */}
        <nav className="hidden max-[980px]:flex gap-2 overflow-x-auto py-3.5 no-scrollbar" aria-label="Dashboard sections">
          {rail.map(([ic, l, to, cnt]) => (
            <Link key={l} to={to} className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full border text-[12.5px] font-semibold transition-colors ${active === to ? "bg-accent border-accent text-white" : "border-bean text-steam hover:bg-bean hover:text-foam"}`}>
              <Ic d={ic} size={14} />{l}{cnt && <span className="font-mono text-[10px] opacity-80">{cnt}</span>}
            </Link>
          ))}
        </nav>
        <nav className="max-[980px]:hidden grid gap-[3px] py-3.5 max-h-[46vh] overflow-y-auto" aria-label="Dashboard sections">
          {rail.map(([ic, l, to, cnt]) => (
            <Link key={l} to={to}
              className={`flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-colors ${active === to ? "bg-bean text-white" : "text-steam hover:bg-bean hover:text-foam"}`}>
              <span className="w-4 text-center shrink-0"><Ic d={ic} size={15} /></span>{l}
              {cnt && <span className="ml-auto font-mono text-[10.5px] opacity-75">{cnt}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t border-bean pt-3">
          <button onClick={() => setPrefsOpen((v) => !v)} aria-expanded={prefsOpen}
            className="flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-steam hover:bg-bean hover:text-foam cursor-pointer transition-colors">
            <span className="w-4 text-center"><Ic d={DP.settings} size={15} /></span>Notifications
            <span className="ml-auto font-mono text-[10px] opacity-70">{prefsOpen ? "hide" : "edit"}</span>
          </button>
          {prefsOpen && (
            <div className="grid gap-1 pb-1">
              {([
                ["Weekly digest", "digest"],
                ["Hackathon deadlines", "windows"],
                ["Mentions & replies", "mentions"],
              ] as const).map(([l, k]) => (
                <div key={k} className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-steam">
                  <span className="flex-1">{l}</span>
                  <Toggle on={dash.prefs[k]} flip={() => dash.setPrefs({ ...dash.prefs, [k]: !dash.prefs[k] })} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-bean mt-2 pt-3.5 grid gap-1">
          <Link to="/nova" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-bold text-white bg-accent/85 hover:bg-accent transition-colors"><Ic d={DP.spark} size={15} /> Ask nova.ai</Link>
          <Link to="/assistant" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-steam hover:bg-bean hover:text-foam"><Ic d={DP.target} size={15} /> Ask the helper</Link>
          <Link to="/projects" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-steam hover:bg-bean hover:text-foam"><Ic d={DP.plus} size={15} /> Find something to save</Link>
          <Link to="/organizations" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-steam hover:bg-bean hover:text-foam"><Ic d={DP.building} size={15} /> Pick an organization</Link>
          <Link to="/tools" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold text-steam hover:bg-bean hover:text-foam"><Ic d={DP.gem} size={15} /> Browse the Artifacts</Link>
        </div>
      </aside>
      <main className="grid gap-5 min-w-0">{children}</main>
    </div>
  );
}

/* page header for a feature page */
export function DashHead({ title, sub, back = "/dashboard" }: { title: string; sub: string; back?: string }) {
  return (
    <div className="flex items-start gap-4 flex-wrap">
      <div className="min-w-0">
        <Link to={back} className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[.12em] text-dim hover:text-accent transition-colors">
          <Ic d={DP.home} size={12} /> Dashboard
        </Link>
        <h1 className="font-display font-extrabold tracking-[-.02em] text-[clamp(24px,3vw,34px)] mt-1.5">{title}</h1>
        <p className="text-cocoa text-[14.5px] leading-[1.65] mt-1.5 max-w-[640px]">{sub}</p>
      </div>
    </div>
  );
}

/* keep the chip rail clean: no visible scrollbar on phones */
