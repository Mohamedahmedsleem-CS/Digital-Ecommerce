'use client';

import React from 'react';

export default function QuantityPicker({ value = 1, onChange, min = 1, max = 99, className = '' }) {
  const dec = () => onChange(Math.max(min, (Number(value) || 1) - 1));
  const inc = () => onChange(Math.min(max, (Number(value) || 1) + 1));

  return (
    <div className={`inline-flex items-center rounded-full border px-2 py-1 gap-3 ${className}`}>
      <button type="button" onClick={dec} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">-</button>
      <input
        className="w-12 text-center outline-none"
        value={value}
        onChange={e => onChange(e.target.value.replace(/\D/g, '') || 1)}
        inputMode="numeric"
      />
      <button type="button" onClick={inc} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200">+</button>
    </div>
  );
} 