'use client';

import axiosClient from './axiosClient';

/**
 * Get latest products (list)
 * Strapi v5 returns { data: [...], meta: {...} }
 */
const getLatestProducts = async () => {
  const response = await axiosClient.get('/products', {
    params: { populate: '*', publicationState: 'live' },
  });
  return response.data;
};

/**
 * Get one product by documentId (v5 findOne) or numeric id (fallback via filter)
 * Always return { data: object|null, meta?: any }
 */
const getProductById = async (idOrDocId) => {
  const val = String(idOrDocId).trim();
  const looksNumeric = /^\d+$/.test(val);

  // Optional dev logging
  if (process.env.NODE_ENV !== 'production') {
    console.log('[ProductApis] GET one ->', looksNumeric ? 'via filter' : 'via findOne', String(idOrDocId));
  }

  if (looksNumeric) {
    // Strapi v5: findOne by numeric id is NOT supported -> filter instead
    const res = await axiosClient.get('/products', {
      params: {
        'filters[id][$eq]': val,
        populate: '*',
        publicationState: 'live',
      },
    });
    return { data: res?.data?.data?.[0] ?? null, meta: res?.data?.meta };
  } else {
    // documentId path
    const res = await axiosClient.get(`/products/${val}`, {
      params: { populate: '*', publicationState: 'live' },
    });
    // res.data already has { data: {...}, meta: {...} }
    return res.data;
  }
};

// get product by category

// const getProductByCategory =(category)=>axiosClient.get(`/products?filters[category][$eq]=${category}&populate=*`)

// إرجاع منتجات نفس الـ category
const getProductByCategory = async (category) => {
  const res = await axiosClient.get('/products', {
    params: {
      'filters[category][$eq]': category,
      populate: '*',
      publicationState: 'live',
    },
  });
  // رجّع Array مباشرة
  return res?.data?.data ?? [];
};

/**
 * Centralized function to fetch products with search, pagination, and sorting
 * @param {Object} options - Configuration options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.pageSize - Items per page (default: 10)
 * @param {string} options.search - Search query for title filtering
 * @param {string} options.sort - Sort field (default: 'createdAt:desc')
 * @param {string} options.category - Filter by category
 * @returns {Promise<{data: Array, meta: Object}>} - Products data and pagination metadata
 */
const fetchProducts = async ({
  page = 1,
  pageSize = 10,
  search = '',
  sort = 'createdAt:desc',
  category = null
} = {}) => {
  try {
    const params = {
      populate: '*',
      publicationState: 'live',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort[0]': sort
    };

    // Add search filter if search query is provided
    if (search && search.trim()) {
      params['filters[title][$containsi]'] = search.trim();
    }

    // Add category filter if category is provided
    if (category) {
      params['filters[category][$eq]'] = category;
    }

    const response = await axiosClient.get('/products', { params });
    
    return {
      data: response.data.data || [],
      meta: response.data.meta || null
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export default {
  getLatestProducts,
  getProductById,
  getProductByCategory,
  fetchProducts
};


