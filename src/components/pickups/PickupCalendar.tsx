import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isSameDay, parseISO } from 'date-fns';

interface PickupCalendarProps {
  pickups: Array<{
    id: string;
    pickupDate: string;
    status: string;
  }>;
  onDateSelect?: (date: Date) => void;
}

export default function PickupCalendar({ pickups, onDateSelect }: PickupCalendarProps) {
  // Mark days with pickups
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const hasPickup = pickups.some(p => isSameDay(parseISO(p.pickupDate), date));
      if (hasPickup) {
        return <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1" />;
      }
    }
    return null;
  };

  // Highlight selected day
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const pickup = pickups.find(p => isSameDay(parseISO(p.pickupDate), date));
      if (pickup) {
        switch (pickup.status) {
          case 'SCHEDULED': return 'bg-gray-200';
          case 'PENDING': return 'bg-yellow-100';
          case 'CONFIRMED': return 'bg-blue-100';
          case 'COMPLETED': return 'bg-green-100';
          default: return '';
        }
      }
    }
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-8">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Kalender Pickup Sampah</h3>
      <p className="text-gray-600 text-sm mb-3">
        Pilih tanggal untuk melihat pickup. Tanggal dengan titik hijau menandakan ada jadwal pickup.
      </p>
      <Calendar
        tileContent={tileContent}
        tileClassName={tileClassName}
        onClickDay={onDateSelect}
      />
      <div className="flex flex-wrap gap-4 mt-4 text-xs items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> <span className="mr-4 text-gray-700">Ada Pickup</span>
        <span className="px-2 py-1 rounded bg-gray-200 text-gray-700">Scheduled</span>
        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">Pending</span>
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">Confirmed</span>
        <span className="px-2 py-1 rounded bg-green-100 text-green-800">Completed</span>
      </div>
    </div>
  );
}
