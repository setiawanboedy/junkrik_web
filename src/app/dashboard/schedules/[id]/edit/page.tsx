import ScheduleForm from '@/components/schedules/ScheduleForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Jadwal | Junkrik B2B',
  description: 'Edit jadwal pengambilan sampah rutin.',
};

export default async function EditSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  // Komponen ScheduleForm akan fetch initialData sendiri jika perlu
  const {id} = await params
  return (
    <div className="max-w-md mx-auto">
      <ScheduleForm scheduleId={id} />
    </div>
  );
}
