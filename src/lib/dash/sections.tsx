"use client"
/* == sections.tsx - the /dashboard/<feature> router ==============
   The three board pages live in issues.tsx, repos.tsx and settings.tsx;
   this file only picks one and renders its empty state.            == */
import { Link } from "@/lib/router";
import { btn } from "../../components/ui";
import { Card } from "./shell";
import { DP, featureBy } from "./shared";
import { IssuesSection } from "./issues";
import { ReposSection } from "./repos";
import { SettingsSection } from "./settings";
import { TOOL_SECTIONS } from "./tools";
import type { Dash } from "./useDash";

export { AttentionList, IssuesSection } from "./issues";
export { ReposSection } from "./repos";
export { SettingsSection } from "./settings";

export function FeaturePage({ d, id }: { d: Dash; id: string }) {
  const f = featureBy(id);
  if (!f) return <MissingFeature id={id} />;
  if (f.id === "issues") return <IssuesSection d={d} />;
  if (f.id === "repos") return <ReposSection d={d} />;
  if (f.id === "settings") return <SettingsSection d={d} />;
  const Tool = TOOL_SECTIONS[f.id];
  if (Tool) return <Tool d={d} />;
  return <SettingsSection d={d} />;
}

function MissingFeature({ id }: { id: string }) {
  return (
    <Card className="text-center py-14">
      <p className="eyebrow mb-3 flex items-center justify-center gap-2">
        <IcMark /> Not on the board
      </p>
      <h1 className="font-display font-extrabold text-[26px] tracking-[-.02em]">
        There is no page called “{id}”.
      </h1>
      <p className="text-cocoa text-[13.5px] mt-2">The board holds your issues, your repositories, four working tools and settings.</p>
      <Link to="/dashboard" className={btn("primary", "md") + " mt-6"}>Back to the overview</Link>
    </Card>
  );
}

const IcMark = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d={DP.x} />
  </svg>
);

