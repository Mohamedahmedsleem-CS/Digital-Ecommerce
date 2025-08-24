'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '@/app/_context/CartContext';
import { getEnumCategoriesClient } from '@/app/_utils/CategoryApisClient';

function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [cats, setCats] = useState([]);
  const [openCats, setOpenCats] = useState(false);
  const [loadingCats, setLoadingCats] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoadingCats(true);
      const list = await getEnumCategoriesClient();
      setCats(list || []);
    } catch {
      setCats([]);
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    
    // Auto-refresh categories every 5 minutes
    const interval = setInterval(fetchCategories, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openCats && !event.target.closest('.categories-dropdown')) {
        setOpenCats(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openCats]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">
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
          
          <Link
            href="/cart"
            className="text-gray-700 hover:text-teal-600 transition relative"
          >
            السلة
            {count > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Categories dropdown */}
          <div className="relative categories-dropdown">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setOpenCats(!openCats)}
                className="text-gray-700 hover:text-teal-600 transition font-medium flex items-center gap-1"
              >
                التصنيفات
                <svg 
                  className={`w-4 h-4 transition-transform ${openCats ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* <button
                onClick={fetchCategories}
                disabled={loadingCats}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="تحديث التصنيفات"
              >
                <svg 
                  className={`w-4 h-4 ${loadingCats ? 'animate-spin' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button> */}
            </div>
            {openCats && (
              <div className="absolute left-0 mt-3 w-72 rounded-xl border bg-white shadow-lg p-2 z-50">
                {cats.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${encodeURIComponent(c.slug)}`}
                    className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                    onClick={() => setOpenCats(false)}
                  >
                    {c.label}
                  </Link>
                ))}
                {loadingCats ? (
                  <div className="px-3 py-2 text-sm text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التحميل...
                  </div>
                ) : cats.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400">لا توجد تصنيفات</div>
                ) : null}
              </div>
            )}
          </div>
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
            <Menu className="w-5 h-5" />
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

            {/* Mobile: categories chips */}
            <div className="border-t pt-3">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {cats.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${encodeURIComponent(c.slug)}`}
                    className="shrink-0 px-3 py-2 rounded-full border text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    {c.label}
                  </Link>
                ))}
                {cats.length === 0 && (
                  <span className="text-gray-400 text-sm">لا توجد تصنيفات</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
