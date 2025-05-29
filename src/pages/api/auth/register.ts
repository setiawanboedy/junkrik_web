import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

// Endpoint untuk register bisnis
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, password, businessName, address, phone, wasteType, wasteVolume, role } = req.body;
  if (!email || !password || !businessName || !address || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await hashPassword(password);    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashed, 
        businessName, 
        address, 
        phone,
        wasteType,
        wasteVolume: wasteVolume ? parseInt(wasteVolume) : null,
        role: role || 'business'
      },
    });
    return res.status(201).json({ message: 'Registration successful', user: { id: user.id, email: user.email } });  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
