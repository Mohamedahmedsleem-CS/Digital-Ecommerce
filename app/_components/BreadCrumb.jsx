'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// دمج كلاسّات بسيط بدل clsx
function cn(...args) {
  return args.filter(Boolean).join(' ');
}

// تنعيم الاسم + قصّه لو طويل
function prettify(label, max = 28) {
  const nice = decodeURIComponent(label).replace(/[-_]/g, ' ');
  return nice.length > max ? nice.slice(0, max - 1) + '…' : nice;
}

// بناء breadcrumbs تلقائيًا من الـ URL لو items مش متبعتة
function buildAutoItems(pathname, { rootLabel = 'Home', rootHref = '/' } = {}) {
  const segments = (pathname || '/')
    .split('?')[0]
    .split('#')[0]
    .split('/')
    .filter(Boolean);

  const items = [{ href: rootHref, label: rootLabel }];

  let acc = '';
  segments.forEach((seg, idx) => {
    acc += `/${seg}`;
    items.push({
      // آخر عنصر مش لينك
      href: idx === segments.length - 1 ? undefined : acc,
      label: prettify(seg),
    });
  });

  return items;
}

/**
 * props:
 * - items?: [{ href?: string; label: string }]
 * - mapLabels?: { [key: string]: string }  // لتعديل التسميات لو شغّلت الوضع التلقائي
 * - rootLabel?: string
 * - rootHref?: string
 * - separator?: ReactNode | string  (افتراضي: ›)
 * - className?: string
 */
export default function BreadCrumb({
  items,
  mapLabels = {},
  rootLabel = 'Home',
  rootHref = '/',
  separator = '›',
  className = '',
}) {
  const pathname = usePathname();
  let data = items && items.length ? items : buildAutoItems(pathname, { rootLabel, rootHref });

  // لو شغال تلقائيًا: طبّق mapLabels لو متبعت
  if (!items || !items.length) {
    data = data.map((it, i) => {
      // حاول نجيب مفتاح منطقي للتعديل (آخر جزء من اللينك أو اللابل نفسه)
      const keyFromHref = it.href ? it.href.split('/').filter(Boolean).pop() : undefined;
      const key =
        (keyFromHref && keyFromHref.toLowerCase()) ||
        it.label.toLowerCase().replace(/\s+/g, '-');
      const override = mapLabels[key] ?? mapLabels[it.label] ?? undefined;
      return override ? { ...it, label: override } : it;
    });
    // أول عنصر يلتزم بـ rootLabel
    if (data[0]?.href === rootHref) data[0].label = rootLabel;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('inline-flex', className)}>
      <ol className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-3 py-1.5 text-sm shadow-sm">
        {data.map((c, idx) => {
          const isLast = idx === data.length - 1;
          const isClickable = !!c.href && !isLast;

          return (
            <li key={idx} className="flex items-center gap-2">
              {isClickable ? (
                <Link
                  href={c.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'text-gray-700',
                    isLast && 'font-semibold text-gray-900'
                  )}
                >
                  {c.label}
                </span>
              )}

              {!isLast && (
                <span className="select-none text-gray-300">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
