// Custom hook to fetch user info from backend for client-side auth-aware UI
import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

export interface AuthUser {
  id: string;
  email: string;
  businessName: string;
  role?: string;
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    api.get('/auth/me')
      .then(res => {
        if (!ignore) setUser(res.data.user);
      })
      .catch((err) => {
        if (!ignore) {
          setUser(null);
          setError(err?.response?.data?.error || 'Gagal memuat data user');
          console.error('useAuthUser error:', err);
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, []);

  return { user, loading, error };
}
