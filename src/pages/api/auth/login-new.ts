import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/lib/services/auth.service';
import { validateLoginInput } from '@/lib/validations/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['POST'])) {
    return;
  }

  try {
    // Validate input
    const validatedData = validateLoginInput(req.body);
    
    // Login user
    const result = await AuthService.login(validatedData);
    
    // Return success response
    res.status(200).json(createSuccessResponse(result, 'Login successful'));
  } catch (error) {
    handleApiError(error, res);
  }
}
