import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// GET /api/driver/profile - Profil driver
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  try {
    // Fetch user from DB to check role
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        businessName: true,
        address: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ success: false, error: 'Driver not found' });
    if (user.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }
    res.status(200).json(createSuccessResponse(user));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
