'use client';

import Link from 'next/link';
import { AlertOctagon, BadgeCheck, ShoppingCartIcon, Star, Crown } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import QuantityPicker from '@/app/_components/QuantityPicker';
import WeightOptions from '@/app/_components/WeightOptions';
import PriceDisplay from '@/app/_components/PriceDisplay';
import ProductDetails from '@/app/_components/ProductDetails';
import { useCart } from '@/app/_context/CartContext';
import WhatsAppCheckoutButton from '@/app/_components/WhatsAppCheckoutButton';

function ProductInfo({ product }) {
  const { addItem, count, items } = useCart();
  const [qty, setQty] = useState(1);
  const [hasAdded, setHasAdded] = useState(false);
  const [selectedWeightOptions, setSelectedWeightOptions] = useState([]);

  // محاكاة بيانات الوزن للاختبار إذا كان المنتج يبدو مثل القهوة/التوابل/التمور
  const isCoffeeOrSpice = useMemo(() => 
    product?.title?.toLowerCase().includes('بن') || 
    product?.title?.toLowerCase().includes('قهوة') ||
    product?.title?.toLowerCase().includes('توابل') ||
    product?.title?.toLowerCase().includes('عطارة') ||
    product?.title?.toLowerCase().includes('تمر') ||
    product?.title?.toLowerCase().includes('تمور') ||
    product?.title?.toLowerCase().includes('عسل') ||
    product?.title?.toLowerCase().includes('مكسرات') ||
    product?.title?.toLowerCase().includes('فواكه مجففة'),
    [product?.title]
  );

  const mockWeightOptions = useMemo(() => [
    {
      id: 'mock-1',
      value: 0.25,
      price_modifier: 1.2,
      displayName: 'ربع كيلو',
      unit: { data: { attributes: { shortName: 'كج' } } }
    },
    {
      id: 'mock-2', 
      value: 0.5,
      price_modifier: 1.1,
      displayName: 'نصف كيلو',
      unit: { data: { attributes: { shortName: 'كج' } } }
    },
    {
      id: 'mock-3',
      value: 1,
      price_modifier: 1.0,
      displayName: 'كيلو واحد',
      unit: { data: { attributes: { shortName: 'كج' } } }
    }
  ], []);

  // استخدام البيانات المحاكاة للمنتجات المباعة بالوزن إذا لم تكن بيانات الوزن موجودة
  const effectiveProduct = useMemo(() => {
    // التعديل الرئيسي: استخدام mockWeightOptions لأي منتج مع isWeighed=true
    const finalQuantityOptions = (product?.quantity_options && product.quantity_options.length > 0) 
      ? product.quantity_options 
      : (product?.isWeighed || isCoffeeOrSpice ? mockWeightOptions : []);
    
    const finalUnit = product?.unit || ((product?.isWeighed || isCoffeeOrSpice) ? { data: { attributes: { shortName: 'كج' } } } : null);
    
    console.log('🔍 ProductInfo - Debug Info:', {
      originalIsWeighed: product?.isWeighed,
      isCoffeeOrSpice,
      originalQuantityOptions: product?.quantity_options,
      originalQuantityOptionsLength: product?.quantity_options?.length,
      finalQuantityOptions,
      finalQuantityOptionsLength: finalQuantityOptions.length,
      originalUnit: product?.unit,
      finalUnit
    });
    
    return {
      ...product,
      isWeighed: product?.isWeighed || isCoffeeOrSpice,
      quantity_options: finalQuantityOptions,
      unit: finalUnit
    };
  }, [product, isCoffeeOrSpice, mockWeightOptions]);

  // تعيين خيار وزن افتراضي عند تحميل المنتج
  useEffect(() => {
    if (effectiveProduct?.isWeighed && effectiveProduct?.quantity_options?.length > 0) {
      // إذا لم يتم اختيار أي وزن بعد، اختر الأول افتراضياً
      if (selectedWeightOptions.length === 0) {
        setSelectedWeightOptions([effectiveProduct.quantity_options[0]]);
        console.log('🔍 ProductInfo - Set default weight option:', effectiveProduct.quantity_options[0]);
      }
    }
  }, [effectiveProduct, selectedWeightOptions.length]);

  // إعادة تعيين hasAdded عند تغيير الكمية أو خيارات الوزن
  useEffect(() => {
    if (hasAdded) {
      setHasAdded(false);
    }
  }, [qty, selectedWeightOptions]);

  // التحقق مما إذا كان هذا المنتج المحدد موجودًا بالفعل في السلة
  const isProductInCart = useMemo(() => {
    const key = effectiveProduct?.documentId || effectiveProduct?.id;
    if (!key) return false;
    
    return count > 0 && items.some(item => 
      (item.documentId || item.id) === key
    );
  }, [effectiveProduct?.documentId, effectiveProduct?.id, count, items]);

  const hideWhatsApp = isProductInCart;
  
  // تحسين: توحيد وظائف الحساب في مكان واحد
  const weightAndPriceCalculations = useMemo(() => {
    if (!effectiveProduct?.isWeighed || selectedWeightOptions.length === 0) {
      return {
        basePrice: Number(effectiveProduct?.price || 0),
        finalPrice: Number(effectiveProduct?.price || 0),
        finalPriceWithQuantity: Number(effectiveProduct?.price || 0) * qty,
        baseWeight: 0,
        totalWeight: 0,
        totalWeightWithQuantity: 0,
        sortedWeights: []
      };
    }
    
    const basePrice = Number(effectiveProduct?.price || 0);
    
    // ترتيب الأوزان من الأكبر إلى الأصغر - نحسب هذا مرة واحدة فقط
    const sortedWeights = [...selectedWeightOptions].sort((a, b) => b.value - a.value);
    
    // حساب الوزن الأساسي (بدون كمية)
    const baseWeight = sortedWeights.reduce((total, option) => total + option.value, 0);
    
    // حساب الوزن الإجمالي مع الكمية (الوزن الأكبر فقط يتأثر بالكمية)
    let totalWeightWithQuantity = 0;
    sortedWeights.forEach((option, index) => {
      if (index === 0) {
        // الوزن الأكبر: يضرب في الكمية
        totalWeightWithQuantity += option.value * qty;
      } else {
        // الأوزان الأصغر: بدون ضرب في الكمية
        totalWeightWithQuantity += option.value;
      }
    });
    
    // حساب السعر النهائي (المعامل السعري يطبق فقط على الوزن الأكبر)
    let finalPrice = 0;
    sortedWeights.forEach((option, index) => {
      if (index === 0) {
        // الوزن الأكبر: تطبيق المعامل السعري
        const modifier = option.price_modifier || 1;
        finalPrice += basePrice * modifier * option.value;
      } else {
        // الأوزان الأصغر: بدون معامل سعري
        finalPrice += basePrice * option.value;
      }
    });
    
    // حساب السعر النهائي مع الكمية
    let finalPriceWithQuantity = 0;
    sortedWeights.forEach((option, index) => {
      if (index === 0) {
        // الوزن الأكبر: تطبيق المعامل السعري والكمية
        const modifier = option.price_modifier || 1;
        finalPriceWithQuantity += basePrice * modifier * option.value * qty;
      } else {
        // الأوزان الأصغر: بدون معامل سعري، بدون ضرب في الكمية
        finalPriceWithQuantity += basePrice * option.value;
      }
    });
    
    return {
      basePrice,
      finalPrice,
      finalPriceWithQuantity,
      baseWeight,
      totalWeight: totalWeightWithQuantity, // للتوافق مع الكود السابق
      totalWeightWithQuantity,
      sortedWeights
    };
  }, [effectiveProduct?.isWeighed, effectiveProduct?.price, selectedWeightOptions, qty]);

  // التعامل مع تبديل خيار الوزن (إضافة/إزالة من التحديد)
  const handleWeightOptionToggle = useCallback((option) => {
    setSelectedWeightOptions(prev => {
      const isSelected = prev.some(selected => selected.id === option.id);
      
      if (isSelected) {
        return prev.filter(selected => selected.id !== option.id);
      } else {
        return [...prev, option];
      }
    });
  }, []);

  // التعامل مع الإضافة إلى السلة
  const handleAdd = useCallback(() => {
    // تحويل الكمية إلى أوزان فعلية للمنتجات المباعة بالوزن
    let processedWeightOptions = selectedWeightOptions;
    
    if (effectiveProduct?.isWeighed && selectedWeightOptions.length > 0 && qty > 1) {
      // ترتيب الأوزان من الأكبر إلى الأصغر
      const sortedWeights = [...selectedWeightOptions].sort((a, b) => b.value - a.value);
      
      // إنشاء أوزان جديدة مع تأثير الكمية على الوزن الأكبر فقط
      processedWeightOptions = [];
      
      sortedWeights.forEach((option, index) => {
        if (index === 0) {
          // الوزن الأكبر: يضرب في الكمية
          processedWeightOptions.push({
            ...option,
            value: option.value * qty,
            displayName: `${option.displayName} × ${qty}`
          });
        } else {
          // الأوزان الأصغر: بدون تغيير
          processedWeightOptions.push(option);
        }
      });
      
      console.log('🔍 ProductInfo - الأوزان الأصلية:', selectedWeightOptions);
      console.log('🔍 ProductInfo - الأوزان المعالجة مع الكمية:', processedWeightOptions);
    }
    
    const mapped = {
      id: effectiveProduct?.id ?? null,
      documentId: effectiveProduct?.documentId || (effectiveProduct?.id ?? null), // استخدام id كبديل إذا لم يكن documentId موجود
      title: effectiveProduct?.title || effectiveProduct?.name,
      // التعديل هنا: للمنتجات بالوزن نستخدم السعر الإجمالي، للمنتجات بالقطعة نستخدم سعر القطعة فقط (بدون ضرب بالكمية)
      price: effectiveProduct?.isWeighed ? weightAndPriceCalculations.finalPriceWithQuantity : Number(effectiveProduct?.price || 0),
      basePrice: Number(effectiveProduct?.price || 0),
      image:
        effectiveProduct?.image ||
        effectiveProduct?.images?.[0]?.url ||
        effectiveProduct?.banner?.[0]?.url ||
        '',
      category: effectiveProduct?.category || effectiveProduct?.category?.name,
      // إضافة معلومات خاصة بالوزن
      isWeighed: effectiveProduct?.isWeighed || false,
      selectedWeightOptions: processedWeightOptions, // استخدام الأوزان المعالجة
      totalWeight: weightAndPriceCalculations.totalWeightWithQuantity,
      weightUnit: effectiveProduct?.unit?.data?.attributes?.shortName || '',
      weightBreakdown: processedWeightOptions.map(option => ({
        value: option.value,
        priceModifier: option.price_modifier,
        displayName: option.displayName
      })),
    };
    
    console.log('🔍 ProductInfo - إرسال المنتج إلى addItem:', mapped);
    console.log('🔍 ProductInfo - documentId:', mapped.documentId);
    console.log('🔍 ProductInfo - selectedWeightOptions:', mapped.selectedWeightOptions);
    console.log('🔍 ProductInfo - isWeighed:', mapped.isWeighed);
    console.log('🔍 ProductInfo - totalWeight:', mapped.totalWeight);
    console.log('🔍 ProductInfo - weightUnit:', mapped.weightUnit);
    
    // للمنتجات بالوزن: نمرر الكمية = 1 دائمًا
    // للمنتجات بالقطعة: نمرر الكمية المختارة
    addItem(mapped, effectiveProduct?.isWeighed ? 1 : qty);
    
    setHasAdded(true);
  }, [effectiveProduct, selectedWeightOptions, weightAndPriceCalculations, qty, addItem]);

  // استخراج وحدة القياس للعرض
  const weightUnit = effectiveProduct?.unit?.data?.attributes?.shortName || '';

  // حساب نسبة الخصم
  const discountPercentage = useMemo(() => {
    if (!product?.originalPrice || !product?.price) return 0;
    const original = Number(product.originalPrice);
    const current = Number(product.price);
    if (original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  }, [product?.originalPrice, product?.price]);



  // إضافة تسجيل أكثر للتصحيح
  console.log('🔍 ProductInfo - Render conditions:', {
    isWeighed: effectiveProduct?.isWeighed,
    hasQuantityOptions: effectiveProduct?.quantity_options?.length > 0,
    quantityOptionsLength: effectiveProduct?.quantity_options?.length || 0,
    showWeightOptions: effectiveProduct?.isWeighed && effectiveProduct?.quantity_options?.length > 0
  });

  return (
    <div className="space-y-6">
      {/* عنوان المنتج مع شارة Best Seller */}
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-lg text-gray-400">{product.category}</p>
          </div>
          
          {/* شارة الأكثر طلباً */}
          {product?.isBestSeller && (
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full shadow-lg">
                <Crown className="w-5 h-5" />
                <span className="font-semibold text-sm">الأكثر طلباً</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* عرض السعر مع الخصم */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          {/* السعر الحالي */}
          <div className="text-3xl font-bold text-gray-900">
            {Number(product?.price || 0).toFixed(2)} ريال
          </div>
          
          {/* السعر الأصلي والخصم */}
          {product?.originalPrice && Number(product.originalPrice) > Number(product?.price) && (
            <div className="flex items-center gap-3">
              <span className="text-xl text-gray-400 line-through">
                {Number(product.originalPrice).toFixed(2)} ريال
              </span>
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                خصم {discountPercentage}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* الوصف */}
      {product.description && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* مكون تفاصيل المنتج الجديد */}
      <ProductDetails product={product} />

      <h2 className="text-[11px] text-gray-500 flex gap-2 mt-2 items-center">
        {product.instantDelivery ? (
          <BadgeCheck className="w-5 h-5 text-green-500" />
        ) : (
          <AlertOctagon className="w-5 h-5 text-amber-500" />
        )}
        Eligible for Instant Delivery
      </h2>

      {/* اختيار خيارات الوزن */}
      {effectiveProduct?.isWeighed && effectiveProduct?.quantity_options?.length > 0 && (
        <div className="space-y-3">
          {/* رسالة معلومات حول اختيار الوزن */}
          <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            ℹ️ هذا المنتج مباع بالوزن. يمكنك اختيار وزن واحد أو أكثر حسب احتياجك.
            {selectedWeightOptions.length > 0 && (
              <span className="block mt-1 font-medium">
                تم اختيار {selectedWeightOptions.length} وزن بإجمالي {weightAndPriceCalculations.baseWeight.toFixed(2)} {weightUnit}
                {qty > 1 && (
                  <span className="block mt-1 text-sm text-gray-600">
                    (الكمية {qty} تؤثر على الوزن الأكبر فقط)
                  </span>
                )}
              </span>
            )}
          </div>
          
          <WeightOptions
            options={effectiveProduct.quantity_options}
            selectedOptions={selectedWeightOptions}
            onOptionToggle={handleWeightOptionToggle}
          />
          
          {/* تحذير إذا لم يتم تحديد وزن */}
          {selectedWeightOptions.length === 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
              ⚠️ يرجى اختيار وزن واحد على الأقل للمتابعة
            </div>
          )}
        </div>
      )}

      {/* إظهار رسالة إذا كان المنتج يجب أن يكون له خيارات وزن ولكن لا يوجد */}
      {effectiveProduct?.isWeighed && effectiveProduct.quantity_options.length === 0 && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          ⚠️ هذا المنتج مباع بالوزن لكن خيارات الوزن غير متوفرة حالياً. يرجى المحاولة لاحقاً.
        </div>
      )}

      {/* عرض السعر */}
      <div className="space-y-3">
        <PriceDisplay
          basePrice={Number(effectiveProduct?.price || 0)}
          selectedOptions={selectedWeightOptions}
          isWeighed={effectiveProduct?.isWeighed || false}
          unit={effectiveProduct?.unit}
          quantity={qty}
        />
        
        {/* معلومات للمنتجات غير المباعة بالوزن */}
        {!effectiveProduct?.isWeighed && (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
            ℹ️ هذا المنتج مباع بالقطعة. السعر ثابت ولا يحتاج اختيار وزن.
          </div>
        )}
        
        {/* معلومات إضافية عن الأسعار للمنتجات المباعة بالوزن */}
        {effectiveProduct?.isWeighed && selectedWeightOptions.length > 0 && (
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 border">
            <div className="font-medium mb-2">تفاصيل الأوزان المختارة:</div>
            <div className="space-y-1">
              {weightAndPriceCalculations.sortedWeights.map((option, index) => {
                const isLargest = index === 0;
                const basePrice = Number(effectiveProduct?.price || 0);
                let price, weightDisplay;
                
                if (isLargest) {
                  // الوزن الأكبر: تطبيق المعامل السعري والكمية
                  const modifier = option.price_modifier || 1;
                  price = basePrice * modifier * option.value * qty;
                  weightDisplay = `${option.value} × ${qty} = ${(option.value * qty).toFixed(2)} ${weightUnit}`;
                } else {
                  // الأوزان الأصغر: بدون معامل سعري، بدون كمية
                  price = basePrice * option.value;
                  weightDisplay = `${option.value} ${weightUnit}`;
                }
                
                return (
                  <div key={option.id} className="flex items-center justify-between">
                    <span>
                      • {option.displayName || `${option.value} ${weightUnit}`}
                      {isLargest && qty > 1 && (
                        <span className="text-xs text-blue-600 block">
                          (الوزن الأكبر × الكمية: {weightDisplay})
                        </span>
                      )}
                      {!isLargest && (
                        <span className="text-xs text-gray-500 block">
                          (وزن ثابت بدون معامل سعري)
                        </span>
                      )}
                    </span>
                    <span className="font-medium">
                      {price.toFixed(2)} ريال
                      {isLargest && option.price_modifier !== 1 && (
                        <span className={`text-xs ${option.price_modifier > 1 ? 'text-red-600' : 'text-green-600'} block`}>
                          (معامل: {option.price_modifier > 1 ? '+' : ''}{((option.price_modifier - 1) * 100).toFixed(0)}%)
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
              
              <div className="border-t pt-1 mt-2 font-medium">
                إجمالي الوزن: {weightAndPriceCalculations.baseWeight.toFixed(2)} {weightUnit}
                {qty > 1 && (
                  <span className="block mt-1 text-sm text-gray-600">
                    (الكمية {qty} تؤثر على الوزن الأكبر فقط)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 space-y-3">
        <div className="flex items-center gap-4">
          <QuantityPicker value={qty} onChange={setQty} />
          <button
            onClick={handleAdd}
            disabled={effectiveProduct?.isWeighed && selectedWeightOptions.length === 0}
            className={`
              flex-1 inline-flex items-center gap-2 rounded-full px-6 py-3 transition-colors
              ${effectiveProduct?.isWeighed && selectedWeightOptions.length === 0
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : hasAdded
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-primary hover:bg-teal-700 text-white'
              }
            `}
          >
            <ShoppingCartIcon />
            {effectiveProduct?.isWeighed && selectedWeightOptions.length === 0 
              ? 'اختر الوزن أولاً' 
              : hasAdded
                ? 'تم الإضافة ✓'
                : `إضافة للسلة ${selectedWeightOptions.length > 0 ? `(${selectedWeightOptions.length} وزن مختار)` : ''}`
            }
          </button>
        </div>

        {/* رسالة نجاح عند إضافة العنصر */}
        {hasAdded && (
          <div className="w-full rounded-lg border border-green-200 bg-green-50 text-green-800 p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>
              ✅ تم إضافة المنتج للسلة بنجاح!
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setHasAdded(false)}
                className="inline-flex items-center justify-center rounded-full bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700"
              >
                تعديل
              </button>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-full bg-teal-600 text-white px-4 py-2 text-sm hover:bg-teal-700"
              >
                اذهب إلى السلة
              </Link>
            </div>
          </div>
        )}

        {/* رسالة عندما يكون العنصر موجودًا بالفعل في السلة */}
        {hideWhatsApp && !hasAdded && (
          <div className="w-full rounded-lg border border-blue-200 bg-blue-50 text-blue-800 p-3 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span>
              ℹ️ هذا المنتج موجود بالفعل في السلة
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setHasAdded(false);
                }}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
              >
                تعديل
              </button>
              <button
                onClick={handleAdd}
                className="inline-flex items-center justify-center rounded-full bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700"
              >
                إضافة مرة أخرى
              </button>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-full bg-teal-600 text-white px-4 py-2 text-sm hover:bg-teal-700"
              >
                اذهب إلى السلة
              </Link>
            </div>
          </div>
        )}

        {/* زر الطلب عبر واتساب (يظهر فقط عندما لا يكون في السلة ولم يتم إضافته للتو) */}
        {!hideWhatsApp && !hasAdded && (
          <WhatsAppCheckoutButton
            items={[
              {
                title: product.title,
                quantity: qty,
                price: weightAndPriceCalculations.finalPriceWithQuantity,
                basePrice: Number(effectiveProduct?.price || 0),
                isWeighed: effectiveProduct?.isWeighed || false,
                selectedWeightOptions: selectedWeightOptions,
                totalWeight: weightAndPriceCalculations.totalWeightWithQuantity,
                weightUnit: weightUnit,
              },
            ]}
            currency="SAR"
            notes=""
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}

export default ProductInfo;