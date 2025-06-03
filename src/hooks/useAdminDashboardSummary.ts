"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

export interface AdminDashboardSummary {
  pickupsToday: number;
  rewardPending: number;
  activeUsers: number;
  wasteVolumeThisMonth: number;
}

export function useAdminDashboardSummary() {
  const [data, setData] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/admin/summary')
      .then(res => setData(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Gagal memuat ringkasan admin'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
