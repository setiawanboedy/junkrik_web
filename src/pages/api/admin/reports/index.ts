/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { month, year, businessName } = req.query;
    const where: any = {};
    if (month) where.month = Number(month);
    if (year) where.year = Number(year);
    if (businessName) {
      where.user = { businessName: { contains: String(businessName), mode: 'insensitive' } };
    }
    const reports = await prisma.report.findMany({
      where,
      include: { user: true },
      orderBy: { generatedAt: 'desc' },
    });
    const data = reports.map(r => ({
      id: r.id,
      userId: r.userId,
      businessName: r.user?.businessName || '-',
      month: r.month,
      year: r.year,
      totalPickups: r.totalPickups,
      totalWeight: r.totalWeight,
      recycledWeight: r.recycledWeight,
      recyclingRate: r.recyclingRate,
      plasticCredits: r.plasticCredits,
      costSavings: r.costSavings,
      generatedAt: r.generatedAt.toISOString(),
    }));
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
