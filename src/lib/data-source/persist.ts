import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

/**
 * JSON永続化のハブ。
 *
 * 保存先の自動切替：
 *   - UPSTASH_REDIS_REST_URL & _TOKEN が設定されている → Upstash Redis（恒久保存）
 *   - 未設定（ローカル開発）→ プロジェクト直下 `data/` ディレクトリ（gitignore済み）
 *
 * ★セキュリティ：
 *   - ローカルの data/ は .gitignore 済み
 *   - Redisトークンは環境変数、コードに直書き禁止
 *   - パスワードは scrypt でハッシュ済み
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_REDIS = Boolean(REDIS_URL && REDIS_TOKEN);

// Redisクライアントは1度だけ初期化（globalThisで hot-reload 越しに使い回す）
const g = globalThis as unknown as {
  __dsCache?: Cache;
  __dsRedis?: Redis;
};

function getRedis(): Redis {
  if (!g.__dsRedis) {
    g.__dsRedis = new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! });
  }
  return g.__dsRedis;
}

// キー命名規則：`telemo:{filename}`（プレフィックスで他アプリと衝突回避）
const KEY_PREFIX = "telemo:";
const redisKey = (filename: string) => `${KEY_PREFIX}${filename}`;

// ローカル開発用ディレクトリ
const DATA_DIR = path.resolve(process.cwd(), "data");

type Cache = {
  maps: Record<string, Map<string, unknown> | undefined>;
  // 進行中のロード（同時アクセス時のシード書込レース対策）
  inflight: Record<string, Promise<Map<string, unknown>> | undefined>;
};

function getCache(): Cache {
  if (!g.__dsCache) g.__dsCache = { maps: {}, inflight: {} };
  return g.__dsCache;
}

// --- ファイル実装（ローカル開発用） ---

async function saveFile<T>(filename: string, items: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const fullPath = path.join(DATA_DIR, filename);
  const tmp = `${fullPath}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(items, null, 2), "utf-8");
  await fs.rename(tmp, fullPath);
}

async function loadFile<T extends { id: string }>(
  filename: string,
  getSeeds: () => T[] | Promise<T[]>,
): Promise<T[]> {
  const fullPath = path.join(DATA_DIR, filename);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(fullPath);
    const raw = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    const seeds = await getSeeds();
    await saveFile(filename, seeds);
    return seeds;
  }
}

// --- Redis実装（Vercel本番用） ---

async function saveRedis<T>(filename: string, items: T[]): Promise<void> {
  // 明示的にJSON文字列化して保存。@upstash/redisは自動パースするので get で復元される。
  try {
    await getRedis().set(redisKey(filename), JSON.stringify(items));
  } catch (e) {
    console.error(`[persist] Redis SET failed for ${filename}:`, e);
    throw new Error(`Redis保存失敗 (${filename}): ${(e as Error).message}`);
  }
}

async function loadRedis<T extends { id: string }>(
  filename: string,
  getSeeds: () => T[] | Promise<T[]>,
): Promise<T[]> {
  const key = redisKey(filename);
  let stored: unknown;
  try {
    stored = await getRedis().get(key);
  } catch (e) {
    console.error(`[persist] Redis GET failed for ${filename}:`, e);
    throw new Error(`Redis読込失敗 (${filename}): ${(e as Error).message}`);
  }
  // 既存データがあれば返す（Upstashは自動JSONパースするので配列で返る）
  if (Array.isArray(stored)) return stored as T[];
  // 文字列で返るケース（明示set-strした場合）にも対応
  if (typeof stored === "string") {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch {
      /* fall through to seed */
    }
  }
  // 初回：シードを保存
  const seeds = await getSeeds();
  await saveRedis(filename, seeds);
  return seeds;
}

// --- 公開API：内部で自動切替 ---

async function loadItems<T extends { id: string }>(
  filename: string,
  getSeeds: () => T[] | Promise<T[]>,
): Promise<T[]> {
  return USE_REDIS ? loadRedis(filename, getSeeds) : loadFile(filename, getSeeds);
}

async function saveItems<T>(filename: string, items: T[]): Promise<void> {
  return USE_REDIS ? saveRedis(filename, items) : saveFile(filename, items);
}

/** データを読み込み、Map<id, T> で返す。以降はメモリキャッシュ。 */
export async function loadMap<T extends { id: string }>(
  filename: string,
  getSeeds: () => T[] | Promise<T[]>,
): Promise<Map<string, T>> {
  const cache = getCache();
  if (cache.maps[filename]) return cache.maps[filename] as Map<string, T>;
  // 同一キーへの並行ロードは同じPromiseを共有（seed書込の競合を防ぐ）
  if (cache.inflight[filename]) return cache.inflight[filename] as Promise<Map<string, T>>;

  const promise = (async () => {
    const items = await loadItems<T>(filename, getSeeds);
    const map = new Map<string, T>();
    for (const item of items) map.set(item.id, item);
    cache.maps[filename] = map as Map<string, unknown>;
    return map;
  })();
  cache.inflight[filename] = promise as Promise<Map<string, unknown>>;
  try {
    return await promise;
  } finally {
    delete cache.inflight[filename];
  }
}

/** Map の内容を永続化。キャッシュも更新。 */
export async function saveMap<T extends { id: string }>(
  filename: string,
  map: Map<string, T>,
): Promise<void> {
  const items = Array.from(map.values());
  await saveItems(filename, items);
  getCache().maps[filename] = map as Map<string, unknown>;
}
