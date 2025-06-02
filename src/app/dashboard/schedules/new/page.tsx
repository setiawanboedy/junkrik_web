import ScheduleForm from '@/components/schedules/ScheduleForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buat Jadwal Baru | Junkrik B2B',
  description: 'Buat jadwal pengambilan sampah rutin untuk bisnis Anda.',
};

export default function NewSchedulePage() {
  return (
    <div className="max-w-md mx-auto">
      <ScheduleForm />
    </div>
  );
}
