/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

export interface AdminReport {
  id: string;
  userId: string;
  businessName: string;
  month: number;
  year: number;
  totalPickups: number;
  totalWeight: number;
  recycledWeight: number;
  recyclingRate: number;
  plasticCredits: number;
  costSavings: number;
  generatedAt: string;
}

export function useAdminReports(filters?: { month?: number; year?: number; businessName?: string }) {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.month) params.append('month', String(filters.month));
      if (filters?.year) params.append('year', String(filters.year));
      if (filters?.businessName) params.append('businessName', filters.businessName);
      const res = await api.get(`/admin/reports${params.toString() ? '?' + params.toString() : ''}`);
      setReports(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat data laporan');
    } finally {
      setLoading(false);
    }
  }, [filters?.month, filters?.year, filters?.businessName]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  return { reports, loading, error, fetchReports };
}
