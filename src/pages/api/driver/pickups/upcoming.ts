import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// GET /api/driver/pickups/upcoming - Daftar pickup mendatang untuk driver
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  try {
    // Verifikasi role driver
    const userRec = await prisma.user.findUnique({ where: { id: req.user.id }, select: { role: true } });
    if (!userRec || userRec.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }
    // Ambil semua pickup yang diassign driver dan jadwalnya di masa depan (status PENDING)
    const upcomingPickups = await prisma.pickup.findMany({
      where: {
        driverId: req.user.id,
        status: 'PENDING',
        pickupDate: { gt: new Date() },
      },
      include: {
        user: { select: { businessName: true, address: true, phone: true } },
      },
      orderBy: { pickupDate: 'asc' },
    });
    res.status(200).json(createSuccessResponse(upcomingPickups));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
