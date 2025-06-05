/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

export interface AdminUser {
  id: string;
  email: string;
  businessName: string;
  address: string;
  phone: string;
  wasteType?: string;
  wasteVolume?: number;
  role?: string;
  status?: string;
  createdAt: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: Partial<AdminUser>) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/users/update', { id, ...data });
      await fetchUsers();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal update user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const suspendUser = async (id: string) => {
    return updateUser(id, { status: 'SUSPENDED' });
  };

  const activateUser = async (id: string) => {
    return updateUser(id, { status: 'ACTIVE' });
  };

  const resetPassword = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/admin/users/reset-password', { id });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal reset password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return { users, loading, error, fetchUsers, updateUser, suspendUser, activateUser, resetPassword };
}
