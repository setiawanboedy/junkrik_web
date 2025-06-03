"use client";
import { useAdminPickups } from '@/hooks/useAdminPickups';
import { useState } from 'react';

export default function AdminPickupsClient() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const { pickups, loading, error, updatePickupStatus, fetchPickups } = useAdminPickups({ status, search });

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPickups();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Manajemen Pickup</h2>
      <p className="mb-6 text-gray-600 max-w-xl">
        Lihat, filter, dan kelola semua permintaan pickup dari bisnis. Anda dapat mengubah status pickup, meng-assign driver, dan memantau progres pickup di sini.
      </p>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form className="flex flex-wrap gap-2 mb-4 items-end" onSubmit={handleFilter}>
        <select className="input input-bordered" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Semua</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <input className="input input-bordered" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari bisnis..." />
        <button type="submit" className="btn btn-primary">Filter</button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border border-green-200">
          <thead>
            <tr className="bg-green-100 text-green-900 text-base">
              <th className="px-4 py-3 text-left font-bold">Bisnis</th>
              <th className="px-4 py-3 text-left font-bold">Alamat</th>
              <th className="px-4 py-3 text-left font-bold">Telepon</th>
              <th className="px-4 py-3 text-left font-bold">Jadwal</th>
              <th className="px-4 py-3 text-left font-bold">Jenis Sampah</th>
              <th className="px-4 py-3 text-left font-bold">Estimasi (kg)</th>
              <th className="px-4 py-3 text-left font-bold">Status</th>
              <th className="px-4 py-3 text-left font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-green-500 font-semibold text-lg">Memuat data...</td></tr>
            ) : pickups.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-green-500 font-semibold text-lg">Tidak ada data pickup</td></tr>
            ) : pickups.map(p => (
              <tr key={p.id} className="border-b border-green-100 hover:bg-green-50 group">
                <td className="px-4 py-3 font-bold text-green-900 group-hover:text-green-800 text-base">{p.businessName}</td>
                <td className="px-4 py-3 text-gray-800 group-hover:text-green-900 text-base">{p.address}</td>
                <td className="px-4 py-3 text-gray-800 group-hover:text-green-900 text-base">{p.phone}</td>
                <td className="px-4 py-3 text-gray-900 font-semibold group-hover:text-green-900 text-base">{p.scheduledAt ? new Date(p.scheduledAt).toLocaleString('id-ID') : '-'}</td>
                <td className="px-4 py-3 text-green-700 font-semibold group-hover:text-green-900 text-base">{p.wasteType}</td>
                <td className="px-4 py-3 text-blue-700 font-bold group-hover:text-blue-900 text-base">{p.estimatedWeight}</td>
                <td className="px-4 py-3 text-lg">
                  <span className={
                    p.status === 'PENDING' ? 'text-yellow-600' :
                    p.status === 'IN_PROGRESS' ? 'text-blue-600' :
                    p.status === 'COMPLETED' ? 'text-green-600' :
                    p.status === 'CANCELLED' ? 'text-red-600' : 'text-gray-600'
                  }>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {/* Tombol aksi (approve, assign, dsb) */}
                  {p.status === 'PENDING' && (
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mr-2"
                      onClick={() => updatePickupStatus(p.id, 'IN_PROGRESS')}
                    >
                      Approve
                    </button>
                  )}
                  {p.status === 'IN_PROGRESS' && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm mr-2"
                      onClick={() => updatePickupStatus(p.id, 'COMPLETED')}
                    >
                      Selesai
                    </button>
                  )}
                  {p.status !== 'COMPLETED' && p.status !== 'CANCELLED' && (
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      onClick={() => updatePickupStatus(p.id, 'CANCELLED')}
                    >
                      Batalkan
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
