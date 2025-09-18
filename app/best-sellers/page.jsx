'use client';

import React, { useState, useEffect } from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import ProductItem from '../_components/ProductItem';
import Pagination from '../_components/Pagination';
import BreadCrumb from '../_components/BreadCrumb';
import Link from 'next/link';

/**
 * صفحة عرض جميع المنتجات الأكثر طلباً
 */
export default function BestSellersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const pageSize = 20;

  // جلب المنتجات الأكثر طلباً
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
          sortBy: sortBy
        });
        
        const response = await fetch(`/api/best-sellers?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('فشل في جلب المنتجات الأكثر طلباً');
        }
        
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data || []);
          setMeta(result.meta);
          console.log('✅ Best sellers loaded:', result.data?.length || 0);
        } else {
          throw new Error(result.message || 'حدث خطأ غير متوقع');
        }
      } catch (err) {
        console.error('❌ Error fetching best sellers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [currentPage, sortBy]);

  // معالجة حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <BreadCrumb path={[
            { name: 'الرئيسية', url: '/' },
            { name: 'الأكثر طلباً', url: '/best-sellers' }
          ]} />
          
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                الأكثر طلباً
              </h1>
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
            </div>
          </div>
          
          {/* Skeleton Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-t-lg h-[170px] mb-3"></div>
                <div className="bg-gray-200 rounded-b-lg h-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // معالجة حالة الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <BreadCrumb path={[
            { name: 'الرئيسية', url: '/' },
            { name: 'الأكثر طلباً', url: '/best-sellers' }
          ]} />
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                الأكثر طلباً
              </h1>
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-600 mb-4 text-lg">حدث خطأ أثناء تحميل المنتجات</p>
              <p className="text-red-500 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* مسار التنقل */}
        <BreadCrumb path={[
          { name: 'الرئيسية', url: '/' },
          { name: 'الأكثر طلباً', url: '/best-sellers' }
        ]} />
        
        {/* عنوان الصفحة مع أدوات التحكم */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                الأكثر طلباً
              </h1>
              <Star className="w-8 h-8 text-yellow-500 fill-current" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl">
              جميع منتجاتنا الأكثر شعبية وطلباً من عملائنا الكرام
            </p>
            {meta && (
              <p className="text-sm text-gray-500 mt-2">
                {meta.pagination?.total || products.length} منتج مميز
              </p>
            )}
          </div>
          
          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">ترتيب حسب:</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="createdAt:desc">الأحدث</option>
              <option value="createdAt:asc">الأقدم</option>
              <option value="price:asc">السعر: من الأقل للأعلى</option>
              <option value="price:desc">السعر: من الأعلى للأقل</option>
              <option value="title:asc">الاسم: أ-ي</option>
              <option value="title:desc">الاسم: ي-أ</option>
            </select>
          </div>
        </div>

        {/* عرض المنتجات */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={product.id || index} className="transform hover:scale-105 transition-transform duration-200">
                  <ProductItem product={product} />
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {meta?.pagination && meta.pagination.pageCount > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={meta.pagination.pageCount}
                totalItems={meta.pagination.total}
                itemsPerPage={pageSize}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-12"
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد منتجات مميزة حالياً
            </h3>
            <p className="text-gray-500 mb-6">
              سيتم إضافة المنتجات المميزة قريباً
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </div>
        )}
        
        {/* زر العودة */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
