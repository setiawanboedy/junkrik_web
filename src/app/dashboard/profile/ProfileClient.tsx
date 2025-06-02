"use client";
import React, { useEffect, useState } from 'react';
import { useProfile, ProfileData } from '@/hooks/useProfile';
import { ProfileView } from '@/components/profile/ProfileView';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import toast from 'react-hot-toast';

export default function ProfileClient() {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();
  const [edit, setEdit] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEdit = () => setEdit(true);
  const handleCancel = () => setEdit(false);

  const handleSubmit = async (data: Partial<ProfileData>) => {
    const ok = await updateProfile(data);
    if (ok) {
      toast.success('Profil berhasil diperbarui');
      setEdit(false);
    } else {
      toast.error('Gagal memperbarui profil');
    }
    return ok;
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    setPassLoading(true);
    try {
      const res = await fetch('/api/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (res.ok) {
        toast.success('Password berhasil diubah');
        setChangePass(false);
        return true;
      } else {
        const data = await res.json();
        toast.error(data.error || 'Gagal mengubah password');
        return false;
      }
    } catch {
      toast.error('Gagal mengubah password');
      return false;
    } finally {
      setPassLoading(false);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="py-8">
      {!edit && !changePass && (
        <>
          <ProfileView profile={profile} loading={loading} onEdit={handleEdit} />
          <div className="max-w-xl mx-auto mt-4 text-right">
            <button className="text-primary-600 underline" onClick={() => setChangePass(true)}>
              Ubah Password
            </button>
          </div>
        </>
      )}
      {edit && profile && (
        <ProfileForm initial={profile} loading={loading} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}
      {changePass && (
        <ChangePasswordForm loading={passLoading} onSubmit={handleChangePassword} onCancel={() => setChangePass(false)} />
      )}
    </div>
  );
}
