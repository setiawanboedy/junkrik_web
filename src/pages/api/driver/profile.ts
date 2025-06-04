import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// GET /api/driver/profile - Profil driver
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET', 'PUT'])) return;
  try {
    // Validate driver role via DB
    const userRec = await prisma.user.findUnique({ where: { id: req.user.id }, select: { role: true } });
    if (!userRec || userRec.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }
    if (req.method === 'GET') {
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
      res.status(200).json(createSuccessResponse(user));
    } else if (req.method === 'PUT') {
      // Update profile fields
      const { email, businessName, address, phone } = req.body;
      const updated = await prisma.user.update({
        where: { id: req.user.id },
        data: { email, businessName, address, phone },
      });
      return res.status(200).json(
        createSuccessResponse({
          id: updated.id,
          email: updated.email,
          businessName: updated.businessName,
          address: updated.address,
          phone: updated.phone,
          role: updated.role,
          createdAt: updated.createdAt,
        })
      );
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
