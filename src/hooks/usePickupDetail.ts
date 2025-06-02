import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';
import type { Pickup } from './usePickups';

export function usePickupDetail(pickupId: string) {
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!pickupId) return;
    setLoading(true);
    api.get(`/pickups/${pickupId}`)
      .then(res => setPickup(res.data.data))
      .catch(err => setError(err?.message || 'Failed to fetch pickup detail'))
      .finally(() => setLoading(false));
  }, [pickupId]);

  return { pickup, loading, error };
}
