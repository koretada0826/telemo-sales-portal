import "server-only";
import type { Notification } from "@/types/notification";
import { loadMap, saveMap } from "./persist";

const FILE = "notifications.json";

// 通知シードは空。実運用で生成される。
function getSeeds(): Notification[] {
  return [];
}

const load = () => loadMap<Notification>(FILE, getSeeds);
const persist = (m: Map<string, Notification>) => saveMap(FILE, m);
const genId = () => `noti-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export async function listNotifications(userId: string): Promise<Notification[]> {
  const map = await load();
  return Array.from(map.values())
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const map = await load();
  let n = 0;
  for (const x of map.values()) if (x.userId === userId && !x.read) n++;
  return n;
}

export async function markAsRead(id: string): Promise<void> {
  const map = await load();
  const cur = map.get(id);
  if (!cur) return;
  map.set(id, { ...cur, read: true });
  await persist(map);
}

export async function markAllAsRead(userId: string): Promise<void> {
  const map = await load();
  let changed = false;
  for (const [id, n] of map) {
    if (n.userId === userId && !n.read) {
      map.set(id, { ...n, read: true });
      changed = true;
    }
  }
  if (changed) await persist(map);
}

export async function createNotification(n: Omit<Notification, "id" | "createdAt" | "read">): Promise<Notification> {
  const map = await load();
  const item: Notification = { id: genId(), ...n, read: false, createdAt: new Date().toISOString() };
  map.set(item.id, item);
  await persist(map);
  return item;
}
