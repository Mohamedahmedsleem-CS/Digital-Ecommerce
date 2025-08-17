import React from 'react'

function ProductBanner({product}) {
  return (
    <div className="space-y-4">
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