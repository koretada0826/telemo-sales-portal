import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * JSONファイル永続化の共通ヘルパー。
 *
 * 各data-sourceが Map<string, T> を維持しているのを、
 * data/*.json への読み書きに置き換える。
 *
 * 動作：
 *  1. 初回読み込み時：ファイル存在→JSON読込 / 無ければシードから作成
 *  2. 以降の読取：globalThisにキャッシュ（高速）
 *  3. 書込：ファイル + キャッシュ両方更新
 *
 * ★アトミック書き込み：一時ファイルに書いてから rename
 *   → 書き込み中にプロセスが落ちてもデータが壊れない
 *
 * ★セキュリティ：data/*.json は .gitignore 済み（GitHub漏洩防止）
 */

const DATA_DIR = path.resolve(process.cwd(), "data");

type Cache = { maps: Record<string, Map<string, unknown>> };
const g = globalThis as unknown as { __dsCache?: Cache };

function getCache(): Cache {
  if (!g.__dsCache) g.__dsCache = { maps: {} };
  return g.__dsCache;
}

async function saveMapImpl<T>(fullPath: string, map: Map<string, T>): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = fullPath + ".tmp";
  const items = Array.from(map.values());
  await fs.writeFile(tmp, JSON.stringify(items, null, 2), "utf-8");
  await fs.rename(tmp, fullPath);
}

/**
 * ファイル読み込み or シードから初期化。以後はメモリキャッシュ。
 * T は { id: string } を含む型を想定。
 */
export async function loadMap<T extends { id: string }>(
  filename: string,
  getSeeds: () => T[] | Promise<T[]>,
): Promise<Map<string, T>> {
  const cache = getCache();
  if (cache.maps[filename]) return cache.maps[filename] as Map<string, T>;

  const fullPath = path.join(DATA_DIR, filename);
  const map = new Map<string, T>();

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(fullPath);
    const raw = await fs.readFile(fullPath, "utf-8");
    const items = JSON.parse(raw) as T[];
    for (const item of items) map.set(item.id, item);
  } catch {
    // ファイル無し → シードで初期化 + ファイル作成
    const seeds = await getSeeds();
    for (const item of seeds) map.set(item.id, item);
    await saveMapImpl(fullPath, map);
  }

  cache.maps[filename] = map as Map<string, unknown>;
  return map;
}

/** ファイル書き込み + キャッシュ更新（Mapは同じ参照を使い続けて良い） */
export async function saveMap<T extends { id: string }>(
  filename: string,
  map: Map<string, T>,
): Promise<void> {
  const fullPath = path.join(DATA_DIR, filename);
  await saveMapImpl(fullPath, map);
  getCache().maps[filename] = map as Map<string, unknown>;
}
