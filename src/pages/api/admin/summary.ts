import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    // Pickup hari ini
    const today = new Date();
    const pickupsToday = await prisma.pickup.count({
      where: {
        createdAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });
    // Reward pending
    const rewardPending = await prisma.rewardHistory.count({ where: { status: 'PENDING' } });
    // User aktif
    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          { role: 'business' },
        ],
      },
    });
    // Volume sampah bulan ini
    const wasteVolumeThisMonth = await prisma.pickup.aggregate({
      _sum: { estimatedWeight: true },
      where: {
        createdAt: {
          gte: startOfMonth(today),
          lte: endOfMonth(today),
        },
        status: 'COMPLETED',
      },
    });
    res.status(200).json({
      data: {
        pickupsToday,
        rewardPending,
        activeUsers,
        wasteVolumeThisMonth: wasteVolumeThisMonth._sum.estimatedWeight || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
