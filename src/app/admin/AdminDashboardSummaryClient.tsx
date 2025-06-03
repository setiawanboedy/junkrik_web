"use client";
import { useAdminDashboardSummary } from '@/hooks/useAdminDashboardSummary';

export default function AdminDashboardSummaryClient() {
  const { data, loading, error } = useAdminDashboardSummary();
  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">Pickup Hari Ini</div>
          <div className="text-5xl font-extrabold text-green-700 tracking-tight drop-shadow-sm mb-1">
            {loading ? '-' : data?.pickupsToday?.toLocaleString('id-ID') ?? '-'}
          </div>
          <div className="text-sm text-gray-400 mt-2">Total pickup terjadwal hari ini</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">Reward Pending</div>
          <div className="text-5xl font-extrabold text-yellow-600 tracking-tight drop-shadow-sm mb-1">
            {loading ? '-' : data?.rewardPending?.toLocaleString('id-ID') ?? '-'}
          </div>
          <div className="text-sm text-gray-400 mt-2">Permintaan reward menunggu approval</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">User/Bisnis Aktif</div>
          <div className="text-5xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm mb-1">
            {loading ? '-' : data?.activeUsers?.toLocaleString('id-ID') ?? '-'}
          </div>
          <div className="text-sm text-gray-400 mt-2">Total user/bisnis aktif</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">Volume Sampah Bulan Ini</div>
          <div className="text-5xl font-extrabold text-emerald-700 tracking-tight drop-shadow-sm mb-1">
            {loading ? '-' : data?.wasteVolumeThisMonth?.toLocaleString('id-ID') ?? '-'} <span className="text-lg font-bold">kg</span>
          </div>
          <div className="text-sm text-gray-400 mt-2">Total volume sampah terkelola bulan ini</div>
        </div>
      </div>
    </div>
  );
}
