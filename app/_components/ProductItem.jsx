import { List, SaudiRiyal } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ProductImage from './ProductImage'

function ProductItem({product}) {
  const productTitle = product?.title || product?.name || 'منتج';
  const productCategory = product?.category || product?.category?.name || 'غير محدد';
  const productPrice = product?.price || 0;

  return (
    <Link href={`/product-details/${product.documentId || product.id}`}>
      <div className='p-1 rounded-lg hover:border hover:shadow-md border-teal-400 hover:cursor-pointer' >
        {/* Product Image */}
        <ProductImage 
          product={product}
          className='rounded-t-lg h-[170px] object-cover'
          fallbackClassName='rounded-t-lg h-[170px] bg-gray-200 flex items-center justify-center'
          useNextImage={true}
          width={400}
          height={350}
        />
        
        {/* Product Info */}
        <div className="p-3 flex justify-between items-center bg-gray-50 rounded-b-lg">
          <div className="flex-1 min-w-0">
            <h2 className='text-[13px] font-medium truncate' title={productTitle}>
              {productTitle}
            </h2>
            <h2 className='text-[10px] text-gray-500 flex gap-1 items-center'>
              <List className='w-4 h-4 flex-shrink-0'/>
              <span className='truncate' title={productCategory}>
                {productCategory}
              </span>
            </h2>
          </div>
          <div className='flex gap-1 items-center flex-shrink-0 ml-2'>
            <span className='text-sm font-medium'>{Number(productPrice).toFixed(2)}</span>
            <SaudiRiyal strokeWidth={1.5} absoluteStrokeWidth className='w-4 h-4' />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem