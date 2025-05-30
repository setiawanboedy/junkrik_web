'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Laporan Keberlanjutan</h1>
          <p className="mt-2 text-gray-600">Lihat dampak lingkungan dan kredit plastik</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sampah</h3>
            <p className="text-3xl font-bold text-green-600">0 kg</p>
            <p className="text-sm text-gray-500">Bulan ini</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Daur Ulang</h3>
            <p className="text-3xl font-bold text-blue-600">0%</p>
            <p className="text-sm text-gray-500">Dari total sampah</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kredit Plastik</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-500">Credit earned</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Laporan Kepatuhan EPR</h2>
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada data laporan</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Generate Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
