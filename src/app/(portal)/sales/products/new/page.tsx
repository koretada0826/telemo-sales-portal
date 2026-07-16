import { PageHeader } from "@/components/layout/page-header";
import { ProductForm } from "@/features/products/components/product-form";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="新規商品を追加" description="商品情報を項目別に入力してください。" />
      <ProductForm />
    </>
  );
}
