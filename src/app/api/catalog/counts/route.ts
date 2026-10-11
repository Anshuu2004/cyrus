/* ══ GET /api/catalog/counts — live row counts per catalog table ═ */
import { OFFLINE, backendReady } from "@/lib/server/auth";
import { catalogCounts } from "@/lib/server/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!backendReady()) return OFFLINE();
  try {
    return Response.json({ counts: await catalogCounts(), snapshot: new Date().toISOString() });
  } catch (e) {
    return Response.json({ error: `catalog query failed: ${(e as Error).message}` }, { status: 500 });
  }
}
