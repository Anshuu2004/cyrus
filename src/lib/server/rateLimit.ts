/* ══ rateLimit.ts — in-process request ceilings ═══════════════════════
   These handlers run on one Node instance, so a Map is enough. This is a
   brake on a scripted burst, not a distributed quota: a caller spread over
   many IPs still gets one budget per instance. Say so in the route that
   uses it rather than pretending the number is a guarantee.

   Three primitives, because the two uses differ:

     take(key, limit, windowMs)    consume a slot and report whether it fit
     peek(key, limit)              ask the same question without consuming
     record(key, windowMs)         consume, for a cap already checked by peek

   peek cannot open a window - there is nothing to open it with - so a
   caller that only asks must eventually call record, which is exactly the
   daily-address pattern in /api/auth/email/start.

   The window is fixed, not sliding: it opens at the first hit and closes
   windowMs later. That is what makes Retry-After exact - we know the
   instant the counter rolls over, so the header never over-promises and a
   caller cannot stretch their own block by hammering through it.

   Keys are namespaced by the caller ("ip:1.2.3.4", "mail:a@b.dev"). Every
   entry remembers its own window, so a sweep on write can drop anything
   idle for two windows and keep the Map from growing with traffic.       ═ */

export type Verdict = { allowed: true } | { allowed: false; retryAfterSeconds: number };

type Bucket = { n: number; t: number; w: number };

const buckets = new Map<string, Bucket>();

/* Sweep once the map outgrows a quiet site's whole traffic pattern. */
const SWEEP_AT = 512;

/** the live bucket for key, or null once its own window has closed */
function live(key: string, now: number): Bucket | null {
  const e = buckets.get(key);
  if (!e || now - e.t >= e.w) return null;
  return e;
}

function sweep(now: number): void {
  for (const [key, e] of buckets) if (now - e.t > e.w * 2) buckets.delete(key);
}

const secondsLeft = (e: Bucket, now: number): number =>
  Math.max(1, Math.ceil((e.t + e.w - now) / 1000));

/** consume one slot for key. The window opens on the first hit. */
export function record(key: string, windowMs: number, now = Date.now()): void {
  const e = live(key, now);
  if (e) e.n++;
  else buckets.set(key, { n: 1, t: now, w: windowMs });
  if (buckets.size > SWEEP_AT) sweep(now);
}

/** ask whether key is under limit, without consuming */
export function peek(key: string, limit: number, now = Date.now()): Verdict {
  const e = live(key, now);
  if (!e || e.n < limit) return { allowed: true };
  return { allowed: false, retryAfterSeconds: secondsLeft(e, now) };
}

/** consume a slot and report whether it fit. A denied hit does not extend the window. */
export function take(key: string, limit: number, windowMs: number, now = Date.now()): Verdict {
  const v = peek(key, limit, now);
  if (!v.allowed) return v;
  record(key, windowMs, now);
  return v;
}

/* exported for tests: the raw counters, so a case can start from zero */
export const __buckets = buckets;
export const __reset = (): void => buckets.clear();
