// Custom hook for logout logic (separation of concern)
import { useCallback } from 'react';
import api from '@/lib/utils/apiClient';

export function useLogout() {
  return useCallback(async () => {
    // Karena baseURL sudah '/api', cukup '/auth/logout' saja
    await api.post('/auth/logout');
    window.location.href = '/';
  }, []);
}
