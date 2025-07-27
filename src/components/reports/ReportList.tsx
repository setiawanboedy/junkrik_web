import { ReportSummary } from '@/hooks/useReports';
import Link from 'next/link';

interface ReportListProps {
  reports: ReportSummary[];
  loading: boolean;
  error: string;
  onDownload: (id: string) => void;
  onFilter: (month: number, year: number) => void;
  filter: { month?: number; year?: number };
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function ReportList({ reports, loading, error, onDownload, onFilter, filter }: ReportListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Bulan</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filter.month || ''}
            onChange={e => onFilter(Number(e.target.value) || 0, filter.year || new Date().getFullYear())}
          >
            <option value="">Semua</option>
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Tahun</label>
          <input
            type="number"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filter.year || new Date().getFullYear()}
            min={2023}
            max={new Date().getFullYear()}
            onChange={e => onFilter(filter.month || 0, Number(e.target.value) || new Date().getFullYear())}
          />
        </div>
      </div>
      {loading ? (
        <div className="py-8 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : reports.length === 0 ? (
        <div className="py-8 text-center text-gray-400">Tidak ada laporan ditemukan</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-xs font-bold text-gray-700">Bulan</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-700">Total Pickup</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-700">Total Berat</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-700">Daur Ulang</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-700">Kredit Plastik</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-b hover:bg-green-50 transition text-gray-700">
                  <td className="py-3 px-4">{MONTHS[r.month - 1]} {r.year}</td>
                  <td className="py-3 px-4">{r.totalPickups}</td>
                  <td className="py-3 px-4">{r.totalWeight} kg</td>
                  <td className="py-3 px-4">{r.recycledWeight} kg</td>
                  <td className="py-3 px-4">{r.plasticCredits ?? 0} kg</td>
                  <td className="py-3 px-4 flex gap-2">
                    <Link
                      href={`/dashboard/report/${r.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-semibold shadow-sm transition"
                    >
                      Detail
                    </Link>
                    <button
                      className="px-3 cursor-pointer py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs font-semibold shadow-sm transition"
                      onClick={() => onDownload(r.id)}
                    >
                      Download
                    </button>
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
