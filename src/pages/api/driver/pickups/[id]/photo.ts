import type { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import prisma from '@/lib/prisma';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// POST /api/driver/pickups/[id]/photo - Upload photo for pickup completion
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['POST'])) return;
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid pickup ID' });
  }
  try {
    // Verify user role via DB
    const userRec = await prisma.user.findUnique({ where: { id: req.user.id }, select: { role: true } });
    if (!userRec || userRec.role !== 'driver') {
      return res.status(403).json({ success: false, error: 'Forbidden: Only driver can access this endpoint.' });
    }
    // Fetch pickup
    const pickup = await prisma.pickup.findUnique({ where: { id } });
    if (!pickup) {
      return res.status(404).json({ success: false, error: 'Pickup not found' });
    }
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
    });
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'File upload error' });
      }
      const file = files.photo;
      if (!file) {
        return res.status(400).json({ success: false, error: 'No photo uploaded' });
      }
      const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;
      const fileName = path.basename(filePath);
      const photoUrl = `/uploads/${fileName}`;
      await prisma.pickup.update({ where: { id }, data: { photoUrl } });
      return res.status(200).json(createSuccessResponse({ photoUrl }, 'Photo uploaded successfully'));
    });
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
