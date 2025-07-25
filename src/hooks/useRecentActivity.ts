import { useEffect, useState } from 'react';
import api from '@/lib/utils/apiClient';

interface ActivityItem {
  type: string;
  date: string;
  description: string;
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      try {
        // Fetch 3 latest pickups
        const pickupRes = await api.get('/pickups?status=COMPLETED&limit=3');
        const pickups = pickupRes.data.data || [];
        const pickupActs = pickups.map((p: any) => ({
          type: 'Pickup',
          date: new Date(p.pickupDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          description: `Pickup ${p.status} - ${p.actualWeight || p.estimatedWeight || 0} kg (${p.address || '-'})`,
        }));
        // Fetch 3 latest reports
        const reportRes = await api.get('/reports?limit=3');
        const reports = reportRes.data.data || [];
        const reportActs = reports.map((r: any) => ({
          type: 'Laporan',
          date: r.generatedAt ? new Date(r.generatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
          description: `Laporan bulan ${r.month}/${r.year} - ${r.totalWeight} kg, ${r.plasticCredits} kredit plastik`,
        }));
        setActivities([...pickupActs, ...reportActs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5));
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return { activities, loading };
}
