import React from 'react';
import type { AdminReport } from '@/hooks/useAdminReports';

interface AdminReportTableProps {
  reports: AdminReport[];
  loading: boolean;
  error: string | null;
  onDetail: (report: AdminReport) => void;
  onExport?: (report: AdminReport) => void;
}

export default function AdminReportTable({ reports, loading, error, onDetail, onExport }: AdminReportTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Laporan Bulanan Bisnis</h3>
      {loading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : reports.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Tidak ada laporan ditemukan</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2 font-semibold text-gray-700">Bisnis</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Periode</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Pickup</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Total Sampah (kg)</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Daur Ulang (kg)</th>
                <th className="py-2 px-2 font-semibold text-gray-700">% Daur Ulang</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Kredit Plastik (kg)</th>
                <th className="py-2 px-2 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="py-2 px-2 font-semibold text-green-800">{r.businessName}</td>
                  <td className="py-2 px-2">{r.month}/{r.year}</td>
                  <td className="py-2 px-2">{r.totalPickups}</td>
                  <td className="py-2 px-2">{r.totalWeight}</td>
                  <td className="py-2 px-2">{r.recycledWeight}</td>
                  <td className="py-2 px-2">{r.recyclingRate}%</td>
                  <td className="py-2 px-2">{r.plasticCredits}</td>
                  <td className="py-2 px-2 flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs" onClick={() => onDetail(r)}>Detail</button>
                    {onExport && <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs" onClick={() => onExport(r)}>Export</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
