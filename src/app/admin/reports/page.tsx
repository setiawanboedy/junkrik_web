import React from 'react';

export default function AdminReportsPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Laporan & Statistik</h2>
      <p className="mb-6 text-gray-600 max-w-xl">
        Pantau statistik pickup, volume sampah, performa armada, dan laporan EPR. Anda dapat mengekspor data untuk kebutuhan audit atau pelaporan ke regulator.
      </p>
      {/* Grafik dan tabel laporan akan diimplementasikan di tahap berikutnya */}
      <div className="bg-white rounded-lg shadow p-6 text-gray-400 text-center">
        Grafik dan tabel laporan akan tampil di sini.
      </div>
    </div>
  );
}
