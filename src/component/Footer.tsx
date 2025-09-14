import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const FooterLayout = () => {
  return (
    <footer className="mt-12 w-full bg-white text-neutral-600">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-10 border-b border-neutral-200 pb-8 md:flex-row md:items-start md:justify-between">
          <div className="md:max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <Image
                className="h-10 w-10 rounded-md shadow-sm ring-1 ring-white/40"
                width={40}
                height={40}
                src="https://res.cloudinary.com/drzqzizv1/image/upload/v1757434862/Omisee_Logo_Design-removebg-preview_nc6gh6.png"
                alt="Omisee icon"
              />
              <span className="text-xl font-extrabold tracking-tight text-orange-600 font-mono">
                Omisee
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Omisee adalah marketplace tempat kamu menemukan produk pilihan
              dengan harga terbaik. Nikmati kurasi barang favorit dan pengalaman
              belanja yang nyaman.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <Link
                href="#"
                aria-label="Instagram"
                className="rounded-lg border border-neutral-200 p-2 transition hover:border-orange-500 hover:text-orange-600"
              >
                <FaInstagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="X (Twitter)"
                className="rounded-lg border border-neutral-200 p-2 transition hover:border-orange-500 hover:text-orange-600"
              >
                <FaXTwitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="rounded-lg border border-neutral-200 p-2 transition hover:border-orange-500 hover:text-orange-600"
              >
                <FaYoutube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-start gap-12 md:flex-row md:justify-end">
            <div>
              <h4 className="mb-4 text-sm font-semibold text-neutral-900">
                Perusahaan
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">Tentang kami</Link>
                </li>
                <li>
                  <Link href="/contact">Kontak</Link>
                </li>
                <li>
                  <Link href="/privacy">Kebijakan Privasi</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-neutral-900">
                Bantuan
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/orders">Pelacakan Pesanan</Link>
                </li>
                <li>
                  <Link href="/returns">Pengembalian</Link>
                </li>
                <li>
                  <Link href="/support">Dukungan</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-neutral-900">
                Hubungi Kami
              </h4>
              <div className="space-y-2 text-sm">
                <p>+62-812-3456-7890</p>
                <p>support@omisee.co</p>
                <p>Sen–Jum 09.00–18.00 WIB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-neutral-500 md:flex-row md:text-sm">
          <p>© {new Date().getFullYear()} Omisee. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/terms">Syarat & Ketentuan</Link>
            <span className="text-neutral-300">•</span>
            <Link href="/privacy">Privasi</Link>
            <span className="text-neutral-300">•</span>
            <Link href="/cookies">Cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;
