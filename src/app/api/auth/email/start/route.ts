/* ══ POST /api/auth/email/start — issue + send a sign-in code ════
   Asks for { email }. Returns 200 with a shaped payload so the client's
   fetch helper can still read the reason:
     { ok:true, sent:true }                       - email is on its way
     { ok:true, sent:false, demo:true, code }     - no key, not production
     { ok:false, reason:"too_soon" }              - 30s resend lock
     { ok:false, reason:"invalid_email" | "send_failed" }
   Three things sit in front of any of that:

     mail_unconfigured  503  no RESEND_API_KEY on a production deploy. The
                            code is not generated, so there is nothing to
                            leak; a missing key fails closed.
     rate_limited       429  8 requests per IP per 10 minutes.
     daily_limit        429  12 codes per address per day.

   The two ceilings are in-process (see rateLimit.ts), so they hold per
   instance. They stop a scripted burst, not a botnet across every ISP.
   The code itself is never logged and lives only hashed in storage.  ═ */
import { demoAllowed, genCode, normalizeEmail, resendConfigured, sendCodeEmail, storeCode, validEmail } from "@/lib/server/email";
import { peek, record, take } from "@/lib/server/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IP_LIMIT = 8;
const IP_WINDOW_MS = 10 * 60_000;
const ADDRESS_DAILY_LIMIT = 12;
const DAY_MS = 24 * 60 * 60_000;

/** x-forwarded-for's first hop, the same read /api/submissions uses.
    "local" is the shared bucket for a dev server behind no proxy. */
const clientIp = (req: Request): string =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

const limited = (reason: "rate_limited" | "daily_limit", retryAfterSeconds: number): Response =>
  Response.json(
    { ok: false, reason, retry_in_seconds: retryAfterSeconds },
    { status: 429, headers: { "retry-after": String(retryAfterSeconds) } },
  );

export async function POST(req: Request) {
  let body: { email?: string };
  try { body = await req.json(); } catch { body = {}; }
  const email = normalizeEmail(body.email ?? "");
  if (!validEmail(email)) return Response.json({ ok: false, reason: "invalid_email" });

  /* Cheapest check first: it is a static condition, and failing it should
     not spend anyone's request budget. */
  if (!resendConfigured() && !demoAllowed()) {
    return Response.json({ ok: false, reason: "mail_unconfigured" }, { status: 503 });
  }

  const ipVerdict = take(`ip:${clientIp(req)}`, IP_LIMIT, IP_WINDOW_MS);
  if (!ipVerdict.allowed) return limited("rate_limited", ipVerdict.retryAfterSeconds);

  /* peek, then record only once a code really exists: a send that fails on
     Resend's side should not eat the address's day. */
  const dayVerdict = peek(`mail:${email}`, ADDRESS_DAILY_LIMIT);
  if (!dayVerdict.allowed) return limited("daily_limit", dayVerdict.retryAfterSeconds);

  const code = genCode();
  const stored = await storeCode(email, code);
  if (!stored) return Response.json({ ok: false, reason: "too_soon", retry_in_seconds: 30 });
  record(`mail:${email}`, DAY_MS);

  const send = await sendCodeEmail(email, code);
  if (send.sent) return Response.json({ ok: true, sent: true, expires_in_seconds: 600 });
  if ("demo" in send && send.demo) return Response.json({ ok: true, sent: false, demo: true, code, expires_in_seconds: 600 });
  return Response.json({ ok: false, reason: "send_failed", error: "error" in send ? send.error : "send failed" });
}
