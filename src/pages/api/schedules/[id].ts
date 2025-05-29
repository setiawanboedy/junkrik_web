import type { NextApiResponse } from 'next';
import { ScheduleService } from '@/lib/services/schedule.service';
import { validateUpdateSchedule } from '@/lib/validations/schedule';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['GET', 'PUT', 'DELETE'])) {
    return;
  }

  const { id } = req.query;
  
  // Validate schedule ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid schedule ID'
    });
  }

  try {
    if (req.method === 'GET') {
      // Get single schedule
      const schedule = await ScheduleService.getScheduleById(id, req.user.id);
      res.status(200).json(createSuccessResponse(schedule));
    } 
    else if (req.method === 'PUT') {
      // Update schedule
      const validatedData = validateUpdateSchedule(req.body);
      const schedule = await ScheduleService.updateSchedule(id, req.user.id, validatedData);
      res.status(200).json(createSuccessResponse(schedule, 'Schedule updated successfully'));
    } 
    else if (req.method === 'DELETE') {
      // Delete schedule
      await ScheduleService.deleteSchedule(id, req.user.id);
      res.status(200).json(createSuccessResponse(null, 'Schedule deleted successfully'));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
