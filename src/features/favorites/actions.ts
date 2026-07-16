"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import type { FavoriteContentType } from "@/types/favorite";
import { toggleFavorite as dsToggle } from "@/lib/data-source/favorites";

/** お気に入りトグル。返り値は現在の状態(true=登録済) */
export async function toggleFavoriteAction(
  contentType: FavoriteContentType,
  contentId: string,
): Promise<{ ok: true; favorited: boolean } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  const now = await dsToggle(user.id, contentType, contentId);
  // 関連ページ全部を再取得
  revalidatePath("/favorites");
  revalidatePath("/dashboard");
  const detailPaths: Record<FavoriteContentType, string> = {
    faq: `/knowledge/faqs/${contentId}`,
    script: `/training/scripts/${contentId}`,
    product: `/sales/products/${contentId}`,
    material: `/sales/materials/${contentId}`,
    proposal: `/sales/proposals/${contentId}`,
  };
  revalidatePath(detailPaths[contentType]);
  return { ok: true, favorited: now };
}
