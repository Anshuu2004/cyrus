/* ══ POST /api/auth/email/start — issue + send a sign-in code ════
   Asks for { email }. Returns 200 with a shaped payload so the client's
   fetch helper (which nulls out non-2xx) can still read the reason:
     { ok:true, sent:true }                       - email is on its way
     { ok:true, sent:false, demo:true, code }     - no RESEND_API_KEY: demo
     { ok:false, reason:"too_soon" }              - 30s resend lock
     { ok:false, reason:"invalid_email" | "send_failed" }
   The code itself is never logged and lives only hashed in storage.  ═ */
import { genCode, normalizeEmail, sendCodeEmail, storeCode, validEmail } from "@/lib/server/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string };
  try { body = await req.json(); } catch { body = {}; }
  const email = normalizeEmail(body.email ?? "");
  if (!validEmail(email)) return Response.json({ ok: false, reason: "invalid_email" });

  const code = genCode();
  const stored = await storeCode(email, code);
  if (!stored) return Response.json({ ok: false, reason: "too_soon", retry_in_seconds: 30 });

  const send = await sendCodeEmail(email, code);
  if (send.sent) return Response.json({ ok: true, sent: true, expires_in_seconds: 600 });
  if ("demo" in send && send.demo) return Response.json({ ok: true, sent: false, demo: true, code, expires_in_seconds: 600 });
  return Response.json({ ok: false, reason: "send_failed", error: "error" in send ? send.error : "send failed" });
}
