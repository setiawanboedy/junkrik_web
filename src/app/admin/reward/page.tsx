import React from 'react';
import AdminRewardTable from './AdminRewardTable';

export default function AdminRewardPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Approval Reward</h2>
      <p className="mb-6 text-gray-600 max-w-xl">
        Kelola dan approve/reject permintaan penukaran reward dari bisnis. Pastikan reward hanya diberikan pada bisnis yang memenuhi syarat dan stok tersedia.
      </p>
      <AdminRewardTable />
    </div>
  );
}
