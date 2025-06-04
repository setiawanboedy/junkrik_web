import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// GET /api/driver/notifications - Notifikasi untuk driver (dummy, bisa diubah ke real-time jika ada infra)
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  try {
    // Fetch user from DB to check role
    const user = await import('@/lib/prisma').then(m => m.default.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, role: true },
    }));
    if (!user || user.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }
    // Dummy notifications, replace with real DB query if needed
    const notifications = [
      {
        id: 'notif-1',
        title: 'Pickup Baru Ditugaskan',
        message: 'Anda mendapat tugas pickup baru untuk hari ini.',
        createdAt: new Date(),
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Pickup Selesai',
        message: 'Pickup #123 telah selesai. Terima kasih!',
        createdAt: new Date(Date.now() - 86400000),
        read: true,
      },
    ];
    res.status(200).json(createSuccessResponse(notifications));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
