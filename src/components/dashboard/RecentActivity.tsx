import React from 'react';

interface RecentActivityProps {
  activities: Array<{ type: string; date: string; description: string }>;
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
        <div className="text-gray-500">Belum ada aktivitas terbaru.</div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
      <ul className="divide-y divide-gray-200">
        {activities.map((act, idx) => (
          <li key={idx} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
            <span className="font-medium text-gray-800">{act.type}</span>
            <span className="text-gray-500 text-xs">{act.date}</span>
            <span className="text-gray-700">{act.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
