'use client';

import { useSchedules } from '@/hooks/useSchedules';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function ScheduleList() {
  const { schedules, loading, error, deleteSchedule, toggleActive } = useSchedules();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Pickup Schedules</h2>
        <Link
          href="/dashboard/schedules/new"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold shadow"
        >
          + Add Schedule
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {schedules.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No schedules found</div>
          <Link
            href="/dashboard/schedules/new"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow"
          >
            Create Your First Schedule
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 flex flex-col justify-between h-full transition-transform hover:scale-[1.02] ${
                schedule.isActive ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: schedule.isActive ? '#22c55e' : '#d1d5db' }}></span>
                    {DAYS_OF_WEEK[schedule.dayOfWeek]}
                  </h3>
                  <p className="text-xl font-bold text-green-600">{schedule.time}</p>
                </div>
                <button
                  onClick={() => toggleActive(schedule.id, schedule.isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    schedule.isActive ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                  title="Toggle Active"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      schedule.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {schedule.notes && (
                <p className="text-gray-600 text-sm mb-4">{schedule.notes}</p>
              )}

              <div className="flex justify-between items-center mt-auto">
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  schedule.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {schedule.isActive ? 'Active' : 'Inactive'}
                </span>

                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/schedules/${schedule.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
