import { PageHeader } from "@/components/layout/page-header";
import { ProposalForm } from "@/features/proposals/components/proposal-form";

export default function NewProposalPage() {
  return (
    <>
      <PageHeader title="新規提案構成を追加" description="12の標準セクション + 追加セクションで構成できます。" />
      <ProposalForm />
    </>
  );
}
