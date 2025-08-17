'use client';

import React, { useState } from 'react';
import { useCart } from '@/app/_context/CartContext';
import WhatsAppFromCartButton from '@/app/_components/WhatsAppFromCartButton';
import { ShoppingCart, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart, notes, setNotes } = useCart();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          {showSuccessMessage ? 'تم إرسال الطلب بنجاح! 🎉' : 'السلة فارغة'}
        </h2>
        <p className="text-gray-500">
          {showSuccessMessage 
            ? 'تم تحويلك لواتساب لإتمام الطلب. ستتمكن من متابعة طلبك هناك.' 
            : 'أضف منتجات لسلة المشتريات'
          }
        </p>
        {showSuccessMessage && (
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            العودة للتسوق
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">سلة المشتريات</h1>

      <ul className="space-y-4">
        {items.map(it => {
          const key = it.documentId || it.id;
          return (
            <li key={key} className="flex items-center justify-between border rounded-xl p-4">
              <div className="flex items-center gap-4">
                {it.image ? (
                  <img src={it.image} alt={it.title} className="w-16 h-16 object-cover rounded-lg" />
                ) : <div className="w-16 h-16 bg-gray-100 rounded-lg" />}
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-gray-500">{Number(it.price).toFixed(2)} ريال</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="inline-flex items-center rounded-full border">
                  <button
                    className="px-3 py-1"
                    onClick={() => updateQty(key, Math.max(1, (it.quantity || 1) - 1))}
                  >-</button>
                  <input
                    className="w-12 text-center outline-none"
                    value={it.quantity}
                    onChange={e => updateQty(key, e.target.value.replace(/\D/g, '') || 1)}
                  />
                  <button
                    className="px-3 py-1"
                    onClick={() => updateQty(key, Math.min(99, (it.quantity || 1) + 1))}
                  >+</button>
                </div>

                <div className="w-24 text-right font-semibold">
                  {(it.quantity * it.price).toFixed(2)} ريال
                </div>

                <button
                  className="text-red-600 hover:underline"
                  onClick={() => removeItem(key)}
                >
                  إزالة
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Order Notes */}
      <div className="mt-6 space-y-2" dir="rtl">
        <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700">
          ملاحظات الطلب (اختياري)
        </label>
        <textarea
          id="order-notes"
          aria-label="ملاحظات الطلب"
          maxLength={300}
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 300))}
          placeholder="اكتب أي تفاصيل إضافية (مثلاً: موعد التسليم، ملاحظات التغليف…)"
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 placeholder:text-gray-400"
          rows={4}
        />
        <div className={`text-xs text-end ${notes.length === 300 ? 'text-red-600' : notes.length > 280 ? 'text-amber-600' : 'text-gray-500'}`}>
          {notes.length}/300
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-lg font-semibold">الإجمالي: {subtotal.toFixed(2)} ريال</div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full border" onClick={clearCart}>تفريغ السلة</button>
          <WhatsAppFromCartButton 
            className="px-5 py-3 rounded-full text-white bg-green-600 hover:bg-green-700"
            onSuccess={() => setShowSuccessMessage(true)}
          />
        </div>
      </div>
    </div>
  );
} 