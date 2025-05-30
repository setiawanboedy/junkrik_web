'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RewardPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Reward & Insentif</h1>
          <p className="mt-2 text-gray-600">Tukar kredit plastik dengan voucher dan diskon</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Saldo Kredit</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500">Kredit plastik tersedia</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Penghematan</h3>
            <p className="text-3xl font-bold text-blue-600">Rp 0</p>
            <p className="text-sm text-gray-500">Dari program reward</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Katalog Reward</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold">Voucher Sembako</h3>
              <p className="text-sm text-gray-600 mt-1">Rp 100.000</p>
              <p className="text-xs text-gray-500 mt-2">5 kredit plastik</p>
              <button className="w-full mt-3 bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">
                Kredit Tidak Cukup
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold">Diskon Layanan</h3>
              <p className="text-sm text-gray-600 mt-1">10% off</p>
              <p className="text-xs text-gray-500 mt-2">3 kredit plastik</p>
              <button className="w-full mt-3 bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">
                Kredit Tidak Cukup
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold">Sertifikat Hijau</h3>
              <p className="text-sm text-gray-600 mt-1">Certificate</p>
              <p className="text-xs text-gray-500 mt-2">2 kredit plastik</p>
              <button className="w-full mt-3 bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm cursor-not-allowed">
                Kredit Tidak Cukup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
