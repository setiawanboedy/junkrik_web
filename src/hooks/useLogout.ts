// Custom hook for logout logic (separation of concern)
import { useCallback } from 'react';
import api from '@/lib/utils/apiClient';

export function useLogout() {
  return useCallback(async () => {
    await api.post('/api/auth/logout');
    window.location.href = '/';
  }, []);
}
