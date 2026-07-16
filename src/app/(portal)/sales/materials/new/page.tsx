import { PageHeader } from "@/components/layout/page-header";
import { MaterialForm } from "@/features/materials/components/material-form";

export default function NewMaterialPage() {
  return (
    <>
      <PageHeader title="新規資料を追加" description="ファイル情報を登録してください。（実ファイルはフェーズ5で対応）" />
      <MaterialForm />
    </>
  );
}
