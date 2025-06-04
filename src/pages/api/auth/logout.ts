import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Expire the token and role cookies
  res.setHeader('Set-Cookie', [
    'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    'role=; Path=/; SameSite=Lax; Max-Age=0',
  ]);
  res.status(200).json({ success: true, message: 'Logged out' });
}
