import React from 'react';

export default function AdminPickupsPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-primary-700">Manajemen Pickup</h2>
      <p className="mb-6 text-gray-600 max-w-xl">
        Lihat, filter, dan kelola semua permintaan pickup dari bisnis. Anda dapat mengubah status pickup, meng-assign driver, dan memantau progres pickup di sini.
      </p>
      {/* Tabel pickup dan aksi akan diimplementasikan di tahap berikutnya */}
      <div className="bg-white rounded-lg shadow p-6 text-gray-400 text-center">
        Tabel pickup akan tampil di sini.
      </div>
    </div>
  );
}
