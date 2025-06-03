import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { status, search } = req.query;
    const where: Prisma.PickupWhereInput = {};
    if (typeof status === 'string' && status) where.status = status;
    if (typeof search === 'string' && search) {
      where.user = { businessName: { contains: search, mode: 'insensitive' } };
    }
    const pickups = await prisma.pickup.findMany({
      where,
      orderBy: { pickupDate: 'desc' },
      include: {
        user: true,
      },
    });
    const data = pickups.map(p => ({
      id: p.id,
      businessName: p.user?.businessName || '-',
      address: p.user?.address || '-',
      phone: p.user?.phone || '-',
      scheduledAt: p.pickupDate ? p.pickupDate.toISOString() : '',
      status: p.status,
      wasteType: Array.isArray(p.wasteTypes) ? p.wasteTypes.join(', ') : '-',
      estimatedWeight: p.estimatedWeight || 0,
    }));
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
