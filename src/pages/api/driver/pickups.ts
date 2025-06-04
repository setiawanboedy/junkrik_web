import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// GET /api/driver/pickups - Daftar pickup yang di-assign ke driver (role: driver)
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
    // Ambil pickup yang di-assign ke driver ini
    // NOTE: If driverId is not in Pickup schema, this should be adjusted to match your assignment logic
    const pickups = await prisma.pickup.findMany({
      where: {
        // driverId: req.user.id, // Uncomment if driverId exists in schema
        status: { in: ['PENDING', 'ON_THE_WAY', 'ARRIVED'] },
      },
      include: {
        user: { select: { businessName: true, address: true } },
      },
      orderBy: { pickupDate: 'asc' },
    });
    res.status(200).json(createSuccessResponse(pickups));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
