import { verifyToken } from '@/lib/jwt';
import { RewardService } from '@/lib/services/reward.service';
import type { NextApiRequest, NextApiResponse } from 'next';

interface JwtPayload { id: string; [key: string]: unknown }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded || !decoded.id) return res.status(401).json({ error: 'Invalid token' });
    const history = await RewardService.getUserRewardHistory(decoded.id);
    return res.status(200).json({ data: history });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
