// Custom hook untuk authentication logic
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginRequest, RegisterRequest } from '@/lib/validations/auth';

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
    loading: true,
    error: null,
  });

  const checkAuthStatus = useCallback(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        const user = JSON.parse(userData);
        setState(prev => ({ ...prev, user, loading: false }));
      } else {
        setState(prev => ({ ...prev, user: null, loading: false }));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setState(prev => ({ ...prev, user: null, loading: false, error: 'Invalid session data' }));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        setState(prev => ({ 
          ...prev, 
          user: data.data.user, 
          loading: false,
          error: null 
        }));
        
        return true;
      } else {
        // Handle error response dengan struktur baru
        const errorMessage = data.error?.message || data.error || 'Login gagal. Silakan coba lagi.';
        
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage        }));
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda.' 
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (registerData: RegisterRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });      const data = await response.json();

      if (response.ok) {
        setState(prev => ({ 
          ...prev, 
          loading: false,
          error: null 
        }));
        
        return true;
      } else {
        // Handle error response dengan struktur baru
        const errorMessage = data.error?.message || data.error || 'Registrasi gagal. Silakan coba lagi.';
        
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage        }));
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda.' 
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
