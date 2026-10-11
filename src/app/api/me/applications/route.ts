/* ══ /api/me/applications — program & hackathon applications ════
   GET   -> all applications for this user
   POST  -> { kind, targetId, targetTitle?, notes? } create or touch
   PATCH -> { id, status?, notes? }                  update stage/draft
   DELETE-> { id }                                   remove             ═ */
import { currentUser } from "@/lib/server/auth";
import {
  deleteApplication, listApplications, patchApplication, upsertApplication,
  validAppKind, validAppStatus, validId,
} from "@/lib/server/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorized = () => Response.json({ error: "signed out" }, { status: 401 });
const bad = (msg: string) => Response.json({ error: msg }, { status: 400 });
const shape = (a: Awaited<ReturnType<typeof listApplications>>[number]) => ({
  id: a.id, kind: a.kind, targetId: a.targetId, targetTitle: a.targetTitle,
  status: a.status, notes: a.notes, createdAt: a.createdAt, updatedAt: a.updatedAt,
});

export async function GET() {
  const u = await currentUser();
  if (!u) return unauthorized();
  return Response.json({ applications: (await listApplications(u.id)).map(shape) });
}

export async function POST(req: Request) {
  const u = await currentUser();
  if (!u) return unauthorized();
  let body: { kind?: unknown; targetId?: unknown; targetTitle?: unknown; notes?: unknown };
  try { body = await req.json(); } catch { return bad("JSON body required"); }
  if (!validAppKind(body.kind) || !validId(body.targetId)) return bad("kind or targetId is invalid");
  const title = typeof body.targetTitle === "string" ? body.targetTitle.slice(0, 200) : null;
  const row = await upsertApplication(u.id, body.kind, body.targetId, title, body.notes);
  return Response.json({ application: shape(row) });
}

export async function PATCH(req: Request) {
  const u = await currentUser();
  if (!u) return unauthorized();
  let body: { id?: unknown; status?: unknown; notes?: unknown };
  try { body = await req.json(); } catch { return bad("JSON body required"); }
  if (!validId(body.id)) return bad("id is required");
  if (body.status !== undefined && !validAppStatus(body.status)) return bad("status is not a known stage");
  const row = await patchApplication(u.id, body.id, {
    ...(body.status !== undefined ? { status: body.status as string } : {}),
    ...(body.notes !== undefined ? { notes: body.notes } : {}),
  });
  if (!row) return Response.json({ error: "application not found" }, { status: 404 });
  return Response.json({ application: shape(row) });
}

export async function DELETE(req: Request) {
  const u = await currentUser();
  if (!u) return unauthorized();
  let body: { id?: unknown };
  try { body = await req.json(); } catch { return bad("JSON body required"); }
  if (!validId(body.id)) return bad("id is required");
  const removed = await deleteApplication(u.id, body.id);
  return Response.json({ ok: removed });
}
