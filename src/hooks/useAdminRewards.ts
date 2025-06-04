/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

export interface AdminRewardHistory {
  id: string;
  userName: string;
  userBusiness: string;
  rewardName: string;
  redeemedAt: string;
  status: string;
  code?: string;
  expiredAt?: string;
}

export function useAdminRewards() {
  const [rewards, setRewards] = useState<AdminRewardHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/reward/pending');
      setRewards(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat data reward');
    } finally {
      setLoading(false);
    }
  };

  const approveReward = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/reward/approve', { id });
      await fetchRewards();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal approve reward');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rejectReward = async (id: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/reward/reject', { id, reason });
      await fetchRewards();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal reject reward');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRewards(); }, []);

  return { rewards, loading, error, approveReward, rejectReward, fetchRewards };
}
