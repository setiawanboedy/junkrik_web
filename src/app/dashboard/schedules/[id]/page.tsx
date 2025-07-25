import { notFound } from 'next/navigation';
import ScheduleDetail from '@/components/schedules/ScheduleDetail';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detail Jadwal | Junkrik B2B',
  description: 'Lihat detail jadwal pengambilan sampah.',
};

export default async function ScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  if (!id) return notFound();
  return <ScheduleDetail scheduleId={id} />;
}
