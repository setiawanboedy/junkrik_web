// src/pages/api/admin/drivers/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const drivers = await prisma.user.findMany({
        where: { role: 'driver' },
        select: {
          id: true,
          email: true,
          businessName: true,
          address: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ data: drivers });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { email, password, businessName, address, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
      const hash = await bcrypt.hash(password, 10);
      const driver = await prisma.user.create({
        data: {
          email,
          password: hash,
          businessName,
          address,
          phone,
          role: 'driver',
        },
      });
      return res.status(201).json({ data: driver });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    }
  }
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
