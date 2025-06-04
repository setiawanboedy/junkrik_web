'use client';

import React, { useState } from 'react';
import { useAdminRewards } from '@/hooks/useAdminRewards';
import toast from 'react-hot-toast';

export default function AdminRewardTable() {
  const { rewards, loading, error, approveReward, rejectReward } = useAdminRewards();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async (id: string) => {
    setSubmitting(true);
    const ok = await approveReward(id);
    setSubmitting(false);
    if (ok) toast.success('Reward disetujui!');
    else toast.error('Gagal menyetujui reward.');
  };

  const handleReject = async () => {
    if (!rejectingId || !rejectReason) return;
    setSubmitting(true);
    const ok = await rejectReward(rejectingId, rejectReason);
    setSubmitting(false);
    if (ok) toast.success('Reward ditolak!');
    else toast.error('Gagal menolak reward.');
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Permintaan Reward Pending</h3>
      {loading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : rewards.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Tidak ada permintaan reward pending</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2 font-semibold text-gray-700">User</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Bisnis</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Reward</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Tanggal</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="py-2 px-2">{r.userName}</td>
                  <td className="py-2 px-2">{r.userBusiness}</td>
                  <td className="py-2 px-2">{r.rewardName}</td>
                  <td className="py-2 px-2">{new Date(r.redeemedAt).toLocaleString('id-ID')}</td>
                  <td className="py-2 px-2 flex gap-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs disabled:opacity-50"
                      disabled={submitting}
                      onClick={() => handleApprove(r.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs disabled:opacity-50"
                      disabled={submitting}
                      onClick={() => setRejectingId(r.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal for rejection reason */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-bold mb-2">Alasan Penolakan Reward</h4>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              disabled={submitting}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => { setRejectingId(null); setRejectReason(''); }}
                disabled={submitting}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={submitting || !rejectReason}
                onClick={handleReject}
              >
                Tolak Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
