"use client";

import { usePickupDetail } from "@/hooks/usePickupDetail";
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

function formatDate(date: string) {
  try {
    return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: idLocale });
  } catch {
    return date;
  }
}

function formatWeight(weight?: number) {
  return typeof weight === 'number' ? `${weight} kg` : '-';
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function PickupDetail({ pickupId }: { pickupId: string }) {
  const { pickup, loading, error } = usePickupDetail(pickupId);

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!pickup) return <div className="py-8 text-center text-gray-500">Pickup not found</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Detail Pickup</h2>
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <span className="text-gray-500">ID: <span className="font-mono text-xs">{pickup.id}</span></span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[pickup.status] || 'bg-gray-100 text-gray-700'}`}>{pickup.status.replace('_', ' ')}</span>
      </div>
      <div className="mb-2"><b>Tanggal:</b> {formatDate(pickup.pickupDate)}</div>
      <div className="mb-2"><b>Jenis Sampah:</b> {pickup.wasteTypes.join(', ')}</div>
      <div className="mb-2"><b>Estimasi Berat:</b> {formatWeight(pickup.estimatedWeight)}</div>
      <div className="mb-2"><b>Berat Aktual:</b> {formatWeight(pickup.actualWeight)}</div>
      <div className="mb-2"><b>Alamat:</b> {pickup.address.street}, {pickup.address.city} {pickup.address.postalCode}</div>
      {pickup.address.notes && <div className="mb-2"><b>Catatan Alamat:</b> {pickup.address.notes}</div>}
      {pickup.schedule && (
        <div className="mb-2 p-2 bg-blue-50 rounded">
          <b>Bagian dari Jadwal:</b> {['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][pickup.schedule.dayOfWeek]} {pickup.schedule.time}
        </div>
      )}
      {pickup.specialInstructions && <div className="mb-2"><b>Instruksi Khusus:</b> {pickup.specialInstructions}</div>}
      {pickup.driverNotes && <div className="mb-2"><b>Catatan Driver:</b> {pickup.driverNotes}</div>}
      <div className="mt-6">
        {/* Tambahkan aksi lain jika perlu */}
      </div>
    </div>
  );
}
