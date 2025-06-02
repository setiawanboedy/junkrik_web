"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/utils/apiClient';

export interface ReportSummary {
  id: string;
  month: number;
  year: number;
  totalPickup: number;
  totalWeight: number;
  recycledWeight: number;
  plasticCredit: number;
  createdAt: string;
}

export function useReports() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<{ month?: number; year?: number }>({});

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, number> = {};
      if (filter.month) params.month = filter.month;
      if (filter.year) params.year = filter.year;
      const response = await api.get('/reports', { params });
      setReports(response.data.data || []);
    } catch (err) {
      setError((err as Error)?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await api.get(`/reports/${reportId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      setError((err as Error)?.message || 'Failed to download report');
    }
  };

  return { reports, loading, error, filter, setFilter, downloadReport };
}
