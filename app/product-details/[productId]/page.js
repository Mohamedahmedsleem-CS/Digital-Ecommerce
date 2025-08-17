"use client"

import BreadCrumb from '@/app/_components/BreadCrumb';
import ProductApis from '@/app/_utils/ProductApis'
import React, { useEffect, useState } from 'react'
import ProductBanner from '../_components/ProductBanner';
import ProductInfo from '../_components/ProductInfo';
import ProductList from '@/app/_components/ProductList';
import { usePathname } from 'next/navigation';

function ProductDetails({ params }) {

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productList, setProductList] = useState([]);
    const path = usePathname();
    console.log('paath', path)

    useEffect(() => {
        getProductById_();
    }, [params?.productId]);

    const getProductById_ = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await ProductApis.getProductById(params.productId);
            console.log('Product response:', res);

            setProduct(res?.data ?? null);
            if (res?.data?.category) {
                getProductListByCategory(res.data.category, res.data.documentId || res.data.id);
            }

            if (!res?.data) {
                setError('Product not found');
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            setError(err?.response?.status === 404 ? 'Product not found' : (err?.message || 'Failed to fetch product'));
        } finally {
            setLoading(false);
        }
    };

 

    const getProductListByCategory = async (category, currentId) => {
        try {
            const list = await ProductApis.getProductByCategory(category);
            // (اختياري) استبعد المنتج الحالي من النتائج المشابهة
            const filtered = Array.isArray(list)
                ? list.filter(p => (p.documentId || p.id) !== currentId)
                : [];
            setProductList(filtered);
        } catch (e) {
            console.error(e);
            setProductList([]);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⏳</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Product...</h3>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Product Not Found</h3>
                        <p className="text-gray-500">{error || 'The requested product could not be found'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="px-4 md:px-6 py-3">
                <BreadCrumb
                    items={[
                        { href: '/', label: 'Home' },
                        { label: `/category/${product?.category}`, label: product?.category },
                        { label: product?.title || 'Product' },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProductBanner product={product} />
                <ProductInfo product={product} />
            </div>
            <div>
                <h2 className='mt-24 text-xl mb-4'>
                    similar productList
                </h2>
                <ProductList productList={productList} />
            </div>
        </div>
    );
}

export default ProductDetails