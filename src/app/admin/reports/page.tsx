'use client';
import React, { useState } from 'react';
import { useAdminReports } from '@/hooks/useAdminReports';
import AdminReportTable from '@/components/admin/AdminReportTable';
import { InputField, SelectField } from '@/components/ui/FormComponents';

export default function AdminReportsPage() {
  const [month, setMonth] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');
  const [businessName, setBusinessName] = useState('');
  const { reports, loading, error, fetchReports } = useAdminReports({
    month: month ? Number(month) : undefined,
    year: year ? Number(year) : undefined,
    businessName: businessName || undefined,
  });

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  const handleDetail = (report: import('@/hooks/useAdminReports').AdminReport) => {
    // TODO: Implementasi modal/detail laporan
    alert(`Detail laporan untuk bisnis: ${report.businessName}, periode: ${report.month}/${report.year}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700">Manajemen Laporan Bisnis</h2>
      <p className="mb-6 text-gray-600 max-w-xl">Lihat, filter, dan ekspor laporan bulanan bisnis. Anda dapat melihat detail dan mengunduh laporan untuk keperluan audit atau pelaporan EPR.</p>
      <form className="flex flex-wrap gap-2 mb-4 items-end" onSubmit={handleFilter}>
        <SelectField
          id="month"
          name="month"
          label=""
          value={month.toString()}
          onChange={e => setMonth(e.target.value ? Number(e.target.value) : '')}
          onBlur={() => {}}
          options={[
            { value: '', label: 'Semua Bulan' },
            ...Array.from({ length: 12 }, (_, i) => ({ value: String(i+1), label: `${i+1}` }))
          ]}
        />
        <InputField
          id="year"
          name="year"
          label=""
          type="number"
          value={year.toString()}
          onChange={e => setYear(e.target.value ? Number(e.target.value) : '')}
          onBlur={() => {}}
          placeholder="Tahun (misal 2025)"
        />
        <InputField
          id="businessName"
          name="businessName"
          label=""
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          onBlur={() => {}}
          placeholder="Cari nama bisnis..."
        />
        <button type="submit" className="btn btn-primary">Filter</button>
      </form>
      <AdminReportTable
        reports={reports}
        loading={loading}
        error={error}
        onDetail={handleDetail}
      />
    </div>
  );
}
