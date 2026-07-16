import Link from "next/link";
import { ArrowRight, MessageSquareText, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Attribution } from "@/components/ui/attribution";
import type { Script } from "@/types/script";
import { SCRIPT_SCENE_LABEL } from "@/types/script";
import { formatRelative, truncate } from "@/lib/utils/format";

type Props = { script: Script };

export function ScriptCard({ script }: Props) {
  return (
    <Card className="p-0">
      <div className="p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint-soft text-mint-dark">
            <MessageSquareText className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-ink sm:text-lg">
              {script.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="mint">{SCRIPT_SCENE_LABEL[script.scene]}</Badge>
              {script.industry && <Badge variant="gray">{script.industry}</Badge>}
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-ink-soft clamp-2">
          {truncate(script.opening || script.productPitch, 120)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Attribution authorId={script.authorId} updaterId={script.updaterId} />
          <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
            <Calendar className="h-3.5 w-3.5" />
            更新 {formatRelative(script.updatedAt)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end border-t border-line bg-mint-softer/40 px-6 py-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/training/scripts/${script.id}`}>
            詳細を見る
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
