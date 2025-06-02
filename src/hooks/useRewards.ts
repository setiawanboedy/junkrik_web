import { useState, useEffect } from 'react';
import api from '@/lib/utils/apiClient';

export interface Reward {
  id: string;
  name: string;
  description: string;
  requiredCredit: number;
  imageUrl?: string;
  available: boolean;
}

export interface RewardHistoryItem {
  id: string;
  rewardId: string;
  rewardName: string;
  redeemedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  code?: string;
  expiredAt?: string;
}

export function useRewards() {
  const [credit, setCredit] = useState<number>(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [history, setHistory] = useState<RewardHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [creditRes, rewardsRes, historyRes] = await Promise.all([
        api.get('/reward/credit'),
        api.get('/reward/list'),
        api.get('/reward/history'),
      ]);
      setCredit(creditRes.data.data || 0);
      setRewards(rewardsRes.data.data || []);
      setHistory(historyRes.data.data || []);
    } catch (err) {
      setError((err as Error)?.message || 'Failed to fetch reward data');
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId: string) => {
    setError('');
    try {
      await api.post('/reward/redeem', { rewardId });
      await fetchAll();
      return true;
    } catch (err) {
      setError((err as Error)?.message || 'Failed to redeem reward');
      return false;
    }
  };

  return { credit, rewards, history, loading, error, redeemReward };
}
