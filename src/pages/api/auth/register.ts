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

    // Set token dan role ke cookie HTTP Only (auto-login)
    const isProd = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', [
      `token=${result.token}; Path=/; HttpOnly; SameSite=${isProd ? 'None' : 'Lax'};${isProd ? ' Secure;' : ''} Max-Age=604800`,
      `role=${result.user.role}; Path=/; SameSite=${isProd ? 'None' : 'Lax'};${isProd ? ' Secure;' : ''} Max-Age=604800`
    ]); // 7 hari
    // Log debug
    console.log('[DEBUG] Set-Cookie header:', res.getHeader('Set-Cookie'));

    // Return success response (jangan kirim token di body untuk keamanan)
    res.status(201).json(createSuccessResponse({ user: result.user }, 'Registration successful'));
  } catch (error) {
    handleApiError(error, res);
  }
}
