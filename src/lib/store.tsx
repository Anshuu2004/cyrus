/* ══ store.tsx — auth, saved items, toasts, modals, server sync ══ */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useStored } from "./util";
import type { User } from "./util";
import { api, type ServerUser } from "./api";

interface Store {
  user: User | null;
  signIn: (u: User) => void;
  signOut: () => void;
  saved: string[];
  toggleSaved: (id: string) => boolean;
  savedOrgs: string[];
  toggleSavedOrg: (login: string) => boolean;
  downloads: Record<string, number>;
  countDownload: (id: string) => void;
  toast: (msg: string) => void;
  authOpen: boolean;
  setAuthOpen: (v: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  /** server session user when a cross-device backend session is active */
  serverUser: ServerUser | null;
  /** re-probe /api/me and merge saved items; call after a server sign-in */
  refreshSession: () => Promise<void>;
}

const Ctx = createContext<Store>(null!);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useStored<User | null>("agenthub.user", null);
  const [saved, setSaved] = useStored<string[]>("agenthub.saved", []);
  const [savedOrgs, setSavedOrgs] = useStored<string[]>("agenthub.savedorgs", []);
  const [downloads, setDownloads] = useStored<Record<string, number>>("agenthub.downloads", {});
  const [toastMsg, setToastMsg] = useState<{ msg: string; k: number } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useStored<"light" | "dark">("agenthub.theme", "light");

  /* ── server sync layer (safe no-op when the backend is offline) ── */
  const [serverUser, setServerUser] = useState<ServerUser | null>(null);
  const savedRef = useRef(saved); savedRef.current = saved;
  const orgsRef = useRef(savedOrgs); orgsRef.current = savedOrgs;
  const titleFor = (id: string) => id.split("/")[1] ?? id;

  const refreshSession = useCallback(async () => {
    const me = await api.me();
    if (!me?.user) { setServerUser(null); return; }
    setServerUser(me.user);
    const list = await api.savedList();
    if (!list) return;
    const sRepos = [...new Set(list.items.filter((i) => i.itemType === "repo").map((i) => i.itemId))];
    const sOrgs = [...new Set(list.items.filter((i) => i.itemType === "org").map((i) => i.itemId))];
    const mine = savedRef.current, ours = orgsRef.current;
    const nextRepos = [...new Set([...sRepos, ...mine])];
    const nextOrgs = [...new Set([...sOrgs, ...ours])];
    if (nextRepos.length !== mine.length || nextOrgs.length !== ours.length) {
      setSaved(nextRepos);
      setSavedOrgs(nextOrgs);
    }
    // push anything this browser has that the server hasn't seen
    for (const id of nextRepos.filter((r) => !sRepos.includes(r))) void api.savedAdd("repo", id, titleFor(id));
    for (const id of nextOrgs.filter((o) => !sOrgs.includes(o))) void api.savedAdd("org", id, titleFor(id));
  }, [setSaved, setSavedOrgs]);

  useEffect(() => { void refreshSession(); }, [refreshSession]);

  /* flip the warm token set by toggling .dark on <html> */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  const toast = useCallback((msg: string) => setToastMsg({ msg, k: Date.now() }), []);

  const signIn = useCallback((u: User) => setUser(u), [setUser]);
  const signOut = useCallback(() => {
    setUser(null);
    if (serverUser) { void api.logout(); setServerUser(null); }
    toast("Signed out");
  }, [setUser, toast, serverUser]);

  const toggleSaved = useCallback((id: string) => {
    const added = !saved.includes(id);
    setSaved(added ? [...saved, id] : saved.filter((x) => x !== id));
    if (serverUser) void (added ? api.savedAdd("repo", id, id.split("/")[1]) : api.savedRemove("repo", id));
    return added;
  }, [saved, setSaved, serverUser]);

  const toggleSavedOrg = useCallback((login: string) => {
    const added = !savedOrgs.includes(login);
    setSavedOrgs(added ? [...savedOrgs, login] : savedOrgs.filter((x) => x !== login));
    if (serverUser) void (added ? api.savedAdd("org", login, login) : api.savedRemove("org", login));
    return added;
  }, [savedOrgs, setSavedOrgs, serverUser]);

  const countDownload = useCallback((id: string) => {
    setDownloads({ ...downloads, [id]: (downloads[id] || 0) + 1 });
  }, [downloads, setDownloads]);

  /* auto-dismiss toast */
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  /* global ⌘K / "/" palette hotkeys */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ae = document.activeElement;
      const typing = /INPUT|TEXTAREA|SELECT/.test(ae?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); }
      else if (e.key === "/" && !typing) { e.preventDefault(); setPaletteOpen(true); }
      else if (e.key === "Escape") { setPaletteOpen(false); setAuthOpen(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Ctx.Provider value={{
      user, signIn, signOut, saved, toggleSaved, savedOrgs, toggleSavedOrg,
      downloads, countDownload,
      toast: (m: string) => toast(m), authOpen, setAuthOpen, paletteOpen, setPaletteOpen,
      theme, toggleTheme, serverUser, refreshSession,
    }}>
      {children}
      {toastMsg && (
        <div key={toastMsg.k} className="reveal fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 flex items-center gap-2.5 rounded-full bg-coffee border border-roast text-foam px-5.5 py-3 text-[14px] font-semibold shadow-lift">
          <span className="text-[#7ee2a8]">✓</span> {toastMsg.msg}
        </div>
      )}
    </Ctx.Provider>
  );
}
