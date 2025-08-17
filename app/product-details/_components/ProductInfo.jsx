import { AlertOctagon, BadgeCheck, SaudiRiyal, ShoppingBag, ShoppingCartIcon } from 'lucide-react'
import React from 'react'

function ProductInfo({ product }) {
    return (
        <div className="space-y-6 ">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.title}
                </h1>
                <p className="text-lg text-gray-400">
                    {product.category}
                </p>
            </div>
            {product.description && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-500 leading-relaxed">
                        {product.description}
                    </p>
                </div>
            )}
            <h2 className='text-[11px] text-gray-500 flex gap-2 mt-2 items-center '>
                {product.instantDelivery ? <BadgeCheck className='w-5 h-5 text-green-500  ' /> : <AlertOctagon/>}
                Eligible for Instant Delivery
            </h2>

            <h2 className=' flex gap-1 items-center text-[32px] text-primary mt-3 '>
                {product?.price}
                <SaudiRiyal strokeWidth={1.5} absoluteStrokeWidth />
            </h2>


            {/* Add more product details as needed */}
            <div className="pt-6">
                <button className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors flex gap-2 justify-center">
                   <ShoppingCartIcon/> Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductInfo