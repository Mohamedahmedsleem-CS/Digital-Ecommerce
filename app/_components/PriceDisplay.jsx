'use client';

import React from 'react';
import { SaudiRiyal } from 'lucide-react';

function PriceDisplay({ 
  basePrice = 0, 
  selectedOptions = [], 
  isWeighed = false,
  unit = null,
  quantity = 1
}) {
  // تحسين: حساب جميع القيم المطلوبة في مكان واحد لضمان الاتساق
  const calculations = React.useMemo(() => {
    if (!selectedOptions.length || !isWeighed) {
      return {
        finalPrice: basePrice,
        finalPriceWithQuantity: basePrice * quantity,
        baseWeight: 0,
        totalWeight: 0,
        averageUnitPrice: basePrice,
        sortedWeights: []
      };
    }
    
    // ترتيب الأوزان من الأكبر إلى الأصغر
    const sortedWeights = [...selectedOptions].sort((a, b) => b.value - a.value);
    
    // حساب الوزن الأساسي (بدون كمية)
    const baseWeight = sortedWeights.reduce((total, option) => total + option.value, 0);
    
    // حساب السعر الأساسي والوزن الكلي (الكمية تؤثر على الوزن الأكبر فقط)
    let finalPrice = 0;
    let totalWeight = 0;
    
    sortedWeights.forEach((option, index) => {
      if (index === 0) {
        // الوزن الأكبر: تطبيق المعامل السعري
        const modifier = option.price_modifier || 1;
        finalPrice += basePrice * modifier * option.value;
        totalWeight += option.value * quantity; // الكمية تؤثر هنا فقط
      } else {
        // الأوزان الأصغر: بدون معامل سعري وبدون كمية
        finalPrice += basePrice * option.value;
        totalWeight += option.value; // بدون كمية
      }
    });
    
    // حساب السعر النهائي مع الكمية (لا تضرب كل شيء في الكمية)
    let finalPriceWithQuantity = 0;
    
    sortedWeights.forEach((option, index) => {
      if (index === 0) {
        // الوزن الأكبر: تطبيق المعامل السعري والكمية
        const modifier = option.price_modifier || 1;
        finalPriceWithQuantity += basePrice * modifier * option.value * quantity;
      } else {
        // الأوزان الأصغر: بدون معامل سعري، بدون كمية
        finalPriceWithQuantity += basePrice * option.value;
      }
    });
    
    // حساب متوسط سعر الوحدة
    const averageUnitPrice = totalWeight > 0 ? finalPriceWithQuantity / totalWeight : basePrice;
    
    return {
      finalPrice,
      finalPriceWithQuantity,
      baseWeight,
      totalWeight,
      averageUnitPrice,
      sortedWeights
    };
  }, [basePrice, selectedOptions, isWeighed, quantity]);

  const { 
    finalPrice, 
    finalPriceWithQuantity, 
    baseWeight, 
    totalWeight, 
    averageUnitPrice, 
    sortedWeights 
  } = calculations;
  
  const unitShortName = unit?.data?.attributes?.shortName || '';

  return (
    <div className="space-y-2">
      {/* عرض السعر النهائي */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold text-primary">
            {finalPriceWithQuantity.toFixed(2)}
          </h2>
          <SaudiRiyal className="w-8 h-8 text-primary" strokeWidth={1.5} />
        </div>
        
        {/* عرض مقارنة السعر الأساسي بالسعر الكلي عندما تكون الكمية > 1 */}
        {quantity > 1 && isWeighed && selectedOptions.length > 0 && (
          <div className="text-sm text-gray-600">
            <span>السعر الأساسي: {basePrice.toFixed(2)} ﷼</span>
            <span className="mx-2">×</span>
            <span>الوزن الإجمالي: {totalWeight.toFixed(2)} {unitShortName}</span>
            <span className="mx-2">=</span>
            <span className="font-medium text-primary">{finalPriceWithQuantity.toFixed(2)} ﷼</span>
          </div>
        )}
        
        {/* للمنتجات غير الموزونة، عرض سعر القطعة × الكمية */}
        {quantity > 1 && (!isWeighed || selectedOptions.length === 0) && (
          <div className="text-sm text-gray-600">
            <span>سعر القطعة: {basePrice.toFixed(2)} ﷼</span>
            <span className="mx-2">×</span>
            <span>الكمية: {quantity}</span>
            <span className="mx-2">=</span>
            <span className="font-medium text-primary">{finalPriceWithQuantity.toFixed(2)} ﷼</span>
          </div>
        )}
      </div>

      {/* إجمالي الوزن وسعر الوحدة (للمنتجات الموزونة) */}
      {isWeighed && selectedOptions.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            <span className="font-medium">إجمالي الوزن المختار:</span>
            <span className="ml-2 text-primary font-semibold">
              {totalWeight.toFixed(2)} {unitShortName}
            </span>
            {quantity > 1 && (
              <span className="block text-xs text-gray-500">
                (الوزن الأساسي: {baseWeight.toFixed(2)} {unitShortName}، الكمية {quantity} تؤثر على الوزن الأكبر فقط)
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">متوسط السعر لكل {unitShortName}:</span>
            <span className="ml-2 text-primary font-semibold">
              {averageUnitPrice.toFixed(2)} ﷼
            </span>
          </div>
          <div className="text-xs text-gray-500">
            💡 السعر الإجمالي = مجموع (السعر الأساسي × الوزن × معامل السعر للوزن الأكبر فقط) لكل وزن مختار
          </div>
        </div>
      )}

      {/* تفاصيل حساب السعر للمنتجات الموزونة */}
      {isWeighed && selectedOptions.length > 0 && (
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <span>السعر الأساسي:</span>
            <span>{basePrice.toFixed(2)} ﷼</span>
          </div>
          
          {/* تفاصيل حساب كل خيار وزن */}
          {sortedWeights.map((option, index) => {
            const isLargest = index === 0;
            let price, calculation, modifierText;
            
            if (isLargest) {
              // الوزن الأكبر: تطبيق المعامل السعري والكمية
              const modifier = option.price_modifier || 1;
              price = basePrice * modifier * option.value * quantity;
              calculation = `${basePrice.toFixed(2)} × ${option.value} × ${modifier !== 1 ? modifier : 1} × ${quantity}`;
              modifierText = modifier !== 1 ? (
                <span className={`text-xs ${modifier > 1 ? 'text-red-600' : 'text-green-600'}`}>
                  (معامل: {modifier > 1 ? '+' : ''}{((modifier - 1) * 100).toFixed(0)}% + كمية: {quantity})
                </span>
              ) : (
                <span className="text-xs text-blue-600">(كمية: {quantity})</span>
              );
            } else {
              // الأوزان الأصغر: بدون معامل سعري، بدون كمية
              price = basePrice * option.value;
              calculation = `${basePrice.toFixed(2)} × ${option.value}`;
              modifierText = <span className="text-xs text-gray-500">(وزن ثابت بدون معامل)</span>;
            }
            
            return (
              <div key={option.id} className="flex items-center gap-2 ml-4">
                <span>• {option.displayName || `${option.value} ${unitShortName}`}:</span>
                <span>{calculation} = </span>
                <span className="font-medium">{price.toFixed(2)} ﷼</span>
                {modifierText}
              </div>
            );
          })}
          
          <div className="border-t pt-1 mt-1">
            <span className="font-medium">المجموع: {finalPriceWithQuantity.toFixed(2)} ﷼</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceDisplay;