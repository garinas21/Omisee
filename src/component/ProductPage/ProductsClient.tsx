"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { type Product } from "@/db/model/productModel";
import { formatIDR } from "@/utils/formater";
import ProductLoading from "@/component/ProductPage/LoadingProductPage";
import ProductError from "@/component/ProductPage/ErrorProductPage";
import {
  computeAvailableTags,
  getVisibleProducts,
  SortKey,
  TAG_UNCATEGORIZED,
} from "@/app/products/action";
type ApiResponse<T> = { data: T };
type WishlistItem = { productId: string };

function getProductId(p: Product): string | undefined {
  return (
    (p as unknown as { _id?: string; id?: string })._id ??
    (p as unknown as { _id?: string; id?: string }).id
  );
}

const INITIAL_LIMIT = 16;
const PAGE_SIZE = 12;

export default function ProductsClient({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const q = (initialQuery || "").trim();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAllTags, setShowAllTags] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("default");

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);

  const fetchProducts = async (signal?: AbortSignal) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/product`,
        { signal, cache: "no-store" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as ApiResponse<Product[]>;
      if (!signal?.aborted) setProducts(json.data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "There is an error.";
      setError(msg);
      toast.error(msg);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const fetchWishlist = async (signal?: AbortSignal) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist`,
        { signal, cache: "no-store" }
      );
      if (!res.ok) return;
      const json = (await res.json()) as ApiResponse<WishlistItem[]>;
      const ids = new Set(json.data?.map((w) => w.productId) || []);
      if (!signal?.aborted) setWishlistIds(ids);
    } catch {}
  };

  useEffect(() => {
    const ctrl = new AbortController();
    fetchProducts(ctrl.signal);
    fetchWishlist(ctrl.signal);
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    setVisibleProducts(getVisibleProducts(products, selectedTag, sortKey, q));
  }, [products, selectedTag, sortKey, q]);

  useEffect(() => {
    setVisibleCount(INITIAL_LIMIT);
  }, [selectedTag, sortKey, q, products]);

  const availableTags = computeAvailableTags(products);
  const tagsToShow = showAllTags ? availableTags : availableTags.slice(0, 5);

  const handleReset = () => {
    setSelectedTag(null);
    setSortKey("default");
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!productId || busy[productId]) return;

    const wasWished = wishlistIds.has(productId);
    const prev = new Set(wishlistIds);

    setBusy((m) => ({ ...m, [productId]: true }));
    setWishlistIds((cur) => {
      const next = new Set(cur);
      if (wasWished) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      const res = await fetch(
        wasWished
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist/${productId}`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist`,
        wasWished
          ? { method: "DELETE" }
          : {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId }),
            }
      );

      if (res.status === 401) {
        const redirectBack = `${window.location.pathname}${window.location.search}`;
        window.location.href = `/login?error=unauthorized&redirectTo=${encodeURIComponent(
          redirectBack
        )}`;
        return;
      }

      if (!res.ok) {
        setWishlistIds(prev);
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Gagal menyimpan perubahan wishlist.");
      }
    } catch {
      setWishlistIds(prev);
      toast.error("Aksi wishlist gagal. Coba lagi.");
    } finally {
      setBusy((m) => ({ ...m, [productId]: false }));
    }
  };

  const showing = visibleProducts.slice(0, visibleCount);
  const hasMore = showing.length < visibleProducts.length;
  const loadMore = () => setVisibleCount((c) => c + PAGE_SIZE);

  return (
    <div className="min-h-screen w-screen bg-neutral-50">
      <nav
        aria-label="Breadcrumb"
        className="mx-auto w-full max-w-7xl px-6 pt-6 text-sm text-gray-500"
      >
        <div className="ml-5 md:ml-50 flex items-center gap-2">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span aria-hidden>&gt;</span>
          <span className="text-gray-800">Products</span>
        </div>
      </nav>

      <section className="mx-auto mt-4 grid w-full max-w-7xl grid-cols-1 gap-6 px-6 pb-12 md:grid-cols-12">
        <aside className="md:col-span-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b-2 border-b-neutral-200 py-5">
            <h2 className="text-base font-semibold text-neutral-900">
              Filters
            </h2>
            <button
              className="text-xs font-medium text-orange-700 hover:text-orange-600"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700">Tag</p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs transition text-left",
                  selectedTag === null
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
                ].join(" ")}
              >
                Semua{" "}
                <span className="ml-1 text-neutral-400">
                  ({products.length})
                </span>
              </button>

              {tagsToShow.map(([tag, count]) => {
                const active = selectedTag?.toLowerCase() === tag;
                const label =
                  tag === TAG_UNCATEGORIZED
                    ? "uncategorized"
                    : tag.replace(/\b\w/g, (m) => m.toUpperCase());
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={[
                      "rounded-full border px-3 py-1.5 text-xs transition text-left",
                      active
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
                    ].join(" ")}
                  >
                    {label}{" "}
                    <span className="ml-1 text-neutral-400">({count})</span>
                  </button>
                );
              })}
            </div>

            {availableTags.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllTags((s) => !s)}
                className="mt-3 text-xs font-medium text-orange-600 hover:underline"
              >
                {showAllTags ? "Tampilkan Sedikit" : "Tampilkan Lainnya"}
              </button>
            )}
          </div>
        </aside>

        <main className="md:col-span-9">
          <div className="mb-4 flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
            <p className="text-sm text-neutral-600">
              Menampilkan{" "}
              <span className="font-medium text-neutral-800">
                {loading ? 0 : Math.min(showing.length, visibleProducts.length)}
              </span>{" "}
              dari{" "}
              <span className="font-medium text-neutral-800">
                {visibleProducts.length}
              </span>{" "}
              produk
              {selectedTag ? (
                <>
                  {" "}
                  untuk tag{" "}
                  <span className="font-medium">
                    {selectedTag === TAG_UNCATEGORIZED
                      ? "uncategorized"
                      : selectedTag.replace(/\b\w/g, (m) => m.toUpperCase())}
                  </span>
                </>
              ) : null}
              {q && (
                <>
                  {" "}
                  untuk pencarian <span className="font-medium">“{q}”</span>
                </>
              )}
            </p>

            {q ? (
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Hapus Pencarian
              </Link>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm text-neutral-600" htmlFor="sort">
                Urutkan:
              </label>
              <select
                id="sort"
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
              >
                <option value="default">Default</option>
                <option value="price-asc">Harga: Rendah → Tinggi</option>
                <option value="price-desc">Harga: Tinggi → Rendah</option>
              </select>
            </div>
          </div>

          {loading ? (
            <ProductLoading />
          ) : error ? (
            <ProductError message={error} onRetry={() => fetchProducts()} />
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-600">
              {q ? (
                <>
                  Tidak ada produk yang cocok dengan pencarian{" "}
                  <span className="font-medium">“{q}”</span>.
                </>
              ) : (
                "Tidak ada produk untuk filter ini."
              )}
            </div>
          ) : (
            <InfiniteScroll
              dataLength={showing.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className="mt-6 text-center text-sm text-neutral-500">
                  Memuat…
                </div>
              }
              endMessage={
                <div className="mt-6 text-center text-sm text-neutral-500">
                  Semua produk sudah ditampilkan.
                </div>
              }
              style={{ overflow: "visible" }}
              scrollThreshold={0.9}
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {showing.map((p) => {
                  const tag = p.tags?.[0]?.trim() || TAG_UNCATEGORIZED;
                  const productId = getProductId(p);
                  const wished = !!(productId && wishlistIds.has(productId));
                  const waiting = !!(productId && busy[productId]);

                  return (
                    <article
                      key={p.slug}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Link
                        href={`/products/${p.slug}`}
                        className="relative block"
                      >
                        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
                          <Image
                            src={p.thumbnail}
                            alt={p.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                            priority={false}
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
                            disabled={!productId || waiting}
                            onClick={() => {
                              if (!productId || waiting) return;
                              handleToggleWishlist(productId);
                            }}
                            aria-pressed={wished}
                            aria-label={
                              wished
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                            title={
                              wished
                                ? "Hapus dari wishlist"
                                : "Tambah ke wishlist"
                            }
                            className={[
                              "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition",
                              wished
                                ? "border border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100"
                                : "border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50",
                              waiting ? "opacity-60" : "",
                            ].join(" ")}
                          >
                            {wished ? (
                              <FaHeart
                                className="h-4 w-4 text-orange-600"
                                aria-hidden
                              />
                            ) : (
                              <FaRegHeart
                                className="h-4 w-4 text-neutral-400"
                                aria-hidden
                              />
                            )}
                            <span className="sr-only">
                              {wished
                                ? "Remove from wishlist"
                                : "Add to wishlist"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </InfiniteScroll>
          )}
        </main>
      </section>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
