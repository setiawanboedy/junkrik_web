import type { NextApiResponse } from 'next';
import { ReportService } from '@/lib/services/report.service';
import { PickupService } from '@/lib/services/pickup.service';
import { ScheduleService } from '@/lib/services/schedule.service';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';
import { verifyToken } from '@/lib/jwt';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Debug: log token dari cookie (bukan header)
  const token = req.cookies?.token;
  console.log('[DEBUG] /api/dashboard/analytics token (cookie):', token);
  if (token) {
    try {
      const decoded = verifyToken(token);
      console.log('[DEBUG] /api/dashboard/analytics decoded:', decoded);
    } catch (e) {
      console.log('[DEBUG] JWT verify error:', e);
    }
  }

  // Validate HTTP method
  if (!validateMethod(req, res, ['GET'])) {
    return;
  }

  try {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'no-store'); // Selalu return data terbaru, tidak 304
      // Get comprehensive dashboard analytics
      const [reportAnalytics, pickupStats, scheduleStats] = await Promise.all([
        ReportService.getDashboardAnalytics(req.user.id),
        PickupService.getPickupStats(req.user.id),
        ScheduleService.getScheduleStats(req.user.id)
      ]);

      const analytics = {
        reports: reportAnalytics,
        pickups: pickupStats,
        schedules: scheduleStats
      };

      res.status(200).json(createSuccessResponse(analytics));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
