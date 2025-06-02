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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
          <select
            className="border rounded px-2 py-1"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
          <input
            type="number"
            className="border rounded px-2 py-1"
            value={filter.year || new Date().getFullYear()}
            min={2023}
            max={new Date().getFullYear()}
            onChange={e => onFilter(filter.month || 0, Number(e.target.value) || new Date().getFullYear())}
          />
        </div>
      </div>
      {loading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : reports.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Tidak ada laporan ditemukan</div>
      ) : (
        <table className="w-full text-left border-t">
          <thead>
            <tr className="border-b">
              <th className="py-2">Bulan</th>
              <th className="py-2">Total Pickup</th>
              <th className="py-2">Total Berat</th>
              <th className="py-2">Daur Ulang</th>
              <th className="py-2">Kredit Plastik</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{MONTHS[r.month - 1]} {r.year}</td>
                <td className="py-2">{r.totalPickup}</td>
                <td className="py-2">{r.totalWeight} kg</td>
                <td className="py-2">{r.recycledWeight} kg</td>
                <td className="py-2">{r.plasticCredit} kg</td>
                <td className="py-2">
                  <Link
                    href={`/dashboard/report/${r.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                  >
                    Detail
                  </Link>
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => onDownload(r.id)}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
