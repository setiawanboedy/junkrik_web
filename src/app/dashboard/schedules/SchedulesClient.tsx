"use client";
import { useSchedules } from '@/hooks/useSchedules';
import ScheduleList from '@/components/schedules/ScheduleList';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function SchedulesClient() {
  const { loading, error } = useSchedules();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Jadwal Pengambilan</h1>
          <p className="mt-2 text-gray-600">Atur jadwal rutin pengambilan sampah</p>
        </div>
        <ScheduleList />
      </div>
    </div>
  );
}
