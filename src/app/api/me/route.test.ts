import { beforeEach, describe, expect, it, vi } from "vitest";

const currentUser = vi.hoisted(() => vi.fn());
vi.mock("@/lib/server/auth", () => ({
  currentUser,
  publicUser: (u: { id: string; name: string }) => ({ id: u.id, name: u.name }),
}));

import { GET } from "./route";

beforeEach(() => currentUser.mockReset());

describe("GET /api/me", () => {
  it("answers 200 with a null user when signed out", async () => {
    currentUser.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ user: null });
  });

  it("returns only the public fields of the signed-in user", async () => {
    currentUser.mockResolvedValue({ id: "u1", name: "Sam", secret: "x" });
    expect(await (await GET()).json()).toEqual({ user: { id: "u1", name: "Sam" } });
  });
});
