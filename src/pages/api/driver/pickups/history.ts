import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// GET /api/driver/pickups/history - Riwayat pickup driver
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  try {
    // Fetch user from DB to check role
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, role: true },
    });
    if (!user || user.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }
    // Auto-transition PENDING/SCHEDULED sebelum hari ini jadi MISSED
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    await prisma.pickup.updateMany({
      where: {
        pickupDate: { lt: startOfToday },
        status: { in: ['PENDING', 'SCHEDULED'] },
      },
      data: { status: 'MISSED' },
    });
    // Ambil pickup yang sudah selesai/cancel/missed untuk driver ini
    const pickups = await prisma.pickup.findMany({
      where: {
        status: { in: ['COMPLETED', 'CANCELLED', 'MISSED'] },
      },
      include: {
        user: { select: { businessName: true, address: true } },
      },
      orderBy: { pickupDate: 'desc' },
    });
    
    res.status(200).json(createSuccessResponse(pickups));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
