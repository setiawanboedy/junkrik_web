import { Reward } from '@/hooks/useRewards';

interface RewardListProps {
  rewards: Reward[];
  credit: number;
  loading: boolean;
  error: string;
  onRedeem: (rewardId: string) => void;
}

export default function RewardList({ rewards, credit, loading, error, onRedeem }: RewardListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Tukar Kredit Plastik dengan Reward</h2>
      <div className="mb-4 text-green-700 font-semibold">Saldo Kredit Plastik: {credit} kg</div>
      {loading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : rewards.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Belum ada reward tersedia</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map(r => (
            <div key={r.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col items-center">
              {r.imageUrl && <img src={r.imageUrl} alt={r.name} className="w-20 h-20 object-contain mb-2" />}
              <div className="font-bold text-lg text-gray-900 mb-1">{r.name}</div>
              <div className="text-gray-700 text-sm mb-2 text-center">{r.description}</div>
              <div className="mb-2 text-green-700 font-semibold">{r.requiredCredit} kg kredit plastik</div>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500"
                disabled={!r.available || credit < r.requiredCredit}
                onClick={() => onRedeem(r.id)}
              >
                {credit < r.requiredCredit ? 'Kredit Tidak Cukup' : r.available ? 'Tukar' : 'Tidak Tersedia'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
