import { notFound } from 'next/navigation';
import ScheduleDetail from '@/components/schedules/ScheduleDetail';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detail Jadwal | Junkrik B2B',
  description: 'Lihat detail jadwal pengambilan sampah.',
};

export default function ScheduleDetailPage({ params }: { params: { id: string } }) {
  if (!params.id) return notFound();
  return <ScheduleDetail scheduleId={params.id} />;
}
