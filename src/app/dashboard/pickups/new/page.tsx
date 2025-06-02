import PickupForm from '@/components/pickups/PickupForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Pickup | Junkrik B2B',
  description: 'Buat permintaan pengambilan sampah baru untuk bisnis Anda.',
};

export default function NewPickupPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <PickupForm />
    </div>
  );
}
