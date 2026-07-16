import "server-only";
import type { Favorite, FavoriteContentType } from "@/types/favorite";
import { loadMap, saveMap } from "./persist";

const FILE = "favorites.json";

// シード：dummy-admin-001 に3件お気に入り
function getSeeds(): Favorite[] {
  const now = new Date().toISOString();
  return [
    { id: "fav-seed-0", userId: "dummy-admin-001", contentType: "faq", contentId: "faq-001", createdAt: now },
    { id: "fav-seed-1", userId: "dummy-admin-001", contentType: "script", contentId: "sc-001", createdAt: now },
    { id: "fav-seed-2", userId: "dummy-admin-001", contentType: "product", contentId: "prd-001", createdAt: now },
  ];
}

const load = () => loadMap<Favorite>(FILE, getSeeds);
const persist = (m: Map<string, Favorite>) => saveMap(FILE, m);

export async function isFavorited(userId: string, contentType: FavoriteContentType, contentId: string): Promise<boolean> {
  const map = await load();
  for (const f of map.values()) {
    if (f.userId === userId && f.contentType === contentType && f.contentId === contentId) return true;
  }
  return false;
}

export async function countFavoritesFor(contentType: FavoriteContentType, contentId: string): Promise<number> {
  const map = await load();
  let n = 0;
  for (const f of map.values()) if (f.contentType === contentType && f.contentId === contentId) n++;
  return n;
}

/** トグル：あれば削除、無ければ追加。返り値=現在の状態(true=登録済) */
export async function toggleFavorite(userId: string, contentType: FavoriteContentType, contentId: string): Promise<boolean> {
  const map = await load();
  for (const [id, f] of map) {
    if (f.userId === userId && f.contentType === contentType && f.contentId === contentId) {
      map.delete(id);
      await persist(map);
      return false;
    }
  }
  const id = `fav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  map.set(id, {
    id, userId, contentType, contentId,
    createdAt: new Date().toISOString(),
  });
  await persist(map);
  return true;
}

export async function listFavoritesByUser(userId: string): Promise<Favorite[]> {
  const map = await load();
  return Array.from(map.values())
    .filter((f) => f.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
