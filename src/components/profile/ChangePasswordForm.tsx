import React, { useState } from 'react';

interface ChangePasswordFormProps {
  loading: boolean;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<boolean>;
  onCancel: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ loading, onSubmit, onCancel }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!oldPassword || !newPassword) {
      setError('Semua field wajib diisi');
      return;
    }
    const ok = await onSubmit(oldPassword, newPassword);
    if (!ok) setError('Gagal mengubah password');
  };

  return (
    <form className="rounded-lg bg-white p-6 shadow-md max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Ubah Password</h2>
      <div className="mb-2">
        <label className="block font-semibold">Password Lama</label>
        <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Password Baru</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input input-bordered w-full" required />
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex gap-2 mt-4">
        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onCancel} disabled={loading}>
          Batal
        </button>
      </div>
    </form>
  );
};
