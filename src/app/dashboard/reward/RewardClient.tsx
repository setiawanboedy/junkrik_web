'use client';
import { useRewards } from '@/hooks/useRewards';
import RewardList from '@/components/reward/RewardList';
import RewardHistory from '@/components/reward/RewardHistory';
import toast from 'react-hot-toast';

export default function RewardClient() {
  const { credit, rewards, history, loading, error, redeemReward } = useRewards();

  const handleRedeem = async (rewardId: string) => {
    const ok = await redeemReward(rewardId);
    if (ok) {
      toast.success('Penukaran reward berhasil!');
    } else {
      toast.error('Penukaran reward gagal!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Reward & Kredit Plastik</h1>
      <RewardList
        rewards={rewards}
        credit={credit}
        loading={loading}
        error={error}
        onRedeem={handleRedeem}
      />
      <RewardHistory
        history={history}
        loading={loading}
        error={error}
      />
    </div>
  );
}
