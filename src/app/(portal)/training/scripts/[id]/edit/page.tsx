import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ScriptForm } from "@/features/scripts/components/script-form";
import { getScript } from "@/lib/data-source/scripts";

type Props = { params: Promise<{ id: string }> };

export default async function EditScriptPage({ params }: Props) {
  const { id } = await params;
  const s = await getScript(id);
  if (!s) notFound();
  return (
    <>
      <PageHeader title="スクリプトを編集" />
      <ScriptForm scriptId={s.id} defaultValues={{
        name: s.name, productId: s.productId, industry: s.industry, scene: s.scene,
        opening: s.opening, hearing: s.hearing, problemRaise: s.problemRaise,
        productPitch: s.productPitch, closing: s.closing, objectionHandling: s.objectionHandling,
        notes: s.notes, tagIds: s.tagIds, visibility: s.visibility,
      }} />
    </>
  );
}
