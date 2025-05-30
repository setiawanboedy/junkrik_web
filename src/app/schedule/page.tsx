'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SchedulePage() {
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
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buat Jadwal Pengambilan</h1>
          <p className="mt-2 text-gray-600">Atur jadwal rutin untuk pengambilan sampah</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hari Pengambilan
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Pilih hari</option>
                  <option value="monday">Senin</option>
                  <option value="tuesday">Selasa</option>
                  <option value="wednesday">Rabu</option>
                  <option value="thursday">Kamis</option>
                  <option value="friday">Jumat</option>
                  <option value="saturday">Sabtu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Pengambilan
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Pilih waktu</option>
                  <option value="morning">Pagi (08:00 - 12:00)</option>
                  <option value="afternoon">Siang (12:00 - 16:00)</option>
                  <option value="evening">Sore (16:00 - 18:00)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Sampah
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Plastik', 'Organik', 'Kertas', 'Logam', 'Kaca', 'Campuran'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input type="checkbox" className="mr-2 text-green-600" />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimasi Volume (kg)
              </label>
              <input
                type="number"
                placeholder="Contoh: 50"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Khusus
              </label>
              <textarea
                rows={3}
                placeholder="Catatan untuk driver (opsional)"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Buat Jadwal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
