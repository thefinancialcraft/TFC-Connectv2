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
  const credentialNamePattern = /authorization|api[-_]?key|token/i;
  const body = req.body;
  const bodyFieldNames =
    body && typeof body === 'object' && !Array.isArray(body)
      ? Object.keys(body)
      : [];

  console.info('Smartflo validation request metadata', {
    method: req.method,
    requestId: req.headers['x-vercel-id'] || req.headers['x-request-id'] || null,
    authorizationPresent: typeof authorization === 'string',
    authorizationIsBearer:
      typeof authorization === 'string' && /^Bearer\s+\S+$/i.test(authorization),
    credentialHeaderNames: Object.keys(req.headers).filter((name) =>
      credentialNamePattern.test(name)
    ),
    credentialQueryFieldNames: Object.keys(req.query).filter((name) =>
      credentialNamePattern.test(name)
    ),
    credentialBodyFieldNames: bodyFieldNames.filter((name) =>
      credentialNamePattern.test(name)
    ),
  });

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  const configuredKey = process.env.SMARTFLO_CONNECTOR_API_KEY;
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