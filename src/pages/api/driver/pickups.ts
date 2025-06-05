import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';
import { Prisma } from '@prisma/client';

// GET /api/driver/pickups - Daftar pickup yang di-assign ke driver (role: driver)
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  try {
    // Cek role driver
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });
    if (!user || user.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }

    // Ambil filter dari query
    const { status, date } = req.query;

    // Siapkan filter dasar
    const whereClause: Prisma.PickupWhereInput = {
      status: {
        in: [
          'PENDING',
          'ON_THE_WAY',
          'ARRIVED',
          'IN_PROGRESS',
          'COMPLETED',
        ],
      },
    };

    if (status) {
      whereClause.status = Array.isArray(status)
        ? { in: status }
        : { in: [status] };
    }
    if (date) {
      const start = new Date(date as string);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      whereClause.pickupDate = { gte: start, lt: end };
    }

    // Auto-transition SCHEDULED → PENDING jika sudah hari H
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    await prisma.pickup.updateMany({
      where: {
        status: 'SCHEDULED',
        pickupDate: { gte: startOfToday, lt: startOfTomorrow },
      },
      data: { status: 'PENDING' },
    });

    // Ambil pickup yang sudah difilter
    const pickups = await prisma.pickup.findMany({
      where: whereClause,
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
