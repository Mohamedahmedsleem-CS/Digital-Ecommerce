import { AlertOctagon, BadgeCheck, SaudiRiyal, ShoppingBag, ShoppingCartIcon } from 'lucide-react'
import React, { useState } from 'react'
import QuantityPicker from '@/app/_components/QuantityPicker'
import { useCart } from '@/app/_context/CartContext'
import WhatsAppCheckoutButton from '@/app/_components/WhatsAppCheckoutButton'

function ProductInfo({ product }) {
    const { addItem } = useCart();
    const [qty, setQty] = useState(1);

    const handleAdd = () => {
        // map product shape from Strapi v5
        const mapped = {
            id: product?.id ?? null,
            documentId: product?.documentId ?? null,
            title: product?.title || product?.name,
            price: Number(product?.price || 0),
            image: product?.image || product?.images?.[0]?.url || product?.banner?.[0]?.url || '',
            category: product?.category || product?.category?.name,
        };
        addItem(mapped, Number(qty) || 1);
    };

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
            <div className="pt-6 space-y-3">
                <div className="flex items-center gap-4">
                    <QuantityPicker value={qty} onChange={setQty} />
                    <button
                        onClick={handleAdd}
                        className="flex-1 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-teal-700 text-white px-6 py-3 transition-colors"
                    >
                        <ShoppingCartIcon/> إضافة للسلة
                    </button>
                </div>
                
                {/* WhatsApp Checkout Button */}
                <WhatsAppCheckoutButton 
                    items={[{ 
                        title: product.title, 
                        quantity: qty, 
                        price: parseFloat(product.price) || 0 
                    }]} 
                    currency="SAR"
                    notes=""
                    className="w-full"
                />
            </div>
        </div>
    )
}

export default ProductInfo