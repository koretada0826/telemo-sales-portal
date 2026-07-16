import { Check, X, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

// 権限マトリクスの列（権限）
const ROLES = [
  { key: "admin", label: "admin", variant: "success" as const },
  { key: "manager", label: "manager", variant: "mint" as const },
  { key: "member", label: "member", variant: "gray" as const },
  { key: "viewer", label: "viewer", variant: "warning" as const },
];

// 権限マトリクスの行（機能）
const PERMISSIONS: {
  label: string;
  admin: boolean;
  manager: boolean;
  member: boolean;
  viewer: boolean;
  note?: string;
}[] = [
  { label: "コンテンツ閲覧", admin: true, manager: true, member: true, viewer: true },
  { label: "コンテンツ追加", admin: true, manager: true, member: true, viewer: false },
  { label: "コンテンツ編集（自分の）", admin: true, manager: true, member: true, viewer: false },
  { label: "コンテンツ編集（他人の）", admin: true, manager: true, member: false, viewer: false },
  { label: "コンテンツ削除", admin: true, manager: true, member: false, viewer: false, note: "memberは自分の投稿のみ削除可" },
  { label: "コメント投稿", admin: true, manager: true, member: true, viewer: false },
  { label: "コメント削除（他人の）", admin: true, manager: false, member: false, viewer: false },
  { label: "ユーザー管理", admin: true, manager: false, member: false, viewer: false },
  { label: "カテゴリー管理", admin: true, manager: false, member: false, viewer: false },
  { label: "メニュー管理", admin: true, manager: false, member: false, viewer: false },
  { label: "システム設定", admin: true, manager: false, member: false, viewer: false },
];

export default function PermissionsSettingsPage() {
  return (
    <>
      <PageHeader
        title="権限管理"
        description="ロールごとの操作可否を一覧で確認できます。実際の制御はフロントとSupabase RLSの二重で行います。"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-mint" />
            権限マトリクス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 text-left font-semibold text-ink-soft">機能</th>
                  {ROLES.map((r) => (
                    <th key={r.key} className="py-3 text-center">
                      <Badge variant={r.variant}>{r.label}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((row, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="py-3 text-ink">
                      {row.label}
                      {row.note && (
                        <p className="mt-0.5 text-[10px] text-ink-soft">{row.note}</p>
                      )}
                    </td>
                    {ROLES.map((r) => (
                      <td key={r.key} className="text-center">
                        <YesNo yes={row[r.key as "admin" | "manager" | "member" | "viewer"]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 rounded-btn border border-mint-soft bg-mint-softer p-3 text-xs text-mint-dark">
        ★ 表示上の制御に加え、フェーズ5以降でSupabase RLSにより二重に制御します。
        フロントだけの制御では攻撃者が直接APIを叩けば回避可能なため。
      </p>
    </>
  );
}

function YesNo({ yes }: { yes: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full",
        yes ? "bg-mint-softer text-mint-dark" : "bg-line/40 text-ink-soft/50",
      )}
      aria-label={yes ? "可" : "不可"}
    >
      {yes ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
    </span>
  );
}
