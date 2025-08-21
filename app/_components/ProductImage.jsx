'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import NextImage from 'next/image';

function ProductImage({ 
  product, 
  className = '', 
  fallbackClassName = '',
  showFallback = true,
  alt = null,
  useNextImage = false,
  width = 400,
  height = 350,
  ...imageProps 
}) {
  // Function to get the best available image
  const getProductImage = () => {
    // Try different image sources in order of preference
    if (product?.banner?.[0]?.url) {
      return product.banner[0].url;
    }
    if (product?.images?.[0]?.url) {
      return product.images[0].url;
    }
    if (product?.image) {
      return product.image;
    }
    if (product?.cover) {
      return product.cover;
    }
    if (product?.thumbnail) {
      return product.thumbnail;
    }
    // Return null if no image is available
    return null;
  };

  const productImage = getProductImage();
  const productTitle = product?.title || product?.name || 'منتج';
  const imageAlt = alt || `صورة ${productTitle}`;

  // Default fallback styles
  const defaultFallbackClass = 'bg-gray-200 flex items-center justify-center text-gray-500';
  const fallbackClass = fallbackClassName || defaultFallbackClass;

  if (!productImage) {
    if (!showFallback) return null;
    
    return (
      <div className={`${fallbackClass} ${className}`}>
        <div className='text-center'>
          <ImageIcon className='w-8 h-8 mx-auto mb-2 opacity-50' />
          <p className='text-xs'>لا توجد صورة</p>
        </div>
      </div>
    );
  }

  const ImageComponent = useNextImage ? NextImage : 'img';
  const imagePropsToPass = useNextImage 
    ? { width, height, ...imageProps }
    : { ...imageProps };

  return (
    <>
      <ImageComponent
        src={productImage}
        alt={imageAlt}
        className={className}
        onError={(e) => {
          if (showFallback) {
            // Hide the image if it fails to load
            e.target.style.display = 'none';
            const fallback = e.target.nextSibling;
            if (fallback) {
              fallback.style.display = 'flex';
            }
          }
        }}
        {...imagePropsToPass}
      />
      
      {/* Fallback placeholder when image fails to load */}
      {showFallback && (
        <div 
          className={`${fallbackClass} ${className}`}
          style={{ display: 'none' }}
        >
          <div className='text-center'>
            <ImageIcon className='w-8 h-8 mx-auto mb-2 opacity-50' />
            <p className='text-xs'>فشل في تحميل الصورة</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductImage;
