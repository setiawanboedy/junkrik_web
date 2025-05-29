import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '@/lib/services/auth.service';
import { validateRegisterInput } from '@/lib/validations/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['POST'])) {
    return;
  }

  try {
    // Validate input
    const validatedData = validateRegisterInput(req.body);
    
    // Register user
    const result = await AuthService.register(validatedData);
    
    // Return success response
    res.status(201).json(createSuccessResponse(result, 'Registration successful'));
  } catch (error) {
    handleApiError(error, res);
  }
}
