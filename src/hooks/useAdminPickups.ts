/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

export interface AdminPickup {
  id: string;
  businessName: string;
  address: string;
  phone: string;
  scheduledAt: string;
  status: string;
  wasteType: string;
  estimatedWeight: number;
}

export function useAdminPickups(filters?: { status?: string; search?: string }) {
  const [pickups, setPickups] = useState<AdminPickup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState(filters || {});

  const fetchPickups = async (overrideFilters?: { status?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const params = overrideFilters || currentFilters;
      const res = await api.get('/admin/pickups', { params });
      setPickups(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat data pickup');
    } finally {
      setLoading(false);
    }
  };

  // Untuk aksi update status pickup
  const updatePickupStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.patch('/admin/pickup-status', { id, status });
      await fetchPickups();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal update status pickup');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentFilters(filters || {});
    fetchPickups(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.status, filters?.search]);

  return { pickups, loading, error, fetchPickups, updatePickupStatus };
}
