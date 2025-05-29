'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Schedule {
  id: string;
  dayOfWeek: number;
  time: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function ScheduleList() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      if (!response.ok) {
        throw new Error('Failed to fetch schedules');
      }
      const data = await response.json();
      setSchedules(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) {
      return;
    }

    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete schedule');
      }

      setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete schedule');
    }
  };

  const toggleActive = async (scheduleId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update schedule');
      }

      setSchedules(schedules.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, isActive: !isActive }
          : schedule
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update schedule');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pickup Schedules</h2>
        <Link
          href="/dashboard/schedules/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Schedule
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
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create Your First Schedule
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                schedule.isActive ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {DAYS_OF_WEEK[schedule.dayOfWeek]}
                  </h3>
                  <p className="text-xl font-bold text-green-600">{schedule.time}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleActive(schedule.id, schedule.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      schedule.isActive ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        schedule.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {schedule.notes && (
                <p className="text-gray-600 text-sm mb-4">{schedule.notes}</p>
              )}

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
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
                    onClick={() => handleDelete(schedule.id)}
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
