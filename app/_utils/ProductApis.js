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

export default {
  getLatestProducts,
  getProductById,
  getProductByCategory
};


