import { createHash, timingSafeEqual } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

type ValidationResponse = {
  success: boolean;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResponse>
) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Authorization');

  const authorization = req.headers.authorization;
  const configuredKey = process.env.SMARTFLO_CONNECTOR_API_KEY;
  const authorizationPresent = typeof authorization === 'string';
  const authorizationScheme =
    authorizationPresent
      ? authorization.trim().match(/^([A-Za-z][A-Za-z0-9+.-]*)\s+\S+$/)?.[1] || 'NO_SCHEME'
      : 'NO_SCHEME';

  console.info({
    authorizationPresent,
    authorizationScheme,
    authorizationLength: authorizationPresent ? authorization.length : null,
    authorizationFirst4: authorizationPresent ? authorization.slice(0, 4) : null,
    authorizationLast4: authorizationPresent ? authorization.slice(-4) : null,
    authorizationSha256: authorizationPresent
      ? createHash('sha256').update(authorization).digest('hex')
      : null,
    configuredKeySha256: configuredKey
      ? createHash('sha256').update(configuredKey).digest('hex')
      : null,
  });

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  if (!configuredKey || configuredKey.trim().length === 0) {
    console.error('Smartflo connector API key is not configured');
    return res.status(500).json({
      success: false,
      message: 'Service unavailable',
    });
  }

  const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  const suppliedKey = bearerMatch?.[1] || authorization?.trim();

  if (!suppliedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const configuredDigest = createHash('sha256').update(configuredKey).digest();
  const suppliedDigest = createHash('sha256').update(suppliedKey).digest();

  if (!timingSafeEqual(configuredDigest, suppliedDigest)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Rynxly CRM authorization successful',
  });
}