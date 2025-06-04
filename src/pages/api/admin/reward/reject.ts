import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { RewardStatus } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    await prisma.rewardHistory.update({
      where: { id },
      data: { status: RewardStatus.REJECTED },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
