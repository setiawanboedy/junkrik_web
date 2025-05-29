import prisma from '@/lib/prisma';
import { CreateScheduleRequest, UpdateScheduleRequest } from '@/lib/validations/schedule';

export class ScheduleService {
  /**
   * Create a new schedule for user
   */
  static async createSchedule(userId: string, data: CreateScheduleRequest) {
    // Check if user already has a schedule for this day
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        userId,
        dayOfWeek: data.dayOfWeek,
        isActive: true
      }
    });

    if (existingSchedule) {
      throw new Error('Schedule already exists for this day');
    }

    return await prisma.schedule.create({
      data: {
        userId,
        dayOfWeek: data.dayOfWeek,
        time: data.time,
        notes: data.notes
      }
    });
  }

  /**
   * Get all schedules for user
   */
  static async getUserSchedules(userId: string) {
    return await prisma.schedule.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' }
    });
  }

  /**
   * Get active schedules for user
   */
  static async getActiveSchedules(userId: string) {
    return await prisma.schedule.findMany({
      where: { 
        userId,
        isActive: true
      },
      orderBy: { dayOfWeek: 'asc' }
    });
  }

  /**
   * Update a schedule
   */
  static async updateSchedule(scheduleId: string, userId: string, data: UpdateScheduleRequest) {
    // Verify schedule belongs to user
    const schedule = await prisma.schedule.findFirst({
      where: { 
        id: scheduleId,
        userId
      }
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    // If updating dayOfWeek, check for conflicts
    if (data.dayOfWeek !== undefined && data.dayOfWeek !== schedule.dayOfWeek) {
      const conflict = await prisma.schedule.findFirst({
        where: {
          userId,
          dayOfWeek: data.dayOfWeek,
          isActive: true,
          id: { not: scheduleId }
        }
      });

      if (conflict) {
        throw new Error('Schedule already exists for this day');
      }
    }

    return await prisma.schedule.update({
      where: { id: scheduleId },
      data
    });
  }

  /**
   * Delete a schedule
   */
  static async deleteSchedule(scheduleId: string, userId: string) {
    // Verify schedule belongs to user
    const schedule = await prisma.schedule.findFirst({
      where: { 
        id: scheduleId,
        userId
      }
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    return await prisma.schedule.delete({
      where: { id: scheduleId }
    });
  }

  /**
   * Generate upcoming pickups based on schedules
   */
  static async generateUpcomingPickups(userId: string, daysAhead: number = 7) {
    const activeSchedules = await this.getActiveSchedules(userId);
    const today = new Date();
    const pickups = [];

    for (let i = 0; i < daysAhead; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();

      const schedule = activeSchedules.find(s => s.dayOfWeek === dayOfWeek);
      if (schedule) {
        // Check if pickup already exists for this date
        const existingPickup = await prisma.pickup.findFirst({
          where: {
            scheduleId: schedule.id,
            scheduledDate: {
              gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
              lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            }
          }
        });

        if (!existingPickup) {
          const [hours, minutes] = schedule.time.split(':');
          const scheduledDateTime = new Date(date);
          scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          const pickup = await prisma.pickup.create({
            data: {
              scheduleId: schedule.id,
              scheduledDate: scheduledDateTime,
              status: 'scheduled'
            },
            include: {
              schedule: true
            }
          });

          pickups.push(pickup);
        }
      }
    }

    return pickups;
  }  /**
   * Get schedule statistics for dashboard
   */
  static async getScheduleStats(userId: string) {
    try {
      const [totalSchedules, activeSchedules, todaysPickups] = await Promise.all([
        // Total schedules
        prisma.schedule.count({
          where: { userId }
        }),
        
        // Active schedules
        prisma.schedule.count({
          where: { 
            userId,
            isActive: true
          }
        }),
        
        // Today's scheduled pickups
        prisma.pickup.count({
          where: { 
            schedule: {
              userId: userId
            },
            scheduledDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        })
      ]);

      return {
        totalSchedules,
        activeSchedules,
        todaysPickups
      };
    } catch {
      throw new Error('Failed to fetch schedule statistics');
    }
  }
}
