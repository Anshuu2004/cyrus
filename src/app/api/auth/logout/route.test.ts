import { expect, it, vi } from "vitest";

const clearSession = vi.hoisted(() => vi.fn());
vi.mock("@/lib/server/auth", () => ({ clearSession }));

import { POST } from "./route";

it("POST /api/auth/logout clears the session and returns ok", async () => {
  clearSession.mockResolvedValue(undefined);
  const res = await POST();
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
  expect(clearSession).toHaveBeenCalledOnce();
});
