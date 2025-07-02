export default function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to your domain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, email } = req.body || {};
  if (!message || typeof message !== 'string' || message.length < 5) {
    return res.status(400).json({ error: 'Message is required and should be at least 5 characters.' });
  }

  console.log('Feedback received:', { message, email });
  res.status(200).json({ success: true });
}