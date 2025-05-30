// Types for dashboard analytics API response

export interface DashboardReportAnalytics {
  currentMonth: {
    totalPickups: number;
    totalWeight: number;
    recycledWeight: number;
    recyclingRate: number;
    plasticCredits: number;
    costSavings: number;
  };
  previousMonth: {
    totalPickups: number;
    totalWeight: number;
    recycledWeight: number;
    recyclingRate: number;
    plasticCredits: number;
    costSavings: number;
  };
  growth: {
    totalPickups: number;
    totalWeight: number;
    recycledWeight: number;
    plasticCredits: number;
  };
  yearToDate: {
    totalPickups: number;
    totalWeight: number;
    recycledWeight: number;
    plasticCredits: number;
    costSavings: number;
  };
}

export interface DashboardPickupStats {
  totalPickups: number;
  pendingPickups: number;
  completedPickups: number;
  totalWeight: number;
}

export interface DashboardScheduleStats {
  totalSchedules: number;
  activeSchedules: number;
  todaysPickups: number;
}

export interface AnalyticsData {
  reports: DashboardReportAnalytics;
  pickups: DashboardPickupStats;
  schedules: DashboardScheduleStats;
}
