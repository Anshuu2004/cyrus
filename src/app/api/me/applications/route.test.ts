import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  currentUser: vi.fn(), listApplications: vi.fn(), upsertApplication: vi.fn(),
  patchApplication: vi.fn(), deleteApplication: vi.fn(),
}));
vi.mock("@/lib/server/auth", () => ({ currentUser: m.currentUser }));
vi.mock("@/lib/server/queries", async (orig) => ({
  ...(await orig<typeof import("@/lib/server/queries")>()),
  listApplications: m.listApplications,
  upsertApplication: m.upsertApplication,
  patchApplication: m.patchApplication,
  deleteApplication: m.deleteApplication,
}));

import { DELETE, GET, PATCH, POST } from "./route";

const req = (method: string, body?: unknown) =>
  new Request("http://x/api/me/applications", { method, body: typeof body === "string" ? body : body === undefined ? undefined : JSON.stringify(body) });
const app = { id: "a1", kind: "program", targetId: "gsoc", targetTitle: "GSoC", status: "drafting", notes: null, createdAt: "c", updatedAt: "u", userId: "u1" };

beforeEach(() => {
  m.currentUser.mockReset().mockResolvedValue({ id: "u1" });
  m.listApplications.mockReset().mockResolvedValue([app]);
  m.upsertApplication.mockReset().mockResolvedValue(app);
  m.patchApplication.mockReset().mockResolvedValue({ ...app, status: "submitted" });
  m.deleteApplication.mockReset().mockResolvedValue(true);
});

describe("/api/me/applications", () => {
  it("returns 401 on every method when signed out", async () => {
    m.currentUser.mockResolvedValue(null);
    expect((await GET()).status).toBe(401);
    expect((await POST(req("POST", {}))).status).toBe(401);
    expect((await PATCH(req("PATCH", {}))).status).toBe(401);
    expect((await DELETE(req("DELETE", {}))).status).toBe(401);
  });

  it("GET lists applications without internal columns", async () => {
    const { applications } = await (await GET()).json();
    expect(applications).toHaveLength(1);
    expect(applications[0]).not.toHaveProperty("userId");
    expect(applications[0]).toMatchObject({ id: "a1", status: "drafting" });
  });

  it("POST creates or touches an application", async () => {
    const res = await POST(req("POST", { kind: "program", targetId: "gsoc", targetTitle: "GSoC" }));
    expect((await res.json()).application.id).toBe("a1");
    expect(m.upsertApplication).toHaveBeenCalledWith("u1", "program", "gsoc", "GSoC", undefined);
  });

  it("POST rejects bad JSON, kind or targetId with 400", async () => {
    expect((await POST(req("POST", "{bad"))).status).toBe(400);
    expect((await POST(req("POST", { kind: "hackathon", targetId: "x" }))).status).toBe(400);
    expect((await POST(req("POST", { kind: "program", targetId: "" }))).status).toBe(400);
    expect(m.upsertApplication).not.toHaveBeenCalled();
  });

  it("PATCH updates the stage, and rejects unknown stages and missing ids", async () => {
    const ok = await PATCH(req("PATCH", { id: "a1", status: "submitted" }));
    expect((await ok.json()).application.status).toBe("submitted");
    expect(m.patchApplication).toHaveBeenCalledWith("u1", "a1", { status: "submitted" });
    expect((await PATCH(req("PATCH", { id: "a1", status: "bogus" }))).status).toBe(400);
    expect((await PATCH(req("PATCH", { status: "submitted" }))).status).toBe(400);
    expect((await PATCH(req("PATCH", "{bad"))).status).toBe(400);
  });

  it("PATCH is 404 when the application is not found for this user", async () => {
    m.patchApplication.mockResolvedValue(null);
    expect((await PATCH(req("PATCH", { id: "nope", notes: "n" }))).status).toBe(404);
  });

  it("DELETE removes by id and validates input", async () => {
    expect(await (await DELETE(req("DELETE", { id: "a1" }))).json()).toEqual({ ok: true });
    expect(m.deleteApplication).toHaveBeenCalledWith("u1", "a1");
    expect((await DELETE(req("DELETE", {}))).status).toBe(400);
    expect((await DELETE(req("DELETE", "{bad"))).status).toBe(400);
    m.deleteApplication.mockResolvedValue(false);
    expect(await (await DELETE(req("DELETE", { id: "gone" }))).json()).toEqual({ ok: false });
  });
});
