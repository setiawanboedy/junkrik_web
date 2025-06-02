import React from 'react';
import { ProfileData } from '@/hooks/useProfile';

interface ProfileViewProps {
  profile: ProfileData | null;
  loading: boolean;
  onEdit: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, loading, onEdit }) => {
  if (loading) return <div>Memuat profil...</div>;
  if (!profile) return <div>Profil tidak ditemukan.</div>;
  return (
    <div className="rounded-lg bg-white p-6 shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-extrabold mb-4 text-gray-900">Profil Bisnis Anda</h2>
      <p className="mb-6 text-gray-600 text-sm">
        Berikut adalah data utama bisnis Anda yang digunakan untuk layanan pengelolaan sampah B2B. Pastikan data selalu akurat agar proses penjadwalan, pelaporan, dan insentif berjalan lancar.
      </p>
      <div className="mb-3 flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Nama Bisnis:</span>
        <span className="text-lg text-gray-900">{profile.businessName}</span>
      </div>
      <div className="mb-3 flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Nama Penanggung Jawab (PIC):</span>
        <span className="text-lg text-gray-900">{profile.name || '-'}</span>
      </div>
      <div className="mb-3 flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Email:</span>
        <span className="text-lg text-gray-900">{profile.email}</span>
      </div>
      <div className="mb-3 flex flex-col gap-1">
        <span className="font-semibold text-gray-700">No. Telepon:</span>
        <span className="text-lg text-gray-900">{profile.phone}</span>
      </div>
      <div className="mb-3 flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Alamat:</span>
        <span className="text-lg text-gray-900">{profile.address}</span>
      </div>
      <div className="mb-3 flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Jenis Usaha:</span>
        <span className="text-lg text-gray-900">{profile.businessType}</span>
      </div>
      <div className="mb-3 flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Volume Sampah Harian:</span>
        <span className="text-lg text-gray-900">{profile.dailyWasteVolume} kg</span>
      </div>
      <button className="mt-6 px-5 py-2 bg-primary-600 text-white font-semibold rounded hover:bg-primary-700 transition" onClick={onEdit}>
        Edit Profil
      </button>
    </div>
  );
};
