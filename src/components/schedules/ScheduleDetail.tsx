"use client";
import { useScheduleDetail } from '@/hooks/useScheduleDetail';

export default function ScheduleDetail({ scheduleId }: { scheduleId: string }) {
  const { schedule, loading, error } = useScheduleDetail(scheduleId);

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!schedule) return <div className="py-8 text-center text-gray-500">Schedule not found</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Detail Jadwal</h2>
      <div className="mb-2"><b>ID:</b> {schedule.id}</div>
      <div className="mb-2"><b>Hari:</b> {["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"][schedule.dayOfWeek]}</div>
      <div className="mb-2"><b>Waktu:</b> {schedule.time}</div>
      <div className="mb-2"><b>Status:</b> {schedule.isActive ? 'Aktif' : 'Nonaktif'}</div>
      {schedule.notes && <div className="mb-2"><b>Catatan:</b> {schedule.notes}</div>}
      <div className="mt-6">
        {/* Tambahkan aksi edit/batal jika perlu */}
      </div>
    </div>
  );
}
