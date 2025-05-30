import type { AnalyticsData } from '@/types/dashboard';

interface User {
  id: string;
  email: string;
  businessName: string;
}

interface DashboardViewProps {
  user: User | null;
  analytics: AnalyticsData | null;
  analyticsLoading: boolean;
  activities: Array<{ type: string; date: string; description: string }>;
}

import TrendChart from './TrendChart';
import RecentActivity from './RecentActivity';

export default function DashboardView({ user, analytics, analyticsLoading, activities }: DashboardViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Junkrik</h1>
            </div>
            <button
              onClick={() => {
                fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                  window.location.href = '/auth/login';
                });
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Bisnis</h2>
          <p className="text-lg text-gray-700">Selamat datang, <span className="font-semibold text-green-700">{user?.businessName}</span>!</p>
          <p className="text-gray-500">Email: {user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-green-700">{analytics?.pickups?.totalPickups ?? 0}</div>
            <div className="text-gray-600 text-sm">Total Pickup</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-700">{analytics?.reports?.currentMonth.totalWeight ?? 0} kg</div>
            <div className="text-gray-600 text-sm">Total Sampah Bulan Ini</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-purple-700">{analytics?.reports?.currentMonth.plasticCredits ?? 0}</div>
            <div className="text-gray-600 text-sm">Kredit Plastik</div>
          </div>
        </div>

        {/* Chart & Activity Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <TrendChart analytics={analytics} />
          <RecentActivity activities={activities} />
        </div>

        {/* Detail Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Ringkasan Bisnis</h2>
          {analyticsLoading ? (
            <div className="text-gray-500">Memuat data...</div>
          ) : analytics ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded shadow text-center">
                  <div className="text-2xl font-bold text-green-700">{analytics.pickups?.totalPickups ?? 0}</div>
                  <div className="text-gray-600 text-sm">Total Pickup</div>
                </div>
                <div className="bg-blue-50 p-4 rounded shadow text-center">
                  <div className="text-2xl font-bold text-blue-700">{analytics.reports?.currentMonth.totalWeight ?? 0} kg</div>
                  <div className="text-gray-600 text-sm">Total Sampah</div>
                </div>
                <div className="bg-purple-50 p-4 rounded shadow text-center">
                  <div className="text-2xl font-bold text-purple-700">{analytics.reports?.currentMonth.plasticCredits ?? 0}</div>
                  <div className="text-gray-600 text-sm">Kredit Plastik</div>
                </div>
              </div>
              {/* Pickup Stats */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-800">Pickup</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow text-center">
                    <div className="text-lg font-bold text-orange-600">{analytics.pickups?.pendingPickups ?? 0}</div>
                    <div className="text-gray-600 text-xs">Pickup Pending</div>
                  </div>
                  <div className="bg-white p-4 rounded shadow text-center">
                    <div className="text-lg font-bold text-green-600">{analytics.pickups?.completedPickups ?? 0}</div>
                    <div className="text-gray-600 text-xs">Pickup Selesai</div>
                  </div>
                  <div className="bg-white p-4 rounded shadow text-center">
                    <div className="text-lg font-bold text-blue-600">{analytics.pickups?.totalWeight ?? 0} kg</div>
                    <div className="text-gray-600 text-xs">Total Berat Pickup</div>
                  </div>
                </div>
              </div>
              {/* Schedule Stats */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-800">Jadwal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded shadow text-center">
                    <div className="text-lg font-bold text-green-700">{analytics.schedules?.activeSchedules ?? 0}</div>
                    <div className="text-gray-600 text-xs">Jadwal Aktif</div>
                  </div>
                  <div className="bg-white p-4 rounded shadow text-center">
                    <div className="text-lg font-bold text-gray-900">{analytics.schedules?.totalSchedules ?? 0}</div>
                    <div className="text-gray-600 text-xs">Total Jadwal</div>
                  </div>
                  <div className="bg-white p-4 rounded shadow text-center">
                    <div className="text-lg font-bold text-blue-700">{analytics.schedules?.todaysPickups ?? 0}</div>
                    <div className="text-gray-600 text-xs">Pickup Hari Ini</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-500">Gagal memuat data dashboard</div>
          )}
        </div>
      </main>
    </div>
  );
}
