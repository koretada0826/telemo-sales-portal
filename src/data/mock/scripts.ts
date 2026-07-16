import type { Script } from "@/types/script";

export const SCRIPT_SEEDS: Script[] = [
  {
    id: "sc-example",
    name: "【例】受付突破の基本トーク",
    productId: null,
    industry: "全業種",
    scene: "reception",
    opening:
      "お世話になっております、株式会社◯◯の△△と申します。\nご担当者様にお繋ぎいただけますでしょうか。",
    hearing: "・現状の課題感\n・利用中ツールの有無",
    problemRaise:
      "多くの企業様で、同じような課題を伺っております。",
    productPitch:
      "弊社サービスは、その課題を解決するために作られました。",
    closing: "15分ほどでご説明できるお時間をいただけますでしょうか。",
    objectionHandling:
      "「今は間に合っている」→ 承知しました。将来のご検討材料として15分だけお時間ください。",
    notes: "架電時間帯：10:00〜11:30 / 14:00〜16:30",
    tagIds: [],
    visibility: "public",
    authorId: "usr-admin",
    updaterId: "usr-admin",
    createdAt: "2026-07-16T00:00:00Z",
    updatedAt: "2026-07-16T00:00:00Z",
  },
];
