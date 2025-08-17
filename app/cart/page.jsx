'use client';

import React, { useState } from 'react';
import WhatsAppCheckoutButton from '../_components/WhatsAppCheckoutButton';
import { ShoppingCart, Trash2 } from 'lucide-react';

export default function CartPage() {
  // Example cart state (replace with your actual cart state)
  const [cartItems, setCartItems] = useState([
    { id: 1, title: 'عسل مانوكا الطبيعي', quantity: 2, price: 120.50 },
    { id: 2, title: 'زيت اللحية والشارب', quantity: 1, price: 75.00 },
    { id: 3, title: 'كريم ترطيب البشرة', quantity: 3, price: 45.25 },
  ]);

  const [notes, setNotes] = useState('لو ممكن التغليف هدية 🎁');

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">سلة المشتريات</h1>
        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
          {totalItems} منتج
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">السلة فارغة</h2>
          <p className="text-gray-500">أضف منتجات لسلة المشتريات</p>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">السعر: {item.price.toFixed(2)} ريال</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-right min-w-[80px]">
                  <p className="font-semibold text-gray-900">
                    {(item.quantity * item.price).toFixed(2)} ريال
                  </p>
                </div>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  aria-label="حذف المنتج"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات إضافية:
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="أضف ملاحظات أو تعليمات خاصة..."
            />
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700">إجمالي المنتجات:</span>
              <span className="text-lg font-semibold text-gray-900">{totalItems}</span>
            </div>
            <div className="flex justify-between items-center text-2xl font-bold text-primary">
              <span>المجموع الكلي:</span>
              <span>{calculateTotal().toFixed(2)} ريال</span>
            </div>
          </div>

          {/* WhatsApp Checkout Button */}
          <div className="text-center">
            <WhatsAppCheckoutButton 
              items={cartItems} 
              currency="SAR" 
              notes={notes}
              className="text-lg px-8 py-4"
            />
            <p className="text-sm text-gray-500 mt-3">
              سيتم تحويلك لواتساب لإتمام الطلب مع رقم المتجر: 009665043099114
            </p>
          </div>
        </>
      )}
    </div>
  );
} 