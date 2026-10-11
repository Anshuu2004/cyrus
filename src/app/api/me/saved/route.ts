/* ══ /api/me/saved — cross-device saved items ═══════════════════
   GET    -> every saved row for this session's user
   POST   -> { itemType, itemId, title?, meta? } - idempotent add
   DELETE -> { itemType, itemId }                - returns removed flag ═ */
import { currentUser } from "@/lib/server/auth";
import {
  addSaved, listSaved, removeSaved,
  validId, validItemType, type ITEM_TYPES,
} from "@/lib/server/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorized = () => Response.json({ error: "signed out" }, { status: 401 });
const bad = (msg: string) => Response.json({ error: msg }, { status: 400 });

type ItemTypeOf = (typeof ITEM_TYPES)[number];

async function user() {
  return currentUser();
}

export async function GET() {
  const u = await user();
  if (!u) return unauthorized();
  const items = await listSaved(u.id);
  return Response.json({
    items: items.map((i) => ({ itemType: i.itemType, itemId: i.itemId, title: i.title, meta: i.meta, createdAt: i.createdAt })),
  });
}

export async function POST(req: Request) {
  const u = await user();
  if (!u) return unauthorized();
  let body: { itemType?: unknown; itemId?: unknown; title?: unknown; meta?: unknown };
  try { body = await req.json(); } catch { return bad("JSON body required"); }
  if (!validItemType(body.itemType) || !validId(body.itemId)) return bad("itemType or itemId is invalid");
  const title = typeof body.title === "string" ? body.title.slice(0, 200) : null;
  const row = await addSaved(u.id, body.itemType as ItemTypeOf, body.itemId, title, body.meta);
  return Response.json({ ok: true, item: row ? { itemType: row.itemType, itemId: row.itemId, title: row.title } : null });
}

export async function DELETE(req: Request) {
  const u = await user();
  if (!u) return unauthorized();
  let body: { itemType?: unknown; itemId?: unknown };
  try { body = await req.json(); } catch { return bad("JSON body required"); }
  if (!validItemType(body.itemType) || !validId(body.itemId)) return bad("itemType or itemId is invalid");
  const removed = await removeSaved(u.id, body.itemType as ItemTypeOf, body.itemId);
  return Response.json({ ok: true, removed });
}
