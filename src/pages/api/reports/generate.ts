import type { NextApiRequest, NextApiResponse } from 'next';
import { ReportService } from '@/lib/services/report.service';
import { validateGenerateReport } from '@/lib/validations/report';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError, createSuccessResponse } from '@/lib/utils/api';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (!validateMethod(req, res, ['POST'])) {
    return;
  }

  try {
    if (req.method === 'POST') {
      // Generate new report
      const validatedData = validateGenerateReport(req.body);
      const report = await ReportService.generateReport(req.user.id, validatedData);
      res.status(201).json(createSuccessResponse(report, 'Report generated successfully'));
    }
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
