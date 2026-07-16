import "server-only";
import type { Notification } from "@/types/notification";
import { loadMap, saveMap } from "./persist";

const FILE = "notifications.json";

function getSeeds(): Notification[] {
  const now = Date.now();
  const raw: Omit<Notification, "id">[] = [
    {
      userId: "dummy-admin-001", type: "comment",
      title: "自分のFAQにコメントが付きました",
      body: "「契約期間中のプラン変更は可能ですか？」に鈴木一郎さんがコメントしました",
      linkUrl: "/knowledge/faqs/faq-001", read: false,
      createdAt: new Date(now - 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "dummy-admin-001", type: "mention",
      title: "コメント内でメンションされました",
      body: "@山田太郎 次回のミーティングで図解案作ります！",
      linkUrl: "/knowledge/faqs/faq-001", read: false,
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "dummy-admin-001", type: "new-content",
      title: "新しいトークスクリプトが追加されました",
      body: "佐藤花子さんが「資料送付後フォロー」を追加しました",
      linkUrl: "/training/scripts/sc-002", read: true,
      createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      userId: "dummy-admin-001", type: "system",
      title: "TELEMOへようこそ",
      body: "本ポータルの使い方はダッシュボード右下のヘルプをご覧ください。",
      linkUrl: null, read: true,
      createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  return raw.map((r, i) => ({ id: `noti-seed-${i}`, ...r }));
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
