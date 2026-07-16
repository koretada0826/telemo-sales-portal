"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { markAsRead, markAllAsRead } from "@/lib/data-source/notifications";

export async function markNotificationReadAction(id: string): Promise<void> {
  await markAsRead(id);
  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}

export async function markAllNotificationsReadAction(): Promise<void> {
  const user = await getCurrentUser();
  await markAllAsRead(user.id);
  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}
