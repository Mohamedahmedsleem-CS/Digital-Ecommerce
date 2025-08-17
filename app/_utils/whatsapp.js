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

  lines.push('-------------------------');
  lines.push(`🔢 الإجمالي الكلي: ${subtotal.toFixed(2)} ${currency}`);

  if (notes && String(notes).trim().length) {
    lines.push('-------------------------');
    lines.push(`📝 ملاحظات: ${notes}`);
  }

  lines.push('');
  lines.push('من فضلك ابعتلي اللوكيشن عشان أحسب تكلفة الشحن ✉️📍');

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

  return { url: waMe, fallbackUrl: apiUrl };
} 