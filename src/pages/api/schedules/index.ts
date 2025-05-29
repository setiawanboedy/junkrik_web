import type { NextApiResponse } from 'next';
import { ScheduleService } from '@/lib/services/schedule.service';
import { validateCreateSchedule } from '@/lib/validations/schedule';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['GET', 'POST'])) {
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get user schedules
      const schedules = await ScheduleService.getUserSchedules(req.user.id);
      res.status(200).json(createSuccessResponse(schedules));
    } else if (req.method === 'POST') {
      // Create new schedule
      const validatedData = validateCreateSchedule(req.body);
      const schedule = await ScheduleService.createSchedule(req.user.id, validatedData);
      res.status(201).json(createSuccessResponse(schedule, 'Schedule created successfully'));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
