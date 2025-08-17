// app/api/log-whatsapp/route.js

export async function POST(request) {
  try {
    const body = await request.json();
    // Log the url to the server console (for debugging/analytics)
    console.log('[WHATSAPP CHECKOUT URL]', body?.url);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e?.message }), { status: 400 });
  }
} 