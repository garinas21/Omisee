"use client";

import ErrorDetailPage from "@/component/DetailProductPage/ErrorDetailProduct";
import LoadingDetailPage from "@/component/DetailProductPage/LoadingDetailProduct";
import Link from "next/link";
import { type Product } from "@/db/model/productModel";
import { formatDateID, formatIDR } from "@/utils/formater";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";

type ApiResponse<T> = { statusCode: number; data?: T; error?: string };
type WishlistItem = { productId: string };

const fetchDataBySlug = async (slug: string, signal?: AbortSignal) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${slug}`,
    {
      signal,
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { data } = (await res.json()) as ApiResponse<Product>;
  return data as Product;
};

function getProductId(p: (Product & { _id?: string; id?: string }) | null) {
  return p?._id || p?.id;
}

export default function DetailProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(
    () => (Array.isArray(params?.slug) ? params.slug[0] : params?.slug),
    [params?.slug]
  );

  const [product, setProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [activeImg, setActiveImg] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isWished, setIsWished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyAction, setBusyAction] = useState<"add" | "remove" | null>(null);

  const productId = getProductId(product);

  const loadProduct = useCallback(
    async (signal?: AbortSignal) => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDataBySlug(slug, signal);
        if (signal?.aborted) return;

        setProduct(data);
        const imgs = [data.thumbnail, ...(data.images || [])].filter(Boolean);
        const unique = Array.from(new Set(imgs));
        setGallery(unique);
        setActiveImg(unique[0] || data.thumbnail || "");
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan.";
        setError(message);
        toast.error(message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [slug]
  );

  const fetchWishlistForThisProduct = useCallback(
    async (pid: string, signal?: AbortSignal) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlist`,
          { signal, cache: "no-store" }
        );
        if (!res.ok) return;
        const json = (await res.json()) as ApiResponse<WishlistItem[]>;
        const setIds = new Set(json.data?.map((w) => w.productId) || []);
        if (!signal?.aborted) setIsWished(setIds.has(pid));
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  useEffect(() => {
    const ctrl = new AbortController();
    loadProduct(ctrl.signal);
    return () => ctrl.abort();
  }, [loadProduct]);

  useEffect(() => {
    if (!productId) return;
    const ctrl = new AbortController();
    fetchWishlistForThisProduct(productId, ctrl.signal);
    return () => ctrl.abort();
  }, [productId, fetchWishlistForThisProduct]);

  const handleToggleWishlist = async () => {
    if (!productId || busy) return;

    const wasWished = isWished;
    const adding = !wasWished;
    setBusy(true);
    setBusyAction(adding ? "add" : "remove");
    setIsWished(adding);

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
        window.location.href = `/login?error=unauthorized&redirectTo=${encodeURIComponent(
          `/products/${slug}`
        )}`;
        return;
      }

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Gagal mengubah wishlist.");
      }

      toast.dismiss();
      toast.success(
        adding ? "Ditambahkan ke wishlist" : "Dihapus dari wishlist"
      );
    } catch (error: unknown) {
      setIsWished(wasWished);
      const message =
        error instanceof Error
          ? error.message
          : "Aksi wishlist gagal. Coba lagi.";
      toast.error(message);
    } finally {
      setBusy(false);
      setBusyAction(null);
    }
  };

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
          <span aria-hidden>&gt;</span>
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <span aria-hidden>&gt;</span>
          <span className="truncate text-gray-800">
            {product?.name || "..."}
          </span>
        </div>
      </nav>

      {loading && <LoadingDetailPage />}

      {!loading && error && (
        <ErrorDetailPage message={error} onRetry={() => loadProduct()} />
      )}

      {!loading && !error && product && (
        <section className="mx-auto my-6 flex min-h-120 max-w-6xl flex-col gap-10 rounded-2xl bg-white p-8 shadow-lg md:flex-row">
          <div className="flex w-full flex-col items-center gap-8 md:w-2/5">
            <div className="w-80 overflow-hidden rounded-xl border border-neutral-200">
              {activeImg && (
                <Image
                  src={activeImg}
                  alt={product.name}
                  width={320}
                  height={320}
                  className="h-80 w-80 object-cover"
                  priority
                />
              )}
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {gallery.slice(0, 5).map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImg(src)}
                    className={`h-16 w-16 overflow-hidden rounded-md ring-1 transition ${
                      activeImg === src
                        ? "ring-2 ring-orange-500"
                        : "ring-transparent hover:ring-2 hover:ring-orange-500"
                    }`}
                    aria-label={`Thumbnail ${idx + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`Product thumbnail ${idx + 1}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-4 md:w-3/5">
            <h1 className="text-2xl font-bold text-neutral-900">
              {product.name}
            </h1>
            <p className="text-sm text-gray-600">{product.experpt}</p>

            <div className="rounded-lg bg-gray-50 p-5 text-sm leading-relaxed text-gray-700">
              <h2 className="mb-1 font-bold">Deskripsi Produk</h2>
              <p className="px-1">{product.description}</p>
            </div>

            <div className="mt-2 self-end text-3xl font-semibold text-orange-600">
              {formatIDR(product.price)}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
              <div>
                <h3 className="text-gray-500">Update</h3>
                <p className="font-medium text-neutral-800">
                  {formatDateID(product.updatedAt)}
                </p>
              </div>

              <div className="col-span-2 flex flex-wrap items-center gap-2 md:col-span-3">
                {product.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border px-3 py-1 text-xs text-orange-500 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button className="flex-1 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-500">
                Add to Cart
              </button>

              <button
                className={[
                  "flex-1 rounded-xl border px-6 py-3 font-semibold transition flex items-center justify-center gap-2",
                  isWished
                    ? "border-orange-600 text-orange-600 hover:text-white hover:bg-orange-500/90"
                    : "border-neutral-300 text-neutral-600 hover:bg-neutral-100",
                  busy && "opacity-60",
                ].join(" ")}
                disabled={!productId || busy}
                onClick={handleToggleWishlist}
                aria-pressed={isWished}
                aria-label={
                  isWished ? "Remove from wishlist" : "Add to wishlist"
                }
                title={isWished ? "Hapus dari wishlist" : "Tambah ke wishlist"}
              >
                {isWished ? (
                  <FaHeart className="h-4 w-4 text-orange-600" />
                ) : (
                  <FaRegHeart className="h-4 w-4 text-neutral-400" />
                )}
                {busy
                  ? busyAction === "add"
                    ? "Menyimpan…"
                    : "Menghapus…"
                  : isWished
                  ? "Tersimpan"
                  : "Wishlist"}
              </button>
            </div>

            {!productId && (
              <p className="mt-2 text-xs text-red-500">
                ID produk tidak ditemukan di response. Pastikan endpoint{" "}
                <code>/api/product/[slug]</code> mengembalikan <code>_id</code>{" "}
                agar wishlist berfungsi.
              </p>
            )}
          </div>
        </section>
      )}

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
