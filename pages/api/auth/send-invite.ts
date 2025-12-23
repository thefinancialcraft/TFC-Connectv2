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

    // Get production URL by parsing the current request URL
    let productionUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
    
    // If not set in env, parse from request
    if (!productionUrl) {
      // Try to get from referer header (the page that made the request)
      const referer = req.headers.referer || req.headers.origin;
      
      if (referer) {
        try {
          const url = new URL(referer);
          productionUrl = `${url.protocol}//${url.host}`;
          console.log('Parsed production URL from referer:', productionUrl);
        } catch (e) {
          console.error('Error parsing referer URL:', e);
        }
      }
      
      // If still not set, try from host header
      if (!productionUrl && req.headers.host) {
        const host = req.headers.host;
        const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0');
        
        if (!isLocalhost) {
          // In production, use the request host
          const protocol = req.headers['x-forwarded-proto'] || 
                          (req.headers.referer?.startsWith('https') ? 'https' : 'http');
          productionUrl = `${protocol}://${host}`;
          console.log('Parsed production URL from host:', productionUrl);
        } else {
          // In development, use production URL from env or a default
          productionUrl = process.env.PRODUCTION_URL || 'https://tfc-connectv2.vercel.app';
          console.warn('Running on localhost. Using production URL:', productionUrl);
        }
      }
    }
    
    // Ensure productionUrl is set (fallback to default)
    if (!productionUrl) {
      productionUrl = 'https://tfc-connectv2.vercel.app';
      console.warn('No production URL found, using default:', productionUrl);
    }
    
    // Remove trailing slash if present
    productionUrl = productionUrl.replace(/\/$/, '');
    
    console.log('Final signup URL being used:', productionUrl);

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

