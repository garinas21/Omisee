import ProductsClient from "@/component/ProductPage/ProductsClient";

export const dynamic = "force-dynamic";

export default function Page({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  return <ProductsClient initialQuery={q} />;
}
