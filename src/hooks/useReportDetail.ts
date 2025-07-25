import { useState, useEffect } from 'react';
import api from '@/lib/utils/apiClient';

export interface ReportDetail {
  id: string;
  month: number;
  year: number;
  totalPickup: number;
  totalWeight: number;
  recycledWeight: number;
  plasticCredit: number;
  breakdown: Array<{
    wasteType: string;
    weight: number;
    recycled: number;
  }>;
  createdAt: string;
}

export function useReportDetail(reportId: string) {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reportId) return;
    fetchReport();
    // eslint-disable-next-line
  }, [reportId]);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/reports/${reportId}`);
      setReport(response.data.data || null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch report detail');
    } finally {
      setLoading(false);
    }
  };

  return { report, loading, error };
}
