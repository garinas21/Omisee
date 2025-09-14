"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const HERO_SLIDES = [
  "https://res.cloudinary.com/drzqzizv1/image/upload/v1757410619/ChatGPT_Image_Sep_9_2025_04_35_36_PM_loqhuk.png",
  "https://res.cloudinary.com/drzqzizv1/image/upload/v1757433876/ChatGPT_Image_Sep_9_2025_10_55_21_PM_gafzd6.png",
  "https://res.cloudinary.com/drzqzizv1/image/upload/v1757846951/ChatGPT_Image_Sep_14_2025_05_03_43_PM_jz6xf5.png",
  "https://res.cloudinary.com/drzqzizv1/image/upload/v1757847046/ChatGPT_Image_Sep_14_2025_05_45_03_PM_f9rbgf.png",
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-orange-100 via-orange-50 to-amber-100 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 md:flex-row">
        <div className="w-full max-w-3xl overflow-hidden md:w-3/5">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {HERO_SLIDES.map((src, i) => (
              <div
                key={i}
                className="relative min-w-full overflow-hidden rounded-2xl shadow-lg aspect-[16/9]"
              >
                <Image
                  src={src}
                  alt={`Slide ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width:1024px) 60vw, 100vw"
                  priority={i === 0}
                  unoptimized
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center space-x-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-3 w-3 rounded-full transition ${
                  currentIndex === i
                    ? "bg-black"
                    : "bg-black/20 hover:bg-black/40"
                }`}
                aria-label={`Ke slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center md:text-left md:w-2/5">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-orange-600">
            Selamat Datang di Omisee
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            Temukan berbagai produk terbaik dengan harga terjangkau untuk
            memenuhi kebutuhan harian Anda. Belanja mudah, cepat, dan aman!
          </p>
          <Link
            href="/products"
            className="inline-block rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-500"
          >
            Belanja Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
