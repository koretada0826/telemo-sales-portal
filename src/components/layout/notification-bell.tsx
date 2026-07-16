import Link from "next/link";
import { Bell } from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { countUnreadNotifications } from "@/lib/data-source/notifications";

/**
 * ヘッダーの通知ベル。
 * Server Component として動作し、未読数を取得してバッジ表示。
 * クリックで /notifications へ遷移。
 */
export async function NotificationBell() {
  const user = await getCurrentUser();
  const unread = await countUnreadNotifications(user.id);

  return (
    <Link
      href="/notifications"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-mint-softer"
      aria-label={`通知（未読 ${unread} 件）`}
    >
      <Bell className="h-5 w-5 text-ink" />
      {unread > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
