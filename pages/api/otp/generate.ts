import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success?: boolean;
  error?: string;
  message?: string;
  unique_id?: string;
  // Extra debug fields for OTP/AppScript responses
  rawResponse?: string;
  rawHtml?: string;
};

/**
 * OTP Generation API
 * 
 * This API acts as a proxy to Google Apps Script.
 * All OTP generation, email verification, and database operations
 * are handled by Apps Script using Supabase.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, purpose } = req.body;

    // Basic validation
    if (!email || !purpose) {
      return res.status(400).json({ error: 'Email and purpose are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate purpose
    const validPurposes = ['forgot_user_id', 'forgot_password', 'email_verification', 'device_activation'];
    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({ 
        error: 'Invalid purpose. Must be one of: forgot_user_id, forgot_password, email_verification' 
      });
    }

    // Call Google Apps Script
    // Apps Script will:
    // 1. Verify email in Supabase
    // 2. Generate OTP
    // 3. Store in database
    // 4. Send email
    const appScriptUrl = process.env.GOOGLE_APPSCRIPT_WEBAPP_URL;
    
    if (!appScriptUrl) {
      return res.status(500).json({ 
        error: 'OTP service not configured. Please contact support.' 
      });
    }

    try {
      const appScriptResponse = await fetch(appScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          purpose: purpose,
        }),
      });

      // Check if response is OK
      if (!appScriptResponse.ok) {
        const errorText = await appScriptResponse.text();
        console.error('Apps Script error response:', {
          status: appScriptResponse.status,
          statusText: appScriptResponse.statusText,
          body: errorText,
        });
        
        // Try to parse as JSON, otherwise return raw error
        try {
          const errorData = JSON.parse(errorText);
          return res.status(appScriptResponse.status || 500).json({ 
            error: errorData.error || `Apps Script error: ${appScriptResponse.statusText}` 
          });
        } catch {
          return res.status(appScriptResponse.status || 500).json({ 
            error: `Apps Script returned error: ${appScriptResponse.statusText}. Please check Apps Script deployment.` 
          });
        }
      }

      // Parse response (HTML ya plain text ko bhi JSON ke andar string bana kar bhej sakte hain)
      let appScriptData;
      const responseText = await appScriptResponse.text();
      console.log('Apps Script raw response:', {
        status: appScriptResponse.status,
        contentType: appScriptResponse.headers.get('content-type'),
        responseLength: responseText.length,
        responsePreview: responseText.substring(0, 200),
      });

      if (!responseText || responseText.trim().length === 0) {
        console.error('Apps Script returned empty response');
        return res.status(500).json({ 
          error: 'Apps Script returned empty response. Please check Apps Script deployment and code.',
          rawResponse: responseText,
        });
      }

      try {
        // Try JSON parse first
        appScriptData = JSON.parse(responseText);
      } catch (parseError: any) {
        // Agar JSON nahi hai (HTML / plain text) to usko JSON ke andar string ke form me bhej do
        console.error('Failed to parse Apps Script response as JSON, returning raw HTML/text in JSON:', {
          error: parseError.message,
          status: appScriptResponse.status,
        });
        return res.status(appScriptResponse.status || 500).json({
          success: false,
          error: 'OTP service returned non-JSON response (likely HTML error page). See rawHtml field for details.',
          rawHtml: responseText.substring(0, 2000), // HTML ko JSON ke andar string ke form me
        });
      }

      if (!appScriptData.success) {
        return res.status(400).json({ 
          error: appScriptData.error || 'Failed to generate OTP' 
        });
      }

      return res.status(200).json({
        success: true,
        message: appScriptData.message || 'OTP has been sent to your email address.',
        unique_id: appScriptData.unique_id || null,
      });
    } catch (fetchError: any) {
      console.error('AppScript request error:', {
        message: fetchError.message,
        stack: fetchError.stack,
        url: appScriptUrl,
      });
      
      // More specific error messages
      if (fetchError.message?.includes('fetch failed')) {
        return res.status(500).json({ 
          error: 'Cannot connect to OTP service. Please verify Apps Script URL and deployment status.' 
        });
      }
      
      return res.status(500).json({ 
        error: `Failed to connect to OTP service: ${fetchError.message || 'Unknown error'}. Please try again.` 
      });
    }
  } catch (error: any) {
    console.error('OTP generation error:', error);
    return res.status(500).json({ error: 'An error occurred while generating OTP' });
  }
}

