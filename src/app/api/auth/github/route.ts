/* ══ POST /api/auth/github — PKCE code exchange, server-side ════
   The client sends { code, verifier } from the popup flow; the token
   exchange happens here with GITHUB_CLIENT_SECRET (never in the browser).
   Needs DATABASE_URL + SESSION_SECRET + GITHUB_CLIENT_SECRET to do
   anything - otherwise the frontend keeps the static relay path.    ═ */
import { OFFLINE, backendReady, publicUser, setSession, upsertUser } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!backendReady()) return OFFLINE();
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const secret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !secret) {
    return Response.json({ error: "GitHub OAuth is not configured on this server" }, { status: 500 });
  }
  let body: { code?: string; verifier?: string };
  try { body = await req.json(); } catch { body = {}; }
  if (!body.code || !body.verifier) {
    return Response.json({ error: "code and verifier are required" }, { status: 400 });
  }

  const tok = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId, client_secret: secret,
      code: body.code, code_verifier: body.verifier,
      grant_type: "authorization_code",
    }),
  }).then((r) => r.json()).catch(() => null);
  if (!tok?.access_token) {
    return Response.json({ error: "GitHub rejected the sign-in code - try again" }, { status: 401 });
  }

  const gh = await fetch("https://api.github.com/user", {
    headers: { authorization: `Bearer ${tok.access_token}`, accept: "application/vnd.github+json" },
  }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  if (!gh?.login) return Response.json({ error: "Could not read your GitHub profile" }, { status: 401 });

  const user = await upsertUser({
    provider: "github", providerId: String(gh.id ?? gh.login),
    login: gh.login, name: gh.name || gh.login,
    email: gh.email ?? null, picture: gh.avatar_url ?? null,
  });
  await setSession({ uid: user.id, name: user.name, provider: "github" });
  return Response.json({ ok: true, user: publicUser(user) });
}
