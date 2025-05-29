import { z } from 'zod';

// Schema for generating a report
export const generateReportSchema = z.object({
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(1).max(12),
  type: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL']).default('MONTHLY')
});

// Type definitions
export type GenerateReportData = z.infer<typeof generateReportSchema>;

// Validation functions
export function validateGenerateReport(data: unknown): GenerateReportData {
  return generateReportSchema.parse(data);
}
