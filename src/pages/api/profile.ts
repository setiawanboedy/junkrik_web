import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = verifyToken(token) as { id: string };
    if (!decoded || !decoded.id) return res.status(401).json({ error: 'Invalid token' });
    const userId = decoded.id;

    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ data: user });
    }

    if (req.method === 'PUT') {
      const data = req.body;
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          email: data.email,
          businessName: data.businessName,
          address: data.address,
          phone: data.phone,
          wasteType: data.businessType,
          wasteVolume: data.dailyWasteVolume ? Number(data.dailyWasteVolume) : undefined,
        },
      });
      return res.status(200).json({ data: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
