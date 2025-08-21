'use client';

import axiosClient from './axiosClient';

/** Fetch categories from /api/categories */
export async function getEnumCategoriesClient() {
  try {
    const res = await fetch('/api/categories', { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    const json = await res.json();
    console.log('🔄 Fetched categories from API:', json?.data);
    return json?.data || [];
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

/** Fetch products by enum category (client-side) */
export async function getProductsByEnumCategory(cat) {
  try {
    const res = await axiosClient.get('/products', {
      params: {
        populate: '*',
        publicationState: 'live',
        'filters[category][$eq]': decodeURIComponent(cat),
      },
    });
    return res?.data || { data: [], meta: {} };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { data: [], meta: {} };
  }
}
