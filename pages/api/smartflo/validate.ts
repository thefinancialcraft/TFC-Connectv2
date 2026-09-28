import { createHash, timingSafeEqual } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

type ValidationResponse =
  | { success: 'true'; data: { value: string } }
  | { success: 'false'; data: { value: string } };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationResponse>
) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Authorization');

  const authorization = req.headers.authorization;
  const configuredKey = process.env.SMARTFLO_CONNECTOR_API_KEY;

  res.once('finish', () => {
    console.info({
      status: res.statusCode,
      contentType: res.getHeader('Content-Type'),
    });
  });

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      success: 'false',
      data: { value: 'Method not allowed' },
    });
  }

  if (!configuredKey || configuredKey.trim().length === 0) {
    return res.status(500).json({
      success: 'false',
      data: { value: 'Service unavailable' },
    });
  }

  const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  const suppliedKey = bearerMatch?.[1] || authorization?.trim();

  if (!suppliedKey) {
    return res.status(401).json({
      success: 'false',
      data: { value: 'Unauthorized' },
    });
  }

  const configuredDigest = createHash('sha256').update(configuredKey).digest();
  const suppliedDigest = createHash('sha256').update(suppliedKey).digest();

  if (!timingSafeEqual(configuredDigest, suppliedDigest)) {
    return res.status(401).json({
      success: 'false',
      data: { value: 'Unauthorized' },
    });
  }

  return res.status(200).json({
    success: 'true',
    data: { value: 'Rynxly CRM' },
  });
}