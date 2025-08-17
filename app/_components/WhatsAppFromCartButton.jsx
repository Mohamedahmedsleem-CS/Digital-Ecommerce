'use client';

import React from 'react';
import { useCart } from '@/app/_context/CartContext';
import WhatsAppCheckoutButton from '@/app/_components/WhatsAppCheckoutButton';

export default function WhatsAppFromCartButton({ className = '', onSuccess = null }) {
  const { items, subtotal, notes, clearCart } = useCart();

  // WhatsApp util expects: [{ title, quantity, price }, ...]
  const mapped = items.map(it => ({
    title: it.title,
    quantity: it.quantity,
    price: it.price,
  }));

  // Clean and sanitize notes
  const cleanNotes = notes.trim();
  let finalNotes = `إجمالي السلة: ${subtotal.toFixed(2)} ريال`;
  
  if (cleanNotes) {
    finalNotes += `\n\n— ملاحظات:\n${cleanNotes}`;
  }

  const handleSuccess = () => {
    // Clear cart first
    clearCart();
    // Then call the parent onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <WhatsAppCheckoutButton
      items={mapped}
      currency="SAR"
      notes={finalNotes}
      className={className}
      onSuccess={handleSuccess}
    />
  );
} 