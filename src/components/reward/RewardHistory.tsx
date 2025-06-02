import { RewardHistoryItem } from '@/hooks/useRewards';

interface RewardHistoryProps {
  history: RewardHistoryItem[];
  loading: boolean;
  error: string;
}

export default function RewardHistory({ history, loading, error }: RewardHistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Riwayat Penukaran Reward</h2>
      {loading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : history.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Belum ada riwayat penukaran</div>
      ) : (
        <table className="w-full text-left border-t text-gray-800">
          <thead>
            <tr className="border-b">
              <th className="py-2 font-semibold text-gray-700">Reward</th>
              <th className="py-2 font-semibold text-gray-700">Tanggal</th>
              <th className="py-2 font-semibold text-gray-700">Status</th>
              <th className="py-2 font-semibold text-gray-700">Kode/Info</th>
            </tr>
          </thead>
          <tbody>
            {history.map(h => (
              <tr key={h.id} className="border-b">
                <td className="py-2 text-gray-900">{h.rewardName}</td>
                <td className="py-2 text-gray-900">{new Date(h.redeemedAt).toLocaleDateString('id-ID')}</td>
                <td className="py-2">
                  {h.status === 'APPROVED' && <span className="text-green-700 font-semibold">Disetujui</span>}
                  {h.status === 'PENDING' && <span className="text-yellow-700 font-semibold">Menunggu</span>}
                  {h.status === 'REJECTED' && <span className="text-red-700 font-semibold">Ditolak</span>}
                </td>
                <td className="py-2 text-gray-900">{h.code || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
