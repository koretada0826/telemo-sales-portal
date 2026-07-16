import { PageHeader } from "@/components/layout/page-header";
import { FaqForm } from "@/features/faqs/components/faq-form";

/**
 * FAQ新規追加ページ。
 * 中身は共通フォームコンポーネント（新規/編集で共用）。
 */
export default function NewFaqPage() {
  return (
    <>
      <PageHeader
        title="新規FAQを追加"
        description="質問と回答を入力してください。公開状態は下書きにも設定できます。"
      />
      <FaqForm />
    </>
  );
}
