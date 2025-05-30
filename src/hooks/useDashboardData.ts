import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnalyticsData } from '@/types/dashboard';
import { useRecentActivity } from './useRecentActivity';
import api from '@/lib/utils/apiClient';

interface User {
  id: string;
  email: string;
  businessName: string;
}

export function useDashboardData() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const { activities } = useRecentActivity();

  useEffect(() => {
    // Fetch user info dari backend
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const res = await api.get('/dashboard/analytics');
        setAnalytics(res.data.data);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  return {
    user,
    loading,
    analytics,
    analyticsLoading,
    activities,
  };
}
