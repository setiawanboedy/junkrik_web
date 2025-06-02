import { useRouter } from 'next/navigation';
import { useReportDetail } from '@/hooks/useReportDetail';
import ReportDetailView from '@/components/reports/ReportDetail';

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { report, loading, error } = useReportDetail(params.id);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
        onClick={() => router.back()}
      >
        &larr; Kembali
      </button>
      {loading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : report ? (
        <ReportDetailView report={report} />
      ) : (
        <div className="py-8 text-center text-gray-500">Laporan tidak ditemukan</div>
      )}
    </div>
  );
}
