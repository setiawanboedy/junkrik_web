"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RewardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);


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
        {/* ...existing code for reward content... */}
      </div>
    </div>
  );
}
