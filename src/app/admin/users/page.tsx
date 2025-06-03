import React from 'react';

export default function AdminUsersPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-primary-700">Manajemen User/Bisnis</h2>
      <p className="mb-6 text-gray-600 max-w-xl">
        Lihat, cari, dan kelola data user/bisnis yang terdaftar di platform. Anda dapat mengedit, suspend, atau reset password akun bisnis di sini.
      </p>
      {/* Tabel user/bisnis dan aksi akan diimplementasikan di tahap berikutnya */}
      <div className="bg-white rounded-lg shadow p-6 text-gray-400 text-center">
        Tabel user/bisnis akan tampil di sini.
      </div>
    </div>
  );
}
