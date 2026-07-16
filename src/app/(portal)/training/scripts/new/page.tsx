import { PageHeader } from "@/components/layout/page-header";
import { ScriptForm } from "@/features/scripts/components/script-form";

export default function NewScriptPage() {
  return (
    <>
      <PageHeader title="新規スクリプトを追加" description="利用シーンとトーク内容を入力してください。" />
      <ScriptForm />
    </>
  );
}
