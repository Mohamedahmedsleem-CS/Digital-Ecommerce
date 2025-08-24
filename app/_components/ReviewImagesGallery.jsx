'use client';

import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, Image as ImageIcon } from 'lucide-react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

// مكون محسن للتعامل مع reviewImages من Strapi
function ReviewImagesGallery({ reviews = [], reviewImages = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  // تسجيل للتصحيح
  useEffect(() => {
    console.log("ReviewImagesGallery Data:", {
      reviews,
      reviewImages,
      hasDirectReviewImages: Array.isArray(reviewImages) && reviewImages.length > 0
    });
  }, [reviews, reviewImages]);

  // إعداد معرض الصور
  useEffect(() => {
    if (selectedImage) {
      const imageItem = {
        original: selectedImage.url || selectedImage.imageUrl,
        thumbnail: selectedImage.url || selectedImage.imageUrl,
        description: selectedImage.comment || '',
      };
      
      setGalleryImages([imageItem]);
      setIsGalleryOpen(true);
    } else {
      setIsGalleryOpen(false);
    }
  }, [selectedImage]);

  // التحقق من وجود صور للعرض
  if (!reviewImages?.length) {
    console.log("No review images found");
    return null;
  }

  // فتح المعرض لصورة محددة
  const openGallery = (image) => {
    setSelectedImage(image);
  };

  // إغلاق المعرض
  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-8">
      <div className="p-5 border-b">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-teal-600" />
          صور من تقييمات العملاء ({reviewImages.length})
        </h3>
      </div>
      
      <div className="p-5">
        {/* معرض الصور المصغرة */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {reviewImages.map((image, index) => (
            <div 
              key={image.id || index} 
              className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => openGallery(image)}
            >
              {/* الصورة المصغرة */}
              <div className="w-full h-full">
                <img
                  src={image.url || image.imageUrl}
                  alt={`تقييم رقم ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/300x300/e2e8f0/64748b?text=صورة+غير+متوفرة";
                  }}
                />
              </div>
              
              {/* تراكب عند التحويم */}
              <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                {image.userName && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-medium">
                      <User className="w-3 h-3" />
                      <span>{image.userName}</span>
                    </div>
                    {image.rating && (
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < image.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {image.comment && (
                  <p className="text-xs line-clamp-2 mt-1">{image.comment}</p>
                )}
                
                <div className="mt-2 bg-white/20 text-white text-xs py-1 px-2 rounded inline-flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  عرض
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* معرض الصور الكبير */}
      {isGalleryOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl">
            {/* زر الإغلاق */}
            <button
              onClick={closeGallery}
              className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-10 transition-colors"
              aria-label="إغلاق"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* الصورة الكبيرة */}
            <div className="flex items-center justify-center h-full">
              <img 
                src={selectedImage.url || selectedImage.imageUrl}
                alt="صورة تقييم"
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
            
            {/* معلومات إضافية */}
            {(selectedImage.userName || selectedImage.comment) && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mt-3 text-white">
                {selectedImage.userName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{selectedImage.userName}</span>
                  </div>
                )}
                
                {selectedImage.comment && (
                  <p className="text-sm mt-1">{selectedImage.comment}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .review-images-gallery .image-gallery-slide img {
          max-height: 70vh;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}

export default ReviewImagesGallery;