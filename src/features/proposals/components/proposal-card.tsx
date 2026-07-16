import Link from "next/link";
import { ArrowRight, LayoutList, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Attribution } from "@/components/ui/attribution";
import type { Proposal } from "@/types/proposal";
import { formatRelative, truncate } from "@/lib/utils/format";

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const sectionCount = 12 + proposal.extraSections.length;
  return (
    <Card className="p-0">
      <div className="p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint-soft text-mint-dark">
            <LayoutList className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-ink sm:text-lg">{proposal.name}</h3>
            <p className="mt-1 text-sm text-ink-soft">{proposal.targetCustomer}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-soft clamp-2">{truncate(proposal.purpose, 140)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {proposal.targetIndustry && <Badge variant="mint">{proposal.targetIndustry}</Badge>}
          <Badge variant="gray">{sectionCount}セクション</Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Attribution authorId={proposal.authorId} updaterId={proposal.updaterId} />
          <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
            <Calendar className="h-3.5 w-3.5" />更新 {formatRelative(proposal.updatedAt)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-end border-t border-line bg-mint-softer/40 px-6 py-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/sales/proposals/${proposal.id}`}>詳細を見る<ArrowRight className="h-3.5 w-3.5" /></Link>
        </Button>
      </div>
    </Card>
  );
}
