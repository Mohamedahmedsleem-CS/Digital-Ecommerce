import axiosClient from './axiosClient';

/** Fetch categories from /api/categories */
export async function getEnumCategoriesClient() {
  try {
    const res = await fetch('/api/categories', { cache: 'no-store' });
    const json = await res.json();
    return json?.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
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

/** Fetch products by enum category (server-side) */
export async function getProductsByEnumCategoryServer(cat) {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://strapi-95jv.onrender.com/api';
    const url = new URL(`${STRAPI_URL}/products`);
    
    url.searchParams.set('populate', '*');
    url.searchParams.set('publicationState', 'live');
    url.searchParams.set('filters[category][$eq]', decodeURIComponent(cat));

    const res = await fetch(url.toString(), { 
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching products by category (server):', error);
    return { data: [], meta: {} };
  }
}
