import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        businessName: true,
        address: true,
        phone: true,
        wasteType: true,
        wasteVolume: true,
        role: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
