import React from 'react';

export default function AdminRewardPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Approval Reward</h2>
      <p className="mb-6 text-gray-600 max-w-xl">
        Kelola dan approve/reject permintaan penukaran reward dari bisnis. Pastikan reward hanya diberikan pada bisnis yang memenuhi syarat dan stok tersedia.
      </p>
      {/* Tabel approval reward dan aksi akan diimplementasikan di tahap berikutnya */}
      <div className="bg-white rounded-lg shadow p-6 text-gray-400 text-center">
        Tabel approval reward akan tampil di sini.
      </div>
    </div>
  );
}
