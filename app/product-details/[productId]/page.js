"use client"

import BreadCrumb from '@/app/_components/BreadCrumb';
import ProductApis from '@/app/_utils/ProductApis'
import React, { useEffect, useState } from 'react'
import ProductBanner from '../_components/ProductBanner';
import ProductInfo from '../_components/ProductInfo';
import ProductList from '@/app/_components/ProductList';
import ReviewImagesGallery from '@/app/_components/ReviewImagesGallery';
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
            // استبعاد المنتج الحالي من النتائج المشابهة
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
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">جاري تحميل المنتج...</h3>
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
                        <div className="bg-red-100 text-red-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 text-2xl">❌</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">المنتج غير موجود</h3>
                        <p className="text-gray-500">{error || 'لم يتم العثور على المنتج المطلوب'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="px-4 md:px-6 py-3">
                <BreadCrumb
                    items={[
                        { href: '/', label: 'الرئيسية' },
                        { href: `/category/${product?.category}`, label: product?.category },
                        { label: product?.title || 'المنتج' },
                    ]}
                />
            </div>

            {/* معلومات المنتج الأساسية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 md:px-6">
                <ProductBanner product={product} />
                <ProductInfo product={product} />
            </div>

            {/* قسم المراجعات والصور */}
            <div className="px-4 md:px-6 mt-12">
                <ReviewImagesGallery 
                    reviews={product?.reviews || []} 
                />
            </div>

            {/* المنتجات المشابهة */}
            {productList.length > 0 && (
                <div className="px-4 md:px-6 mt-16 pb-8">
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                        منتجات مشابهة
                    </h2>
                    <ProductList productList={productList} />
                </div>
            )}
        </div>
    );
}

export default ProductDetails;