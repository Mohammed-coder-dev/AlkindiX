// File: /api/subscribe.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = JSON.parse(req.body);

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // TODO: replace this with real provider call
    console.log('📧 Subscribing email:', email);

    // Simulate success
    return res.status(200).json({ success: true, message: 'Subscribed successfully' });

  } catch (err) {
    console.error('Subscription error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
