'use client';

import axiosClient from './axiosClient';

/**
 * Get latest products (list) with pagination support
 * Strapi v5 returns { data: [...], meta: {...} }
 */
const getLatestProducts = async (options = {}) => {
  const { page = 1, pageSize = 20, sortBy = 'createdAt:desc' } = options;
  
  const response = await axiosClient.get('/products', {
    params: { 
      populate: '*', 
      publicationState: 'live',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort[0]': sortBy
    },
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

// إرجاع منتجات نفس الـ category مع دعم التصفح والتصفية
const getProductByCategory = async (category, options = {}) => {
  const { page = 1, pageSize = 20, sortBy = 'createdAt:desc' } = options;
  
  const res = await axiosClient.get('/products', {
    params: {
      'filters[category][$eq]': category,
      populate: '*',
      publicationState: 'live',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort[0]': sortBy
    },
  });
  // رجّع البيانات الكاملة مع meta للتصفح
  return res?.data ?? { data: [], meta: {} };
};

export default {
  getLatestProducts,
  getProductById,
  getProductByCategory
};


