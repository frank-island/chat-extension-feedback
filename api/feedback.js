import nodemailer from 'nodemailer';

export default async function handler(req, res) {
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

  // Set up nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FEEDBACK_GMAIL_USER,
      pass: process.env.FEEDBACK_GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.FEEDBACK_GMAIL_USER,
    to: process.env.FEEDBACK_GMAIL_USER,
    subject: 'New Feedback Received',
    text: `Feedback message: ${message}\nFrom: ${email || 'No email provided'}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Nodemailer response:', info);
    console.log('Feedback email sent:', { message, email });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending feedback email:', error);
    res.status(500).json({ error: 'Failed to send feedback email.' });
  }
}