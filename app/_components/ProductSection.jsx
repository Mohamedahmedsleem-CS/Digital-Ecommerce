"use client"
import React, { useEffect, useState } from 'react'
import ProductList from './ProductList'
import Pagination from './Pagination'
import ProductApis from '../_utils/ProductApis';

function ProductSection() {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [meta, setMeta] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt:desc');
    const pageSize = 12; // Number of products per page

    useEffect(() => {
        getLatestProducts_();
    }, [currentPage, sortBy]);

    // get data by axios with pagination
    const getLatestProducts_ = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await ProductApis.getLatestProducts({
                page: currentPage,
                pageSize: pageSize,
                sortBy: sortBy
            });
            console.log('Full response:', res);
            
            // Strapi v5 returns { data: [...], meta: {...} }
            if (res && Array.isArray(res.data)) {
                setProductList(res.data);
                setMeta(res.meta);
            } else {
                console.error('Unexpected response structure:', res);
                setProductList([]);
                setMeta(null);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message || 'Failed to fetch products');
            setProductList([]);
            setMeta(null);
        } finally {
            setLoading(false);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to products section
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    if (loading) {
        return (
            <div className=" flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center mb-6">منتجات جديدة</h2>
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-7xl">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="text-6xl mb-4">⏳</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Products...</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className=" flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center mb-6">Latest Products</h2>
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-7xl">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="text-6xl mb-4">❌</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Products</h3>
                                <p className="text-gray-500">{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="products" className=" flex flex-col items-center">
            <div className="w-full max-w-7xl px-4">
                {/* Header with title and sorting */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-center">منتجات جديدة</h2>
                    
                    {/* Sort Controls */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">ترتيب حسب:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
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
                
                {/* Products Grid */}
                <ProductList productList={productList} />
                
                {/* Pagination */}
                {meta && meta.pagination && meta.pagination.pageCount > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={meta.pagination.pageCount}
                        totalItems={meta.pagination.total}
                        itemsPerPage={pageSize}
                        onPageChange={handlePageChange}
                        className="mt-8"
                    />
                )}
            </div>
        </div>
    )
}

export default ProductSection