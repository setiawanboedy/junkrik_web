import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// PATCH /api/driver/pickups/[id]status - Update status pickup oleh driver
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['PATCH'])) return;
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid pickup ID' });
  }
  try {
    // Verify user role by fetching from DB
    const userRecord = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });
    if (!userRecord || userRecord.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }
    const { status } = req.body;
    if (!status || !['ON_THE_WAY', 'ARRIVED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }
    // Ensure pickup exists
    const pickup = await prisma.pickup.findUnique({ where: { id } });
    if (!pickup) {
      return res.status(404).json({ success: false, error: 'Pickup not found' });
    }
    // Update only status
    const updated = await prisma.pickup.update({
      where: { id },
      data: { status },
    });
    res.status(200).json(createSuccessResponse(updated));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
