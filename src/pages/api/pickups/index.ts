import type { NextApiResponse } from 'next';
import { PickupService } from '@/lib/services/pickup.service';
import { validateCreatePickup } from '@/lib/validations/pickup';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['GET', 'POST'])) {
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get user pickups with optional filters
      const { status, startDate, endDate } = req.query;
      const filters = {
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string
      };
      
      const pickups = await PickupService.getUserPickups(req.user.id, filters);
      res.status(200).json(createSuccessResponse(pickups));
    } else if (req.method === 'POST') {
      // Create new pickup request
      const validatedData = validateCreatePickup(req.body);
      const pickup = await PickupService.createPickup(req.user.id, validatedData);
      res.status(201).json(createSuccessResponse(pickup, 'Pickup request created successfully'));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
