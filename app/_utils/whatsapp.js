// app/_utils/whatsapp.js

const STORE_PHONE_ENV = process.env.NEXT_PUBLIC_STORE_WHATSAPP; 
const DEFAULT_STORE_PHONE_RAW = '966536697488'; // your fixed number

// Normalize a phone number to WhatsApp format: remove '+' or leading '00', keep digits only.
// Example: "00966..." or "+966..." -> "966..."
export function normalizePhone(raw) {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  // Remove leading 00 if present
  const no00 = digits.replace(/^00/, '');
  // Remove leading plus if it remained somehow (safety)
  return no00.replace(/^\+/, '');
}

// Build a human-readable Arabic message from cart items
export function buildWhatsAppMessage({ items = [], currency = 'SAR', notes = '' } = {}) {
  // Expect items: [{ title | name, quantity, price, isWeighed, totalWeight, weightUnit, basePrice }]
  console.log('🔍 buildWhatsAppMessage - Received items:', items);
  console.log('🔍 buildWhatsAppMessage - Notes:', notes);
  
  const lines = [];
  lines.push('🛒 طلب جديد');
  lines.push('-------------------------');

  let subtotal = 0;
  items.forEach((it, idx) => {
    const name = it.title || it.name || `منتج ${idx + 1}`;
    const qty = Number(it.quantity || 1);
    const price = Number(it.price || 0);
    const basePrice = Number(it.basePrice || price); // سعر الوحدة الأساسي
    
    // التعديل الرئيسي هنا: حساب إجمالي سطر المنتج بشكل مختلف حسب نوع المنتج
    const lineTotal = it.isWeighed 
      ? price  // للمنتجات بالوزن: استخدم السعر الإجمالي مباشرة
      : basePrice * qty;  // للمنتجات بالقطعة: اضرب سعر القطعة في الكمية

    subtotal += lineTotal;

    console.log(`🔍 Item ${idx + 1} (${name}):`, {
      isWeighed: it.isWeighed,
      totalWeight: it.totalWeight,
      weightUnit: it.weightUnit,
      basePrice,
      price,
      qty,
      lineTotal,  // سجل القيمة المحسوبة للتأكد من صحتها
      selectedWeightOptions: it.selectedWeightOptions,
      fullItem: it  // إضافة العنصر كاملاً للتأكد من البيانات
    });

    lines.push(`• ${name}`);
    
    // التعامل بشكل مختلف مع المنتجات بالوزن والمنتجات بالقطعة
    if (it.isWeighed) {
      // منتج بالوزن - حساب السعر لكل كجم
      const totalWeight = it.totalWeight || 0;
      const weightUnit = it.weightUnit || 'كجم';
      const pricePerUnit = basePrice; // السعر لكل وحدة وزن
      
      console.log('🔍 WhatsApp - Product by weight:', {
        name,
        isWeighed: it.isWeighed,
        totalWeight,
        weightUnit,
        pricePerUnit,
        lineTotal
      });
      
      lines.push(`  الكمية: ${totalWeight} ${weightUnit}`);
      lines.push(`  سعر ${weightUnit}: ${pricePerUnit.toFixed(2)} ${currency}`);
      lines.push(`  الإجمالي: ${lineTotal.toFixed(2)} ${currency}`);
      
      // إضافة تفاصيل الأوزان المختارة إذا كانت متوفرة
      // if (it.selectedWeightOptions && it.selectedWeightOptions.length > 0) {
      //   lines.push(`  تفاصيل الأوزان المختارة:`);
      //   it.selectedWeightOptions.forEach((weightOption, index) => {
      //     const weightValue = weightOption.value || 0;
      //     const displayName = weightOption.displayName || `${weightValue} ${weightUnit}`;
      //     const priceModifier = weightOption.price_modifier || 1;
          
      //     lines.push(`    • ${displayName}`);
      //     if (priceModifier !== 1) {
      //       const modifierPercent = ((priceModifier - 1) * 100).toFixed(0);
      //       lines.push(`      (معامل سعري: ${priceModifier > 1 ? '+' : ''}${modifierPercent}%)`);
      //     }
      //   });
      // }
    } else {
      // منتج بالقطعة
      lines.push(`  الكمية: ${qty}`);
      lines.push(`  السعر للقطعة: ${basePrice.toFixed(2)} ${currency}`);
      lines.push(`  الإجمالي: ${lineTotal.toFixed(2)} ${currency}`);
    }
    
    lines.push(''); // blank line
  });

  // Grand total block
  lines.push('-------------------------');
  lines.push(`الإجمالي الكلي: ${currency} ${subtotal.toFixed(2)}`);
  lines.push('-------------------------');
  
  // Notes block
  if (notes && notes.trim().length > 0) {
   
    
    const rawNotes = String(notes || '');
    const sanitizedNotes = rawNotes
      .replace(/\r\n?/g, '\n')
      .split('\n')
      // remove any accidental lines like "إجمالي السلة: ..."
      .filter(line => !/إجمالي\s*السلة/i.test(line))
      .join('\n')
      .trim();
    
    lines.push(sanitizedNotes);
    lines.push('-------------------------');
  }
  
  // Final instruction  
  lines.push('من فضلك ارسل لي الموقع لأحسب تكلفة الشحن 📍');

  const finalMessage = lines.join('\n');
  console.log('🔍 buildWhatsAppMessage - Final message:', finalMessage);
  return finalMessage;
}

// Build a final WhatsApp URL. Prefer wa.me, fallback to api.whatsapp.com
export function buildWhatsAppUrl({ items, currency = 'SAR', notes } = {}) {
   const storePhone = normalizePhone(STORE_PHONE_ENV || DEFAULT_STORE_PHONE_RAW);
   const text = buildWhatsAppMessage({ items, currency, notes });
   const encoded = encodeURIComponent(text);

   // wa.me requires just digits (no + / no 00)
   const waMe = `https://wa.me/${storePhone}?text=${encoded}`;
   // Fallback just in case
   const apiUrl = `https://api.whatsapp.com/send?phone=${storePhone}&text=${encoded}`;

   // Prefer api.whatsapp.com (more compatible across clients); keep wa.me as fallback
   return { url: apiUrl, fallbackUrl: waMe };
}