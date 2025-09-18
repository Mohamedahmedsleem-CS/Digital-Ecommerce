'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import ProductList from '../_components/ProductList';
import Pagination from '../_components/Pagination';
import BreadCrumb from '../_components/BreadCrumb';
import SearchBar from '../_components/SearchBar';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Search parameters
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt:desc';

  // Available categories (you might want to fetch this from API)
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Search function
  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: '20'
      });
      
      if (category !== 'all') params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (sortBy) params.set('sortBy', sortBy);
      
      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
        setMeta(data.meta);
      } else {
        setError(data.message || 'Search failed');
        setProducts([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('حدث خطأ أثناء البحث');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Perform search when parameters change
  useEffect(() => {
    performSearch();
  }, [query, page, category, minPrice, maxPrice, sortBy]);

  // Update URL with filters
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    params.set('q', query);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      }
    });
    
    router.push(`/search?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Pagination handlers
  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <BreadCrumb 
          items={[
            { href: '/', label: 'الرئيسية' },
            { label: `البحث: "${query}"` }
          ]} 
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">تصفية النتائج</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-600"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التصنيف
                  </label>
                  <select
                    value={category}
                    onChange={(e) => updateFilters({ category: e.target.value, page: 1 })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="all">جميع التصنيفات</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نطاق السعر (ر.س)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="من"
                      value={minPrice}
                      onChange={(e) => updateFilters({ minPrice: e.target.value, page: 1 })}
                      className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="إلى"
                      value={maxPrice}
                      onChange={(e) => updateFilters({ maxPrice: e.target.value, page: 1 })}
                      className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ترتيب حسب
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => updateFilters({ sortBy: e.target.value, page: 1 })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="createdAt:desc">الأحدث</option>
                    <option value="createdAt:asc">الأقدم</option>
                    <option value="price:asc">السعر: من الأقل للأعلى</option>
                    <option value="price:desc">السعر: من الأعلى للأقل</option>
                    <option value="title:asc">الاسم: أ-ي</option>
                    <option value="title:desc">الاسم: ي-أ</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  مسح جميع المرشحات
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search Results Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    نتائج البحث عن: "{query}"
                  </h1>
                  {meta && (
                    <p className="text-gray-600">
                      تم العثور على {meta.pagination?.total || 0} منتج
                      {category !== 'all' && ` في تصنيف "${categories.find(c => c.slug === category)?.label || category}"`}
                    </p>
                  )}
                </div>
                
                {/* Mobile Search Bar */}
                <div className="md:hidden">
                  <SearchBar className="w-full" />
                </div>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <div className="animate-spin mx-auto mb-4 w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full"></div>
                <p className="text-gray-600">جاري البحث...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <Search className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">حدث خطأ</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={performSearch}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">لم يتم العثور على نتائج</h3>
                <p className="text-gray-600 mb-6">جرب كلمات بحث مختلفة أو قم بتعديل المرشحات</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة للرئيسية
                </Link>
              </div>
            ) : (
              <>
                <ProductList productList={products} />
                
                {/* Pagination */}
                {meta?.pagination && meta.pagination.pageCount > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={meta.pagination.pageCount}
                    totalItems={meta.pagination.total}
                    itemsPerPage={20}
                    onPageChange={goToPage}
                    className="mt-6"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}