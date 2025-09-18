'use client';

import axiosClient from './axiosClient';
import mockProducts, { getProductById as getMockProductById, getProductsByCategory as getMockProductsByCategory } from './mockData';

/**
 * Get latest products (list)
 * Strapi v5 returns { data: [...], meta: {...} }
 * Uses mock data as fallback when API fails
 */
const getLatestProducts = async () => {
  try {
    const response = await axiosClient.get('/products', {
      params: { populate: '*', publicationState: 'live' },
    });
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch from API, using mock data:', error.message);
    // استخدام البيانات التجريبية كحل بديل
    return {
      data: mockProducts,
      meta: {
        total: mockProducts.length,
        fallback: true,
        message: 'البيانات من المصدر التجريبي'
      }
    };
  }
};

/**
 * Get one product by documentId (v5 findOne) or numeric id (fallback via filter)
 * Always return { data: object|null, meta?: any }
 * Uses mock data as fallback when API fails
 */
const getProductById = async (idOrDocId) => {
  const val = String(idOrDocId).trim();
  const looksNumeric = /^\d+$/.test(val);

  // Optional dev logging
  if (process.env.NODE_ENV !== 'production') {
    console.log('[ProductApis] GET one ->', looksNumeric ? 'via filter' : 'via findOne', String(idOrDocId));
  }

  try {
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
  } catch (error) {
    console.warn('Failed to fetch product from API, using mock data:', error.message);
    // استخدام البيانات التجريبية كحل بديل
    const mockProduct = getMockProductById(idOrDocId);
    return {
      data: mockProduct || null,
      meta: {
        fallback: true,
        message: 'البيانات من المصدر التجريبي'
      }
    };
  }
};

/**
 * إرجاع منتجات نفس الـ category
 * Uses mock data as fallback when API fails
 */
const getProductByCategory = async (category) => {
  try {
    const res = await axiosClient.get('/products', {
      params: {
        'filters[category][$eq]': category,
        populate: '*',
        publicationState: 'live',
      },
    });
    // رجّع Array مباشرة
    return res?.data?.data ?? [];
  } catch (error) {
    console.warn('Failed to fetch category products from API, using mock data:', error.message);
    // استخدام البيانات التجريبية كحل بديل
    return getMockProductsByCategory(category);
  }
};

export default {
  getLatestProducts,
  getProductById,
  getProductByCategory
};


