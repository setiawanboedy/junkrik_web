import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

export interface Schedule {
  id: string;
  dayOfWeek: number;
  time: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    } catch (err: any) {
      setError(err?.message || 'Failed to delete schedule');
    }
  };

  const toggleActive = async (scheduleId: string, isActive: boolean) => {
    try {
      await api.put(`/schedules/${scheduleId}`, { isActive: !isActive });
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === scheduleId ? { ...s, isActive: !isActive } : s
        )
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to update schedule');
    }
  };

  return { schedules, loading, error, deleteSchedule, toggleActive };
}
