import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { FaqForm } from "@/features/faqs/components/faq-form";
import { getFaq } from "@/lib/data-source/faqs";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * FAQ編集ページ。
 * URLの :id を使って既存FAQを取得し、初期値としてフォームに渡す。
 */
export default async function EditFaqPage({ params }: Props) {
  const { id } = await params;
  const faq = await getFaq(id);
  if (!faq) notFound();

  return (
    <>
      <PageHeader
        title="FAQを編集"
        description="質問・回答・カテゴリー・公開状態を編集できます。"
      />
      <FaqForm
        faqId={faq.id}
        defaultValues={{
          question: faq.question,
          answer: faq.answer,
          categoryId: faq.categoryId,
          tagIds: faq.tagIds,
          visibility: faq.visibility,
          viewableBy: faq.viewableBy,
          relatedFaqIds: faq.relatedFaqIds,
        }}
      />
    </>
  );
}
