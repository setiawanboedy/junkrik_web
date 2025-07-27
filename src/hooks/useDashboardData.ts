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
  
  // Debug state
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  useEffect(() => {
    // Fetch user info dari backend
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        console.log("Auth response:", res.data); // Log untuk debug
        if (res.data && res.data.data && res.data.data.user) {
          setUser(res.data.data.user);
        } else {
          console.error("User data not found in response:", res.data);
          router.push('/auth/login');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
