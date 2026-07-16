import { Tags, Plus, Hash } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FAQ_CATEGORIES } from "@/data/mock/categories";
import { TAGS } from "@/data/mock/tags";

export default function CategoriesSettingsPage() {
  return (
    <>
      <PageHeader
        title="カテゴリー管理"
        description="FAQ・スクリプト等で使うカテゴリーとタグを管理します。"
        action={
          <Button disabled title="編集は今後実装予定">
            <Plus className="h-4 w-4" />新規カテゴリー
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-mint" />FAQカテゴリー（{FAQ_CATEGORIES.length}件）
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {FAQ_CATEGORIES.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-btn border border-line px-3 py-2">
                <span className="text-sm text-ink">{c.name}</span>
                <Badge variant="mint">FAQ</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-mint" />共通タグ（{TAGS.length}件）
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <Badge key={t.id} variant="gray">#{t.name}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-xs text-ink-soft">
        ★ カテゴリー・タグの追加・編集はフェーズ5で有効化します。
      </p>
    </>
  );
}
