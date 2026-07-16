# TELEMO AI SALES AUTOMATION

営業会社向けの社内ナレッジ・営業支援ポータル。
Next.js 16 + TypeScript + Tailwind CSS で構築し、
JSONファイル永続化 + 自前ログイン（Node標準 scrypt + HMAC署名Cookie）で動作します。

## 主な機能

- ログイン / 新規登録（自前実装、Supabase不要）
- ナレッジ集(FAQ)：質問だけ投稿 / 未回答に答える Q&A スタイル
- トークスクリプト集（セクション別コピー機能付き）
- 商談ログ（ステータス管理）
- 商品理解（タブ切替）
- 提案資料 / 提案構成（セクション並び替え + 複製）
- コメント（返信・編集・削除）
- お気に入り / 通知 / 横断検索
- 動的メニュー管理（管理者のみ）
- 5種類の権限ロール（admin / manager / member / viewer）

## セットアップ

```bash
# 依存インストール
npm install

# 環境変数を用意（サンプルからコピー）
cp .env.local.example .env.local
# SESSION_SECRET を 32 文字以上のランダム文字列に設定
# 生成コマンド：openssl rand -hex 32

# 開発サーバー起動
npm run dev
```

初回アクセス時、`data/users.json` に以下のデモアカウントが自動作成されます
（**パスワード共通：`telemo2026`**、本番運用時は変更してください）：

| メール | 氏名 | 権限 |
|---|---|---|
| yamada@example.com | 山田 太郎 | admin |
| sato@example.com | 佐藤 花子 | manager |
| suzuki@example.com | 鈴木 一郎 | member |
| tanaka@example.com | 田中 美咲 | member |
| ito@example.com | 伊藤 健 | viewer |

## Vercelデプロイ

1. GitHub連携で Vercel プロジェクトを作成
2. 環境変数に `SESSION_SECRET` を設定（ローカルとは別のランダム文字列を推奨）
3. デプロイ

**注意**：Vercelは書き込み可能なファイルシステムを持たないため、
`data/*.json` への保存はVercel環境では動作しません。
本番運用には Supabase / Prisma+PostgreSQL 等への切替が必要です。

## データの保存場所

すべて `data/` ディレクトリ配下の JSON ファイルで永続化されます
（`.gitignore` 済み。パスワードハッシュを含むため絶対に公開しないこと）。

| ファイル | 内容 |
|---|---|
| `users.json` | ユーザー（scrypt でハッシュ化されたパスワード） |
| `faqs.json` | FAQ・質問・回答 |
| `comments.json` | 全コンテンツへのコメント |
| `favorites.json` | お気に入り |
| `notifications.json` | 通知 |
| `scripts.json` | トークスクリプト |
| `meetings.json` | 商談ログ |
| `products.json` | 商品情報 |
| `materials.json` | 提案資料 |
| `proposals.json` | 提案構成 |
| `custom-menus.json` | 動的メニュー |

## セキュリティ

- パスワードは Node標準 `crypto.scrypt` で一方向ハッシュ化（OWASP推奨パラメータ）
- セッションは HMAC-SHA256 署名付きCookie（HttpOnly + SameSite=Lax）
- Zod検証をフロント + サーバー両方で実施
- 全 Server Action 冒頭で権限チェック
- 電話番号は一覧で自動マスク

## 技術構成

- **フロントエンド**：Next.js 16 App Router / React 18 / TypeScript / Tailwind CSS
- **UI**：Radix UI / lucide-react / sonner
- **フォーム**：React Hook Form + Zod
- **認証**：自前実装（Node標準 crypto）
- **永続化**：JSONファイル（サーバー再起動でも残存）

## ライセンス

社内利用のみ。
