/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/jwt';
import { AuthService } from '@/lib/services/auth.service';
import { createErrorResponse } from '@/lib/utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ambil token dari cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json(createErrorResponse('AUTH_TOKEN_REQUIRED', 'Authorization token required'));
    }
    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id) {
      return res.status(401).json(createErrorResponse('INVALID_OR_EXPIRED_TOKEN', 'Invalid or expired token'));
    }
    const user = await AuthService.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json(createErrorResponse('USER_NOT_FOUND', 'User not found'));
    }
    return res.status(200).json({ data: { user } });
  } catch (error) {
    return res.status(500).json(createErrorResponse('INTERNAL_ERROR', 'Internal server error '+ error));
  }
}
