import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, createSuccessResponse } from '@/lib/utils/api';

// Dummy in-memory notifications; replace with DB in production
interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  userId: string;
}

const notifications: Notification[] = [
  { id: 'notif-1', title: 'Pickup Baru Ditugaskan', message: 'Anda mendapat tugas pickup baru untuk hari ini.', createdAt: new Date(), read: false, userId: 'driver-id-1' },
  { id: 'notif-2', title: 'Pickup Selesai', message: 'Pickup #123 telah selesai.', createdAt: new Date(Date.now() - 86400000), read: true, userId: 'driver-id-1' },
];

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  // filter unread for this driver
  const unread = notifications.filter(n => !n.read && n.userId === req.user.id);
  res.status(200).json(createSuccessResponse(unread));
}

export default withAuth(handler);
