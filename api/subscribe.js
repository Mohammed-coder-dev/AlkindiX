// File: /api/subscribe.js

// --- Simple in-memory rate limiter (best-effort; resets on cold start) ---
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;           // 10 requests / IP / minute
const hits = new Map();              // ip -> { count, resetAt }

const allowedOrigins = new Set([
  'https://alkindix.com',
  // Add your Vercel preview/prod URLs if you use them directly:
  // 'https://<your-project>.vercel.app'
]);

function setCommonHeaders(res) {
  // Security + cache
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // CORS (tight allowlist; relax if you need)
  res.setHeader('Vary', 'Origin');
}

function allowCors(req, res) {
  const origin = req.headers.origin || '';
  if (allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function rateLimit(ip) {
  const now = Date.now();
  const entry = hits.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  hits.set(ip, entry);
  return entry.count <= RATE_LIMIT_MAX;
}

function badMediaType(res, detail = 'Unsupported media type') {
  return res.status(415).json({ ok: false, error: 'unsupported_media_type', detail });
}

function parseEmailFromBody(ct, raw) {
  let email = '';
  if (ct.includes('application/json')) {
    const data = JSON.parse(raw || '{}');
    email = (data.email || '').trim();
    // Optional honeypot
    if ((data.website || '').trim()) return { email: '', honeypot: true };
    return { email, honeypot: false };
  }
  if (ct.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    const hp = (params.get('website') || '').trim();
    email = (params.get('email') || '').trim();
    return { email, honeypot: !!hp };
  }
  return { email: '', honeypot: false };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export default async function handler(req, res) {
  setCommonHeaders(res);
  allowCors(req, res);

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  // Tighten CSRF: require same-origin for browsers (non-essential for pure API)
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ ok: false, error: 'forbidden_origin' });
  }
  if (referer && ![...allowedOrigins].some(allowed => referer.startsWith(allowed))) {
    // Soft check; comment out if you expect third-party POSTs.
    // return res.status(403).json({ ok: false, error: 'forbidden_referer' });
  }

  // Best-effort rate limit
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '0.0.0.0';

  if (!rateLimit(ip)) {
    return res.status(429).json({ ok: false, error: 'rate_limited', retry_after_ms: RATE_LIMIT_WINDOW_MS });
  }

  try {
    // Read raw body (works on Vercel Node functions and generic servers)
    let raw = '';
    if (typeof req.body === 'string') {
      raw = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      raw = req.body.toString();
    } else if (req.body && typeof req.body === 'object') {
      // Some runtimes auto-parse JSON; re-stringify
      raw = JSON.stringify(req.body);
    } else {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      raw = Buffer.concat(chunks).toString();
    }

    const ct = (req.headers['content-type'] || '').toLowerCase();

    if (!ct || (!ct.includes('application/json') && !ct.includes('application/x-www-form-urlencoded'))) {
      return badMediaType(res, 'Use application/json or application/x-www-form-urlencoded');
    }

    const { email: rawEmail, honeypot } = parseEmailFromBody(ct, raw);
    if (honeypot) {
      // Silently succeed (don’t reveal honeypot)
      return res.status(200).json({ ok: true, message: 'Thanks!' });
    }

    const email = (rawEmail || '').toLowerCase();
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: 'invalid_email' });
    }

    // --- PLACEHOLDER: integrate your provider here ---
    // Example (Resend/Mailchimp/Buttondown/etc.)
    // await fetch('https://api.provider.com/subscribe', { method: 'POST', headers: {...}, body: JSON.stringify({ email }) })

    console.log('📧 Subscribe request', {
      email,
      ip,
      ua: req.headers['user-agent'] || 'n/a',
      at: new Date().toISOString(),
    });

    // For double opt-in, generate token & email the user here.

    return res.status(200).json({ ok: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Subscription error:', err);
    return res.status(500).json({ ok: false, error: 'internal_error' });
  }
}
