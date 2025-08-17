"use client"
import React, { useEffect, useState } from 'react'
import ProductList from './ProductList'
import ProductApis from '../_utils/ProductApis';

function ProductSection() {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getLatestProducts_();
    }, []);

    // get data by axios
    const getLatestProducts_ = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const res = await ProductApis.getLatestProducts();
            console.log('Full response:', res);
            
            // Strapi v5 returns { data: [...], meta: {...} }
            if (res && Array.isArray(res.data)) {
                setProductList(res.data);
            } else {
                console.error('Unexpected response structure:', res);
                setProductList([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message || 'Failed to fetch products');
            setProductList([]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="border flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center mb-6">Latest Products</h2>
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
            <div className="border flex flex-col items-center">
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
        <div className="border flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-6">Latest Products</h2>
            <div className="w-full flex justify-center">
                <div className="w-full max-w-7xl">
                    <ProductList productList={productList} />
                </div>
            </div>
        </div>
    )
}

export default ProductSection