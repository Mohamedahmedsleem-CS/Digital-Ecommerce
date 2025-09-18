import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://strapi-95jv.onrender.com/api';

/**
 * Search API endpoint for products
 * Supports query parameters: q (search term), limit, page, filters
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const category = searchParams.get('category');
    const minPrice = parseFloat(searchParams.get('minPrice'));
    const maxPrice = parseFloat(searchParams.get('maxPrice'));
    const sortBy = searchParams.get('sortBy') || 'createdAt:desc';

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        message: 'Search query must be at least 2 characters',
        data: [],
        meta: { pagination: { page: 1, pageSize: limit, pageCount: 0, total: 0 } }
      });
    }

    const url = new URL(`${STRAPI_URL}/products`);
    
    // Search filters - searching in title and description
    const searchTerm = query.trim();
    url.searchParams.set('filters[$or][0][title][$containsi]', searchTerm);
    url.searchParams.set('filters[$or][1][description][$containsi]', searchTerm);
    
    // Category filter
    if (category && category !== 'all') {
      url.searchParams.set('filters[category][$eq]', category);
    }
    
    // Price range filters
    if (!isNaN(minPrice)) {
      url.searchParams.set('filters[price][$gte]', minPrice.toString());
    }
    if (!isNaN(maxPrice)) {
      url.searchParams.set('filters[price][$lte]', maxPrice.toString());
    }
    
    // Pagination
    url.searchParams.set('pagination[page]', page.toString());
    url.searchParams.set('pagination[pageSize]', limit.toString());
    
    // Include all related data
    url.searchParams.set('populate', '*');
    url.searchParams.set('publicationState', 'live');
    
    // Sorting
    url.searchParams.set('sort[0]', sortBy);

    console.log('🔍 Search URL:', url.toString());

    const response = await fetch(url.toString(), {
      next: { revalidate: 60 }, // Cache for 1 minute
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Format response to include image URLs
    const formattedProducts = data?.data?.map(product => ({
      ...product,
      image: product.image || product.files?.[0] || null,
    })) || [];

    console.log(`✅ Search completed: "${searchTerm}" - Found ${formattedProducts.length} products`);
    
    return NextResponse.json({
      success: true,
      data: formattedProducts,
      meta: data?.meta || { pagination: { page: 1, pageSize: limit, pageCount: 0, total: 0 } },
      query: {
        searchTerm,
        category,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit
      }
    });

  } catch (error) {
    console.error('❌ Search API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Search failed',
      error: error.message,
      data: [],
      meta: { pagination: { page: 1, pageSize: 20, pageCount: 0, total: 0 } }
    }, { status: 500 });
  }
}