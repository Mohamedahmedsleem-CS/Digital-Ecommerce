'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const LS_KEY = 'cart_v1';
const NOTES_LS_KEY = 'cart_notes';

function readLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function writeLS(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');

  // hydrate
  useEffect(() => {
    const saved = readLS();
    if (Array.isArray(saved.items)) setItems(saved.items);
    
    // Load notes from localStorage
    try {
      const savedNotes = localStorage.getItem(NOTES_LS_KEY);
      if (savedNotes) setNotes(savedNotes);
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    writeLS({ items });
  }, [items]);

  // persist notes
  useEffect(() => {
    try {
      localStorage.setItem(NOTES_LS_KEY, notes);
    } catch {}
  }, [notes]);

  const addItem = (product, qty = 1) => {
    const key = product?.documentId || product?.id;
    if (!key) return;

    setItems(prev => {
      const idx = prev.findIndex(p => (p.documentId || p.id) === key);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], quantity: Math.max(1, (clone[idx].quantity || 1) + qty) };
        return clone;
      }
      const newItem = {
        id: product.id ?? null,
        documentId: product.documentId ?? null,
        title: product.title || product.name || 'Product',
        price: Number(product.price || 0),
        image: product.image || product.cover || product.thumbnail || product?.images?.[0]?.url || product?.banner?.[0]?.url || '',
        category: product.category || product?.category?.name || '',
        quantity: Math.max(1, qty),
      };
      return [...prev, newItem];
    });
  };

  const updateQty = (keyLike, qty) => {
    setItems(prev => prev.map(it => {
      const key = it.documentId || it.id;
      if (key === keyLike) return { ...it, quantity: Math.max(1, Number(qty) || 1) };
      return it;
    }));
  };

  const removeItem = (keyLike) => {
    setItems(prev => prev.filter(it => (it.documentId || it.id) !== keyLike));
  };

  const clearCart = () => {
    setItems([]);
    setNotes('');
    try {
      localStorage.removeItem(NOTES_LS_KEY);
    } catch {}
  };

  const count = useMemo(() => items.reduce((a, b) => a + (b.quantity || 1), 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, b) => a + (b.price || 0) * (b.quantity || 1), 0), [items]);

  const value = useMemo(() => ({
    items, addItem, updateQty, removeItem, clearCart, count, subtotal, notes, setNotes
  }), [items, count, subtotal, notes]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider />');
  return ctx;
} 