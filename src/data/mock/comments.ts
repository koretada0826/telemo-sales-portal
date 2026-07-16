import type { Comment } from "@/types/comment";

/** コメントのシードデータ */
export const COMMENT_SEEDS: Comment[] = [
  {
    id: "cmt-001",
    contentType: "faq",
    contentId: "faq-001",
    parentId: null,
    body: "この件、営業チームでも同じ質問が多いので上位プラン変更のフローを図解しておくと更に良さそうです。",
    authorId: "user-003",
    mentionUserIds: [],
    createdAt: "2026-07-12T10:00:00Z",
    updatedAt: "2026-07-12T10:00:00Z",
  },
  {
    id: "cmt-002",
    contentType: "faq",
    contentId: "faq-001",
    parentId: "cmt-001",
    body: "承知しました。次のミーティングで図解案作ります！",
    authorId: "user-002",
    mentionUserIds: ["user-003"],
    createdAt: "2026-07-12T14:30:00Z",
    updatedAt: "2026-07-12T14:30:00Z",
  },
  {
    id: "cmt-003",
    contentType: "faq",
    contentId: "faq-002",
    parentId: null,
    body: "24時間対応の日本語サポート、これ強調ポイントですね。次回商談で使わせてもらいます。",
    authorId: "user-004",
    mentionUserIds: [],
    createdAt: "2026-07-13T09:15:00Z",
    updatedAt: "2026-07-13T09:15:00Z",
  },
];
