'use client';
import { useReports } from '@/hooks/useReports';
import ReportList from '@/components/reports/ReportList';
import toast from 'react-hot-toast';
import { useState } from 'react';
import api from '@/lib/utils/apiClient';

export default function ReportsClient() {
  const { reports, loading, error, filter, setFilter, downloadReport, refetch } = useReports();
  const [showDialog, setShowDialog] = useState(false);
  const [genMonth, setGenMonth] = useState<number>(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState<number>(new Date().getFullYear());
  const [genType, setGenType] = useState<string>('MONTHLY');
  const [genLoading, setGenLoading] = useState(false);

  const handleFilter = (month?: number, year?: number) => {
    setFilter({ month, year });
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadReport(id);
      toast.success('Laporan berhasil diunduh!');
    } catch (e: any) {
      toast.error('Gagal mengunduh laporan: '+e.message);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenLoading(true);
    try {
      await api.post('/reports/generate', { year: genYear, month: genMonth, type: genType });
      toast.success('Laporan berhasil digenerate!');
      setShowDialog(false);
      if (typeof refetch === 'function') await refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Gagal generate laporan');
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Laporan Pengelolaan Sampah</h1>
      <button
        className="mb-4 cursor-pointer px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => setShowDialog(true)}
      >
        Generate Laporan Sekarang
      </button>
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 transition-all animate-fade-in">
          <form onSubmit={handleGenerate} className="relative bg-white p-8 rounded-xl shadow-2xl min-w-[340px] w-full max-w-xs sm:max-w-sm">
            <button
              type="button"
              className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold focus:outline-none"
              onClick={() => setShowDialog(false)}
              disabled={genLoading}
              aria-label="Tutup dialog"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-5 text-gray-800 text-center">Generate Laporan</h2>
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Bulan</label>
              <select value={genMonth} onChange={e => setGenMonth(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500">
                {[...Array(12)].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tahun</label>
              <input type="number" value={genYear} onChange={e => setGenYear(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipe</label>
              <select value={genType} onChange={e => setGenType(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="MONTHLY">Bulanan</option>
                <option value="WEEKLY">Mingguan</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-4 cursor-pointer py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold" onClick={() => setShowDialog(false)} disabled={genLoading}>Batal</button>
              <button type="submit" className="px-4 cursor-pointer py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-sm" disabled={genLoading}>{genLoading ? 'Memproses...' : 'Generate'}</button>
            </div>
          </form>
        </div>
      )}
      <ReportList
        reports={reports}
        loading={loading}
        error={error}
        onDownload={handleDownload}
        onFilter={handleFilter}
        filter={filter}
      />
    </div>
  );
}
