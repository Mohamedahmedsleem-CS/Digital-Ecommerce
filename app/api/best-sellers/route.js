import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1337/api';

/**
 * API Route لجلب المنتجات الأكثر طلباً
 * يعيد المنتجات ذات الخاصية isBestSeller: true
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
    console.error('❌ Error fetching best sellers:', error);
    
    return NextResponse.json(
      {
        success: false,
        data: [],
        meta: {},
        message: 'حدث خطأ أثناء جلب المنتجات الأكثر طلباً',
        error: error.message
      },
      { status: 500 }
    );
  }
}
