import React from 'react'

function ProductBanner({ product }) {
  return (
    <div className="">
      
      <div className="aspect-square overflow-hidden rounded-lg">
        <img
          src={product.banner?.[0]?.url || '/placeholder-image.jpg'}
          alt={product.title || 'Product Image'}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export default ProductBanner