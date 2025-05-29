import { PrismaClient } from '@prisma/client';
import { CreatePickupData, UpdatePickupData } from '@/lib/validations/pickup';
import { ValidationError, NotFoundError } from '@/lib/utils/api';

const prisma = new PrismaClient();

export class PickupService {
  // Create a new pickup request
  static async createPickup(userId: string, data: CreatePickupData) {
    try {
      // Validate schedule if provided
      if (data.scheduleId) {
        const schedule = await prisma.schedule.findFirst({
          where: {
            id: data.scheduleId,
            userId: userId
          }
        });

        if (!schedule) {
          throw new NotFoundError('Schedule not found');
        }
      }

      // Create pickup
      const pickup = await prisma.pickup.create({
        data: {
          userId: userId,
          scheduleId: data.scheduleId || null,
          pickupDate: new Date(data.pickupDate),
          wasteTypes: data.wasteTypes,
          estimatedWeight: data.estimatedWeight || null,
          specialInstructions: data.specialInstructions || null,
          address: data.address,
          status: 'PENDING'
        },
        include: {
          schedule: true,
          user: {
            select: {
              id: true,
              businessName: true,
              email: true,
              phone: true
            }
          }
        }
      });

      return pickup;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Failed to create pickup request');
    }
  }

  // Get user's pickups with optional filters
  static async getUserPickups(userId: string, filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {}) {    try {
      const whereClause: {
        userId: string;
        status?: string;
        pickupDate?: {
          gte?: Date;
          lte?: Date;
        };
      } = {
        userId: userId
      };

      // Apply filters
      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.startDate || filters.endDate) {
        whereClause.pickupDate = {};
        if (filters.startDate) {
          whereClause.pickupDate.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          whereClause.pickupDate.lte = new Date(filters.endDate);
        }
      }

      const pickups = await prisma.pickup.findMany({
        where: whereClause,
        include: {
          schedule: true,
          user: {
            select: {
              id: true,
              businessName: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          pickupDate: 'desc'
        }
      });

      return pickups;
    } catch {
      throw new Error('Failed to fetch pickups');
    }
  }

  // Get pickup by ID
  static async getPickupById(pickupId: string, userId: string) {
    try {
      const pickup = await prisma.pickup.findFirst({
        where: {
          id: pickupId,
          userId: userId
        },
        include: {
          schedule: true,
          user: {
            select: {
              id: true,
              businessName: true,
              email: true,
              phone: true
            }
          }
        }
      });

      if (!pickup) {
        throw new NotFoundError('Pickup not found');
      }

      return pickup;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Failed to fetch pickup');
    }
  }

  // Update pickup
  static async updatePickup(pickupId: string, userId: string, data: UpdatePickupData) {
    try {
      // Check if pickup exists and belongs to user
      const existingPickup = await prisma.pickup.findFirst({
        where: {
          id: pickupId,
          userId: userId
        }
      });

      if (!existingPickup) {
        throw new NotFoundError('Pickup not found');
      }

      // Prevent updating completed or cancelled pickups
      if (existingPickup.status === 'COMPLETED' || existingPickup.status === 'CANCELLED') {
        throw new ValidationError('Cannot update completed or cancelled pickup');
      }

      // Update pickup
      const updatedPickup = await prisma.pickup.update({
        where: {
          id: pickupId
        },
        data: {
          ...(data.pickupDate && { pickupDate: new Date(data.pickupDate) }),
          ...(data.wasteTypes && { wasteTypes: data.wasteTypes }),
          ...(data.estimatedWeight !== undefined && { estimatedWeight: data.estimatedWeight }),
          ...(data.actualWeight !== undefined && { actualWeight: data.actualWeight }),
          ...(data.specialInstructions !== undefined && { specialInstructions: data.specialInstructions }),
          ...(data.status && { status: data.status }),
          ...(data.driverNotes !== undefined && { driverNotes: data.driverNotes }),
          updatedAt: new Date()
        },
        include: {
          schedule: true,
          user: {
            select: {
              id: true,
              businessName: true,
              email: true,
              phone: true
            }
          }
        }
      });

      return updatedPickup;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Failed to update pickup');
    }
  }

  // Cancel pickup
  static async cancelPickup(pickupId: string, userId: string) {
    try {
      // Check if pickup exists and belongs to user
      const existingPickup = await prisma.pickup.findFirst({
        where: {
          id: pickupId,
          userId: userId
        }
      });

      if (!existingPickup) {
        throw new NotFoundError('Pickup not found');
      }

      // Check if pickup can be cancelled
      if (existingPickup.status === 'COMPLETED' || existingPickup.status === 'CANCELLED') {
        throw new ValidationError('Cannot cancel completed or already cancelled pickup');
      }

      if (existingPickup.status === 'IN_PROGRESS') {
        throw new ValidationError('Cannot cancel pickup that is in progress');
      }

      // Cancel pickup
      await prisma.pickup.update({
        where: {
          id: pickupId
        },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      });      return true;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Failed to cancel pickup');
    }
  }

  // Get pickup statistics for dashboard
  static async getPickupStats(userId: string) {
    try {
      const [totalPickups, pendingPickups, completedPickups, totalWeight] = await Promise.all([
        // Total pickups
        prisma.pickup.count({
          where: { userId }
        }),
        
        // Pending pickups
        prisma.pickup.count({
          where: { 
            userId,
            status: 'PENDING'
          }
        }),
        
        // Completed pickups
        prisma.pickup.count({
          where: { 
            userId,
            status: 'COMPLETED'
          }
        }),
        
        // Total weight collected
        prisma.pickup.aggregate({
          where: { 
            userId,
            status: 'COMPLETED',
            actualWeight: { not: null }
          },
          _sum: {
            actualWeight: true
          }
        })
      ]);      return {
        totalPickups,
        pendingPickups,
        completedPickups,
        totalWeight: totalWeight._sum.actualWeight || 0
      };
    } catch {
      throw new Error('Failed to fetch pickup statistics');
    }
  }
}
