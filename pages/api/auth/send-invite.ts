import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get Google Apps Script web app URL from environment
    const webAppUrl = process.env.GOOGLE_APPSCRIPT_WEBAPP_URL;

    if (!webAppUrl) {
      console.error('GOOGLE_APPSCRIPT_WEBAPP_URL is not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Get production URL from environment or use current request origin
    const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                         process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                         (req.headers.host ? `https://${req.headers.host}` : 'https://your-production-domain.com');

    // Call Google Apps Script to send invite email
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        name: name,
        purpose: 'posp_agent_invite',
        baseUrl: productionUrl, // Pass production URL to Google Apps Script
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Google Apps Script error:', data);
      return res.status(response.status || 500).json({ 
        error: data.error || 'Failed to send invitation email' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Invitation email sent successfully',
    });
  } catch (error: any) {
    console.error('Send invite error:', error);
    return res.status(500).json({ error: 'An error occurred while sending invitation' });
  }
}

