'use client';

import React from 'react';
import { useCart } from '@/app/_context/CartContext';
import WhatsAppCheckoutButton from '@/app/_components/WhatsAppCheckoutButton';

export default function WhatsAppFromCartButton({ className = '', onSuccess = null }) {
  const { items, total, notes, clearCart } = useCart();

  // WhatsApp util expects: [{ title, quantity, price, isWeighed, totalWeight, weightUnit, basePrice }]
  const mapped = items.map(it => {
    console.log('🔍 WhatsAppFromCartButton - Mapping item:', {
      title: it.title,
      isWeighed: it.isWeighed,
      selectedWeightOptions: it.selectedWeightOptions,
      totalWeight: it.totalWeight,
      weightUnit: it.weightUnit,
      price: it.price,
      basePrice: it.basePrice,
      fullItem: it  // إضافة العنصر كاملاً للتأكد من البيانات
    });
    
    return {
      title: it.title,
      quantity: it.quantity,
      price: it.price,
      isWeighed: it.isWeighed || false,
      totalWeight: it.totalWeight || 0,
      weightUnit: it.weightUnit || 'كج',
      basePrice: it.basePrice || it.price,
      selectedWeightOptions: it.selectedWeightOptions || []
    };
  });

  // Clean and sanitize notes
  const cleanNotes = notes.trim();
  let finalNotes = `إجمالي السلة: ${total.toFixed(2)} ريال`;
  
  if (cleanNotes) {
    finalNotes += `\n\n— ملاحظات:\n${cleanNotes}`;
  }

  return (
    <WhatsAppCheckoutButton
      items={mapped}
      currency="SAR"
      notes={finalNotes}
      className={className}
      onSuccess={onSuccess}
    />
  );
} 