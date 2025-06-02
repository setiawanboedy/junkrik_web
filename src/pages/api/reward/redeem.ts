// POST /api/reward/redeem
// Body: { rewardId: string }
// Return: { success: boolean }
import { verifyToken } from '@/lib/jwt';
import { RewardService } from '@/lib/services/reward.service';
import type { NextApiRequest, NextApiResponse } from 'next';

interface JwtPayload { id: string; [key: string]: unknown }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded || !decoded.id) return res.status(401).json({ error: 'Invalid token' });
    const { rewardId } = req.body;
    if (!rewardId) return res.status(400).json({ error: 'Missing rewardId' });
    await RewardService.redeemReward(decoded.id, rewardId);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to redeem reward' });
  }
}
