import "server-only";
import type { Material, MaterialInput } from "@/types/material";
import type { ListParams, ListResult } from "@/types/common";
import { MATERIAL_SEEDS } from "@/data/mock/materials";
import { loadMap, saveMap } from "./persist";

const FILE = "materials.json";
const load = () => loadMap<Material>(FILE, () => MATERIAL_SEEDS);
const persist = (m: Map<string, Material>) => saveMap(FILE, m);
const genId = () => `mat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function listMaterials(params: ListParams = {}): Promise<ListResult<Material>> {
  const map = await load();
  const { q, sort = "newest", page = 1, perPage = 10 } = params;
  let list = Array.from(map.values());
  if (q) {
    const kw = q.toLowerCase();
    list = list.filter((m) => m.name.toLowerCase().includes(kw) || m.description.toLowerCase().includes(kw));
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

export async function getMaterial(id: string): Promise<Material | null> {
  return (await load()).get(id) ?? null;
}

export async function createMaterial(input: MaterialInput, authorId: string): Promise<Material> {
  const map = await load();
  const now = new Date().toISOString();
  const m: Material = { id: genId(), ...input, authorId, updaterId: authorId, createdAt: now, updatedAt: now };
  map.set(m.id, m);
  await persist(map);
  return m;
}

export async function updateMaterial(id: string, input: MaterialInput, updaterId: string): Promise<Material | null> {
  const map = await load();
  const cur = map.get(id);
  if (!cur) return null;
  const u = { ...cur, ...input, updaterId, updatedAt: new Date().toISOString() };
  map.set(id, u);
  await persist(map);
  return u;
}

export async function deleteMaterial(id: string): Promise<boolean> {
  const map = await load();
  const ok = map.delete(id);
  if (ok) await persist(map);
  return ok;
}

export async function countMaterials(): Promise<number> {
  return (await load()).size;
}
