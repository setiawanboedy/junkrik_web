"use client";
import PickupList from '@/components/pickups/PickupList';

export default function PickupsClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pengambilan Sampah</h1>
          <p className="mt-2 text-gray-600">Kelola jadwal dan riwayat pengambilan sampah</p>
        </div>
        <PickupList />
      </div>
    </div>
  );
}
