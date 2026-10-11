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

const JSON_INIT: RequestInit = { headers: { "content-type": "application/json" }, credentials: "same-origin" };

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { credentials: "same-origin" });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

async function postJson<T>(url: string, body: unknown, method: "POST" | "DELETE" = "POST"): Promise<T | null> {
  try {
    const r = await fetch(url, { ...JSON_INIT, method, body: JSON.stringify(body) });
    return r.ok ? ((await r.json()) as T) : null;
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

  savedList: () => getJson<{ items: SavedRow[] }>("/api/me/saved"),
  savedAdd: (itemType: string, itemId: string, title?: string) =>
    fire("/api/me/saved", { itemType, itemId, title }, "POST"),
  savedRemove: (itemType: string, itemId: string) =>
    fire("/api/me/saved", { itemType, itemId }, "DELETE"),

  submit: (kind: string, payload: unknown, extra?: { name?: string; email?: string }) =>
    postJson<{ ok: true; id: string }>("/api/submissions", { kind, payload, ...extra }),
};

/** can this deployment actually run server sessions? (cached per page load) */
let readyCache: boolean | null = null;
export async function serverAuthReady(): Promise<boolean> {
  if (readyCache !== null) return readyCache;
  const h = await api.health();
  readyCache = Boolean(h?.db && h?.auth);
  return readyCache;
}
