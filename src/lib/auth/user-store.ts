import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { hashPassword } from "./hash";

/**
 * ユーザー情報のJSONファイル永続化ストア。
 * サーバー再起動でもデータが残る。
 *
 * ★セキュリティ鉄則：
 *  - パスワードは必ずハッシュ化して保存（平文NG）
 *  - このJSONファイルは .gitignore 済み（GitHub漏洩防止）
 *  - 読取をglobalThisでキャッシュしてfs I/Oを削減
 */

export type UserRole = "admin" | "manager" | "member" | "viewer";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  department: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

type Store = { users: StoredUser[]; loaded: boolean };
const g = globalThis as unknown as { __userStore?: Store };

/** ファイル存在確認 → 無ければ作る */
async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(USERS_FILE);
  } catch {
    // ファイルが無ければ初期ユーザーで作成
    const seedUsers = await createSeedUsers();
    await fs.writeFile(USERS_FILE, JSON.stringify(seedUsers, null, 2), "utf-8");
  }
}

/** 初回シード：既存モックユーザー相当を作成、全員パスワード "telemo2026" */
async function createSeedUsers(): Promise<StoredUser[]> {
  const defaultPassword = "telemo2026";
  const hash = await hashPassword(defaultPassword);
  const now = new Date().toISOString();
  return [
    { id: "dummy-admin-001", email: "yamada@example.com", name: "山田 太郎", department: "営業部", role: "admin", passwordHash: hash, createdAt: now },
    { id: "user-002", email: "sato@example.com", name: "佐藤 花子", department: "営業推進部", role: "manager", passwordHash: hash, createdAt: now },
    { id: "user-003", email: "suzuki@example.com", name: "鈴木 一郎", department: "営業部", role: "member", passwordHash: hash, createdAt: now },
    { id: "user-004", email: "tanaka@example.com", name: "田中 美咲", department: "カスタマーサクセス", role: "member", passwordHash: hash, createdAt: now },
    { id: "user-005", email: "ito@example.com", name: "伊藤 健", department: "経営企画", role: "viewer", passwordHash: hash, createdAt: now },
  ];
}

/** メモリキャッシュ + ファイル読取 */
async function loadUsers(): Promise<StoredUser[]> {
  if (!g.__userStore) g.__userStore = { users: [], loaded: false };
  if (g.__userStore.loaded) return g.__userStore.users;

  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, "utf-8");
  const parsed = JSON.parse(raw) as StoredUser[];
  g.__userStore.users = parsed;
  g.__userStore.loaded = true;
  return parsed;
}

/** アトミック保存：一時ファイルに書いてから rename（書込中クラッシュ対策） */
async function saveUsers(users: StoredUser[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = USERS_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(users, null, 2), "utf-8");
  await fs.rename(tmp, USERS_FILE);
  if (g.__userStore) g.__userStore.users = users;
}

/** メールでユーザー検索（ログイン時に使用） */
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await loadUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

/** IDでユーザー検索（セッション復元時に使用） */
export async function findUserById(id: string): Promise<StoredUser | null> {
  const users = await loadUsers();
  return users.find((u) => u.id === id) ?? null;
}

/** 全ユーザー取得（ユーザー管理画面用） */
export async function listUsers(): Promise<StoredUser[]> {
  return loadUsers();
}

/** 新規ユーザー作成 */
export async function createUser(input: {
  email: string;
  name: string;
  department?: string;
  role?: UserRole;
  password: string;
}): Promise<StoredUser> {
  const users = await loadUsers();
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("このメールアドレスは既に登録されています");
  }
  const passwordHash = await hashPassword(input.password);
  const user: StoredUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email,
    name: input.name.trim(),
    department: input.department?.trim() ?? "",
    role: input.role ?? "member",
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  await saveUsers([...users, user]);
  return user;
}
