import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProposalForm } from "@/features/proposals/components/proposal-form";
import { getProposal } from "@/lib/data-source/proposals";

type Props = { params: Promise<{ id: string }> };

export default async function EditProposalPage({ params }: Props) {
  const { id } = await params;
  const p = await getProposal(id);
  if (!p) notFound();
  return (
    <>
      <PageHeader title="提案構成を編集" />
      <ProposalForm proposalId={p.id} defaultValues={{
        name: p.name, productId: p.productId,
        targetIndustry: p.targetIndustry, targetCustomer: p.targetCustomer,
        purpose: p.purpose, currentState: p.currentState, issue: p.issue,
        cause: p.cause, solution: p.solution, benefit: p.benefit,
        flow: p.flow, pricing: p.pricing, closing: p.closing, supplement: p.supplement,
        extraSections: p.extraSections, tagIds: p.tagIds, visibility: p.visibility,
      }} />
    </>
  );
}
