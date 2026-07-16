import "server-only";
import { hashPassword } from "./hash";
import { loadMap, saveMap } from "@/lib/data-source/persist";

/**
 * ユーザーストア（自前ログイン用）。
 *
 * 認証識別子は**ユーザー名（name）**。
 * emailは任意（将来のパスワードリセット用）。
 *
 * ★セキュリティ鉄則：
 *  - パスワードは必ずscryptハッシュ化して保存（平文NG）
 *  - JSONファイルは .gitignore 済み・Vercel Blob はランダムURL
 *  - ログイン時は「ユーザー無し」「パスワード不一致」で同じエラーメッセージを返す
 *    → 攻撃者に「そのユーザーは存在する」情報を渡さない
 */

export type UserRole = "admin" | "manager" | "member" | "viewer";

export type StoredUser = {
  id: string;
  name: string; // ログイン識別子
  email?: string; // 任意
  department: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
};

const FILE = "users.json";

/** シード：admin(あなた) + 4名。全員パスワード "1111" */
async function getSeeds(): Promise<StoredUser[]> {
  const hash = await hashPassword("1111");
  const now = new Date().toISOString();
  return [
    { id: "usr-admin", name: "admin", department: "運営", role: "admin", passwordHash: hash, createdAt: now },
    { id: "usr-katayama", name: "片山尚久", department: "営業", role: "member", passwordHash: hash, createdAt: now },
    { id: "usr-kato", name: "加藤虎太郎", department: "営業", role: "member", passwordHash: hash, createdAt: now },
    { id: "usr-furukawa", name: "古川隼也", department: "営業", role: "member", passwordHash: hash, createdAt: now },
    { id: "usr-miyake", name: "三宅海大", department: "営業", role: "member", passwordHash: hash, createdAt: now },
  ];
}

async function load() {
  return loadMap<StoredUser>(FILE, getSeeds);
}
async function persist(m: Map<string, StoredUser>) {
  return saveMap(FILE, m);
}

/** 名前でユーザー検索（ログイン時） */
export async function findUserByName(name: string): Promise<StoredUser | null> {
  const map = await load();
  const trimmed = name.trim();
  for (const u of map.values()) {
    if (u.name === trimmed) return u;
  }
  return null;
}

/** IDでユーザー検索（セッション復元時） */
export async function findUserById(id: string): Promise<StoredUser | null> {
  return (await load()).get(id) ?? null;
}

/** 全ユーザー取得（ユーザー管理画面用） */
export async function listUsers(): Promise<StoredUser[]> {
  return Array.from((await load()).values());
}

/** 新規ユーザー作成（管理者による追加時のみ想定） */
export async function createUser(input: {
  name: string;
  email?: string;
  department?: string;
  role?: UserRole;
  password: string;
}): Promise<StoredUser> {
  const map = await load();
  const name = input.name.trim();
  for (const u of map.values()) {
    if (u.name === name) throw new Error("同じ名前のユーザーが既に登録されています");
  }
  const passwordHash = await hashPassword(input.password);
  const user: StoredUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    email: input.email?.trim(),
    department: input.department?.trim() ?? "",
    role: input.role ?? "member",
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  map.set(user.id, user);
  await persist(map);
  return user;
}
