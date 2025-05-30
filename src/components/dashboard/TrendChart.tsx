import { AnalyticsData } from '@/types/dashboard';
import React from 'react';

interface TrendChartProps {
  analytics: AnalyticsData | null;
}

// Placeholder: Replace with chart library (e.g. Chart.js, Recharts) for real chart
export default function TrendChart({ analytics }: TrendChartProps) {
  // Dummy: show current month vs previous month pickup & weight
  if (!analytics) return null;
  const { reports } = analytics;
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Tren Pickup & Sampah (Bulan Ini vs Bulan Lalu)</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 text-center">
          <div className="text-gray-600 mb-1">Pickup</div>
          <div className="flex justify-center gap-4">
            <div>
              <div className="text-xs text-gray-400">Bulan Ini</div>
              <div className="text-2xl font-bold text-green-700">{reports.currentMonth.totalPickups}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Bulan Lalu</div>
              <div className="text-2xl font-bold text-gray-500">{reports.previousMonth.totalPickups}</div>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-gray-600 mb-1">Total Sampah</div>
          <div className="flex justify-center gap-4">
            <div>
              <div className="text-xs text-gray-400">Bulan Ini</div>
              <div className="text-2xl font-bold text-blue-700">{reports.currentMonth.totalWeight} kg</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Bulan Lalu</div>
              <div className="text-2xl font-bold text-gray-500">{reports.previousMonth.totalWeight} kg</div>
            </div>
          </div>
        </div>
      </div>
      {/* TODO: Replace with real chart */}
    </div>
  );
}
