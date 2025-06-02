import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';
import type { Schedule } from './useSchedules';

export function useScheduleDetail(scheduleId: string) {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!scheduleId) return;
    setLoading(true);
    api.get(`/schedules/${scheduleId}`)
      .then(res => setSchedule(res.data.data))
      .catch(err => setError(err?.message || 'Failed to fetch schedule detail'))
      .finally(() => setLoading(false));
  }, [scheduleId]);

  return { schedule, loading, error };
}
