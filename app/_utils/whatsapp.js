// app/_utils/whatsapp.js

const STORE_PHONE_ENV = process.env.NEXT_PUBLIC_STORE_WHATSAPP; 
const DEFAULT_STORE_PHONE_RAW = '009665043099114'; // your fixed number

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
  // Expect items: [{ title | name, quantity, price }]
  const lines = [];
  lines.push('🛒 *طلب جديد*');
  lines.push('-------------------------');

  let subtotal = 0;
  items.forEach((it, idx) => {
    const name = it.title || it.name || `منتج ${idx + 1}`;
    const qty = Number(it.quantity || 1);
    const price = Number(it.price || 0);
    const lineTotal = qty * price;
    subtotal += lineTotal;

    lines.push(`• ${name}`);
    lines.push(`  الكمية: ${qty}`);
    lines.push(`  السعر: ${price.toFixed(2)} ${currency}`);
    lines.push(`  الإجمالي: ${lineTotal.toFixed(2)} ${currency}`);
    lines.push(''); // blank line
  });

  // Grand total block (keep exact formatting and separators)
  lines.push('-------------------------');
  lines.push(`الإجمالي الكلي: ${currency} ${subtotal.toFixed(2)}`);
  lines.push('-------------------------');
  
  // Notes block (header only + user notes if provided). Do not include totals here.
  const rawNotes = String(notes || '');
  const sanitizedNotes = rawNotes
  .replace(/\r\n?/g, '\n')
  .split('\n')
  // remove any accidental lines like "إجمالي السلة: ..."
  .filter(line => !/إجمالي\s*السلة/i.test(line))
  .join('\n')
  .trim();
  
  if (sanitizedNotes.length) {
    // lines.push('— ملاحظات —');
    lines.push(sanitizedNotes);
  }
  
  // Final instruction (use zero-width space U+200B)
  lines.push('من فضلك ارسل اللوكيشن لتحديد تكلفة الشحن ✉️📍\u200B');

  return lines.join('\n');
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

