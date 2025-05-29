import type { NextApiResponse } from 'next';
import { ReportService } from '@/lib/services/report.service';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['GET'])) {
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get user reports with optional filters
      const { year, month, type } = req.query;
      const filters = {
        year: year ? parseInt(year as string) : undefined,
        month: month ? parseInt(month as string) : undefined,
        type: type as string
      };
      
      const reports = await ReportService.getUserReports(req.user.id, filters);
      res.status(200).json(createSuccessResponse(reports));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
