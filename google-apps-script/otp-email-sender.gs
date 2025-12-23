/**
 * Google Apps Script - OTP Email Sender with Supabase Integration
 * 
 * Setup Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Add Supabase credentials in Script Properties:
 *    - SUPABASE_URL: Your Supabase project URL
 *    - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
 * 5. Deploy as web app
 * 6. Copy the web app URL and add to .env.local as GOOGLE_APPSCRIPT_WEBAPP_URL
 */

// function setupSupabaseProperties() {
//   const props = PropertiesService.getScriptProperties();

//   props.setProperties({
//     SUPABASE_URL: 'https://dvrxpqqqplgnkfbleoci.supabase.co',
//     SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnhwcXFxcGxnbmtmYmxlb2NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIxNTE3MSwiZXhwIjoyMDc3NzkxMTcxfQ.3YrBKDWSOyCDmTeXpa9l2r0NMzev0BjDFY3ZbOcd1Qg'
//   });

//   Logger.log("✅ Supabase Script Properties saved successfully");
// }



function setupSupabaseProperties() {
  const props = PropertiesService.getScriptProperties();

  props.setProperties({
    SUPABASE_URL: 'https://dvrxpqqqplgnkfbleoci.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnhwcXFxcGxnbmtmYmxlb2NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIxNTE3MSwiZXhwIjoyMDc3NzkxMTcxfQ.3YrBKDWSOyCDmTeXpa9l2r0NMzev0BjDFY3ZbOcd1Qg',
    SIGNUP_BASE_URL: 'http://localhost:3000' // Update this to your production URL
  }, true); // true = overwrite

  Logger.log("✅ Supabase Script Properties saved (forced overwrite)");
}



function verifySupabaseProperties() {
  Logger.log("🔍 Verifying Supabase Script Properties...");

  const props = PropertiesService.getScriptProperties();

  const supabaseUrl = props.getProperty('SUPABASE_URL');
  const serviceRoleKey = props.getProperty('SUPABASE_SERVICE_ROLE_KEY');

  // Check SUPABASE_URL
  if (supabaseUrl) {
    Logger.log("✅ SUPABASE_URL found");
    Logger.log("🌐 URL: " + supabaseUrl);
  } else {
    Logger.log("❌ SUPABASE_URL is missing");
  }

  // Check SERVICE ROLE KEY
  if (serviceRoleKey) {
    Logger.log("✅ SUPABASE_SERVICE_ROLE_KEY found");
    Logger.log("🔑 Key preview: " + serviceRoleKey.substring(0, 15) + "...");
    Logger.log("📏 Key length: " + serviceRoleKey.length);
  } else {
    Logger.log("❌ SUPABASE_SERVICE_ROLE_KEY is missing");
  }

  Logger.log("🔍 Verification completed");

  return {
    urlPresent: !!supabaseUrl,
    serviceRoleKeyPresent: !!serviceRoleKey
  };
}





function runFuntion(){
  verifyEmailInDatabase("deepakkumar.official32@gmail.com");
}



/**
 * Verify email exists in Supabase database
 */
function verifyEmailInDatabase(email) {
  try {
    Logger.log('[verifyEmailInDatabase] Start for email: ' + email);
   const props = PropertiesService.getScriptProperties();

  const supabaseUrl = props.getProperty('SUPABASE_URL');
  const serviceRoleKey = props.getProperty('SUPABASE_SERVICE_ROLE_KEY');

    // Check in user_profiles table (case-insensitive search using ilike)
    // Supabase ilike operator requires proper URL encoding for special characters like @
    const emailLower = email.toLowerCase();
    // URL encode the email - this converts @ to %40, which Supabase REST API expects
    const encodedEmail = encodeURIComponent(emailLower);
    const profilesUrl = supabaseUrl + '/rest/v1/user_profiles?email=ilike.' + encodedEmail + '&select=email,user_id';
    Logger.log('[verifyEmailInDatabase] Requesting user_profiles: ' + profilesUrl);
    Logger.log('[verifyEmailInDatabase] Email (original): ' + email + ', Email (lowercase): ' + emailLower + ', Email (encoded): ' + encodedEmail);
    
    const profilesResponse = UrlFetchApp.fetch(profilesUrl, {
      method: 'GET',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': 'Bearer ' + serviceRoleKey,
        'Content-Type': 'application/json'
      }
    });

    const responseCode = profilesResponse.getResponseCode();
    const responseText = profilesResponse.getContentText();
    Logger.log('[verifyEmailInDatabase] Response code: ' + responseCode + ', Response body: ' + responseText);

    if (responseCode === 200) {
      Logger.log('[verifyEmailInDatabase] user_profiles response 200');
      const profilesData = JSON.parse(responseText);
      Logger.log('[verifyEmailInDatabase] Parsed data length: ' + (profilesData ? profilesData.length : 0));
      if (profilesData && profilesData.length > 0) {
        Logger.log('[verifyEmailInDatabase] Email found in user_profiles: ' + JSON.stringify(profilesData[0]));
        return { exists: true, source: 'user_profiles' };
      } else {
        Logger.log('[verifyEmailInDatabase] Email not found in user_profiles (empty array)');
      }
    } else {
      Logger.log('[verifyEmailInDatabase] Error response from Supabase: ' + responseCode + ' - ' + responseText);
    }

    // If not found in profiles, check auth.users (via admin API)
    // Note: This requires Supabase Admin API which might not be accessible via REST
    // For now, we'll rely on user_profiles check
    Logger.log('[verifyEmailInDatabase] Email not found in user_profiles, returning exists=false');
    return { exists: false };
  } catch (error) {
    Logger.log('[verifyEmailInDatabase] Error verifying email: ' + error.toString());
    throw error;
  }
}

/**
 * Generate and store OTP in Supabase
 */
function generateAndStoreOTP(email, purpose) {
  try {
    Logger.log('[generateAndStoreOTP] Start for email: ' + email + ', purpose: ' + purpose);
    const props = PropertiesService.getScriptProperties();
    const supabaseUrl = props.getProperty('SUPABASE_URL');
    const serviceRoleKey = props.getProperty('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      Logger.log('[generateAndStoreOTP] Missing Supabase config');
      throw new Error('Supabase credentials not configured');
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    Logger.log('[generateAndStoreOTP] Generated OTP: ' + otpCode);

    // Generate unique ID (UUID-like format: timestamp + random string)
    const uniqueId = Utilities.getUuid() || (Date.now().toString(36) + Math.random().toString(36).substring(2, 15));
    Logger.log('[generateAndStoreOTP] Generated unique ID: ' + uniqueId);

    // Set expiration (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    const expiresAtISO = expiresAt.toISOString();
    Logger.log('[generateAndStoreOTP] OTP expires at: ' + expiresAtISO);

    // Mark previous OTPs as used
    const markUsedUrl = supabaseUrl + '/rest/v1/otp_verifications';
    const markUsedPayload = {
      is_used: true,
      used_at: new Date().toISOString()
    };

    const markUsedFullUrl = markUsedUrl + '?email=eq.' + encodeURIComponent(email.toLowerCase()) + '&purpose=eq.' + purpose + '&is_used=eq.false';
    Logger.log('[generateAndStoreOTP] Marking previous OTPs used: ' + markUsedFullUrl);
    UrlFetchApp.fetch(markUsedFullUrl, {
      method: 'PATCH',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': 'Bearer ' + serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      payload: JSON.stringify(markUsedPayload)
    });

    // Store new OTP with unique ID
    const insertUrl = supabaseUrl + '/rest/v1/otp_verifications';
    const otpData = {
      email: email.toLowerCase(),
      otp_code: otpCode,
      purpose: purpose,
      expires_at: expiresAtISO,
      is_used: false,
      unique_id: uniqueId
    };

    Logger.log('[generateAndStoreOTP] Inserting new OTP at: ' + insertUrl + ' with payload: ' + JSON.stringify(otpData));
    const insertResponse = UrlFetchApp.fetch(insertUrl, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': 'Bearer ' + serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      payload: JSON.stringify(otpData)
    });

    const insertStatus = insertResponse.getResponseCode();
    Logger.log('[generateAndStoreOTP] Insert response status: ' + insertStatus + ', body: ' + insertResponse.getContentText());
    if (insertStatus !== 201) {
      throw new Error('Failed to store OTP in database, status: ' + insertStatus);
    }

    Logger.log('[generateAndStoreOTP] OTP stored successfully, returning OTP and unique ID');
    return {
      otp: otpCode,
      uniqueId: uniqueId
    };
  } catch (error) {
    Logger.log('[generateAndStoreOTP] Error generating OTP: ' + error.toString());
    throw error;
  }
}

/**
 * Handle OPTIONS request for CORS preflight
 */
function doOptions() {
  // Always return JSON, even for OPTIONS, to keep behaviour consistent
  const resp = {
    success: true,
    message: 'CORS preflight OK'
  };

  return ContentService.createTextOutput(JSON.stringify(resp))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Main function to handle POST requests from Next.js API
 */
function doPost(e) {
  try {
    // Safely read request body
    const rawBody = (e && e.postData && e.postData.contents) ? e.postData.contents : '';
    Logger.log('[doPost] Raw request body: ' + rawBody);

    if (!rawBody || rawBody.trim() === '') {
      const resp = {
        success: false,
        error: 'Empty request body'
      };
      Logger.log('[doPost] Empty body, returning: ' + JSON.stringify(resp));
      return ContentService.createTextOutput(JSON.stringify(resp))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Parse JSON body safely
    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseErr) {
      const resp = {
        success: false,
        error: 'Invalid JSON body: ' + parseErr.toString()
      };
      Logger.log('[doPost] JSON parse error: ' + JSON.stringify(resp));
      return ContentService.createTextOutput(JSON.stringify(resp))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const email = data && data.email;
    const purpose = data && data.purpose;
    const name = data && data.name;
    Logger.log('[doPost] Parsed data - email: ' + email + ', purpose: ' + purpose + ', name: ' + name);

    // Validate required fields
    if (!email || !purpose) {
      const resp = { success: false, error: 'Email and purpose are required' };
      Logger.log('[doPost] Validation failed: ' + JSON.stringify(resp));
      return ContentService.createTextOutput(
        JSON.stringify(resp)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const resp = { success: false, error: 'Invalid email format' };
      Logger.log('[doPost] Validation failed: ' + JSON.stringify(resp));
      return ContentService.createTextOutput(
        JSON.stringify(resp)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Validate purpose
    const validPurposes = ['forgot_user_id', 'forgot_password', 'email_verification', 'posp_agent_invite'];
    if (validPurposes.indexOf(purpose) === -1) {
      const resp = { success: false, error: 'Invalid purpose' };
      Logger.log('[doPost] Validation failed: ' + JSON.stringify(resp));
      return ContentService.createTextOutput(
        JSON.stringify(resp)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Handle POSP Agent Invite differently - no email verification needed
    if (purpose === 'posp_agent_invite') {
      Logger.log('[doPost] Processing POSP Agent invite for: ' + email + ', name: ' + name);
      
      // Get signup link from script properties or use default
      const props = PropertiesService.getScriptProperties();
      const baseUrl = props.getProperty('SIGNUP_BASE_URL') || 'http://localhost:3000';
      const signupUrl = baseUrl + '/signup?email=' + encodeURIComponent(email) + '&type=posp_agent';
      Logger.log('[doPost] Signup URL: ' + signupUrl);
      
      // Get email template for invite
      const emailTemplate = getPosAgentInviteTemplate(signupUrl, name || 'there');
      const subject = 'Invitation to Join TFC Connect as POSP Agent';
      
      Logger.log('[doPost] Sending invite email to: ' + email);
      
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: emailTemplate,
      });

      const successResp = { 
        success: true, 
        message: 'Invitation email has been sent successfully.'
      };
      Logger.log('[doPost] Success response: ' + JSON.stringify(successResp));
      return ContentService.createTextOutput(
        JSON.stringify(successResp)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Step 1: Verify email exists in database (for other purposes)
    const emailCheck = verifyEmailInDatabase(email);
    if (!emailCheck.exists) {
      const resp = { 
        success: false, 
        error: 'Email not found. Please check your email address or sign up first.' 
      };
      Logger.log('[doPost] Email not found: ' + JSON.stringify(resp));
      return ContentService.createTextOutput(
        JSON.stringify(resp)
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Step 2: Generate and store OTP in Supabase
    Logger.log('[doPost] Email exists, generating OTP');
    const otpResult = generateAndStoreOTP(email, purpose);
    const otpCode = otpResult.otp;
    const uniqueId = otpResult.uniqueId;
    Logger.log('[doPost] OTP generated: ' + otpCode + ', Unique ID: ' + uniqueId);

    // Step 3: Get email template based on purpose
    const emailTemplate = getEmailTemplate(purpose, otpCode);
    Logger.log('[doPost] Email template selected for purpose: ' + purpose);

    // Step 4: Send email
    const subject = getEmailSubject(purpose);
    const htmlBody = emailTemplate;
    Logger.log('[doPost] Sending email to: ' + email + ' with subject: ' + subject);

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
    });

    // Return response with unique ID
    const successResp = { 
      success: true, 
      message: 'OTP has been sent to your email address.',
      unique_id: uniqueId
    };
    Logger.log('[doPost] Success response: ' + JSON.stringify(successResp));
    return ContentService.createTextOutput(
      JSON.stringify(successResp)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    const errorMsg = error && error.toString ? error.toString() : String(error);
    Logger.log('[doPost] Error in doPost: ' + errorMsg);
    const errorResp = { 
      success: false, 
      error: errorMsg 
    };
    Logger.log('[doPost] Error response: ' + JSON.stringify(errorResp));
    return ContentService.createTextOutput(
      JSON.stringify(errorResp)
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get email subject based on purpose
 */
function getEmailSubject(purpose) {
  const subjects = {
    'forgot_user_id': 'Your User ID Recovery - OTP Verification',
    'forgot_password': 'Password Reset - OTP Verification',
    'email_verification': 'Email Verification - OTP Code'
  };
  return subjects[purpose] || 'OTP Verification Code';
}

/**
 * Get email template based on purpose
 */
function getEmailTemplate(purpose, otp) {
  const templates = {
    'forgot_user_id': getForgotUserIdTemplate(otp),
    'forgot_password': getForgotPasswordTemplate(otp),
    'email_verification': getEmailVerificationTemplate(otp)
  };
  return templates[purpose] || getDefaultTemplate(otp);
}

/**
 * Forgot User ID Email Template
 */
function getForgotUserIdTemplate(otp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4A32E7, #6B4CE6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px solid #4A32E7; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4A32E7; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>User ID Recovery</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You have requested to recover your User ID. Please use the OTP code below to verify your identity:</p>
          <div class="otp-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>TFC Connect Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Forgot Password Email Template
 */
function getForgotPasswordTemplate(otp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4A32E7, #6B4CE6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px solid #4A32E7; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4A32E7; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>You have requested to reset your password. Please use the OTP code below to verify your identity:</p>
          <div class="otp-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          <p>Best regards,<br>TFC Connect Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email Verification Template
 */
function getEmailVerificationTemplate(otp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4A32E7, #6B4CE6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px solid #4A32E7; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4A32E7; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for signing up! Please verify your email address using the OTP code below:</p>
          <div class="otp-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>TFC Connect Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * POSP Agent Invite Email Template
 */
function getPosAgentInviteTemplate(signupUrl, name) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF8C42 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF8C42 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Join TFC Connect as POSP Agent</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>You have been invited to join TFC Connect as a POSP Agent. Click the button below to complete your registration:</p>
          <div style="text-align: center;">
            <a href="${signupUrl}" class="button">Complete Registration</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4A32E7;">${signupUrl}</p>
          <p>This invitation link will remain valid. If you didn't expect this invitation, please ignore this email.</p>
          <p>Best regards,<br>TFC Connect Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Default Email Template
 */
function getDefaultTemplate(otp) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4A32E7, #6B4CE6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px solid #4A32E7; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #4A32E7; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>OTP Verification</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Your OTP verification code is:</p>
          <div class="otp-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>Best regards,<br>TFC Connect Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

