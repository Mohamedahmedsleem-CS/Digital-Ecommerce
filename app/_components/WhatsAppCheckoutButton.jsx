'use client';

import React, { useState } from 'react';
import { buildWhatsAppUrl } from '../_utils/whatsapp';

export default function WhatsAppCheckoutButton({ 
  items = [], 
  currency = 'SAR', 
  notes = '', 
  className = '' 
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const { url, fallbackUrl } = buildWhatsAppUrl({ items, currency, notes });

      // Record the URL locally
      try {
        localStorage.setItem('last_whatsapp_checkout_url', url);
      } catch (_) {}

      // Optional: send it to an API route for server logging (no DB)
      try {
        await fetch('/api/log-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
      } catch (_) {
        // ignore network/logging errors
      }

      // Redirect user to WhatsApp
      window.location.href = url;
      // If for some reason wa.me fails (rare), use fallback:
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = fallbackUrl;
        }
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !items?.length}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 ${className}`}
      aria-label="إتمام الطلب عبر واتساب"
    >
      {loading ? 'جارٍ التحويل...' : 'إتمام الطلب عبر واتساب'}
    </button>
  );
} 