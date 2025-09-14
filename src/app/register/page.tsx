"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type RegisterResponse =
  | { statusCode: number; message?: string; data?: unknown; error?: string }
  | { statusCode: number; message?: string; data?: unknown; error?: string[] };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (!name.trim()) return "Name is required";
    if (!username.trim()) return "Username is required";
    if (!email.trim()) return "Email is required";
    if (!emailRe.test(email.trim())) return "Email format is invalid";
    if (!password) return "Password is required";
    if (password.length < 5) return "Password must be at least 5 characters";
    return null;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const v = validate();
    if (v) {
      toast.error(v, { toastId: "register-validate" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            username: username.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      let json: RegisterResponse | null = null;
      try {
        json = (await res.json()) as RegisterResponse;
      } catch {}

      if (!res.ok) {
        const errs: string[] = Array.isArray(json?.error)
          ? json?.error
          : json?.error
          ? [json.error]
          : [json?.message ?? `Registration failed (HTTP ${res.status})`];

        const seen = new Set<string>();
        errs.forEach((msg, i) => {
          const text = String(msg);
          if (seen.has(text)) return;
          seen.add(text);
          toast.error(text, { toastId: `reg-${i}-${text}` });
        });
        return;
      }

      toast.success(json?.message || "Registration successful!", {
        toastId: "register-success",
      });
      router.push("/login");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Network error";
      toast.error(message, { toastId: "register-network" });
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
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Register
                  </h2>
                </div>

                <div className="px-6 py-6">
                  <form className="grid gap-5" onSubmit={onSubmit} noValidate>
                    <div className="grid gap-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 disabled:opacity-60"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="username"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 disabled:opacity-60"
                      />
                    </div>

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
                        disabled={loading}
                        className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 disabled:opacity-60"
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 disabled:opacity-60"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-500 disabled:opacity-60 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-white/70"
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="text-center text-sm text-neutral-600">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-semibold text-orange-700 hover:text-orange-600"
                      >
                        Login
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
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={2}
      />
    </section>
  );
}
