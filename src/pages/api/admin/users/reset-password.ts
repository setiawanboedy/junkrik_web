import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    // Generate random password
    const newPassword = randomBytes(6).toString('base64');
    await prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });
    // TODO: Kirim password baru ke email user (implementasi email service diperlukan)
    res.status(200).json({ success: true, newPassword });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
