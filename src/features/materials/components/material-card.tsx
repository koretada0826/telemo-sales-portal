import Link from "next/link";
import { ArrowRight, FileText, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Attribution } from "@/components/ui/attribution";
import type { Material } from "@/types/material";
import { FILE_KIND_LABEL } from "@/types/material";
import { formatNumber, formatRelative } from "@/lib/utils/format";

export function MaterialCard({ material }: { material: Material }) {
  return (
    <Card className="p-0">
      <div className="p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-mint-softer text-mint-dark">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-ink sm:text-lg">{material.name}</h3>
            <p className="mt-0.5 text-xs text-ink-soft">{material.fileName}</p>
          </div>
          <Badge variant="outline">{FILE_KIND_LABEL[material.fileKind]}</Badge>
        </div>
        <p className="mt-4 text-sm text-ink-soft clamp-2">{material.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
          <span>{formatNumber(material.fileSizeKb)} KB</span>
          <span>v{material.version}</span>
          <Attribution authorId={material.authorId} updaterId={material.updaterId} />
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />更新 {formatRelative(material.updatedAt)}</span>
        </div>
      </div>
      <div className="flex items-center justify-end border-t border-line bg-mint-softer/40 px-6 py-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/sales/materials/${material.id}`}>詳細を見る<ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>
    </Card>
  );
}
