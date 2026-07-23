import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/**
 * 診断エンドポイント: Redis接続を実際にテストする。
 * ブラウザで /api/health を開いて、成功/失敗を目視確認する。
 * ★セキュリティ: 環境変数の実値は返さない。存在有無だけ返す。
 */
export async function GET() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // トークンの中身は出さず、長さと先頭/末尾4文字だけ返す（漏洩リスク最小）
  const tokenInfo = token
    ? {
        length: token.length,
        head: token.slice(0, 4),
        tail: token.slice(-4),
        hasWhitespace: /\s/.test(token),
        hasAsterisk: token.includes("*"),
      }
    : null;

  const status: Record<string, unknown> = {
    hasUrl: Boolean(url),
    hasToken: Boolean(token),
    urlPrefix: url ? url.slice(0, 30) + "..." : null,
    tokenInfo,
  };

  if (!url || !token) {
    return NextResponse.json({ ok: false, ...status, error: "env vars missing" }, { status: 500 });
  }

  try {
    const redis = new Redis({ url, token });
    const pong = await redis.ping();
    const testKey = "telemo:_healthcheck";
    await redis.set(testKey, JSON.stringify({ at: new Date().toISOString() }));
    const back = await redis.get(testKey);
    return NextResponse.json({ ok: true, ...status, pong, roundTrip: back });
  } catch (e) {
    return NextResponse.json(
      { ok: false, ...status, error: (e as Error).message, stack: (e as Error).stack },
      { status: 500 },
    );
  }
}
