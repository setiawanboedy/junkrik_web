// GET /api/reward/list
// Return: { data: Reward[] }
import { RewardService } from '@/lib/services/reward.service';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const rewards = await RewardService.getAvailableRewards();
    return res.status(200).json({ data: rewards });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
