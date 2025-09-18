import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://strapi-95jv.onrender.com/api';

/**
 * API Route لجلب المنتجات الأكثر طلباً
 * يعيد المنتجات ذات الخاصية isBestSeller: true
 * Supports pagination and sorting
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 20;
    const sortBy = searchParams.get('sortBy') || 'createdAt:desc';

    const url = new URL(`${STRAPI_URL}/products`);
    
    // فلترة المنتجات الأكثر طلباً
    url.searchParams.set('filters[isBestSeller][$eq]', 'true');
    
    // تضمين جميع البيانات المطلوبة
    url.searchParams.set('populate', '*');
    
    // حالة النشر
    url.searchParams.set('publicationState', 'live');
    
    // Pagination
    url.searchParams.set('pagination[page]', page.toString());
    url.searchParams.set('pagination[pageSize]', pageSize.toString());
    
    // Sorting
    url.searchParams.set('sort[0]', sortBy);

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
