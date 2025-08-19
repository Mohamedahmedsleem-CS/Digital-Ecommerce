'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const LS_KEY = 'cart:v1';
const NOTES_LS_KEY = 'cart_notes';

function readLS() {
  if (typeof window === 'undefined') return { items: [] };
  
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure we have the expected structure
      if (parsed && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
    return { items: [] };
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return { items: [] };
  }
}

function writeLS(state) {
  if (typeof window === 'undefined') return;
  
  try { 
    localStorage.setItem(LS_KEY, JSON.stringify(state)); 
    console.log('Cart saved to localStorage:', state);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  } 
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = readLS();
      console.log('Loading cart from localStorage:', saved);
      
      if (Array.isArray(saved.items)) {
        setItems(saved.items);
      }
      
      // Load notes from localStorage
      try {
        const savedNotes = localStorage.getItem(NOTES_LS_KEY);
        if (savedNotes) {
          setNotes(savedNotes);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
      
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever items change (but not on initial load)
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const count = items.reduce((a, b) => a + (b.quantity || 1), 0);
      const total = items.reduce((a, b) => a + (b.price || 0) * (b.quantity || 1), 0);
      
      const cartState = { items, count, total };
      writeLS(cartState);
    }
  }, [items, isInitialized]);

  // Save notes to localStorage
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(NOTES_LS_KEY, notes);
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  }, [notes, isInitialized]);

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
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LS_KEY);
        localStorage.removeItem(NOTES_LS_KEY);
        console.log('Cart cleared from localStorage');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const count = useMemo(() => items.reduce((a, b) => a + (b.quantity || 1), 0), [items]);
  const total = useMemo(() => items.reduce((a, b) => a + (b.price || 0) * (b.quantity || 1), 0), [items]);

  const value = useMemo(() => ({
    items, addItem, updateQty, removeItem, clearCart, count, total, notes, setNotes
  }), [items, count, total, notes]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider />');
  return ctx;
} 