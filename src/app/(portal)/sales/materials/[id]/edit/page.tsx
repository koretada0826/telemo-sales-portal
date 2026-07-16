import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { MaterialForm } from "@/features/materials/components/material-form";
import { getMaterial } from "@/lib/data-source/materials";

type Props = { params: Promise<{ id: string }> };

export default async function EditMaterialPage({ params }: Props) {
  const { id } = await params;
  const m = await getMaterial(id);
  if (!m) notFound();
  return (
    <>
      <PageHeader title="資料情報を編集" />
      <MaterialForm materialId={m.id} defaultValues={{
        name: m.name, description: m.description, productId: m.productId,
        targetIndustry: m.targetIndustry, scene: m.scene,
        fileName: m.fileName, fileKind: m.fileKind, fileSizeKb: m.fileSizeKb,
        fileUrl: m.fileUrl, thumbnailUrl: m.thumbnailUrl, version: m.version,
        visibility: m.visibility, tagIds: m.tagIds,
      }} />
    </>
  );
}
