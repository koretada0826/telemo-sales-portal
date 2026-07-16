import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 認証ミドルウェア。
 * 未ログイン状態でポータル系ページにアクセスしたら /login へリダイレクト。
 *
 * ★セキュリティ鉄則：
 *  - フロントの表示制御だけでなくミドルウェアで確実にブロック
 *  - Cookie の署名検証まではここでは行わない（Edge Runtime制約でcrypto制限のため）
 *  - 詳細な認可（role確認など）は各Server Componentで再チェック
 */

const PUBLIC_PATHS = ["/login", "/register"];
const COOKIE_NAME = "telemo_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 公開ページ・APIルート・静的アセットはスルー
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // セッションCookie存在チェック（署名検証は各ページ側で実施）
  const sessionCookie = req.cookies.get(COOKIE_NAME);
  if (!sessionCookie) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    // ログイン後に元のページに戻れるように保存（任意）
    if (pathname !== "/") loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// matcher：全ルートに適用（静的ファイルとfaviconを除外）
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
