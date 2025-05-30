/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom hook untuk authentication logic
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest, RegisterRequest } from '@/lib/validations/auth';
import api from '@/lib/utils/apiClient';

interface User {
  id: string;
  email: string;
  businessName: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
  register: (data: RegisterRequest) => Promise<boolean>;
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false, // Mulai dengan false agar tombol tidak loading sebelum aksi
    error: null,
  });



  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      setState(prev => ({ 
        ...prev, 
        user: data.data.user, 
        loading: false,
        error: null 
      }));
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Login gagal. Silakan coba lagi.';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (registerData: RegisterRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await api.post('/auth/register', registerData);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: null 
      }));
      return true;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } } }, message?: string };
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Registrasi gagal. Silakan coba lagi.';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    // Hapus cookie token di server
    await fetch('/api/auth/logout', { method: 'POST' });
    setState({ user: null, loading: false, error: null });
    router.push('/auth/login');
  }, [router]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    clearError,
    isAuthenticated: !!state.user,
    register,
  };
};
