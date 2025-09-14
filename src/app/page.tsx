import Link from "next/link";
import { formatIDR } from "@/utils/formater";
import type { Product } from "@/db/model/productModel";
import HeroSlider from "@/component/HomePage/heroSlider";
import MainLayout from "@/component/MainLayout";
import Image from "next/image";

async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product`,
    {
      cache: "no-store",
    }
  );
  if (!response.ok) throw new Error("Failed to load product");

  const json = await response.json();
  const products = json.data as Product[];

  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
}

export default async function Home() {
  const products = await getProducts();

  return (
    <MainLayout>
      <div className="min-h-screen w-screen bg-neutral-50">
        <HeroSlider />

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-900">
              Daftar Produk
            </h1>
            <Link
              href="/products"
              className="text-sm font-medium text-orange-600 hover:text-orange-500"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {products.map((product) => (
              <Link
                href={`/products/${product.slug}`}
                key={product.slug}
                className="group flex h-72 flex-col overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
              >
                <div className="relative h-2/3 w-full overflow-hidden">
                  <Image
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    src={product.thumbnail}
                    width={40}
                    height={40}
                    alt={product.name}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-3">
                  <h2 className="line-clamp-2 text-sm font-medium text-neutral-700">
                    {product.name}
                  </h2>
                  <p className="text-base font-bold text-orange-600">
                    {formatIDR(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
