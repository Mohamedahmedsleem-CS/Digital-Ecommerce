'use client';

import Image from 'next/image';
import Link from 'next/link';

const RAW_PHONE = process.env.NEXT_PUBLIC_STORE_WHATSAPP || '009665043099114';
const WA_PHONE = RAW_PHONE.replace(/^00/, '').replace(/^\+/, '');
const WA_MSG = encodeURIComponent('السلام عليكم ورحمة الله وبركاته! أريد الطلب/الاستفسار عن منتجات عطارة المكارم المميزة.');
const WA_URL = `https://wa.me/${WA_PHONE}?text=${WA_MSG}`;

export default function Hero() {
  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <section 
        className="relative w-full overflow-hidden rounded-3xl bg-black/50 backdrop-blur-sm lg:h-[88vh]" 
        dir="rtl" 
        aria-label="عطارة المكارم المميزة"
      >
        {/* Background image - now with 50% opacity container overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/عطارة المكارم.png"
            alt="عطارة المكارم المميزة - بهارات وأعشاب طبيعية"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Semi-transparent overlay with Islamic pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-[url('/patterns/islamic-pattern.png')] opacity-10" />
        </div>

        {/* Content */}
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-16 sm:px-8 lg:px-12">
          <div className="w-full text-center md:text-right">
            <p className="text-lg font-amiri text-amber-300">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>

            <h1 className="mt-3 font-cairo text-4xl font-extrabold leading-tight text-green-200 sm:text-5xl lg:text-6xl">
              عطارة <span className="text-amber-400">المكارم المميزة</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-gray-100 sm:text-lg">
              منتجات طبيعية أصيلة مستوحاة من تراثنا الإسلامي العريق: أعشاب، زيوت، وخلطات موثوقة تجمع بين الجودة والبركة.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-start md:justify-end">
              <Link
                href="/#products"
                className="inline-flex h-12 items-center justify-center rounded-full bg-green-700 px-6 text-white shadow-lg transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                scroll={true}
              >
                تسوّق الآن
              </Link>

              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/95 px-6 text-green-700 shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                اطلب عبر واتساب
              </a>
            </div>

            {/* Benefits */}
            <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 text-sm text-gray-100 sm:grid-cols-3">
              <li className="rounded-xl bg-green-900/40 px-4 py-3 backdrop-blur ring-1 ring-white/15">
                🌿 منتجات طبيعية 100%
              </li>
              <li className="rounded-xl bg-green-900/40 px-4 py-3 backdrop-blur ring-1 ring-white/15">
                🕌 تراث إسلامي أصيل
              </li>
              <li className="rounded-xl bg-green-900/40 px-4 py-3 backdrop-blur ring-1 ring-white/15">
                📿 خدمة سريعة عبر واتساب
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}