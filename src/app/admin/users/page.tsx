'use client';
import React, { useCallback } from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import AdminUserTable from '@/components/admin/AdminUserTable';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { users, loading, error, updateUser, suspendUser, activateUser, resetPassword } = useAdminUsers();

  const handleEdit = useCallback(async (userId: string, data: any) => {
    const ok = await updateUser(userId, data);
    if (ok) toast.success('Data user berhasil diupdate');
    else toast.error('Gagal update user');
  }, [updateUser]);

  const handleSuspend = useCallback(async (userId: string) => {
    const ok = await suspendUser(userId);
    if (ok) toast.success('User berhasil disuspend');
    else toast.error('Gagal suspend user');
  }, [suspendUser]);

  const handleActivate = useCallback(async (userId: string) => {
    const ok = await activateUser(userId);
    if (ok) toast.success('User berhasil diaktifkan');
    else toast.error('Gagal aktifkan user');
  }, [activateUser]);

  const handleResetPassword = useCallback(async (userId: string) => {
    const ok = await resetPassword(userId);
    if (ok) toast.success('Password user berhasil direset');
    else toast.error('Gagal reset password');
  }, [resetPassword]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Manajemen User/Bisnis</h2>
      <p className="mb-6 text-gray-600 max-w-xl">Kelola data user/bisnis, suspend akun, dan reset password dari halaman ini.</p>
      <AdminUserTable
        users={users}
        loading={loading}
        error={error}
        onEdit={handleEdit}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
        onResetPassword={handleResetPassword}
      />
    </div>
  );
}
