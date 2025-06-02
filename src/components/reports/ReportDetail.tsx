import { ReportDetail } from '@/hooks/useReportDetail';

interface ReportDetailProps {
  report: ReportDetail;
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function ReportDetailView({ report }: ReportDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Laporan Bulan {MONTHS[report.month - 1]} {report.year}
      </h2>
      <div className="mb-4">
        <div>Total Pickup: <b>{report.totalPickup}</b></div>
        <div>Total Berat: <b>{report.totalWeight} kg</b></div>
        <div>Daur Ulang: <b>{report.recycledWeight} kg</b></div>
        <div>Kredit Plastik: <b>{report.plasticCredit} kg</b></div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Rincian Jenis Sampah</h3>
        <table className="w-full text-left border-t">
          <thead>
            <tr className="border-b">
              <th className="py-2">Jenis Sampah</th>
              <th className="py-2">Total (kg)</th>
              <th className="py-2">Daur Ulang (kg)</th>
            </tr>
          </thead>
          <tbody>
            {report.breakdown.map((b) => (
              <tr key={b.wasteType} className="border-b">
                <td className="py-2">{b.wasteType}</td>
                <td className="py-2">{b.weight}</td>
                <td className="py-2">{b.recycled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
