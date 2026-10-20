import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function snapshotLabel(source) {
  // repos.ts stores the catalog as a JSON array after its type declaration.
  const array = source.match(/export const REPOS: Repo\[\] = (\[[\s\S]*\]);\s*$/)?.[1];
  if (!array) throw new Error("Cannot find the REPOS catalog in src/data/repos.ts");
  const dates = JSON.parse(array).map(({ updated }) => {
    if (typeof updated !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(updated)
      || Number.isNaN(Date.parse(updated)) || new Date(updated).toISOString().slice(0, 10) !== updated) {
      throw new Error(`Invalid catalog updated date: ${updated}`);
    }
    return updated;
  });
  const latest = dates.sort().at(-1);
  if (!latest) throw new Error("Cannot date an empty catalog");
  const [year, month, day] = latest.split("-");
  return `${Number(day)}_${MONTHS[Number(month) - 1]}_${year}`;
}

export function updateSnapshotBadge(readme, label) {
  const badge = /(https:\/\/img\.shields\.io\/badge\/snapshot-)[^-?"/]+(-[0-9a-fA-F]{6}\?)/;
  if (!badge.test(readme)) throw new Error("Cannot find the README snapshot badge");
  return readme.replace(badge, `$1${label}$2`);
}

export function updateReadmeSnapshot(root) {
  const label = snapshotLabel(readFileSync(join(root, "src/data/repos.ts"), "utf8"));
  const path = join(root, "README.md");
  const readme = readFileSync(path, "utf8");
  const updated = updateSnapshotBadge(readme, label);
  if (updated !== readme) writeFileSync(path, updated);
}
