import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/jwt';
import { AuthService } from '@/lib/services/auth.service';
import { createErrorResponse } from '@/lib/utils/api';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
    businessName: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(createErrorResponse('Authorization token required'));
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix

      // Verify token
      const decoded = verifyToken(token) as any;
      if (!decoded || !decoded.id) {
        return res.status(401).json(createErrorResponse('Invalid token'));
      }

      // Get user data
      const user = await AuthService.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json(createErrorResponse('User not found'));
      }

      // Add user to request object
      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email,
        businessName: user.businessName
      };

      // Call the actual handler
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json(createErrorResponse('Invalid token'));
    }
  };
}
