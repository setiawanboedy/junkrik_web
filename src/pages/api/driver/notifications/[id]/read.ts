import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

// Dummy store (sync with unread.ts notifications)
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

// In-memory notifications for demo
const notifications: Notification[] = [
  { id: 'notif-1', userId: 'driver-id-1', title: 'Pickup Baru Ditugaskan', message: 'Anda mendapat tugas pickup baru.', createdAt: new Date(), read: false },
  { id: 'notif-2', userId: 'driver-id-1', title: 'Pickup Selesai', message: 'Pickup #123 telah selesai.', createdAt: new Date(Date.now() - 86400000), read: true },
];

// PATCH /api/driver/notifications/[id]/read - mark notification as read
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['PATCH'])) return;
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid notification ID' });
    }
    // find notification belonging to user
    const notif = notifications.find(n => n.id === id && n.userId === req.user.id);
    if (!notif) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    notif.read = true;
    return res.status(200).json(createSuccessResponse({ id, read: true }));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
