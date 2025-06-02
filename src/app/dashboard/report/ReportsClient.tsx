/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useReports } from '@/hooks/useReports';
import ReportList from '@/components/reports/ReportList';
import toast from 'react-hot-toast';

export default function ReportsClient() {
  const { reports, loading, error, filter, setFilter, downloadReport } = useReports();

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

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Laporan Pengelolaan Sampah</h1>
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
