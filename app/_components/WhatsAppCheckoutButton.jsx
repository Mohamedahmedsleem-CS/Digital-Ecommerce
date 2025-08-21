'use client';

import React, { useState } from 'react';
import { useCart } from '../_context/CartContext';

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

  const buildWhatsAppMessage = () => {
    if (!messageItems.length) return '';

    const lines = [];
    lines.push('🛒 *طلب جديد*');
    lines.push('-------------------------');

    // Order details
    messageItems.forEach((item) => {
      const title = item.title || item.name || 'Product';
      const qty = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const subtotal = qty * price;
      
      let itemLine = `• ${title} x${qty} = ${subtotal.toFixed(2)} ${currency}`;
      
      // Add weight information for weighed products
      if (item.isWeighed && item.weightUnit) {
        if (item.selectedWeightOptions && item.selectedWeightOptions.length > 0) {
          // Multiple weight options selected
          const weightDetails = item.selectedWeightOptions.map(option => {
            let detail = `${option.displayName || `${option.value} ${item.weightUnit}`}`;
            if (option.price_modifier && option.price_modifier !== 1) {
              detail += ` [${option.price_modifier > 1 ? '+' : ''}${((option.price_modifier - 1) * 100).toFixed(0)}%]`;
            }
            return detail;
          }).join(' + ');
          
          itemLine += ` (${weightDetails})`;
          if (item.totalWeight) {
            itemLine += ` = ${item.totalWeight} ${item.weightUnit}`;
          }
        } else if (item.weightValue) {
          // Legacy single weight option
          itemLine += ` (${item.weightValue} ${item.weightUnit})`;
          if (item.priceModifier && item.priceModifier !== 1) {
            itemLine += ` [${item.priceModifier > 1 ? '+' : ''}${((item.priceModifier - 1) * 100).toFixed(0)}%]`;
          }
        }
      }
      
      lines.push(itemLine);
    });

    lines.push('-------------------------');
    lines.push(`Total: ${total.toFixed(2)} ${currency}`);

    if (notes && notes.trim()) {
      lines.push('');
      lines.push(notes.trim());
    }

    return lines.join('\n');
  };

  const handleCheckout = async () => {
    if (!messageItems.length) return;

    try {
      setLoading(true);
      
      const message = buildWhatsAppMessage();
      const encodedMessage = encodeURIComponent(message);
      const url = `https://api.whatsapp.com/send?phone=009665043099114&text=${encodedMessage}`;

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