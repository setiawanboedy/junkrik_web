import React, { useState } from 'react';
import { ProfileData } from '@/hooks/useProfile';

interface ProfileFormProps {
  initial: ProfileData;
  loading: boolean;
  onSubmit: (data: Partial<ProfileData>) => Promise<boolean>;
  onCancel: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ initial, loading, onSubmit, onCancel }) => {
  const [form, setForm] = useState<Partial<ProfileData>>(initial);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = await onSubmit(form);
    if (!ok) setError('Gagal memperbarui profil');
  };

  return (
    <form className="rounded-lg bg-white p-6 shadow-md max-w-xl mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Edit Profil Bisnis</h2>
      <div className="mb-2">
        <label className="block font-semibold">Nama Bisnis</label>
        <input name="businessName" value={form.businessName || ''} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Nama PIC</label>
        <input name="name" value={form.name || ''} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Email</label>
        <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">No. Telepon</label>
        <input name="phone" value={form.phone || ''} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Alamat</label>
        <input name="address" value={form.address || ''} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Jenis Usaha</label>
        <input name="businessType" value={form.businessType || ''} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block font-semibold">Volume Sampah Harian (kg)</label>
        <input name="dailyWasteVolume" type="number" value={form.dailyWasteVolume || ''} onChange={handleChange} className="input input-bordered w-full" required min={0} />
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
