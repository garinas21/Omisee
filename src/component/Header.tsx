import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { dologin, logout } from "./action";
import { FaHeart } from "react-icons/fa";
import SearchProduct from "./SearchProduct";
import Image from "next/image";

const HeaderLayout = async () => {
  const isLoggedIn = await dologin();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-orange-600/95 backdrop-blur supports-[backdrop-filter]:bg-orange-600/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            className="h-10 w-10 rounded-md shadow-sm ring-1 ring-white/40"
            width={40}
            height={40}
            src="https://res.cloudinary.com/drzqzizv1/image/upload/v1757401028/ChatGPT_Image_Sep_9__2025__01_49_49_PM-removebg-preview_wsckre.png"
            alt="Omisee icon"
          />
          <span className="text-2xl font-extrabold tracking-tight text-white font-mono">
            Omisee
          </span>
        </Link>

        <SearchProduct className="hidden md:flex flex-1 max-w-xl items-center gap-2 rounded-xl bg-white/95 px-2 py-1 shadow-sm ring-1 ring-white/60" />

        {!isLoggedIn ? (
          <nav className="hidden items-center gap-3 md:flex">
            <Link
              href="/register"
              className="group relative overflow-hidden px-4 py-1.5 text-sm font-semibold text-white/90 transition duration-300 hover:text-white"
            >
              <span className="relative z-10">Register</span>
              <span className="absolute inset-0 z-0 scale-0 rounded-full bg-orange-500/20 transition-transform duration-300 group-hover:scale-100" />
            </Link>
            <span className="text-white/30">|</span>
            <Link
              href="/login"
              className="group relative overflow-hidden px-4 py-1.5 text-sm font-semibold text-white/90 transition duration-300 hover:text-white"
            >
              <span className="relative z-10">Log In</span>
              <span className="absolute inset-0 z-0 scale-0 rounded-full bg-orange-500/20 transition-transform duration-300 group-hover:scale-100" />
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-5">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/20"
            >
              <FaHeart className="h-4 w-4" aria-hidden />
              <span>Wishlist</span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                aria-label="Logout"
                className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-semibold text-orange-700 shadow transition hover:bg-white"
              >
                <FiLogOut className="h-4 w-4" aria-hidden />
                <span>Logout</span>
              </button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
};

export default HeaderLayout;
