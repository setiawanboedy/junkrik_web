/* eslint-disable @typescript-eslint/no-explicit-any */
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
      // Get token from Authorization header or cookie
      let token: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else if ('cookies' in req && req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }
      if (!token) {
        return res.status(401).json(createErrorResponse(
          'AUTH_TOKEN_REQUIRED',
          'Authorization token required'
        ));
      }
      // Verify token
      const decoded = verifyToken(token) as any;
      if (!decoded || !decoded.id) {
        return res.status(401).json(createErrorResponse(
          'INVALID_OR_EXPIRED_TOKEN',
          'Invalid or expired token'
        ));
      }

      // Get user data
      const user = await AuthService.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json(createErrorResponse(
          'USER_NOT_FOUND',
          'User not found'
        ));
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
      return res.status(401).json(createErrorResponse('INVALID_TOKEN', 'Invalid token'));
    }
  };
}
