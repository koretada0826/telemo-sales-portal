import { Bell } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// 通知チャネルとON/OFFの見本（実制御はフェーズ5以降）
const CHANNELS = [
  { key: "app", label: "アプリ内通知", desc: "ヘッダーのベルアイコンに未読が表示されます" },
  { key: "email", label: "メール通知", desc: "重要な通知のみメールで送信します" },
  { key: "slack", label: "Slack連携", desc: "任意のSlackチャンネルに通知します" },
];
const EVENTS = [
  { key: "comment", label: "自分の投稿にコメントが付いた" },
  { key: "mention", label: "自分がメンションされた" },
  { key: "new-content", label: "新しいコンテンツが追加された" },
  { key: "updated", label: "投稿が更新された" },
  { key: "reminder-call", label: "次回架電予定日が近づいた" },
  { key: "reminder-meeting", label: "次回商談予定日が近づいた" },
];

export default function NotificationSettingsPage() {
  return (
    <>
      <PageHeader
        title="通知設定"
        description="どの通知をどの経路で受け取るかを設定できます。"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-mint" />
              通知チャネル
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {CHANNELS.map((c) => (
              <label key={c.key} className="flex items-start gap-3 rounded-btn border border-line p-3">
                <input type="checkbox" defaultChecked={c.key === "app"} className="mt-1 h-4 w-4 accent-mint" disabled />
                <div>
                  <p className="text-sm font-medium text-ink">{c.label}</p>
                  <p className="text-xs text-ink-soft">{c.desc}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>通知する出来事</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {EVENTS.map((e) => (
              <label key={e.key} className="flex items-center justify-between rounded-btn border border-line px-3 py-2 text-sm">
                <Label htmlFor={e.key}>{e.label}</Label>
                <input id={e.key} type="checkbox" defaultChecked className="h-4 w-4 accent-mint" disabled />
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-xs text-ink-soft">
        ★ 現在は設定UIのみ。実際の通知制御はSupabase接続後に有効化されます。
      </p>
    </>
  );
}
