import { PrismaClient } from '@prisma/client';
import { GenerateReportData } from '@/lib/validations/report';
import { ValidationError, NotFoundError } from '@/lib/utils/api';

const prisma = new PrismaClient();

export class ReportService {
  // Generate a new report
  static async generateReport(userId: string, data: GenerateReportData) {
    try {
      // Calculate date range for the report
      const startDate = new Date(data.year, data.month - 1, 1);
      const endDate = new Date(data.year, data.month, 0, 23, 59, 59);

      // Get pickups data for the period
      const pickups = await prisma.pickup.findMany({
        where: {
          userId: userId,
          status: "COMPLETED",
          pickupDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Calculate report metrics
      const totalPickups = pickups.length;
      const totalWeight = pickups.reduce(
        (sum, pickup) => sum + (pickup.estimatedWeight || 0),
        0
      );
      const wasteTypeStats = pickups.reduce((stats, pickup) => {
        pickup.wasteTypes.forEach((type) => {
          if (!stats[type]) stats[type] = 0;
          stats[type] +=
            (pickup.estimatedWeight || 0) / pickup.wasteTypes.length;
        });
        return stats;
      }, {} as Record<string, number>);
      const recycledWeight = totalWeight * 0.7;
      const recyclingRate =
        totalWeight > 0 ? (recycledWeight / totalWeight) * 100 : 0;
      const plasticWeight = wasteTypeStats["PLASTIC"] || 0;
      const plasticCredits = plasticWeight * 1;
      const costSavings = totalWeight * 2000;

      // Upsert report
      const report = await prisma.report.upsert({
        where: {
          userId_year_month_type: {
            userId: userId,
            year: data.year,
            month: data.month,
            type: data.type,
          },
        },
        update: {
          totalPickups,
          totalWeight,
          recycledWeight,
          recyclingRate,
          plasticCredits,
          costSavings,
          wasteTypeBreakdown: wasteTypeStats,
          generatedAt: new Date(),
        },
        create: {
          userId: userId,
          year: data.year,
          month: data.month,
          type: data.type,
          totalPickups,
          totalWeight,
          recycledWeight,
          recyclingRate,
          plasticCredits,
          costSavings,
          wasteTypeBreakdown: wasteTypeStats,
          generatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              businessName: true,
              email: true,
            },
          },
        },
      });
      return report;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error("Failed to generate report");
    }
  }

  // Get user's reports with optional filters
  static async getUserReports(userId: string, filters: {
    year?: number;
    month?: number;
    type?: string;
  } = {}) {    try {
      const whereClause: {
        userId: string;
        year?: number;
        month?: number;
        type?: string;
      } = {
        userId: userId
      };

      // Apply filters
      if (filters.year) {
        whereClause.year = filters.year;
      }
      if (filters.month) {
        whereClause.month = filters.month;
      }
      if (filters.type) {
        whereClause.type = filters.type;
      }

      const reports = await prisma.report.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              businessName: true,
              email: true
            }
          }
        },
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ]
      });      return reports;
    } catch {
      throw new Error('Failed to fetch reports');
    }
  }

  // Get report by ID
  static async getReportById(reportId: string, userId: string) {
    try {
      const report = await prisma.report.findFirst({
        where: {
          id: reportId,
          userId: userId
        },
        include: {
          user: {
            select: {
              id: true,
              businessName: true,
              email: true
            }
          }
        }
      });

      if (!report) {
        throw new NotFoundError('Report not found');
      }

      return report;    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Failed to fetch report');
    }
  }

  // Get dashboard analytics
  static async getDashboardAnalytics(userId: string) {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      // Get current month's data
      const currentMonthReport = await prisma.report.findFirst({
        where: {
          userId: userId,
          year: currentYear,
          month: currentMonth
        }
      });

      // Get previous month's data for comparison
      const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
      
      const previousMonthReport = await prisma.report.findFirst({
        where: {
          userId: userId,
          year: prevYear,
          month: prevMonth
        }
      });

      // Get year-to-date totals
      const yearToDateReports = await prisma.report.findMany({
        where: {
          userId: userId,
          year: currentYear
        }
      });

      const yearToDateTotals = yearToDateReports.reduce((totals, report) => {
        return {
          totalPickups: totals.totalPickups + report.totalPickups,
          totalWeight: totals.totalWeight + report.totalWeight,
          recycledWeight: totals.recycledWeight + report.recycledWeight,
          plasticCredits: totals.plasticCredits + report.plasticCredits,
          costSavings: totals.costSavings + report.costSavings
        };
      }, {
        totalPickups: 0,
        totalWeight: 0,
        recycledWeight: 0,
        plasticCredits: 0,
        costSavings: 0
      });

      // Calculate month-over-month growth
      const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      return {
        currentMonth: {
          totalPickups: currentMonthReport?.totalPickups || 0,
          totalWeight: currentMonthReport?.totalWeight || 0,
          recycledWeight: currentMonthReport?.recycledWeight || 0,
          recyclingRate: currentMonthReport?.recyclingRate || 0,
          plasticCredits: currentMonthReport?.plasticCredits || 0,
          costSavings: currentMonthReport?.costSavings || 0
        },
        previousMonth: {
          totalPickups: previousMonthReport?.totalPickups || 0,
          totalWeight: previousMonthReport?.totalWeight || 0,
          recycledWeight: previousMonthReport?.recycledWeight || 0,
          recyclingRate: previousMonthReport?.recyclingRate || 0,
          plasticCredits: previousMonthReport?.plasticCredits || 0,
          costSavings: previousMonthReport?.costSavings || 0
        },
        growth: {
          totalPickups: calculateGrowth(
            currentMonthReport?.totalPickups || 0,
            previousMonthReport?.totalPickups || 0
          ),
          totalWeight: calculateGrowth(
            currentMonthReport?.totalWeight || 0,
            previousMonthReport?.totalWeight || 0
          ),
          recycledWeight: calculateGrowth(
            currentMonthReport?.recycledWeight || 0,
            previousMonthReport?.recycledWeight || 0
          ),
          plasticCredits: calculateGrowth(
            currentMonthReport?.plasticCredits || 0,
            previousMonthReport?.plasticCredits || 0
          )
        },
        yearToDate: yearToDateTotals
      };    } catch {
      throw new Error('Failed to fetch dashboard analytics');
    }
  }
}
