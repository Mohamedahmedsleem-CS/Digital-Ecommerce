import { NextResponse } from 'next/server';
import { getBestSellerProducts } from '../../_utils/mockData';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://strapi-95jv.onrender.com/api';

/**
 * API Route لجلب المنتجات الأكثر طلباً
 * يعيد المنتجات ذات الخاصية isBestSeller: true
 * يستخدم البيانات التجريبية كحل بديل عند فشل الاتصال
 */
export async function GET() {
  try {
    const url = new URL(`${STRAPI_URL}/products`);
    
    // فلترة المنتجات الأكثر طلباً
    url.searchParams.set('filters[isBestSeller][$eq]', 'true');
    
    // تضمين جميع البيانات المطلوبة
    url.searchParams.set('populate', '*');
    
    // حالة النشر
    url.searchParams.set('publicationState', 'live');
    
    // ترتيب حسب الأحدث
    url.searchParams.set('sort[0]', 'createdAt:desc');
    
    // عدد المنتجات (يمكن تعديله حسب الحاجة)
    url.searchParams.set('pagination[pageSize]', '20');

    console.log('🔍 Fetching best sellers from:', url.toString());

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // تحديث كل 5 دقائق
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Found ${data?.data?.length || 0} best seller products`);
    
    return NextResponse.json({
      success: true,
      data: data?.data || [],
      meta: data?.meta || {},
      message: 'تم جلب المنتجات الأكثر طلباً بنجاح'
    });

  } catch (error) {
    console.error('❌ Error fetching best sellers from API, using mock data:', error);
    
    // استخدام البيانات التجريبية كحل بديل
    const mockBestSellers = getBestSellerProducts();
    
    console.log(`🔄 Using mock data: ${mockBestSellers.length} best seller products`);
    
    return NextResponse.json({
      success: true,
      data: mockBestSellers,
      meta: {
        total: mockBestSellers.length,
        fallback: true,
        message: 'البيانات من المصدر التجريبي'
      },
      message: 'تم جلب المنتجات الأكثر طلباً من البيانات التجريبية'
    });
  }
}
