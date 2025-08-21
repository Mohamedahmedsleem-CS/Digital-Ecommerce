import React from 'react'
import ProductImage from '@/app/_components/ProductImage'

function ProductBanner({ product }) {
  return (
    <div className="">
      <div className="aspect-square overflow-hidden rounded-lg">
        <ProductImage 
          product={product}
          className="w-full h-full object-cover"
          fallbackClassName="w-full h-full bg-gray-200 flex items-center justify-center"
        />
      </div>
    </div>
  )
}

export default ProductBanner