import type { Proposal } from "@/types/proposal";

export const PROPOSAL_SEEDS: Proposal[] = [
  {
    id: "prp-example",
    name: "【例】新規開拓 標準構成",
    productId: "prd-example",
    targetIndustry: "全業種",
    targetCustomer: "従業員100〜500名の営業組織",
    purpose: "貴社の営業組織における属人化課題を解消し、成約率を向上させる。",
    currentState: "・営業ノウハウが個人に分散\n・KPIレポートが手動集計",
    issue: "成約要因が定性的にしか把握できていない",
    cause: "ナレッジ蓄積の仕組み不在",
    solution: "サービス導入により、通話録音→自動要約→ナレッジ化を実現",
    benefit: "・新人立ち上げ期間の短縮\n・成約率の向上",
    flow: "①キックオフ ②データ移行 ③トレーニング ④本番運用",
    pricing: "月額15万円 + 導入支援 一式30万円",
    closing: "無料トライアル14日 → 導入決定のステップでいかがでしょうか。",
    supplement: "既存CRM(Salesforce/HubSpot)との連携は追加コスト無し。",
    extraSections: [],
    tagIds: [],
    visibility: "public",
    authorId: "usr-admin",
    updaterId: "usr-admin",
    createdAt: "2026-07-16T00:00:00Z",
    updatedAt: "2026-07-16T00:00:00Z",
  },
];
