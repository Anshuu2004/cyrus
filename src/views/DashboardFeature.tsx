"use client"
/* ══ DashboardFeature.tsx — one dashboard feature, full page ═══════
   Same shared shell + hook as the hub, but the main column shows the
   whole section for the feature id it was given.                  ══ */
import { useDash } from "../lib/dash/useDash";
import { DashGate, DashShell } from "../lib/dash/shell";
import { FeaturePage } from "../lib/dash/sections";

export default function DashboardFeature({ feature }: { feature: string }) {
  const d = useDash();
  return (
    <DashGate dash={d}>
      <DashShell dash={d} active={`/dashboard/${feature}`}>
        <FeaturePage d={d} id={feature} />
      </DashShell>
    </DashGate>
  );
}
