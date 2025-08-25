'use client';

import React, { useState } from 'react';
import { useCart } from '../_context/CartContext';
import { buildWhatsAppMessage } from '../_utils/whatsapp';

export default function WhatsAppCheckoutButton({ 
  items = [], 
  currency = 'SAR', 
  notes = '', 
  className = '',
  onSuccess = null
}) {
  const [loading, setLoading] = useState(false);
  const { items: cartItems, total, clearCart } = useCart();

  // Use provided items or fall back to cart items
  const messageItems = items.length > 0 ? items : cartItems;

  // استخدام buildWhatsAppMessage من whatsapp.js

  const handleCheckout = async () => {
    if (!messageItems.length) return;

    try {
      setLoading(true);
      
      const message = buildWhatsAppMessage({ items: messageItems, currency, notes });
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?phone=966573644405&text=${encodedMessage}`;

      console.log('Opening WhatsApp with message:', message);
      console.log('WhatsApp URL:', url);

      // Try to open WhatsApp in new tab
      const win = window.open(url, '_blank');
      
      // Clear cart after opening WhatsApp (with small delay)
      const clearCartWithDelay = () => {
        console.log('Clearing cart after WhatsApp checkout');
        clearCart();
        if (onSuccess) {
          onSuccess();
        }
      };
      
      if (win) {
        // Popup opened successfully, clear cart after delay
        console.log('WhatsApp opened in new tab, clearing cart in 300ms');
        setTimeout(clearCartWithDelay, 300);
      } else {
        // Popup blocked, redirect in same tab and clear cart
        console.log('Popup blocked, redirecting in same tab and clearing cart in 300ms');
        setTimeout(clearCartWithDelay, 300);
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error during WhatsApp checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !messageItems.length}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 ${className}`}
      aria-label="إتمام الطلب عبر واتساب"
    >
      {loading ? 'جارٍ التحويل...' : 'إتمام الطلب عبر واتساب'}
    </button>
  );
} 