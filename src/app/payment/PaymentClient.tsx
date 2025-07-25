"use client";

export default function PaymentClient() {

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
          <p className="mt-2 text-gray-600">Kelola pembayaran dan tagihan layanan</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tagihan Aktif</h2>
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada tagihan tertunda</p>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Riwayat Pembayaran</h2>
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada riwayat pembayaran</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
