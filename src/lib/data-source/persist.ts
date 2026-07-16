import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * JSON永続化のハブ。
 *
 * 保存先：
 *   - ローカル開発 → `data/` ディレクトリ（プロジェクト直下、gitignore済み）
 *   - Vercel本番 → `/tmp/data/` （インスタンス寿命の間だけ保持）
 *
 * ★Vercel上の制約：
 *   - サーバーレスなので、コールドスタート時にデータリセット
 *   - でもログインは常に動く（起動時にシード = 5人が自動作成される）
 *   - 恒久永続が必要になったらSupabase/Postgres等へ切替
 *
 * ★セキュリティ：
 *   - ローカルの data/ は .gitignore 済み
 *   - パスワードは scrypt でハッシュ済み
 *   - /tmp はVercelの各インスタンス専用、外部アクセス不可
 */

// Vercel環境判定：VERCEL 環境変数はVercel上で自動的に "1" が設定される
const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL
  ? "/tmp/data"
  : path.resolve(process.cwd(), "data");

type Cache = { maps: Record<string, Map<string, unknown>> };
const g = globalThis as unknown as { __dsCache?: Cache };

function getCache(): Cache {
  if (!g.__dsCache) g.__dsCache = { maps: {} };
  return g.__dsCache;
}

/** ファイル書込（アトミック：一時ファイル→rename） */
async function saveFile<T>(filename: string, items: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const fullPath = path.join(DATA_DIR, filename);
  const tmp = fullPath + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(items, null, 2), "utf-8");
  await fs.rename(tmp, fullPath);
}

/** ファイル読込 or シードから初期化 */
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

/** ファイルから読み込み。Map<id, T> で返す。以降はメモリキャッシュ。 */
export async function loadMap<T extends { id: string }>(
  filename: string,
  getSeeds: () => T[] | Promise<T[]>,
): Promise<Map<string, T>> {
  const cache = getCache();
  if (cache.maps[filename]) return cache.maps[filename] as Map<string, T>;

  const items = await loadFile<T>(filename, getSeeds);
  const map = new Map<string, T>();
  for (const item of items) map.set(item.id, item);
  cache.maps[filename] = map as Map<string, unknown>;
  return map;
}

/** Map の内容をファイルに保存。キャッシュも更新。 */
export async function saveMap<T extends { id: string }>(
  filename: string,
  map: Map<string, T>,
): Promise<void> {
  const items = Array.from(map.values());
  await saveFile(filename, items);
  getCache().maps[filename] = map as Map<string, unknown>;
}
