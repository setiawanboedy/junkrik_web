'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/utils/apiClient';

interface ScheduleFormData {
  dayOfWeek: number;
  time: string;
  notes?: string;
}

interface ScheduleFormProps {
  initialData?: ScheduleFormData;
  scheduleId?: string;
  onSuccess?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

export default function ScheduleForm({ initialData, scheduleId, onSuccess }: ScheduleFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ScheduleFormData>({
    dayOfWeek: initialData?.dayOfWeek ?? 1,
    time: initialData?.time ?? '09:00',
    notes: initialData?.notes ?? ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = scheduleId ? `/schedules/${scheduleId}` : '/schedules';
      const method = scheduleId ? 'put' : 'post';
      await api[method](url, formData);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/dashboard/schedules');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {scheduleId ? 'Edit Schedule' : 'Create New Schedule'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-2">
            Day of Week
          </label>
          <select
            id="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Time
          </label>
          <input
            type="time"
            id="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Special instructions for pickup..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : scheduleId ? 'Update Schedule' : 'Create Schedule'}
          </button>
        </div>
      </form>
    </div>
  );
}
