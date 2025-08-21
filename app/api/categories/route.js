import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337/api';

// Helper to fetch one page of categories-only data
async function fetchPage(page = 1) {
  const url = new URL(`${STRAPI_URL}/products`);
  // Only fetch the category field to reduce payload
  url.searchParams.set('fields[0]', 'category');
  url.searchParams.set('publicationState', 'live');
  url.searchParams.set('pagination[pageSize]', '200');
  url.searchParams.set('pagination[page]', String(page));

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Strapi products fetch failed: ${res.status}`);
  }
  return res.json();
}

export async function GET() {
  try {
    const set = new Set();
    let page = 1;
    let pageCount = 1;

    do {
      const data = await fetchPage(page);
      const items = data?.data || [];
      items.forEach((p) => {
        const cat = p?.category; // enum string at top-level (Strapi v5)
        if (cat) set.add(String(cat));
      });
      pageCount = data?.meta?.pagination?.pageCount ?? 1;
      page++;
    } while (page <= pageCount);

    const categories = Array.from(set).map((name) => ({
      name,
      label: name, // you can prettify if needed
      slug: name,  // enum is already URL-safe
    }));

    console.log('📂 Fetched categories:', categories);
    return NextResponse.json({ data: categories });
  } catch (e) {
    console.error('❌ Error fetching categories:', e);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
