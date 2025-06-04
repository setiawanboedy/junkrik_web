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
    // Ambil pickup yang sudah selesai/cancel untuk driver ini
    // NOTE: If driverId is not in Pickup schema, adjust this filter as needed
    const pickups = await prisma.pickup.findMany({
      where: {
        // driverId: req.user.id, // Uncomment if driverId exists in schema
        status: { in: ['COMPLETED', 'CANCELLED'] },
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
