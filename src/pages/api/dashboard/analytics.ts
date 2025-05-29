import type { NextApiRequest, NextApiResponse } from 'next';
import { ReportService } from '@/lib/services/report.service';
import { PickupService } from '@/lib/services/pickup.service';
import { ScheduleService } from '@/lib/services/schedule.service';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['GET'])) {
    return;
  }

  try {
    if (req.method === 'GET') {
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
