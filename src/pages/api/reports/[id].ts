import type { NextApiResponse } from 'next';
import { ReportService } from '@/lib/services/report.service';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['GET'])) {
    return;
  }

  const { id } = req.query;
  
  // Validate report ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid report ID'
    });
  }

  try {
    if (req.method === 'GET') {
      // Get single report
      const report = await ReportService.getReportById(id, req.user.id);
      res.status(200).json(createSuccessResponse(report));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
