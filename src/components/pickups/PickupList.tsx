'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePickups } from '@/hooks/usePickups';
import PickupCalendar from './PickupCalendar';
import PickupCard from './PickupCard';

export default function PickupList() {
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { pickups, loading, error, cancelPickup } = usePickups(statusFilter, startDate, endDate);

  // Group pickups by date relative to today
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const todaysPickups = pickups.filter(p => {
    const d = new Date(p.pickupDate);
    return d >= startOfToday && d < startOfTomorrow;
  });
  const upcomingPickups = pickups.filter(p => new Date(p.pickupDate) >= startOfTomorrow);
  const historyPickups = pickups.filter(p => new Date(p.pickupDate) < startOfToday);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PickupCalendar pickups={pickups} onDateSelect={date => {
        const iso = date.toISOString().slice(0, 10);
        setStartDate(iso);
        setEndDate(iso);
      }} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Pickup Requests</h2>
        <Link
          href="/dashboard/pickups/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold shadow"
        >
          + Request Pickup
        </Link>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Status</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md"
            max={endDate || undefined}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md"
            min={startDate || undefined}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Sections: Today */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">Today&apos;s Pickups</h2>
        {todaysPickups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {todaysPickups.map(pickup => (
              <PickupCard key={pickup.id} pickup={pickup} cancelPickup={cancelPickup} color='border-green-500' />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No pickups scheduled for today.</p>
        )}
      </div>

      {/* Sections: Upcoming */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Upcoming Pickups</h2>
        {upcomingPickups.some(p => p.status === 'SCHEDULED') && (
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <span className="text-yellow-800 font-medium">Reminder: You have scheduled pickups coming up. Please confirm or prepare accordingly.</span>
          </div>
        )}
        {upcomingPickups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingPickups.map(pickup => (
              <PickupCard key={pickup.id} pickup={pickup} cancelPickup={cancelPickup} color='border-blue-500' />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming pickups.</p>
        )}
      </div>

      {/* Sections: History */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Pickup History</h2>
        {historyPickups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {historyPickups.map(pickup => (
              <PickupCard key={pickup.id} pickup={pickup} cancelPickup={cancelPickup} color='border-gray-500' />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No past pickups found.</p>
        )}
      </div>
    </div>
  );
}
