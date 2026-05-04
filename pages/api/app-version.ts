import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers if needed for the mobile app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    return res.status(200).json({
      version: "1.0.1",
      buildNumber: 2,
      url: "https://rynxly.com/app/rynxly.apk",
      releaseNotes: "1. Fixed Call Card Flicker\n2. Added Periodic Heartbeat (30s)\n3. Centralized Storage System"
    });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
