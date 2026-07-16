import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * JSON永続化のハブ。
 *
 * 動作モード：
 *   - ローカル開発（BLOB_READ_WRITE_TOKEN 無し）→ data/*.json にファイル保存
 *   - Vercel本番（BLOB_READ_WRITE_TOKEN 有り）→ Vercel Blob に保存
 *
 * 呼び出し側はどちらのモードかを意識せずに使える。
 *
 * ★セキュリティ：
 *   - ローカルの data/*.json は .gitignore 済み
 *   - Vercel BlobはURLが推測しづらい（ストアIDがランダム21文字）
 *   - パスワードは scrypt でハッシュ済み → JSON漏洩でも復元困難
 */

const DATA_DIR = path.resolve(process.cwd(), "data");
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

type Cache = { maps: Record<string, Map<string, unknown>> };
const g = globalThis as unknown as { __dsCache?: Cache };

function getCache(): Cache {
  if (!g.__dsCache) g.__dsCache = { maps: {} };
  return g.__dsCache;
}

// ============================================================
// ファイル方式（ローカル開発）
// ============================================================
async function fsLoad<T extends { id: string }>(
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
    await fsSave(filename, seeds);
    return seeds;
  }
}

async function fsSave<T>(filename: string, items: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const fullPath = path.join(DATA_DIR, filename);
  const tmp = fullPath + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(items, null, 2), "utf-8");
  await fs.rename(tmp, fullPath);
}

// ============================================================
// Vercel Blob方式（本番）
// ============================================================
// Turbopackの静的解析を回避するため、Functionコンストラクタで動的import
// これによりローカル(未インストール)ではimport評価が起きず、Vercel(インストール済)でのみ実行される
type BlobList = (opts: { prefix: string }) => Promise<{ blobs: { pathname: string; url: string }[] }>;
type BlobPut = (
  pathname: string,
  body: string,
  opts: {
    access: "public";
    addRandomSuffix: boolean;
    allowOverwrite: boolean;
    contentType: string;
  },
) => Promise<{ url: string }>;

async function loadBlobModule(): Promise<{ list: BlobList; put: BlobPut }> {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const dyn = new Function("m", "return import(m)") as (m: string) => Promise<{ list: BlobList; put: BlobPut }>;
  return dyn("@vercel/blob");
}

async function blobLoad<T extends { id: string }>(
  filename: string,
  getSeeds: () => T[] | Promise<T[]>,
): Promise<T[]> {
  const { list } = await loadBlobModule();
  const { blobs } = await list({ prefix: filename });
  const found = blobs.find((b) => b.pathname === filename);
  if (!found) {
    const seeds = await getSeeds();
    await blobSave(filename, seeds);
    return seeds;
  }
  const res = await fetch(found.url + `?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`);
  return (await res.json()) as T[];
}

async function blobSave<T>(filename: string, items: T[]): Promise<void> {
  const { put } = await loadBlobModule();
  await put(filename, JSON.stringify(items, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

// ============================================================
// 公開API
// ============================================================

/** ファイル or Blob から読み込み。Map<id, T> で返す。以降はメモリキャッシュ。 */
export async function loadMap<T extends { id: string }>(
  filename: string,
  getSeeds: () => T[] | Promise<T[]>,
): Promise<Map<string, T>> {
  const cache = getCache();
  if (cache.maps[filename]) return cache.maps[filename] as Map<string, T>;

  const items = USE_BLOB
    ? await blobLoad<T>(filename, getSeeds)
    : await fsLoad<T>(filename, getSeeds);

  const map = new Map<string, T>();
  for (const item of items) map.set(item.id, item);
  cache.maps[filename] = map as Map<string, unknown>;
  return map;
}

/** Map の内容をファイル or Blob に保存。キャッシュも更新。 */
export async function saveMap<T extends { id: string }>(
  filename: string,
  map: Map<string, T>,
): Promise<void> {
  const items = Array.from(map.values());
  if (USE_BLOB) {
    await blobSave(filename, items);
  } else {
    await fsSave(filename, items);
  }
  getCache().maps[filename] = map as Map<string, unknown>;
}
