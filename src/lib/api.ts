/* ══ api.ts — thin fetch client for the Next API routes ═════════
   Same-origin, so the httpOnly session cookie rides along on every
   call. Every function returns null (or false) when the backend is
   offline or the session isn't there - callers keep localStorage as
   the source of truth and treat the server as a sync layer.       ═ */

export type ServerUser = {
  id: string; name: string; login: string | null;
  email: string | null; picture: string | null; provider: string;
};
export type SavedRow = { itemType: string; itemId: string; title?: string | null };
export type EmailStartRes = {
  ok: boolean; sent?: boolean; demo?: boolean; code?: string;
  reason?: string; error?: string; expires_in_seconds?: number;
};
export type EmailVerifyRes = { ok: boolean; user?: ServerUser; offline?: boolean; reason?: string };
export type AppRow = {
  id: string; kind: "program" | "hackathon"; targetId: string; targetTitle: string | null;
  status: string; notes?: unknown; createdAt: string; updatedAt: string;
};
export type AssistantRes = { reply: string; model: string; demo: boolean; error?: string };

const JSON_INIT: RequestInit = { headers: { "content-type": "application/json" }, credentials: "same-origin" };

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { credentials: "same-origin" });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

async function postJson<T>(url: string, body: unknown, method: "POST" | "PATCH" | "DELETE" = "POST", readErrors = false): Promise<T | null> {
  try {
    const r = await fetch(url, { ...JSON_INIT, method, body: JSON.stringify(body) });
    /* readErrors is for the routes that answer 429 or 503 with a reason the
       sheet has to show rather than swallow. A non-JSON body still falls in
       the catch and returns null, so every other caller is unaffected. */
    if (!r.ok && !readErrors) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

async function fire(url: string, body: unknown, method: "POST" | "DELETE"): Promise<boolean> {
  try {
    const r = await fetch(url, { ...JSON_INIT, method, body: JSON.stringify(body) });
    return r.ok;
  } catch {
    return false;
  }
}

export const api = {
  health: () => getJson<{ ok: boolean; db: boolean; auth: boolean }>("/api/health"),
  me: () => getJson<{ user: ServerUser }>("/api/me"),
  logout: () => fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).then((r) => r.ok).catch(() => false),

  authGithub: (code: string, verifier: string) =>
    postJson<{ ok: true; user: ServerUser }>("/api/auth/github", { code, verifier }),
  authGoogle: (idToken: string) => postJson<{ ok: true; user: ServerUser }>("/api/auth/google", { idToken }),

  /* Both email routes report a reason the sheet must show (too_soon,
     rate_limited, daily_limit, mail_unconfigured), so they read the body on
     a 4xx/5xx too. */
  emailStart: (email: string) => postJson<EmailStartRes>("/api/auth/email/start", { email }, "POST", true),
  emailVerify: (email: string, code: string, name?: string) =>
    postJson<EmailVerifyRes>("/api/auth/email/verify", { email, code, name }, "POST", true),

  savedList: () => getJson<{ items: SavedRow[] }>("/api/me/saved"),
  savedAdd: (itemType: string, itemId: string, title?: string) =>
    fire("/api/me/saved", { itemType, itemId, title }, "POST"),
  savedRemove: (itemType: string, itemId: string) =>
    fire("/api/me/saved", { itemType, itemId }, "DELETE"),

  submit: (kind: string, payload: unknown, extra?: { name?: string; email?: string }) =>
    postJson<{ ok: true; id: string }>("/api/submissions", { kind, payload, ...extra }),

  appList: () => getJson<{ applications: AppRow[] }>("/api/me/applications"),
  appUpsert: (kind: string, targetId: string, targetTitle?: string) =>
    postJson<{ application: AppRow }>("/api/me/applications", { kind, targetId, targetTitle }),
  appPatch: (id: string, patch: { status?: string; notes?: unknown }) =>
    postJson<{ application: AppRow }>("/api/me/applications", { id, ...patch }, "PATCH"),
  appDelete: (id: string) => postJson<{ ok: boolean }>("/api/me/applications", { id }, "DELETE"),

  assistant: (messages: { role: "user" | "assistant"; content: string }[], mode: "assistant" | "builder", context?: string) =>
    postJson<AssistantRes>("/api/assistant", { messages, mode, context }),
};

/** can this deployment actually run server sessions? (cached per page load) */
let readyCache: boolean | null = null;
export async function serverAuthReady(): Promise<boolean> {
  if (readyCache !== null) return readyCache;
  const h = await api.health();
  readyCache = Boolean(h?.db && h?.auth);
  return readyCache;
}
