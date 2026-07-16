import "server-only";
import type { Product, ProductInput } from "@/types/product";
import type { ListParams, ListResult } from "@/types/common";
import { PRODUCT_SEEDS } from "@/data/mock/products";
import { loadMap, saveMap } from "./persist";

const FILE = "products.json";
const load = () => loadMap<Product>(FILE, () => PRODUCT_SEEDS);
const persist = (m: Map<string, Product>) => saveMap(FILE, m);
const genId = () => `prd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export async function listProducts(params: ListParams = {}): Promise<ListResult<Product>> {
  const map = await load();
  const { q, sort = "newest", page = 1, perPage = 10 } = params;
  let list = Array.from(map.values());
  if (q) {
    const kw = q.toLowerCase();
    list = list.filter((p) =>
      [p.productName, p.serviceName, p.overview, p.value].some((v) => v.toLowerCase().includes(kw)),
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

export async function getProduct(id: string): Promise<Product | null> {
  return (await load()).get(id) ?? null;
}

export async function createProduct(input: ProductInput, authorId: string): Promise<Product> {
  const map = await load();
  const now = new Date().toISOString();
  const p: Product = { id: genId(), ...input, authorId, updaterId: authorId, createdAt: now, updatedAt: now };
  map.set(p.id, p);
  await persist(map);
  return p;
}

export async function updateProduct(id: string, input: ProductInput, updaterId: string): Promise<Product | null> {
  const map = await load();
  const cur = map.get(id);
  if (!cur) return null;
  const u = { ...cur, ...input, updaterId, updatedAt: new Date().toISOString() };
  map.set(id, u);
  await persist(map);
  return u;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const map = await load();
  const ok = map.delete(id);
  if (ok) await persist(map);
  return ok;
}

export async function countProducts(): Promise<number> {
  return (await load()).size;
}
