/* ══ email.ts — email sign-in verification codes ══════════════════════
   A 6-digit one-time code is generated with crypto.randomInt, stored as a
   sha256 hash (10-minute TTL, 6 tries, 30s resend lock) and delivered via
   the Resend HTTP API through plain fetch - no SDK, no new dependency.
   Storage prefers the Neon email_codes table; without DATABASE_URL it
   falls back to an in-memory Map so the flow still works per server
   instance. Without RESEND_API_KEY the routes run in demo mode and hand
   the code back to the UI instead of emailing it.                      ═ */
import { createHash, randomInt } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { emailCodes } from "../db/schema";

const TTL_MS = 10 * 60 * 1000;
const MAX_TRIES = 6;
const RESEND_LOCK_MS = 30 * 1000;

export type CodeResult = { ok: true } | { ok: false; reason: "too_soon" | "expired" | "wrong" | "no_code" | "locked" };

export const validEmail = (e: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim().toLowerCase()) && e.trim().length <= 254;

export const normalizeEmail = (e: string): string => e.trim().toLowerCase();

export function genCode(): string {
  return randomInt(100000, 999999).toString();
}

const hash = (code: string): string => createHash("sha256").update(code).digest("hex");

/* ── in-memory fallback (no DATABASE_URL) ───────────────────────────── */
type Mem = { codeHash: string; expiresAt: number; tries: number; lastSent: number };
const mem = new Map<string, Mem>();

/** true when we can actually store+send; demo mode is handled by the caller */
export const dbBacked = (): boolean => Boolean(getDb());

/** store a fresh code. Returns false when the 30s resend lock is still on. */
export async function storeCode(email: string, code: string): Promise<boolean> {
  const now = Date.now();
  const db = getDb();
  if (db) {
    const rows = await db.select().from(emailCodes).where(eq(emailCodes.email, email)).limit(1);
    const existing = rows[0];
    if (existing) {
      const lastSentMs = new Date(existing.createdAt).getTime();
      if (now - lastSentMs < RESEND_LOCK_MS && existing.expiresAt.getTime() > now) return false;
      await db.update(emailCodes)
        .set({ codeHash: hash(code), expiresAt: new Date(now + TTL_MS), tries: 0, createdAt: new Date(now) })
        .where(eq(emailCodes.email, email));
      return true;
    }
    await db.insert(emailCodes).values({
      email, codeHash: hash(code), expiresAt: new Date(now + TTL_MS), tries: 0, createdAt: new Date(now),
    });
    return true;
  }
  const m = mem.get(email);
  if (m && now - m.lastSent < RESEND_LOCK_MS && m.expiresAt > now) return false;
  mem.set(email, { codeHash: hash(code), expiresAt: now + TTL_MS, tries: 0, lastSent: now });
  return true;
}

export async function checkCode(email: string, code: string): Promise<CodeResult> {
  const now = Date.now();
  const db = getDb();
  if (db) {
    const rows = await db.select().from(emailCodes).where(eq(emailCodes.email, email)).limit(1);
    const r = rows[0];
    if (!r) return { ok: false, reason: "no_code" };
    if (r.expiresAt.getTime() < now) {
      await db.delete(emailCodes).where(eq(emailCodes.email, email));
      return { ok: false, reason: "expired" };
    }
    if (r.tries >= MAX_TRIES) {
      await db.delete(emailCodes).where(eq(emailCodes.email, email));
      return { ok: false, reason: "locked" };
    }
    if (r.codeHash === hash(code)) {
      await db.delete(emailCodes).where(eq(emailCodes.email, email));
      return { ok: true };
    }
    await db.update(emailCodes).set({ tries: r.tries + 1 }).where(eq(emailCodes.email, email));
    return { ok: false, reason: "wrong" };
  }
  const m = mem.get(email);
  if (!m) return { ok: false, reason: "no_code" };
  if (m.expiresAt < now) { mem.delete(email); return { ok: false, reason: "expired" }; }
  if (m.tries >= MAX_TRIES) { mem.delete(email); return { ok: false, reason: "locked" }; }
  if (m.codeHash === hash(code)) { mem.delete(email); return { ok: true }; }
  m.tries += 1;
  return { ok: false, reason: "wrong" };
}

/** active code window for an email, used for resend countdowns and cleanup */
export async function dropCode(email: string): Promise<void> {
  const db = getDb();
  if (db) { await db.delete(emailCodes).where(eq(emailCodes.email, email)); return; }
  mem.delete(email);
}

/* exported for tests: the raw memory store so cases can reset between runs */
export const __mem = mem;

/* ── sending via Resend (fetch only) ────────────────────────────────── */
export type SendResult = { sent: true } | { sent: false; demo: true; code: string } | { sent: false; error: string };

export async function sendCodeEmail(email: string, code: string): Promise<SendResult> {
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  const from = (process.env.EMAIL_FROM ?? "").trim() || "cyrus.ai <onboarding@resend.dev>";
  email = email.trim();
  if (!key) return { sent: false, demo: true, code }; // demo mode: caller shows the code
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `${code} is your cyrus.ai sign-in code`,
        text: `Your cyrus.ai verification code is ${code}. It expires in 10 minutes. ` +
          `If you didn't ask to sign in, ignore this email.\n\n— cyrus.ai, the agent skill index`,
        html: `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#f6f5f3;padding:32px">
  <div style="max-width:440px;margin:0 auto;background:#fff;border:1px solid #d9d6cd;border-radius:16px;padding:28px">
    <div style="font-weight:800;font-size:15px;color:#1b2426;letter-spacing:.02em">cyrus.ai</div>
    <p style="color:#1b2426;font-size:14px;margin:16px 0 8px">Your verification code is</p>
    <div style="font-family:ui-monospace,Menlo,monospace;font-size:34px;font-weight:700;letter-spacing:.28em;color:#126879;margin:8px 0 16px">${code}</div>
    <p style="color:#5d6365;font-size:13px;margin:0">It expires in 10 minutes. If you didn't ask to sign in to cyrus.ai, you can safely ignore this email.</p>
  </div>
</div>`,
      }),
    });
    if (!r.ok) return { sent: false, error: `resend ${r.status}` };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
