import type { NextApiResponse } from 'next';
import { PickupService } from '@/lib/services/pickup.service';
import { validateUpdatePickup } from '@/lib/validations/pickup';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['GET', 'PUT', 'DELETE'])) {
    return;
  }

  const { id } = req.query;
  
  // Validate pickup ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid pickup ID'
    });
  }

  try {
    if (req.method === 'GET') {
      // Get single pickup
      const pickup = await PickupService.getPickupById(id, req.user.id);
      res.status(200).json(createSuccessResponse(pickup));
    } 
    else if (req.method === 'PUT') {
      // Update pickup status/details
      const validatedData = validateUpdatePickup(req.body);
      const pickup = await PickupService.updatePickup(id, req.user.id, validatedData);
      res.status(200).json(createSuccessResponse(pickup, 'Pickup updated successfully'));
    } 
    else if (req.method === 'DELETE') {
      // Cancel pickup
      await PickupService.cancelPickup(id, req.user.id);
      res.status(200).json(createSuccessResponse(null, 'Pickup cancelled successfully'));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
