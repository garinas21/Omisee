"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { type Product } from "@/db/model/productModel";
import { formatIDR } from "@/utils/formater";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";

type ApiResponse<T> = { statusCode: number; data?: T; error?: string };

type WishlistItem = {
  _id: string;
  userId: string;
  productId: string;
  product?: Product;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  console.log(items, "cek11");

  const fetchWishlist = async (signal?: AbortSignal) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist?include=products`,
        {
          signal,
          cache: "no-store",
        }
      );
      console.log(res);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${text ? ` - ${text}` : ""}`);
      }
      const json = (await res.json()) as ApiResponse<WishlistItem[]>;
      setItems(json.data || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Gagal memuat wishlist.");
      toast.error(
        err instanceof Error ? err.message : "Gagal memuat wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctrl = new AbortController();
    fetchWishlist(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    const prev = items;
    setItems((list) => list.filter((it) => it.productId !== productId));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (error) {
      console.log(error);
      setItems(prev);
      toast.error("Gagal menghapus dari wishlist.");
    } finally {
      setRemovingId(null);
    }
  };

  const productCards = items
    .map((it) => it.product)
    .filter(Boolean) as Product[];

  return (
    <div className="min-h-screen w-screen bg-neutral-50">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto w-full max-w-7xl px-6 pt-6 text-sm text-gray-500"
      >
        <div className="flex items-center gap-2 ml-5 md:ml-50">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>›</span>
          <span className="text-gray-800">Wishlist</span>
        </div>
      </nav>

      <section className="mx-auto mt-4 w-full max-w-7xl px-6 pb-12">
        <header className="mb-4 flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <h1 className="text-lg font-semibold text-neutral-900">
            Wishlist Kamu
          </h1>
          <p className="text-sm text-neutral-600">
            {loading ? "Memuat…" : `Total ${productCards.length} produk`}
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-600">
            Memuat wishlist…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">Terjadi kesalahan: {error}</p>
            <button
              onClick={() => fetchWishlist()}
              className="mt-3 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && productCards.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center">
            <p className="text-sm text-neutral-600">
              Wishlist kamu masih kosong.
            </p>
            <Link
              href="/products"
              className="mt-3 inline-block rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
            >
              Jelajahi Produk
            </Link>
          </div>
        )}

        {!loading && !error && productCards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((it) => {
              const p = it.product;
              if (!p) return null;

              const tag = p.tags?.[0] ?? "uncategorized";
              const productId = it.productId;

              return (
                <article
                  key={`${productId}-${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Link href={`/products/${p.slug}`} className="relative block">
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
                      <Image
                        src={p.thumbnail}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className="text-xs text-gray-500">{tag}</p>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="line-clamp-2 text-base font-semibold leading-snug text-neutral-900">
                        {p.name}
                      </h3>
                    </Link>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                      <p className="text-sm font-light text-orange-600">
                        {formatIDR(p.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemove(productId)}
                        disabled={removingId === productId}
                        className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                        aria-label="Remove from wishlist"
                        title="Hapus dari wishlist"
                      >
                        <FaTrash className="h-4 w-4" />
                        {removingId === productId ? "Menghapus…" : "Hapus"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={2}
      />
    </div>
  );
}
