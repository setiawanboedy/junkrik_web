import { AnalyticsData } from '@/types/dashboard';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  analytics: AnalyticsData | null;
}

// Helper to generate dummy 12-month trend from analytics (replace with real data if available)
function getMonthlyTrend(analytics: AnalyticsData | null) {
  // This should be replaced with real monthly data from backend
  // For now, generate 12 months with current/previous month values
  if (!analytics) return [];
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return {
      month: d.toLocaleString('id-ID', { month: 'short', year: '2-digit' }),
      totalPickups: i === 10 ? analytics.reports.previousMonth.totalPickups : (i === 11 ? analytics.reports.currentMonth.totalPickups : Math.round(Math.random() * 10)),
      totalWeight: i === 10 ? analytics.reports.previousMonth.totalWeight : (i === 11 ? analytics.reports.currentMonth.totalWeight : Math.round(Math.random() * 100)),
    };
  });
  return months;
}

export default function TrendChart({ analytics }: TrendChartProps) {
  if (!analytics) return null;
  const data = getMonthlyTrend(analytics);
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Tren Pickup & Sampah (12 Bulan)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" label={{ value: 'Pickup', angle: -90, position: 'insideLeft', offset: 0 }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Berat (kg)', angle: 90, position: 'insideRight', offset: 0 }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="totalPickups" stroke="#16a34a" name="Pickup" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="totalWeight" stroke="#2563eb" name="Berat (kg)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
