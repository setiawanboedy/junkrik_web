import ScheduleForm from '@/components/schedules/ScheduleForm';
import { useScheduleDetail } from '@/hooks/useScheduleDetail';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Jadwal | Junkrik B2B',
  description: 'Edit jadwal pengambilan sampah rutin.',
};

export default function EditSchedulePage({ params }: { params: { id: string } }) {
  // Komponen ScheduleForm akan fetch initialData sendiri jika perlu
  return (
    <div className="max-w-md mx-auto">
      <ScheduleForm scheduleId={params.id} />
    </div>
  );
}
