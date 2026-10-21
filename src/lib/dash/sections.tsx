"use client"
/* ══ sections.tsx — the dashboard feature sections, rendered per page ══ */
import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { REPOS } from "../../data/repos";
import { ORGS } from "../../data/orgs";
import { avatarOf, fmt, CAT_META } from "../util";
import { Chip, OrgImg, btn } from "../../components/ui";
import { toolPath, TOOLS_TOTAL } from "../tools/data";
import { DP, daysTo, dueTone, norm, STATUS_CLS, YEARS_AGO } from "./shared";
import { Card, Ic, DashHead } from "./shell";
import type { Dash } from "./useDash";

const IC_STAR_SM = <Ic d={DP.star} size={14} filled />;
const IC_X = <Ic d={DP.x} size={13} />;
const IC_EYE = <Ic d={DP.eye} size={15} />;

export function SavedSection({ d }: { d: Dash }) {
  return (
    <Card>
      <h3 className="panel-h-lg mb-4 flex items-center gap-2.5">
        {IC_STAR_SM} Saved projects <Link to="/projects" className="go ml-auto text-dim text-[13px] font-medium hover:text-accent">browse more</Link>
      </h3>
      {d.savedRepos.length ? d.savedRepos.map((r) => {
        const prog = Math.round(20 + ((r!.repo.length * 7) % 70));
        return (
          <div key={r!.repo} className="flex items-center gap-3.5 py-3.5 border-b border-liness last:border-0 last:pb-0">
            <OrgImg src={avatarOf(r!.repo.split("/")[0], 76)} name={r!.repo} className="w-[38px] h-[38px] rounded-[11px] object-cover bg-clay shrink-0" />
            <div className="min-w-0 flex-1">
              <b className="block card-title text-[14px] truncate"><Link to={`/repo/${encodeURIComponent(r!.repo)}`} className="hover:text-accent">{r!.repo.split("/")[1]}</Link></b>
              <span className="font-mono text-[10.5px] text-dim">★ {fmt(r!.stars)} · {r!.lang} · {CAT_META[r!.cat]?.label ?? "community"}</span>
            </div>
            <div className="w-[120px] h-1.5 rounded-full bg-clay overflow-hidden shrink-0 max-[640px]:hidden" title={`${prog}% catalog activity`}>
              <i className="block h-full rounded-full grow-x" style={{ width: `${prog}%`, background: "linear-gradient(90deg, var(--color-accent), var(--color-ember))" }} />
            </div>
            <span className="font-mono text-[10.5px] text-dim w-8 shrink-0 max-[640px]:hidden">{prog}%</span>
            <button aria-label="Remove" onClick={() => { d.toggleSaved(r!.repo); d.toast(`Removed ${r!.repo.split("/")[1]}`); }}
              className="text-dim p-1.5 rounded-lg hover:text-brick transition-colors cursor-pointer shrink-0">{IC_X}</button>
          </div>
        );
      }) : (
        <p className="text-dim text-[14px] py-6 text-center">Nothing saved yet - tap the star on any project card and it lands here. <Link to="/projects" className="text-accent font-semibold hover:underline">Browse projects</Link></p>
      )}
    </Card>
  );
}

export function OrgsSection({ d }: { d: Dash }) {
  return (
    <Card>
      <h3 className="panel-h-lg mb-4 flex items-center gap-2.5"><Ic d={DP.building} size={16} /> Saved organizations</h3>
      {d.orgList.length ? (
        <div className="flex gap-2.5 flex-wrap">
          {d.orgList.map((o) => (
            <span key={o!.login} className="inline-flex items-center gap-2.5 bg-paper border border-line rounded-full py-2 pl-2 pr-3.5 text-[13px] font-semibold">
              <OrgImg src={avatarOf(o!.login, 52)} name={o!.login} className="w-[26px] h-[26px] rounded-full object-cover bg-clay" />
              <Link to={`/organizations/${o!.login}`} className="hover:text-accent">{o!.login}</Link>
              <span className="font-mono text-[10.5px] text-honey font-bold">★ {fmt(o!.stars)}</span>
              <button aria-label="Unfollow" onClick={() => { d.toggleSavedOrg(o!.login); d.toast(`Unfollowed ${o!.login}`); }}
                className="text-dim hover:text-brick cursor-pointer">{IC_X}</button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-dim text-[14px] py-6 text-center">Follow a few orgs and their new catalog repos show up in your digest. <Link to="/organizations" className="text-accent font-semibold hover:underline">Browse organizations</Link></p>
      )}
    </Card>
  );
}

export function MatcherSection({ d }: { d: Dash }) {
  const fin = "w-full bg-paper border border-line rounded-xl px-3.5 py-2.5 text-[14px] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(34, 197, 94,.12)]";
  const [drag, setDrag] = useState(false);
  const take = (f: File | null | undefined) => { if (f) d.parseResume(f); };
  return (
    <Card>
      <h3 className="panel-h-lg mb-1 flex items-center gap-2.5"><Ic d={DP.target} size={16} /> Personalised org selection</h3>
      <p className="text-cocoa text-[13px] mb-4 max-w-[640px]">
        Give cyrus a GitHub handle and your skills - typed or read straight off your resume - and it scores every
        organization in the {fmt(Math.max(d.archive.length, 5238))}-project program archive against what you actually build with.
      </p>
      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end max-[820px]:grid-cols-1">
        <label className="block">
          <span className="font-mono text-[9.5px] uppercase tracking-[.12em] text-dim block mb-1.5">GitHub username</span>
          <input value={d.ghIn} onChange={(e) => d.setGhIn(e.target.value)} placeholder="yourhandle" spellCheck={false} className={fin} />
        </label>
        <label className="block">
          <span className="font-mono text-[9.5px] uppercase tracking-[.12em] text-dim block mb-1.5">Skills</span>
          <input value={d.skillsIn} onChange={(e) => d.setSkillsIn(e.target.value)} placeholder="python, react, kubernetes…" className={fin} />
        </label>
        <button onClick={d.runMatch} className={btn("primary", "md")}>Match me</button>
      </div>

      {/* resume upload - parsed in the browser, nothing leaves the page */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files?.[0]); }}
        className={`mt-3 border border-dashed rounded-[16px] px-4 py-4 flex items-center gap-3.5 transition-colors ${drag ? "border-accent bg-peach/50" : "border-line bg-cream hover:border-accent/50"}`}
      >
        <span className="w-10 h-10 rounded-[12px] bg-white border border-line grid place-items-center shrink-0 text-rust">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 16V4m-5 5 5-5 5 5" /><path d="M4 15v4a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19v-4" />
          </svg>
        </span>
        <div className="min-w-0">
          <b className="block card-title text-[13.5px]">Upload your resume</b>
          <span className="text-[11.5px] text-dim">PDF, TXT or MD - drop it here or pick a file. It is read in your browser and only the skill keywords fill the box above.</span>
        </div>
        <label className={btn("outline", "sm") + " ml-auto shrink-0 cursor-pointer max-[560px]:hidden"}>
          Choose file
          <input type="file" accept=".md,.txt,.json,.csv,.pdf,text/*,application/pdf" className="hidden" onChange={(e) => take(e.target.files?.[0])} />
        </label>
      </div>
      {d.fileNote && (
        <p className="font-mono text-[10.5px] text-leaf mt-2 flex items-center gap-2 flex-wrap">
          {d.fileNote}
          <button onClick={() => d.setFileNote("")} className="text-dim hover:text-brick underline cursor-pointer">dismiss</button>
        </p>
      )}
      {d.prof.done && (
        <div className="mt-5 border-t border-liness pt-4">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[.1em] text-cocoa">
              Profile: {d.prof.gh ? `@${d.prof.gh} · ` : ""}{d.prof.skills.length} skills{d.savedOrgs.length ? ` · ${d.savedOrgs.length} followed orgs` : ""}
            </span>
            <button onClick={() => d.setProf({ ...d.prof, done: false })} className="font-mono text-[10px] font-bold uppercase tracking-[.1em] text-accent hover:underline cursor-pointer">Edit profile</button>
          </div>
          {d.recs.length ? (
            <div className="grid grid-cols-3 gap-3 max-[1000px]:grid-cols-2 max-[620px]:grid-cols-1">
              {d.recs.map((r) => (
                <div key={r.name} className="bg-cream border border-line rounded-[16px] p-4 flex flex-col gap-2 hover:border-accent/45 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-[9px] bg-white border border-line grid place-items-center overflow-hidden shrink-0">
                      <OrgImg src={avatarOf(r.login ?? r.name, 64)} name={r.login ?? r.name} className="w-5 h-5 object-contain" />
                    </span>
                    <b className="card-title text-[13px] truncate flex-1">{r.name}</b>
                    <span className="font-mono text-[11px] font-bold text-accent shrink-0">{r.score}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-clay overflow-hidden"><i className="block h-full rounded-full" style={{ width: `${r.score}%`, background: "linear-gradient(90deg, var(--color-accent), var(--color-ember))" }} /></div>
                  <span className="font-mono text-[10px] text-dim">{r.hits} skill matches · {r.projects} projects · {r.years} program years</span>
                  <div className="flex gap-1 flex-wrap">{r.techs.map((t) => <Chip key={t} tone="lang">{t}</Chip>)}</div>
                  <div className="flex gap-2 mt-1">
                    {r.login ? (
                      <Link to={`/organizations/${r.login}`} className={btn("primary", "sm") + " flex-1 justify-center !px-2 text-[11.5px]"}>View org</Link>
                    ) : (
                      <a href={`https://github.com/search?q=${encodeURIComponent(r.name)}&type=organizations`} target="_blank" rel="noopener" className={btn("outline", "sm") + " flex-1 justify-center !px-2 text-[11.5px]"}>Find on GitHub</a>
                    )}
                    <button onClick={() => d.addWatch(r.name)} title="Add to watchlist"
                      className="w-[30px] h-[30px] rounded-[9px] border border-line grid place-items-center text-dim hover:border-accent hover:text-accent transition-colors cursor-pointer shrink-0">{IC_EYE}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dim text-[13.5px]">No archive org overlapped that profile - broaden a skill or two and re-run the match.</p>
          )}
        </div>
      )}
    </Card>
  );
}

export function WatchlistSection({ d }: { d: Dash }) {
  return (
    <Card>
      <div className="flex items-center gap-2.5 flex-wrap mb-4">
        <h3 className="panel-h-lg flex items-center gap-2.5">{IC_EYE} Watchlist</h3>
        <button onClick={d.trackFollowed} title="Copy every followed org into the watchlist"
          className="ml-auto font-mono text-[10px] font-bold uppercase tracking-[.08em] text-rust bg-peach border border-accent/25 rounded-full px-3 py-[5px] hover:bg-accent/15 transition-colors cursor-pointer">Track followed orgs</button>
        <Link to="/organizations" className="go text-dim text-[13px] font-medium hover:text-accent">add orgs</Link>
      </div>
      {d.watch.length ? (
        <div className="grid gap-2.5">
          {d.watch.map((w) => {
            const o = ORGS.find((x) => norm(x.name) === norm(w.org) || x.login === w.org);
            return (
              <div key={w.org} className="flex items-center gap-3 border border-line rounded-[14px] px-4 py-3 max-[720px]:flex-wrap">
                <span className="w-8 h-8 rounded-[9px] bg-cream border border-line grid place-items-center overflow-hidden shrink-0">
                  <OrgImg src={avatarOf(o?.login ?? w.org, 64)} name={o?.login ?? w.org} className="w-5 h-5 object-contain" />
                </span>
                <b className="card-title text-[13.5px] w-[190px] truncate shrink-0 max-[720px]:w-auto max-[720px]:flex-1">{o ? o.name : w.org}</b>
                <button onClick={() => d.setWatch(d.watch.map((x) => x.org === w.org
                  ? { ...x, status: d.STATUS_CYCLE[(d.STATUS_CYCLE.indexOf(x.status) + 1) % 3] as typeof x.status } : x))}
                  title="Click to advance status"
                  className={`font-mono text-[9.5px] font-bold uppercase tracking-[.08em] px-2.5 py-1 rounded-full border cursor-pointer transition-colors shrink-0 ${STATUS_CLS[w.status]}`}>{w.status}</button>
                <input value={w.note} placeholder="why it's on the list - repo, idea, mentor…" onChange={(e) => d.setWatch(d.watch.map((x) => x.org === w.org ? { ...x, note: e.target.value } : x))}
                  className="flex-1 min-w-[140px] bg-transparent border-b border-dashed border-line text-[12.5px] py-1 outline-none focus:border-accent" />
                <button aria-label="Remove from watchlist" onClick={() => d.setWatch(d.watch.filter((x) => x.org !== w.org))}
                  className="text-dim p-1 rounded hover:text-brick transition-colors cursor-pointer shrink-0">{IC_X}</button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-dim text-[14px] py-5 text-center">Track orgs from the <Link to="/dashboard/matcher" className="text-accent font-semibold hover:underline">matcher</Link> cards - or just <Link to="/organizations" className="text-accent font-semibold hover:underline">browse the directory</Link> and tap the eye.</p>
      )}
    </Card>
  );
}

export function MentorsSection({ d }: { d: Dash }) {
  return (
    <Card>
      <h3 className="panel-h-lg mb-1 flex items-center gap-2.5"><Ic d={DP.user} size={16} /> Mentor finder</h3>
      <p className="font-mono text-[10.5px] text-dim mb-4">
        Pre-fetched contact channels and mentor handles from archived project pages - so you can introduce yourself before proposal season gets busy.
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-4 font-mono text-[10px] uppercase tracking-[.08em]">
        <span className="text-cocoa bg-cream border border-line rounded-full px-2.5 py-1">Cached mentor contact data</span>
        <span className="text-cocoa bg-cream border border-line rounded-full px-2.5 py-1">Generated offline by the project workflow - no scraping in your browser</span>
        <span className="text-honey bg-honey/10 border border-honey/35 rounded-full px-2.5 py-1">Last updated: {YEARS_AGO} weeks ago</span>
      </div>
      {d.mentors.length ? (
        <div className="grid grid-cols-2 gap-2.5 max-[820px]:grid-cols-1">
          {d.mentors.map((mt) => (
            <div key={mt.name + mt.org} className="flex items-center gap-3 border border-line rounded-[14px] px-4 py-3 hover:border-accent/40 transition-colors">
              <span className="w-8 h-8 rounded-full bg-accent/15 text-accent grid place-items-center font-display font-bold text-[13px] shrink-0">{mt.name.slice(0, 1).toUpperCase()}</span>
              <div className="min-w-0 flex-1">
                <b className="block card-title text-[13px] truncate">{mt.name}</b>
                <span className="font-mono text-[10px] text-dim truncate block">{mt.org}</span>
              </div>
              <span className="font-mono text-[9.5px] font-bold text-cocoa bg-cream border border-line rounded-full px-2.5 py-1 shrink-0">{mt.channel}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-dim text-[14px] py-5 text-center">
          {d.archive.length ? "Follow or watch an org and its mentor handles surface here." : "The archive is still loading - mentor handles appear once it lands."}
        </p>
      )}
      <p className="font-mono text-[10px] text-dim mt-4">
        Handles come straight from accepted-project pages in the archive; verify each channel on the org's own community page before first contact.
      </p>
    </Card>
  );
}

const CMP_METRICS: [string, (r: { o: { stars: number; repos: number }; followers: number; projects: number; years: number }) => number, (n: number) => string][] = [
  ["GitHub stars", (r) => r.o.stars, fmt],
  ["Public repos", (r) => r.o.repos, fmt],
  ["Followers", (r) => r.followers, (n) => (n ? fmt(n) : "-")],
  ["Archive projects", (r) => r.projects, fmt],
  ["Program years", (r) => r.years, (n) => String(n || "-")],
];

export function CompareSection({ d }: { d: Dash }) {
  const rows = d.cmpRows;
  const maxes = CMP_METRICS.map(([, get]) => Math.max(0, ...rows.map(get)));
  const suggestions = useMemo(() => ORGS.slice().sort((a, b) => b.stars - a.stars).slice(0, 6).filter((o) => !d.cmpIds.includes(o.login)).slice(0, 3), [d.cmpIds]);
  return (
    <Card>
      <h3 className="panel-h-lg mb-1 flex items-center gap-2.5"><Ic d={DP.scale} size={16} /> Compare organisations</h3>
      <p className="text-cocoa text-[13px] mb-4 max-w-[560px]">Put up to three side by side. The bar that stretches furthest on each row wins it - so the strongest host for your stack is obvious in one glance.</p>
      <div className="relative mb-4 max-w-[380px]">
        <input value={d.cmpQ} onChange={(e) => d.setCmpQ(e.target.value)} placeholder="Search orgs to compare (up to 3)…" aria-label="Search organizations"
          className="w-full bg-paper border border-line rounded-xl px-3.5 py-2.5 text-[14px] outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(34, 197, 94,.12)]" />
        {d.cmpMatches.length > 0 && (
          <div className="absolute z-10 top-full mt-1.5 left-0 right-0 bg-card border border-line rounded-[14px] shadow-lift overflow-hidden">
            {d.cmpMatches.map((o) => (
              <button key={o.login} onClick={() => { d.setCmpIds([...d.cmpIds, o.login].slice(-3)); d.setCmpQ(""); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-cream transition-colors cursor-pointer">
                <OrgImg src={avatarOf(o.login, 48)} name={o.login} className="w-6 h-6 rounded-md object-cover bg-clay shrink-0" />
                <b className="text-[13px] truncate">{o.name}</b>
                <span className="ml-auto font-mono text-[10px] text-dim shrink-0">★ {fmt(o.stars)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* selected chips */}
      {rows.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {rows.map(({ o }) => (
            <span key={o.login} className="inline-flex items-center gap-2 bg-coffee text-foam rounded-full pl-1.5 pr-2.5 py-1.5">
              <OrgImg src={avatarOf(o.login, 48)} name={o.login} className="w-[22px] h-[22px] rounded-full object-cover bg-white shrink-0" />
              <b className="text-[12px] max-w-[140px] truncate">{o.name}</b>
              <button aria-label={`Remove ${o.login}`} onClick={() => d.setCmpIds(d.cmpIds.filter((x) => x !== o.login))}
                className="text-foam/60 hover:text-white cursor-pointer grid place-items-center">{IC_X}</button>
            </span>
          ))}
        </div>
      )}

      {rows.length >= 2 ? (
        <div className={`grid gap-4 ${rows.length === 2 ? "grid-cols-2 max-[900px]:grid-cols-1" : "grid-cols-3 max-[1050px]:grid-cols-1"}`}>
          {rows.map((r, ri) => (
            <div key={r.o.login} className="bg-cream border border-line rounded-[18px] p-[18px] flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <OrgImg src={avatarOf(r.o.login, 64)} name={r.o.login} className="w-9 h-9 rounded-[10px] object-cover bg-white border border-line shrink-0" />
                <div className="min-w-0">
                  <Link to={`/organizations/${r.o.login}`} className="card-title text-[13.5px] truncate block hover:text-accent">{r.o.name}</Link>
                  <span className="font-mono text-[10px] text-dim">@{r.o.login}</span>
                </div>
                <button aria-label={`Remove ${r.o.login}`} onClick={() => d.setCmpIds(d.cmpIds.filter((x) => x !== r.o.login))}
                  className="ml-auto text-dim hover:text-brick cursor-pointer shrink-0">{IC_X}</button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <Chip tone={r.projects >= 150 ? "stars" : "cat"}>{r.tier}</Chip>
                <Chip tone="lang">{r.topTech}</Chip>
              </div>
              <div className="grid gap-3">
                {CMP_METRICS.map(([k, get, show], mi) => {
                  const v = get(r);
                  const win = maxes[mi] > 0 && v === maxes[mi] && rows.length > 1;
                  return (
                    <div key={k}>
                      <div className="flex justify-between items-baseline font-mono text-[10.5px] mb-1">
                        <span className="text-dim uppercase tracking-[.08em]">{k}</span>
                        <span className={`font-bold ${win ? "text-accent" : "text-ink"}`}>{win ? "★ " : ""}{show(v)}</span>
                      </div>
                      <div className="w-full h-[5px] rounded-full bg-clay overflow-hidden">
                        <i className={win ? "block h-full rounded-full" : "block h-full rounded-full bg-cocoa/35"}
                          style={{ width: `${maxes[mi] ? Math.max(4, Math.round((v / maxes[mi]) * 100)) : 0}%`, background: win ? "linear-gradient(90deg, var(--color-accent), var(--color-ember))" : undefined, transition: "width .5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link to={`/organizations/${r.o.login}`} className={btn(ri === 0 ? "primary" : "outline", "sm") + " justify-center mt-auto"}>Open org page</Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-line rounded-[18px] bg-paper/60">
          <p className="text-dim text-[13.5px] mb-3">{rows.length === 1 ? "One more to make a race -" : "Pick at least two organizations above."}</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {suggestions.map((o) => (
              <button key={o.login} onClick={() => d.setCmpIds([...d.cmpIds, o.login].slice(-3))}
                className="inline-flex items-center gap-1.5 bg-card border border-line rounded-full px-3 py-1.5 text-[12px] font-semibold text-cocoa hover:border-accent hover:text-rust transition-colors cursor-pointer">
                <OrgImg src={avatarOf(o.login, 48)} name={o.login} className="w-4 h-4 rounded-full object-cover bg-clay" />
                {o.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export function ArtifactsSection({ d }: { d: Dash }) {
  return (
    <Card>
      <h3 className="panel-h-lg mb-4 flex items-center gap-2.5">
        <Ic d={DP.gem} size={16} /> Artifact favourites
        <span className="flex gap-2 ml-auto items-center">
          <Link to="/tools/builder" className="text-[13px] font-medium text-dim hover:text-accent">prompt builder</Link>
          <Link to="/tools" className="text-[13px] font-medium text-dim hover:text-accent">all {TOOLS_TOTAL}</Link>
        </span>
      </h3>
      {d.favTools.length ? (
        <div className="grid grid-cols-3 gap-3 max-[800px]:grid-cols-1">
          {d.favTools.map((t) => (
            <Link key={t.id} to={toolPath(t)}
              className="group flex flex-col gap-1.5 border border-line rounded-[16px] p-4 hover:border-ember hover:-translate-y-px transition-all">
              <span className="font-mono text-[9.5px] uppercase tracking-[.1em] text-dim">{t.tags.slice(0, 2).join(" · ") || t.name}</span>
              <b className="card-title text-[14px] leading-snug group-hover:text-rust transition-colors line-clamp-1">{t.name}</b>
              <span className="text-cocoa text-[12.5px] leading-[1.5] line-clamp-2">{t.summary}</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-dim text-[14px] py-5 text-center">
          Tap Save on any artifact and it lands here - {TOOLS_TOTAL} live demos with copy-paste code and prompts tuned to your values. <Link to="/tools" className="text-accent font-semibold hover:underline">Open Artifacts</Link>
        </p>
      )}
    </Card>
  );
}

export function DeadlinesSection({ d, limit }: { d: Dash; limit?: number }) {
  const list = limit ? d.due.slice(0, limit) : d.due;
  return (
    <Card>
      <h3 className="panel-h-lg mb-4 flex items-center gap-2.5">
        <Ic d={DP.flag} size={16} /> Deadlines ahead <Link to="/hackathons" className="ml-auto text-[13px] font-medium text-dim hover:text-accent">full calendar</Link>
      </h3>
      {list.length ? (
        <div className="grid grid-cols-2 gap-3 max-[700px]:grid-cols-1">
          {list.map((h) => {
            const dd = daysTo(h.deadline);
            return (
              <Link key={h.id} to={`/hackathons/${h.id}`}
                className="group flex items-center gap-3 border border-line rounded-[16px] p-4 hover:border-ember hover:-translate-y-px transition-all">
                <OrgImg src={avatarOf(h.orgLogo, 64)} name={h.orgLogo} className="w-[34px] h-[34px] rounded-[10px] object-cover bg-sand shrink-0" />
                <div className="min-w-0">
                  <b className="block card-title text-[14px] group-hover:text-rust transition-colors">{h.name}</b>
                  <span className="font-mono text-[10.5px] text-dim">{h.org} · closes {h.deadline}</span>
                </div>
                <span className={`ml-auto shrink-0 font-mono text-[10px] font-bold border rounded-full px-2.5 py-1 ${dueTone(dd)}`}>
                  {dd === 0 ? "today" : `${dd}d left`}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-dim text-[14px] py-6 text-center">Nothing open this second - the <Link to="/hackathons" className="text-accent font-semibold hover:underline">calendar</Link> refills every season.</p>
      )}
    </Card>
  );
}

export function ReadingSection({ d, limit }: { d: Dash; limit?: number }) {
  const list = limit ? d.picks.slice(0, limit) : d.picks;
  return (
    <Card>
      <h3 className="panel-h-lg mb-4 flex items-center gap-2.5">
        <Ic d={DP.book} size={16} /> Reading picked for your stack <Link to="/resources" className="ml-auto text-[13px] font-medium text-dim hover:text-accent">all resources</Link>
      </h3>
      <div className="grid grid-cols-3 gap-3 max-[800px]:grid-cols-1">
        {list.map((r) => (
          <Link key={r.id} to={`/resources/${r.id}`}
            className="group flex flex-col gap-2 border border-line rounded-[16px] p-4 hover:border-ember hover:-translate-y-px transition-all">
            <div className="flex items-center gap-2">
              <OrgImg src={avatarOf(r.provider, 48)} name={r.brand} className="w-[24px] h-[24px] rounded-[7px] object-cover bg-sand shrink-0" />
              <span className="font-mono text-[10px] text-dim truncate">{r.brand}</span>
              {r.free && <span className="ml-auto shrink-0 font-mono text-[9px] font-bold text-leaf">FREE</span>}
            </div>
            <b className="card-title text-[14px] leading-snug group-hover:text-rust transition-colors line-clamp-2">{r.title}</b>
            <span className="font-mono text-[10px] text-dim mt-auto">{r.cat} · {r.time}</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

export function ActivitySection({ d }: { d: Dash }) {
  return (
    <Card>
      <h3 className="panel-h-lg mb-2 flex items-center gap-2.5"><Ic d={DP.pulse} size={16} /> Activity</h3>
      <div>
        {d.acts.map(([txt, when], i) => (
          <div key={i} className="flex gap-3.5 py-3 relative">
            <span className="shrink-0 grid gap-1 justify-items-center">
              <i className="w-3 h-3 rounded-full mt-1 not-italic bg-peach border-[3px] border-accent" />
              {i < d.acts.length - 1 && <i className="w-[2px] flex-1 bg-line not-italic" />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] text-cocoa leading-[1.55]" dangerouslySetInnerHTML={{ __html: txt.replace("<b>", '<b class="text-ink">') }} />
              <time className="font-mono text-[10.5px] text-dim">{when}</time>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function StackSection({ d }: { d: Dash }) {
  return (
    <Card>
      <h3 className="panel-h-lg mb-4 flex items-center gap-2.5"><Ic d={DP.bookmark} size={16} /> Your working stack, per the board</h3>
      <div className="flex flex-wrap gap-2">
        {(d.langs.length ? d.langs : ["TypeScript", "Python"]).map((l) => <Chip key={l} tone="lang">{l}</Chip>)}
        {d.skills.map((t) => <Chip key={t} tone="cat">{t}</Chip>)}
        {!d.saved.length && <span className="text-dim text-[13.5px]">Save a few repos and your real stack appears here - {REPOS.length} repos to choose from.</span>}
      </div>
    </Card>
  );
}

/* feature page wrapper: header + the one section it owns */
export function FeaturePage({ d, id }: { d: Dash; id: string }) {
  const map: Record<string, [string, string, React.ReactNode]> = {
    saved: ["Saved projects", "Everything you starred, in one shelf. Remove what no longer serves the plan and the board resets itself.", <SavedSection key="s" d={d} />],
    orgs: ["Saved organizations", "The orgs you follow. Their new catalog work and program activity feed your digest.", <OrgsSection key="o" d={d} />],
    matcher: ["Org matcher", "Score every organization against your real skills - typed or read off your resume.", <MatcherSection key="m" d={d} />],
    watchlist: ["Watchlist", "A three-step pipeline for every organization you're serious about: researching, preparing, applied.", <WatchlistSection key="w" d={d} />],
    mentors: ["Mentor finder", "Mentor handles and contact channels, harvested offline from archived project pages.", <MentorsSection key="mn" d={d} />],
    compare: ["Compare organizations", "Two or three orgs side by side - stars, repos, archive footprint, program years and tier.", <CompareSection key="c" d={d} />],
    artifacts: ["Artifact favourites", "The design and prompt tools you saved from Artifacts, one click from their live demos.", <ArtifactsSection key="a" d={d} />],
    deadlines: ["Deadlines ahead", "Every open hackathon and application window, soonest first.", <DeadlinesSection key="dl" d={d} />],
    reading: ["Reading list", "Learning resources matched to the stack on your shelf - not a generic syllabus.", <ReadingSection key="r" d={d} />],
    activity: ["Activity", "What happened on your board, in order.", <ActivitySection key="ac" d={d} />],
    stack: ["Working stack", "Languages and topics derived from the projects you actually save.", <StackSection key="st" d={d} />],
  };
  const f = map[id];
  if (!f) return null;
  return (
    <div className="grid gap-5">
      <DashHead title={f[0]} sub={f[1]} />
      {f[2]}
    </div>
  );
}
