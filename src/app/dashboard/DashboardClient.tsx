"use client";
import DashboardView from '@/components/dashboard/DashboardView';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardClient() {
  const {
    user,
    loading,
    analytics,
    analyticsLoading,
    activities,
  } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardView
      user={user}
      analytics={analytics}
      analyticsLoading={analyticsLoading}
      activities={activities}
    />
  );
}
