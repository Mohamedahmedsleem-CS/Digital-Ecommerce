'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/_context/CartContext';

function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={40} height={40} priority />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-teal-600 transition"
          >
            الرئيسية
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border px-3 py-2 text-gray-700 hover:text-teal-600 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>السلة</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border px-3 py-2 text-gray-700"
            aria-label="السلة"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="rounded-md bg-gray-100 p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <span className="sr-only">فتح/غلق القائمة</span>
            {/* icon */}
            {!open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-b bg-white shadow-sm"
        >
          <div className="mx-auto max-w-screen-xl px-4 py-3 space-y-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-gray-800 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              الرئيسية
            </Link>

            {/* زوّد روابط تانية هنا لو حبيت:
            <Link href="/about" className="block rounded-md px-3 py-2 text-gray-800 hover:bg-gray-50" onClick={()=>setOpen(false)}>
              نبذة عنا
            </Link>
            */}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
