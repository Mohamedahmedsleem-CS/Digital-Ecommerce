'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import ProductList from '../_components/ProductList'
import ProductApis from '../_utils/ProductApis'
import { debounce } from 'lodash'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(12) // Items per page
  const [totalCount, setTotalCount] = useState(0)

  // Fetch products with search and pagination
  const fetchProducts = useCallback(async (query = '', page = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await ProductApis.getProductsWithSearchAndPagination({
        searchQuery: query,
        page,
        pageSize
      })
      
      if (response && response.data) {
        setProducts(response.data)
        setTotalCount(response.meta?.pagination?.total || 0)
        setTotalPages(response.meta?.pagination?.pageCount || 1)
      } else {
        setProducts([])
        setTotalCount(0)
        setTotalPages(1)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message || 'Failed to fetch products')
      setProducts([])
      setTotalCount(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setCurrentPage(1) // Reset to first page on new search
      fetchProducts(query, 1)
    }, 400),
    [fetchProducts]
  )

  // Initial load
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page)
      fetchProducts(searchQuery, page)
      // Scroll to top of products
      document.getElementById('products-header')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const half = Math.floor(maxVisiblePages / 2)
    
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div id="products-header" className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">جميع المنتجات</h1>
          <p className="text-gray-600">
            {loading ? 'جاري التحميل...' : `${totalCount} منتج متوفر`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200"
              dir="rtl"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-500 animate-spin" />
            )}
          </div>
        </div>

        {/* Products Content */}
        {error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">حدث خطأ</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => fetchProducts(searchQuery, currentPage)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">جاري تحميل المنتجات...</h3>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'لا توجد منتجات مطابقة للبحث' : 'لا توجد منتجات متوفرة'}
            </h3>
            {searchQuery && (
              <p className="text-gray-500 mb-4">
                جرب البحث بكلمات مختلفة أو تصفح جميع المنتجات
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="mb-8">
              <ProductList productList={products} />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 space-x-reverse">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 mr-1" />
                  السابق
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1 space-x-reverse">
                  {getPageNumbers().map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        pageNumber === currentPage
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  التالي
                  <ChevronLeft className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductsPage