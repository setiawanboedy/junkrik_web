import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, createSuccessResponse } from '@/lib/utils/api';
import { startOfToday, endOfToday, startOfWeek, endOfWeek } from 'date-fns';

// GET /api/driver/dashboard/stats
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  // verify driver role
  const userRec = await prisma.user.findUnique({ where: { id: req.user.id }, select: { role: true } });
  if (!userRec || userRec.role !== 'driver') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  // count today's pickups
  const todayCount = await prisma.pickup.count({ where: { driverId: req.user.id, pickupDate: { gte: startOfToday(), lte: endOfToday() } } });
  // count week's pickups
  const weekCount = await prisma.pickup.count({ where: { driverId: req.user.id, pickupDate: { gte: startOfWeek(new Date()), lte: endOfWeek(new Date()) } } });
  return res.status(200).json(createSuccessResponse({ todayCount, weekCount }));
}

export default withAuth(handler);
