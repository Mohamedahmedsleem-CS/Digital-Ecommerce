'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Thumbs, FreeMode, Zoom } from 'swiper/modules';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductImage from '@/app/_components/ProductImage';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';

function ProductBanner({ product }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // تجميع جميع الصور (الصورة الرئيسية + الصور الإضافية من files)
  const allImages = React.useMemo(() => {
    const images = [];
    
    // إضافة الصورة الرئيسية أولاً
    if (product?.banner?.[0]?.url) {
      images.push({
        id: 'main',
        url: product.banner[0].url,
        alt: product.title || 'صورة المنتج الرئيسية'
      });
    }
    
    // إضافة الصور الإضافية من حقل files
    if (product?.files && Array.isArray(product.files)) {
      product.files.forEach((file, index) => {
        if (file?.url) {
          images.push({
            id: `file-${index}`,
            url: file.url,
            alt: `${product.title || 'المنتج'} - صورة ${index + 1}`
          });
        }
      });
    }
    
    return images;
  }, [product]);

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  // إذا لم توجد صور، عرض رسالة
  if (allImages.length === 0) {
    return (
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-sm">لا توجد صور متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {/* معرض الصور الرئيسي بنمط Super Flow */}
        <div className="relative rounded-xl overflow-hidden bg-gray-100">
          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow, Thumbs, FreeMode, Zoom]}
            effect="coverflow"
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true
            }}
            zoom={true}
            slidesPerView={'auto'}
            centeredSlides={true}
            loop={allImages.length > 1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            className="product-banner-swiper h-80 sm:h-96 md:h-[28rem]"
          >
            {allImages.map((image, index) => (
              <SwiperSlide key={image.id} className="swiper-slide-custom">
                <div className="swiper-zoom-container">
                  <ProductImage 
                    product={{ ...product, banner: [{ url: image.url }] }}
                    className="w-full h-full object-contain cursor-pointer"
                    fallbackClassName="w-full h-full bg-gray-200 flex items-center justify-center"
                  />
                </div>
                
                {/* زر التكبير */}
                <button
                  onClick={() => handleImageClick(index)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="تكبير الصورة"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </SwiperSlide>
            ))}
            
            {/* أزرار التنقل المخصصة */}
            {allImages.length > 1 && (
              <>
                <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 transition-all cursor-pointer">
                  <ChevronLeft className="w-5 h-5" />
                </div>
                <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-3 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 transition-all cursor-pointer">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </>
            )}
          </Swiper>
        </div>

        {/* معرض الصور المصغرة */}
        {allImages.length > 1 && (
          <div className="relative px-5">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumbs-swiper"
              breakpoints={{
                0: { slidesPerView: 3.5 },
                640: { slidesPerView: 4.5 },
                768: { slidesPerView: 5.5 },
                1024: { slidesPerView: 6.5 },
              }}
            >
              {allImages.map((image) => (
                <SwiperSlide key={`thumb-${image.id}`} className="cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-md border-2 border-gray-200 hover:border-teal-500 transition-colors">
                    <ProductImage 
                      product={{ ...product, banner: [{ url: image.url }] }}
                      className="w-full h-full object-cover"
                      fallbackClassName="w-full h-full bg-gray-100"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      {/* Lightbox للصور */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-full">
            {/* زر الإغلاق */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-10 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>

            {/* الصور في المعرض المكبر */}
            <Swiper
              initialSlide={lightboxIndex}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination, Zoom]}
              zoom={true}
              className="lightbox-swiper h-full"
            >
              {allImages.map((image) => (
                <SwiperSlide key={`lightbox-${image.id}`} className="flex items-center justify-center">
                  <div className="swiper-zoom-container">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="max-w-full max-h-[80vh] object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* عداد الصور */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {lightboxIndex + 1} من {allImages.length}
            </div>
          </div>
        </div>
      )}

      {/* CSS المضمن للتخصيص */}
      <style jsx global>{`
        .product-banner-swiper .swiper-slide-custom {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        
        .product-banner-swiper .swiper-pagination-bullet-active {
          background-color: #0D9488;
        }
        
        .thumbs-swiper .swiper-slide-thumb-active div {
          border-color: #0D9488;
        }
      `}</style>
    </>
  );
}

export default ProductBanner;