import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * セッション管理（自前実装）。
 *
 * 仕組み：
 *  1. サーバー側で「userId + 有効期限」をJSON化 → Base64
 *  2. SESSION_SECRET でHMAC署名を付ける
 *  3. `<データ>.<署名>` の形でCookieに保存
 *  4. 読取時に署名を検証（改ざん検知）
 *  5. 有効期限も検証
 *
 * ★セキュリティ鉄則：
 *  - Cookie は HttpOnly（JSから読めない = XSS対策）
 *  - Cookie は Secure（本番のみ、HTTPSでのみ送信）
 *  - Cookie は SameSite=lax（CSRF対策）
 *  - SESSION_SECRET は .env.local に置き Git に含めない
 */

const COOKIE_NAME = "telemo_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7日間

type SessionPayload = {
  userId: string;
  exp: number; // UNIX秒
};

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "SESSION_SECRET が未設定または短すぎます。.env.local に32文字以上を設定してください。",
    );
  }
  return s;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

/** ペイロード → Cookie値（データ.署名） */
function encode(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = sign(data);
  return `${data}.${sig}`;
}

/** Cookie値 → ペイロード（署名検証込み）。失敗時 null */
function decode(cookieValue: string | undefined): SessionPayload | null {
  if (!cookieValue) return null;
  const [data, sig] = cookieValue.split(".");
  if (!data || !sig) return null;

  // 定数時間比較で署名検証（タイミング攻撃対策）
  const expected = sign(data);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    if (!payload.userId || typeof payload.exp !== "number") return null;
    // 有効期限チェック
    if (Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/** 現在のセッションからユーザーIDを取得。未ログインなら null。 */
export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  const payload = decode(raw);
  return payload?.userId ?? null;
}

/** セッション書き込み（ログイン成功時） */
export async function createSession(userId: string): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const value = encode({ userId, exp });
  const store = await cookies();
  store.set(COOKIE_NAME, value, {
    httpOnly: true, // ★JSから読めない（XSS対策）
    secure: process.env.NODE_ENV === "production", // 本番はHTTPSのみ
    sameSite: "lax", // ★CSRF対策
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

/** セッション破棄（ログアウト時） */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
