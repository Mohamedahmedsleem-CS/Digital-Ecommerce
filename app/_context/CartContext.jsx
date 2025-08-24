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
      // تم تعديل حساب العداد هنا للتمييز بين المنتجات بالوزن والمنتجات بالقطعة
      const count = items.reduce((a, item) => {
        // المنتجات بالوزن تحسب كعنصر واحد بغض النظر عن الكمية
        if (item.isWeighed) return a + 1;
        // المنتجات العادية تحسب بالكمية
        return a + (item.quantity || 1);
      }, 0);
      
      // تعديل طريقة حساب الإجمالي
      const total = items.reduce((a, item) => {
        if (item.isWeighed) {
          // للمنتجات المباعة بالوزن، نستخدم السعر الإجمالي مباشرة
          return a + (item.price || 0);
        } else {
          // للمنتجات المباعة بالقطعة، نضرب سعر القطعة في الكمية
          const unitPrice = item.basePrice || item.price || 0;
          return a + unitPrice * (item.quantity || 1);
        }
      }, 0);
      
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
    if (!product) return;
    
    console.log('Adding product to cart:', product);
    console.log('Selected weight options:', product.selectedWeightOptions);
    
    const productId = product?.documentId || product?.id;
    if (!productId) return;

    setItems(prev => {
      // نسخة جديدة من العناصر
      const newItems = [...prev];
      
      // ابحث عن نفس المنتج
      const existingIdx = newItems.findIndex(p => (p.documentId || p.id) === productId);
      
      // إذا كان المنتج موجودًا بالفعل
      if (existingIdx >= 0) {
        console.log('Found existing product in cart at index:', existingIdx);
        const existingItem = newItems[existingIdx];
        
        // للمنتجات المباعة بالوزن
        if (product.isWeighed && existingItem.isWeighed) {
          console.log('🔍 CartContext - دمج أوزان المنتج الموجود:', product.title);
          console.log('🔍 CartContext - الأوزان الموجودة:', existingItem.selectedWeightOptions);
          console.log('🔍 CartContext - الأوزان الجديدة:', product.selectedWeightOptions);
          
          // استخراج الأوزان الموجودة والجديدة
          const existingWeights = existingItem.selectedWeightOptions || [];
          const newWeights = product.selectedWeightOptions || [];
          
          // دمج قوائم الأوزان - السماح بالتكرار للتجميع
          // بدلاً من Map، نستخدم مصفوفة بسيطة مع منطق تجميع
          let mergedWeights = [...existingWeights];
          
          // إضافة الأوزان الجديدة مع منطق التجميع
          newWeights.forEach(newWeight => {
            // البحث عن وزن مماثل في الأوزان الموجودة
            const similarWeightIndex = mergedWeights.findIndex(existingWeight => 
              existingWeight.value === newWeight.value && 
              existingWeight.price_modifier === newWeight.price_modifier
            );
            
            if (similarWeightIndex >= 0) {
              // إذا وجد وزن مماثل، نضيف إليه
              console.log('🔍 CartContext - تجميع وزن مماثل:', newWeight.value, 'مع', mergedWeights[similarWeightIndex].value);
              // نضيف الوزن الجديد كعنصر منفصل (للتجميع)
              mergedWeights.push(newWeight);
            } else {
              // إذا لم يوجد وزن مماثل، نضيفه كعنصر جديد
              console.log('🔍 CartContext - إضافة وزن جديد:', newWeight.value);
              mergedWeights.push(newWeight);
            }
          });
          
          console.log('🔍 CartContext - الأوزان المدمجة (قبل الترتيب):', mergedWeights);
          
          // ترتيب الأوزان من الأكبر للأصغر
          const sortedWeights = [...mergedWeights].sort((a, b) => b.value - a.value);
          
          // حساب الوزن الإجمالي الجديد (مجموع جميع الأوزان)
          const totalWeight = sortedWeights.reduce((total, opt) => total + opt.value, 0);
          
          // حساب السعر النهائي (المعامل السعري يطبق على الوزن الأكبر فقط)
          let totalPrice = 0;
          const basePrice = Number(existingItem.basePrice || 0);
          
          // تطبيق منطق الحساب الجديد: المعامل على الأكبر فقط
          if (sortedWeights.length > 0) {
            // الوزن الأكبر: تطبيق المعامل السعري
            const largestWeight = sortedWeights[0];
            const modifier = largestWeight.price_modifier || 1;
            totalPrice += basePrice * modifier * largestWeight.value;
            
            // باقي الأوزان: بدون معامل سعري
            for (let i = 1; i < sortedWeights.length; i++) {
              totalPrice += basePrice * sortedWeights[i].value;
            }
          }
          
          console.log('🔍 CartContext - الوزن الإجمالي الجديد:', totalWeight);
          console.log('🔍 CartContext - السعر الإجمالي الجديد:', totalPrice);
          
          // تحديث العنصر بالأوزان الجديدة والسعر المحدث
          // بالنسبة للمنتجات بالوزن: نحتفظ بالكمية = 1 دائمًا
          newItems[existingIdx] = {
            ...existingItem,
            selectedWeightOptions: sortedWeights,
            totalWeight: totalWeight,
            price: totalPrice,
            quantity: 1, // دائما نحتفظ بالكمية = 1 للمنتجات بالوزن
            weightBreakdown: sortedWeights.map(option => ({
              value: option.value,
              priceModifier: option.price_modifier,
              displayName: option.displayName
            })),
          };
        } else {
          // للمنتجات غير الموزونة، زد الكمية فقط
          console.log('🔍 CartContext - زيادة كمية المنتج غير الموزون:', product.title);
          newItems[existingIdx] = {
            ...existingItem,
            quantity: (existingItem.quantity || 1) + qty
          };
        }
      } else {
        // المنتج غير موجود في السلة، أضفه
        console.log('🔍 CartContext - إضافة منتج جديد:', product.title);
        
        // إضافة منتج جديد - نضع كمية=1 دائما للمنتجات بالوزن
        const newItem = {
          id: product.id ?? null,
          documentId: product.documentId ?? null,
          title: product.title || product.name || 'Product',
          price: Number(product.price || 0),
          basePrice: Number(product.basePrice || product.price || 0),
          image: product.image || product.cover || product.thumbnail || 
                 (product.images && product.images[0] ? product.images[0].url : '') || 
                 (product.banner && product.banner[0] ? product.banner[0].url : ''),
          category: product.category || product?.category?.name || '',
          quantity: product.isWeighed ? 1 : Math.max(1, qty), // دائما كمية=1 للمنتجات بالوزن
          // معلومات الوزن
          isWeighed: product.isWeighed || false,
          selectedWeightOptions: product.selectedWeightOptions || [],
          totalWeight: product.totalWeight || 0,
          weightUnit: product.weightUnit || '',
          weightBreakdown: product.weightBreakdown || [],
        };
        
        newItems.push(newItem);
      }
      
      console.log('🔍 CartContext - العناصر المحدثة في السلة:', newItems);
      return newItems;
    });
  };

  const updateQty = (keyLike, qty) => {
    setItems(prev => prev.map(it => {
      const key = it.documentId || it.id;
      if (key === keyLike) {
        // تحديث الكمية - للمنتجات المباعة بالوزن نحتفظ بالكمية = 1
        const updatedQuantity = it.isWeighed ? 1 : Math.max(1, Number(qty) || 1);
        return { ...it, quantity: updatedQuantity };
      }
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

  // تم تعديل منطق العداد ليميز بين المنتجات بالوزن والمنتجات بالقطعة
  const count = useMemo(() => {
    return items.reduce((sum, item) => {
      // المنتجات بالوزن تحسب كعنصر واحد دائمًا
      if (item.isWeighed) return sum + 1;
      // المنتجات العادية تحسب بالكمية
      return sum + (item.quantity || 1);
    }, 0);
  }, [items]);
  
  // حساب السعر الإجمالي مع التمييز بين أنواع المنتجات
  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.isWeighed) {
        // للمنتجات المباعة بالوزن، نستخدم السعر الإجمالي مباشرة
        return sum + (item.price || 0);
      } else {
        // للمنتجات المباعة بالقطعة، نضرب سعر القطعة في الكمية
        const unitPrice = item.basePrice || item.price || 0;
        return sum + unitPrice * (item.quantity || 1);
      }
    }, 0);
  }, [items]);

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