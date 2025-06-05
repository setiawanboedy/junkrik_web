/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/utils/apiClient';

export interface Pickup {
  id: string;
  pickupDate: string;
  wasteTypes: string[];
  estimatedWeight?: number;
  actualWeight?: number;
  status: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  specialInstructions?: string;
  driverNotes?: string;
  createdAt: string;
  schedule?: {
    id: string;
    dayOfWeek: number;
    time: string;
  };
}

export function usePickups(
  statusFilter: string,
  startDate?: string,
  endDate?: string
) {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPickups = useCallback(async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await api.get('/pickups', { params });
      setPickups(response.data.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch pickups');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, startDate, endDate]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  const cancelPickup = async (pickupId: string) => {
    try {
      await api.delete(`/pickups/${pickupId}`);
      setPickups((prev) =>
        prev.map((p) =>
          p.id === pickupId ? { ...p, status: 'CANCELLED' } : p
        )
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to cancel pickup');
    }
  };

  return { pickups, loading, error, cancelPickup };
}
