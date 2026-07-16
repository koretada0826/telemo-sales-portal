import "server-only";
import type { Script, ScriptInput } from "@/types/script";
import type { ListParams, ListResult } from "@/types/common";
import { SCRIPT_SEEDS } from "@/data/mock/scripts";
import { loadMap, saveMap } from "./persist";

const FILE = "scripts.json";
const load = () => loadMap<Script>(FILE, () => SCRIPT_SEEDS);
const persist = (m: Map<string, Script>) => saveMap(FILE, m);
const genId = () => `sc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function listScripts(params: ListParams = {}): Promise<ListResult<Script>> {
  const map = await load();
  const { q, sort = "newest", page = 1, perPage = 10 } = params;
  let list = Array.from(map.values());
  if (q) {
    const kw = q.toLowerCase();
    list = list.filter((s) =>
      [s.name, s.opening, s.closing, s.productPitch].some((v) => v.toLowerCase().includes(kw)),
    );
  }
  list.sort((a, b) =>
    sort === "oldest" ? a.createdAt.localeCompare(b.createdAt) : b.updatedAt.localeCompare(a.updatedAt),
  );
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: list.slice(start, start + perPage), total, page: safePage, perPage, totalPages };
}

export async function getScript(id: string): Promise<Script | null> {
  return (await load()).get(id) ?? null;
}

export async function createScript(input: ScriptInput, authorId: string): Promise<Script> {
  const map = await load();
  const now = new Date().toISOString();
  const s: Script = { id: genId(), ...input, authorId, updaterId: authorId, createdAt: now, updatedAt: now };
  map.set(s.id, s);
  await persist(map);
  return s;
}

export async function updateScript(id: string, input: ScriptInput, updaterId: string): Promise<Script | null> {
  const map = await load();
  const cur = map.get(id);
  if (!cur) return null;
  const u: Script = { ...cur, ...input, updaterId, updatedAt: new Date().toISOString() };
  map.set(id, u);
  await persist(map);
  return u;
}

export async function deleteScript(id: string): Promise<boolean> {
  const map = await load();
  const ok = map.delete(id);
  if (ok) await persist(map);
  return ok;
}

export async function countScripts(): Promise<number> {
  return (await load()).size;
}
