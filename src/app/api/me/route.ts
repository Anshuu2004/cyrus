/* ══ GET /api/me — who does this session cookie belong to? ══════ */
import { currentUser } from "@/lib/server/auth";
import { publicUser } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "signed out" }, { status: 401 });
  return Response.json({ user: publicUser(user) });
}
