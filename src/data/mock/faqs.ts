import type { Faq } from "@/types/faq";

/**
 * FAQのシード（初期状態）：使い方サンプルとして1件だけ。
 * データファイル未生成時にのみ登録される。
 */
export const FAQ_SEEDS: Faq[] = [
  {
    id: "faq-example",
    question: "【例】このFAQ機能はどう使うのですか？",
    answer:
      "右上の「新規FAQを追加」から質問と回答をセットで投稿できます。\n回答が分からない場合は「質問を投稿」ボタンで質問だけ投稿し、他のメンバーに回答してもらえます。",
    categoryId: "cat-support",
    tagIds: ["tag-faq"],
    visibility: "public",
    viewableBy: "everyone",
    attachmentIds: [],
    relatedFaqIds: [],
    authorId: "usr-admin",
    updaterId: "usr-admin",
    viewCount: 0,
    favoriteCount: 0,
    createdAt: "2026-07-16T00:00:00Z",
    updatedAt: "2026-07-16T00:00:00Z",
  },
];
