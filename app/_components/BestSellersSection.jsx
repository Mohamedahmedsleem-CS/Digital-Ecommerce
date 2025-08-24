'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductItem from './ProductItem';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper-custom.css';

/**
 * مكون قسم المنتجات الأكثر طلباً مع سلايدر متقدم
 * يعرض المنتجات ذات الخاصية isBestSeller: true
 */
export default function BestSellersSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب المنتجات الأكثر طلباً
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/best-sellers');
        
        if (!response.ok) {
          throw new Error('فشل في جلب المنتجات الأكثر طلباً');
        }
        
        const result = await response.json();
        
        if (result.success) {
          setProducts(result.data || []);
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
  }, []);

  // إعدادات Swiper
  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 20,
    slidesPerView: 1,
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    pagination: {
      el: '.swiper-pagination-custom',
      clickable: true,
      dynamicBullets: true,
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    loop: true,
    centeredSlides: false,
  };

  // معالجة حالات التحميل والخطأ
  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              الأكثر طلباً
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اكتشف منتجاتنا الأكثر شعبية وطلباً من عملائنا الكرام
            </p>
          </div>
          
          {/* Skeleton Loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-t-lg h-[170px] mb-3"></div>
                <div className="bg-gray-200 rounded-b-lg h-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              الأكثر طلباً
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">حدث خطأ أثناء تحميل المنتجات</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // إذا لم توجد منتجات، لا نعرض القسم
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section id="best-sellers" className="py-12 ">
      <div className="container mx-auto px-4">
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              الأكثر طلباً
            </h2>
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اكتشف منتجاتنا الأكثر شعبية وطلباً من عملائنا الكرام
          </p>
        </div>

        {/* منطقة السلايدر باستخدام Swiper */}
        <div className="relative">
          {/* أزرار التنقل المخصصة */}
          <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 group cursor-pointer flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
          </div>

          <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 group cursor-pointer flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-teal-600 transition-colors" />
          </div>

          {/* Swiper Container */}
          <Swiper {...swiperConfig} className="px-12">
            {products.map((product, index) => (
              <SwiperSlide key={product.id || index}>
                <div className="px-2">
                  <ProductItem product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* نقاط التنقل المخصصة */}
          <div className="swiper-pagination-custom flex justify-center mt-8"></div>
        </div>

        {/* زر عرض جميع المنتجات المميزة */}
        <div className="text-center mt-8">
          <Link 
            href="/best-sellers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 group"
          >
            عرض جميع المنتجات المميزة
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
