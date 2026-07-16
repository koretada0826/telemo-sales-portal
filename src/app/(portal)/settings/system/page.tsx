import { Cog, Database, Palette, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function SystemSettingsPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader
        title="システム設定"
        description="ポータル全体の運用に関する設定です。管理者のみ変更できます。"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="h-4 w-4 text-mint" />
              基本
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingRow label="組織名">株式会社TELEMOサンプル</SettingRow>
            <SettingRow label="タイムゾーン">Asia/Tokyo (UTC+9)</SettingRow>
            <SettingRow label="言語">日本語</SettingRow>
            <SettingRow label="1ページの表示件数">10件</SettingRow>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-4 w-4 text-mint" />
              データソース
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingRow label="現在の接続先">
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning">Mock (メモリ)</span>
            </SettingRow>
            <SettingRow label="将来の接続先">Supabase PostgreSQL</SettingRow>
            <SettingRow label="Storage">Supabase Storage（フェーズ5）</SettingRow>
            <p className="text-xs text-ink-soft">
              モック↔Supabaseの切り替えは lib/data-source/ 内の関数を差し替えるだけで済む設計です。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-mint" />
              表示
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="theme">テーマ</Label>
              <Select id="theme" defaultValue="mint" disabled>
                <option value="mint">ミント（デフォルト）</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="density">情報密度</Label>
              <Select id="density" defaultValue="normal" disabled>
                <option value="compact">コンパクト</option>
                <option value="normal">標準</option>
                <option value="comfortable">ゆったり</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-mint" />
              セキュリティ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <SettingRow label="ログイン方式">未設定（フェーズ5）</SettingRow>
            <SettingRow label="多要素認証">未対応</SettingRow>
            <SettingRow label="セッションタイムアウト">未設定</SettingRow>
            <SettingRow label="監査ログ">全操作を記録（実装予定）</SettingRow>
            <SettingRow label="RLS（DBレベル権限制御）">Supabase切替後に有効化</SettingRow>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className="text-right text-ink">{children}</span>
    </div>
  );
}
