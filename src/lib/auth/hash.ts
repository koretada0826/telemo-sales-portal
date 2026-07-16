import "server-only";
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * パスワードハッシュ化ヘルパー（Node組込 crypto.scrypt 使用）。
 *
 * scryptはメモリ使用量が大きい一方向ハッシュ関数で、
 * GPU/ASICによる総当り攻撃への耐性が高い（bcryptと同等以上）。
 * 外部パッケージ不要。
 *
 * 保存形式：`scrypt$N=16384,r=8,p=1$<salt(base64)>$<hash(base64)>`
 * → 将来パラメータを変更しても、既存ハッシュが壊れないよう自己記述型。
 *
 * ★セキュリティ鉄則：
 *  - パスワードを平文で保存してはいけない
 *  - salt をパスワードごとにランダム生成（レインボーテーブル対策）
 *  - 照合時は timingSafeEqual で定数時間比較（タイミング攻撃対策）
 */

// scrypt にオプションを渡すためのラッパー（型が煩雑なので手動Promise化）
function scryptWithOptions(
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });
}


// scrypt パラメータ（OWASP推奨：N>=2^14, r=8, p=1、keylen=64）
const N = 16384;
const R = 8;
const P = 1;
const KEY_LEN = 64;
const SALT_LEN = 16;

/** 平文パスワード → 保存用ハッシュ文字列 */
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const key = await scryptWithOptions(plain, salt, KEY_LEN, { N, r: R, p: P });
  return `scrypt$N=${N},r=${R},p=${P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

/** 入力パスワードとハッシュ文字列を照合 */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "scrypt") return false;

  const params = Object.fromEntries(
    parts[1].split(",").map((kv) => {
      const [k, v] = kv.split("=");
      return [k, Number(v)];
    }),
  );
  const n = params.N ?? N;
  const r = params.r ?? R;
  const p = params.p ?? P;

  const salt = Buffer.from(parts[2], "base64");
  const expected = Buffer.from(parts[3], "base64");
  const actual = await scryptWithOptions(plain, salt, expected.length, { N: n, r, p });

  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
