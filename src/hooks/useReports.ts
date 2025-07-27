"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/utils/apiClient';

export interface ReportSummary {
  id: string;
  month: number;
  year: number;
  totalPickups: number;
  totalWeight: number;
  recycledWeight: number;
  plasticCredits: number;
  createdAt: string;
}

export function useReports() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<{ month?: number; year?: number }>({});

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, number> = {};
      if (filter.month) params.month = filter.month;
      if (filter.year) params.year = filter.year;
      const response = await api.get('/reports', { params });
      console.log(response);
      
      setReports(response.data.data || []);
    } catch (err) {
      setError((err as Error)?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      // Ambil data report dari API (bukan file PDF)
      const response = await api.get(`/reports/${reportId}`);
      const report = response.data.data;
      // Import pdfmake dan font secara dinamis agar vfs selalu siap
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      const pdfMake = pdfMakeModule.default;
      pdfMake.vfs = pdfFontsModule.default.vfs;
      // Generate PDF di frontend dengan pdfmake
      const docDefinition = {
        content: [
          { text: 'LAPORAN EPR PENGELOLAAN SAMPAH', style: 'header', alignment: 'center' },
          { text: 'Sesuai Peraturan Menteri LHK No. P.75/2019', style: 'subheader', alignment: 'center', margin: [0, 0, 0, 10] },
          { text: `Nama Bisnis: ${report.user?.businessName || ''}` },
          { text: `Periode: ${report.month}/${report.year}` },
          { text: `Email: ${report.user?.email || ''}`, margin: [0, 0, 0, 10] },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', '*', '*', '*'],
              body: [
                [
                  'Total Pickup',
                  'Total Berat (kg)',
                  'Berat Didaur Ulang (kg)',
                  'Kredit Plastik (kg)',
                  'Persentase Daur Ulang',
                  'Penghematan Biaya (Rp)'
                ],
                [
                  report.totalPickup ?? report.totalPickups ?? 0,
                  report.totalWeight ?? 0,
                  report.recycledWeight ?? 0,
                  report.plasticCredits ?? report.plasticCredits ?? 0,
                  `${report.recyclingRate ?? 0}%`,
                  report.costSavings ?? 0
                ]
              ]
            },
            margin: [0, 10, 0, 0]
          }
        ],
        styles: {
          header: { fontSize: 16, bold: true },
          subheader: { fontSize: 10, italics: true }
        }
      };
      pdfMake.createPdf(docDefinition).download(`laporan-${report.month}-${report.year}.pdf`);
    } catch (err) {
      setError((err as Error)?.message || 'Failed to download report');
    }
  };

  return { reports, loading, error, filter, setFilter, downloadReport, refetch: fetchReports };
}
