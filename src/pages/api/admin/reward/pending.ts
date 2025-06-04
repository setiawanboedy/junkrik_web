import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const rewards = await prisma.rewardHistory.findMany({
      where: { status: 'PENDING' },
      include: { user: true, reward: true },
      orderBy: { redeemedAt: 'desc' },
    });
    const data = rewards.map(r => ({
      id: r.id,
      userName: r.user?.businessName || r.user?.email || '-',
      userBusiness: r.user?.businessName || '-',
      rewardName: r.reward?.name || '-',
      redeemedAt: r.redeemedAt.toISOString(),
      status: r.status,
      code: r.code || '',
      expiredAt: r.expiredAt ? r.expiredAt.toISOString() : '',
    }));
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
