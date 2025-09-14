"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export default function SearchProduct({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qFromUrl = searchParams.get("q") ?? "";
  const [q, setQ] = useState(qFromUrl);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setQ(qFromUrl), [qFromUrl]);

  const go = (value: string) => {
    const query = value.trim();
    const url = query
      ? `/products?q=${encodeURIComponent(query)}`
      : "/products";
    router.prefetch(url);
    router.push(url);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQ(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => go(value), 500);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    go(q);
  };

  const onClear = () => {
    setQ("");
    go("");
  };

  return (
    <form role="search" onSubmit={onSubmit} className={className}>
      <input
        name="q"
        value={q}
        onChange={onChange}
        placeholder="Cari produk…"
        aria-label="Cari produk"
        className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
      />
      {q && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100"
          aria-label="Bersihkan pencarian"
          title="Bersihkan"
        >
          Clear
        </button>
      )}
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-orange-500"
      >
        <FiSearch aria-hidden />
        Search
      </button>
    </form>
  );
}
