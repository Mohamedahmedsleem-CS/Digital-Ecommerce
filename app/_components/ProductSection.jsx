"use client"
import React, { useEffect, useState } from 'react'
import ProductList from './ProductList'
import SearchInput from './SearchInput'
import PaginationControls from './PaginationControls'
import ProductApis from '../_utils/ProductApis';
import { useDebounce } from '../_hooks/useDebounce';

function ProductSection() {
    // State for products and metadata
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    
    // State for user controls
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    
    // State for UI feedback
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Debounce search query to avoid excessive API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Reset page to 1 when search query changes
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    // Fetch products when debounced search query or page changes
    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // For now, use the old getLatestProducts to ensure it works
                // TODO: Switch to fetchProducts once it's working
                if (debouncedSearchQuery.trim() === '' && page === 1) {
                    const res = await ProductApis.getLatestProducts();
                    console.log('Latest products response:', res);
                    
                    if (res && Array.isArray(res.data)) {
                        setProducts(res.data);
                        setMeta(res.meta || null);
                    } else {
                        console.error('Unexpected response structure:', res);
                        setProducts([]);
                        setMeta(null);
                    }
                } else {
                    // Use the new fetchProducts function for search and pagination
                    const result = await ProductApis.fetchProducts({
                        page: page,
                        search: debouncedSearchQuery,
                        pageSize: 12
                    });
                    
                    console.log('Fetch products result:', result);
                    setProducts(result.data || []);
                    setMeta(result.meta || null);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Network Error: Failed to load products.");
                setProducts([]);
                setMeta(null);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [debouncedSearchQuery, page]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
        // Scroll to top of products section
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center mb-6">منتجات جديدة</h2>
                <SearchInput 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    loading={loading}
                />
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-7xl">
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="text-6xl mb-4">⏳</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">جاري تحميل المنتجات...</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center mb-6">منتجات جديدة</h2>
                <SearchInput 
                    value={searchQuery}
                    onChange={handleSearchChange}
                    loading={loading}
                />
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
        <div id="products" className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-6">منتجات جديدة</h2>
            
            {/* Search Input - Always show */}
            <SearchInput 
                value={searchQuery}
                onChange={handleSearchChange}
                loading={loading}
            />

            {/* Products List */}
            <div className="w-full flex justify-center">
                <div className="w-full max-w-7xl">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="text-6xl mb-4">⏳</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">جاري تحميل المنتجات...</h3>
                            </div>
                        </div>
                    ) : (
                        <ProductList productList={products} />
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            <PaginationControls 
                meta={meta}
                currentPage={page}
                onPageChange={handlePageChange}
                loading={loading}
            />
        </div>
    )
}

export default ProductSection