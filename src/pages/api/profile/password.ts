import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/jwt';
import prisma from '@/lib/prisma';
import { hashPassword, comparePassword } from '@/lib/password';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = verifyToken(token) as { id: string };
    if (!decoded || !decoded.id) return res.status(401).json({ error: 'Invalid token' });
    const userId = decoded.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Field tidak lengkap' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) return res.status(404).json({ error: 'User not found' });
    const valid = await comparePassword(oldPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Password lama salah' });
    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
