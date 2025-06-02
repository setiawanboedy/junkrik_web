import { notFound } from 'next/navigation';
import PickupDetail from '@/components/pickups/PickupDetail';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detail Pickup | Junkrik B2B',
  description: 'Lihat detail permintaan pickup Anda.',
};

export default function PickupDetailPage({ params }: { params: { id: string } }) {
  // Komponen PickupDetail akan fetch data sendiri via usePickupDetail
  if (!params.id) return notFound();
  return <PickupDetail pickupId={params.id} />;
}
