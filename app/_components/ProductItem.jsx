import { List, SaudiRiyal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ProductItem({product}) {
  return (
    <Link href={`/product-details/${product.documentId || product.id}`}>
      <div className='p-1 rounded-lg hover:border hover:shadow-md border-teal-400 hover:cursor-pointer' >
          <Image src={product.banner[0].url}
           alt='bannar card'
           width={400}
           height={350}
           className='rounded-t-lg h-[170px] object-cover'
           />
          <div className="p-3 flex justify-between items-center bg-gray-50 rounded-b-lg ">
          <div className=" ">
              {/* line-clamp-1 */}
              <h2 className='text-[13px] font-medium ' >{product?.title}</h2>
              <h2 className='text-[10px] text-gray-500 flex gap-1 items-center'>
              <List className='w-4 h-4'/>
                  {product?.category}
                  </h2>
           </div>
           <h2 className=' flex gap-1 items-center '>{product?.price}
           <SaudiRiyal strokeWidth={1.5} absoluteStrokeWidth /></h2>
          </div>
      </div>
    </Link>
  )
}

export default ProductItem