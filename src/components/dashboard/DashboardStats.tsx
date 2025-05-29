'use client';

import { useState, useEffect } from 'react';

interface DashboardAnalytics {
  reports: {
    currentMonth: {
      totalPickups: number;
      totalWeight: number;
      recycledWeight: number;
      recyclingRate: number;
      plasticCredits: number;
      costSavings: number;
    };
    previousMonth: {
      totalPickups: number;
      totalWeight: number;
      recycledWeight: number;
      recyclingRate: number;
      plasticCredits: number;
      costSavings: number;
    };
    growth: {
      totalPickups: number;
      totalWeight: number;
      recycledWeight: number;
      plasticCredits: number;
    };
    yearToDate: {
      totalPickups: number;
      totalWeight: number;
      recycledWeight: number;
      plasticCredits: number;
      costSavings: number;
    };
  };
  pickups: {
    totalPickups: number;
    pendingPickups: number;
    completedPickups: number;
    totalWeight: number;
  };
  schedules: {
    totalSchedules: number;
    activeSchedules: number;
    todaysPickups: number;
  };
}

export default function DashboardStats() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/dashboard/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(1)} kg`;
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error || 'Failed to load analytics'}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Pickups This Month',
      value: analytics.reports.currentMonth.totalPickups,
      growth: analytics.reports.growth.totalPickups,
      icon: '📦',
      color: 'blue'
    },
    {
      title: 'Weight Collected',
      value: formatWeight(analytics.reports.currentMonth.totalWeight),
      growth: analytics.reports.growth.totalWeight,
      icon: '⚖️',
      color: 'green'
    },
    {
      title: 'Recycled Weight',
      value: formatWeight(analytics.reports.currentMonth.recycledWeight),
      growth: analytics.reports.growth.recycledWeight,
      icon: '♻️',
      color: 'emerald'
    },
    {
      title: 'Plastic Credits',
      value: formatWeight(analytics.reports.currentMonth.plasticCredits),
      growth: analytics.reports.growth.plasticCredits,
      icon: '🏆',
      color: 'yellow'
    },
    {
      title: 'Cost Savings',
      value: formatCurrency(analytics.reports.currentMonth.costSavings),
      growth: 0,
      icon: '💰',
      color: 'purple'
    },
    {
      title: 'Recycling Rate',
      value: `${analytics.reports.currentMonth.recyclingRate.toFixed(1)}%`,
      growth: 0,
      icon: '📊',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string, isGrowth = false) => {
    const baseColors = {
      blue: isGrowth ? 'text-blue-600' : 'bg-blue-500',
      green: isGrowth ? 'text-green-600' : 'bg-green-500',
      emerald: isGrowth ? 'text-emerald-600' : 'bg-emerald-500',
      yellow: isGrowth ? 'text-yellow-600' : 'bg-yellow-500',
      purple: isGrowth ? 'text-purple-600' : 'bg-purple-500',
      indigo: isGrowth ? 'text-indigo-600' : 'bg-indigo-500'
    };
    return baseColors[color as keyof typeof baseColors] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg ${getColorClasses(stat.color)} flex items-center justify-center text-white text-xl`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                {stat.growth !== 0 && (
                  <div className={`text-sm font-medium ${stat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatGrowth(stat.growth)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-orange-600">{analytics.pickups.pendingPickups}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">{analytics.pickups.completedPickups}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold text-gray-900">{analytics.pickups.totalPickups}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedules</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Active</span>
                <span className="font-semibold text-green-600">{analytics.schedules.activeSchedules}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-semibold text-gray-900">{analytics.schedules.totalSchedules}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Pickups</span>
                <span className="font-semibold text-blue-600">{analytics.schedules.todaysPickups}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Year to Date</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Weight</span>
                <span className="font-semibold text-gray-900">{formatWeight(analytics.reports.yearToDate.totalWeight)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plastic Credits</span>
                <span className="font-semibold text-yellow-600">{formatWeight(analytics.reports.yearToDate.plasticCredits)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost Savings</span>
                <span className="font-semibold text-green-600">{formatCurrency(analytics.reports.yearToDate.costSavings)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
