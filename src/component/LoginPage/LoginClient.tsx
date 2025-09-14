"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/";
  const queryError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryError === "unauthorized") {
      toast.info("Silakan login untuk mengakses halaman tersebut.");
    }
  }, [queryError]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let json: unknown;
      try {
        json = await res.json();
      } catch {}

      if (!res.ok) {
        const msg =
          (json as { error?: string; message?: string } | undefined)?.error ??
          (json as { error?: string; message?: string } | undefined)?.message ??
          `Login failed (HTTP ${res.status})`;
        toast.error(msg);
        return;
      }

      toast.dismiss();
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="h-screen w-screen flex flex-col">
      <header className="bg-white sticky top-0 z-10 w-full border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="https://res.cloudinary.com/drzqzizv1/image/upload/v1757434862/Omisee_Logo_Design-removebg-preview_nc6gh6.png"
              alt="Omisee icon"
              width={40}
              height={40}
              className="h-10 w-10 rounded-md shadow-sm ring-1 ring-white/40"
              priority
            />
            <span className="text-2xl font-extrabold tracking-tight text-orange-600 font-mono">
              Omisee
            </span>
          </Link>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-700 via-orange-600 to-amber-700/70" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1px)] [background-size:20px_20px]"
        />

        <section className="relative z-10 h-full w-full">
          <div className="mx-auto flex h-full max-w-7xl flex-col md:flex-row">
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-10">
              <div className="relative">
                <Image
                  src="https://res.cloudinary.com/drzqzizv1/image/upload/v1757401028/ChatGPT_Image_Sep_9__2025__01_49_49_PM-removebg-preview_wsckre.png"
                  alt="Illustration"
                  width={480}
                  height={320}
                  className="h-[320px] w-auto drop-shadow-2xl animate-[float_8s_ease-in-out_infinite]"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
              <div className="flex flex-col w-full max-w-md rounded-2xl bg-white/90 backdrop-blur shadow-2xl ring-1 ring-white/60">
                <div className="px-6 pt-6 self-center">
                  <h2 className="text-2xl font-bold text-neutral-900">Login</h2>
                </div>
                <div className="px-6 py-6">
                  <form className="grid gap-5" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
                        minLength={5}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-500 disabled:opacity-60 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-white/70"
                    >
                      {loading ? "Signing in..." : "Login"}
                    </button>

                    <div className="relative my-2">
                      <hr className="border-neutral-200" />
                      <span className="absolute left-1/2 -translate-x-1/2 px-3 text-xs text-neutral-400">
                        or
                      </span>
                    </div>

                    <p className="text-center text-sm text-neutral-600">
                      Don&apos;t have an account yet?{" "}
                      <Link
                        href="/register"
                        className="font-semibold text-orange-700 hover:text-orange-600"
                      >
                        Register
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

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
    </section>
  );
}
