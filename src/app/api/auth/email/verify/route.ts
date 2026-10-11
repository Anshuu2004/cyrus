/* ══ POST /api/auth/email/verify — check the code, start a session ══
   Asks for { email, code, name? }. A correct code is single-use (burned
   on success). With DATABASE_URL + SESSION_SECRET the address becomes a
   real users row (provider "email") and gets the httpOnly cyrus.session
   cookie; without a backend the code still verifies against the in-memory
   store and the client signs in locally (offline:true).              ═ */
import { backendReady, publicUser, setSession, upsertUser } from "@/lib/server/auth";
import { checkCode, normalizeEmail, validEmail } from "@/lib/server/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string; code?: string; name?: string };
  try { body = await req.json(); } catch { body = {}; }
  const email = normalizeEmail(body.email ?? "");
  const code = (body.code ?? "").trim();
  if (!validEmail(email) || !/^\d{6}$/.test(code)) {
    return Response.json({ ok: false, reason: "wrong" });
  }

  const res = await checkCode(email, code);
  if (!res.ok) return Response.json(res);

  const display = body.name?.trim() || email.split("@")[0];
  if (backendReady()) {
    const user = await upsertUser({ provider: "email", providerId: email, name: display, email });
    await setSession({ uid: user.id, name: user.name, provider: "email" });
    return Response.json({ ok: true, user: publicUser(user) });
  }
  return Response.json({
    ok: true, offline: true,
    user: { id: `email:${email}`, name: display, login: null, email, picture: null, provider: "email" },
  });
}
