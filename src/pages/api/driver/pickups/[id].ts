import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// GET /api/driver/pickups/[id] - Detail pickup untuk driver
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid pickup ID' });
  }
  try {
    // Verify driver role via DB
    const userRec = await prisma.user.findUnique({ where: { id: req.user.id }, select: { role: true } });
    if (!userRec || userRec.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }
    // Fetch pickup by ID
    const pickup = await prisma.pickup.findUnique({
      where: { id },
      include: {
        user: { select: { businessName: true, address: true, phone: true } },
      },
    });
    if (!pickup) {
      return res.status(404).json({ success: false, error: 'Pickup not found' });
    }
    res.status(200).json(createSuccessResponse(pickup));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
