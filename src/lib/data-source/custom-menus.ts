import "server-only";
import type { CustomMenu, CustomMenuGroup, CustomMenuInput } from "@/types/custom-menu";
import { loadMap, saveMap } from "./persist";

const FILE = "custom-menus.json";
// 初期は空。動的メニューは /settings/menus からユーザーが追加する
const load = () => loadMap<CustomMenu>(FILE, () => []);
const persist = (m: Map<string, CustomMenu>) => saveMap(FILE, m);
const genId = () => `cmenu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

/** 全件取得（管理画面用） */
export async function listAllCustomMenus(): Promise<CustomMenu[]> {
  const map = await load();
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

/** サイドバー表示用（公開中 + 権限フィルター + group絞込） */
export async function listVisibleCustomMenus(
  role: "admin" | "manager" | "member" | "viewer",
  group?: CustomMenuGroup,
): Promise<CustomMenu[]> {
  const map = await load();
  return Array.from(map.values())
    .filter((m) => m.isPublished)
    .filter((m) => m.viewableRoles.includes(role))
    .filter((m) => (group ? m.group === group : true))
    .sort((a, b) => a.order - b.order);
}

export async function getCustomMenu(id: string): Promise<CustomMenu | null> {
  return (await load()).get(id) ?? null;
}

export async function createCustomMenu(input: CustomMenuInput, authorId: string): Promise<CustomMenu> {
  const map = await load();
  const now = new Date().toISOString();
  const m: CustomMenu = { id: genId(), ...input, authorId, createdAt: now, updatedAt: now };
  map.set(m.id, m);
  await persist(map);
  return m;
}

export async function updateCustomMenu(id: string, input: CustomMenuInput): Promise<CustomMenu | null> {
  const map = await load();
  const cur = map.get(id);
  if (!cur) return null;
  const u = { ...cur, ...input, updatedAt: new Date().toISOString() };
  map.set(id, u);
  await persist(map);
  return u;
}

export async function deleteCustomMenu(id: string): Promise<boolean> {
  const map = await load();
  const ok = map.delete(id);
  if (ok) await persist(map);
  return ok;
}
