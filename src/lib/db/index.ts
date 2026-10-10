/* ══ db connection ═══════════════════════════════════════════════════
   Neon serverless driver, created lazily. Without DATABASE_URL the app
   still works — every API route treats a null db as "backend offline"
   and the frontend falls back to localStorage. ═══════════════════════ */
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Db = NeonHttpDatabase<typeof schema>;

const cache = (globalThis as { __cyrusDb?: { url: string; db: Db | null } }).__cyrusDb ??= {
  url: "",
  db: null,
};

export function getDb(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (cache.db && cache.url === url) return cache.db;
  cache.url = url;
  cache.db = drizzle(neon(url), { schema });
  return cache.db;
}

export function dbReady(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
