import Link from 'next/link';
import ProductList from '@/app/_components/ProductList';
import { getProductsByEnumCategoryServer } from '@/app/_utils/CategoryApis';

export const revalidate = 60;

export default async function CategoryPage({ params }) {
  const id = params?.id; // enum value (e.g. men, women, children)
  const res = await getProductsByEnumCategoryServer(id);
  const items = res?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">الرئيسية</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">التصنيف</span>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{decodeURIComponent(id)}</span>
      </nav>

      <h1 className="text-2xl font-bold mb-4">التصنيف: {decodeURIComponent(id)}</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border p-6 text-gray-600">
          لا توجد منتجات لهذه الفئة حالياً.
        </div>
      ) : (
        <ProductList productList={items} />
      )}
    </div>
  );
}
