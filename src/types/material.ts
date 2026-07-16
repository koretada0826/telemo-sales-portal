import type { ID, Visibility } from "./common";

/** 提案資料の対応ファイル種別 */
export type FileKind = "pdf" | "pptx" | "docx" | "xlsx" | "image" | "other";

export const FILE_KIND_LABEL: Record<FileKind, string> = {
  pdf: "PDF", pptx: "PowerPoint", docx: "Word", xlsx: "Excel", image: "画像", other: "その他",
};

export type Material = {
  id: ID;
  name: string; // 資料名
  description: string; // 説明
  productId: ID | null; // 対象商品
  targetIndustry: string; // 対象業界
  scene: string; // 利用シーン
  fileName: string; // ファイル名（実データはフェーズ5でStorageへ）
  fileKind: FileKind;
  fileSizeKb: number; // KB数
  fileUrl: string | null; // ダウンロードURL（現状ダミー）
  thumbnailUrl: string | null;
  version: string; // "1.0" 等
  visibility: Visibility;
  tagIds: ID[];
  authorId: ID;
  updaterId: ID;
  createdAt: string;
  updatedAt: string;
};

export type MaterialInput = Omit<Material, "id" | "authorId" | "updaterId" | "createdAt" | "updatedAt">;
