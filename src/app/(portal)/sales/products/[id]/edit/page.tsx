import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ProductForm } from "@/features/products/components/product-form";
import { getProduct } from "@/lib/data-source/products";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();
  return (
    <>
      <PageHeader title="商品情報を編集" />
      <ProductForm productId={p.id} defaultValues={{
        productName: p.productName, serviceName: p.serviceName, overview: p.overview,
        targetCustomer: p.targetCustomer, targetIndustry: p.targetIndustry,
        customerIssue: p.customerIssue, value: p.value, features: p.features,
        strengths: p.strengths, pricing: p.pricing, implementationFlow: p.implementationFlow,
        competitors: p.competitors, competitiveAdvantage: p.competitiveAdvantage,
        faq: p.faq, notes: p.notes,
        relatedMaterialIds: p.relatedMaterialIds, tagIds: p.tagIds, visibility: p.visibility,
      }} />
    </>
  );
}
