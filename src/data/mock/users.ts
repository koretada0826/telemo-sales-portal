import type { CurrentUser } from "@/lib/current-user";

/**
 * モックユーザー一覧。
 * 投稿者情報として引用する際にここから引く。
 * 将来 profiles テーブルに置き換わる想定。
 */
export const MOCK_USERS: Record<string, CurrentUser> = {
  "dummy-admin-001": {
    id: "dummy-admin-001",
    name: "山田 太郎",
    email: "yamada@example.com",
    role: "admin",
    department: "営業部",
  },
  "user-002": {
    id: "user-002",
    name: "佐藤 花子",
    email: "sato@example.com",
    role: "manager",
    department: "営業推進部",
  },
  "user-003": {
    id: "user-003",
    name: "鈴木 一郎",
    email: "suzuki@example.com",
    role: "member",
    department: "営業部",
  },
  "user-004": {
    id: "user-004",
    name: "田中 美咲",
    email: "tanaka@example.com",
    role: "member",
    department: "カスタマーサクセス",
  },
  "user-005": {
    id: "user-005",
    name: "伊藤 健",
    email: "ito@example.com",
    role: "viewer",
    department: "経営企画",
  },
};

/** ユーザーID → ユーザー情報の取得（見つからなければundefined） */
export function getMockUser(id: string): CurrentUser | undefined {
  return MOCK_USERS[id];
}

/** 全ユーザーを配列で返す */
export function getAllMockUsers(): CurrentUser[] {
  return Object.values(MOCK_USERS);
}
