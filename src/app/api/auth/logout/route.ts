/* ══ POST /api/auth/logout ═════════════════════════════════════ */
import { clearSession } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await clearSession();
  return Response.json({ ok: true });
}
