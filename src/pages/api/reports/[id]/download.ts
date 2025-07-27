import type { NextApiResponse } from 'next';
import { ReportService } from '@/lib/services/report.service';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import { validateMethod, handleApiError } from '@/lib/utils/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (!validateMethod(req, res, ['GET'])) return;
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid report ID' });
  }
  try {
    // Get report data
    const report = await ReportService.getReportById(id, req.user.id);
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });

    // Generate PDF EPR (template lebih profesional)
    const doc = new jsPDF();
    // Header/logo
    doc.setFontSize(18);
    doc.text('LAPORAN EPR PENGELOLAAN SAMPAH', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Sesuai Peraturan Menteri LHK No. P.75/2019', 105, 25, { align: 'center' });
    // Identitas bisnis
    doc.setFontSize(12);
    doc.text(`Nama Bisnis: ${report.user.businessName}`, 14, 38);
    doc.text(`Periode: ${report.month}/${report.year}`, 14, 46);
    doc.text(`Email: ${report.user.email}`, 14, 54);
    // Tabel utama
    doc.autoTable({
      startY: 62,
      head: [[
        'Total Pickup',
        'Total Berat (kg)',
        'Berat Didaur Ulang (kg)',
        'Kredit Plastik (kg)',
        'Persentase Daur Ulang',
        'Penghematan Biaya (Rp)'
      ]],
      body: [[
        report.totalPickups,
        report.totalWeight,
        report.recycledWeight,
        report.plasticCredits,
        `${report.recyclingRate.toFixed(2)}%`,
        report.costSavings.toLocaleString('id-ID')
      ]],
      theme: 'grid',
      styles: { fontSize: 10 },
    });
    // Tabel breakdown jenis sampah
    const wasteBreakdown = Object.entries(report.wasteTypeBreakdown || {});
    let lastY = 0;
    if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
      lastY = doc.lastAutoTable.finalY;
    } else {
      lastY = 120;
    }
    if (wasteBreakdown.length > 0) {
      doc.text('Rincian Jenis Sampah:', 14, lastY + 12);
      doc.autoTable({
        startY: lastY + 16,
        head: [['Jenis Sampah', 'Berat (kg)']],
        body: wasteBreakdown.map(([type, weight]) => [type, weight]),
        theme: 'striped',
        styles: { fontSize: 10 },
      });
      lastY = doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : lastY + 40;
    }
    // Footer/catatan
    const footerY = lastY + 20;
    doc.setFontSize(10);
    doc.text('Catatan:', 14, footerY);
    doc.text('- Laporan ini dihasilkan otomatis oleh sistem Junkrik.', 14, footerY + 6);
    doc.text('- Format mengikuti Peraturan Menteri LHK No. P.75/2019 tentang EPR.', 14, footerY + 12);
    doc.text('- Untuk pertanyaan atau revisi, hubungi admin Junkrik.', 14, footerY + 18);
    // Tanda tangan (dummy)
    doc.text('_________________________', 150, footerY + 30);
    doc.text('Admin Junkrik', 160, footerY + 36);
    // Output PDF
    const pdf = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-epr-${id}.pdf`);
    res.status(200).send(Buffer.from(pdf));
  } catch (error) {
    handleApiError(error, res);
  }
}

export default withAuth(handler);
