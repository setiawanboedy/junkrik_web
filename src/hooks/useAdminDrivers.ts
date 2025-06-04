/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAdminDrivers.ts
import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

export interface AdminDriver {
  id: string;
  email: string;
  businessName: string;
  address: string;
  phone: string;
  createdAt: string;
}

export function useAdminDrivers() {
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/drivers');
      setDrivers(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat data driver');
    } finally {
      setLoading(false);
    }
  };

  const createDriver = async (data: { email: string; password: string; businessName?: string; address?: string; phone?: string }) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/drivers', data);
      await fetchDrivers();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal menambah driver');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

  return { drivers, loading, error, fetchDrivers, createDriver };
}
