import { z } from 'zod';

// Schema for creating a pickup request
export const createPickupSchema = z.object({
  scheduleId: z.string().optional(),
  pickupDate: z.string().datetime(),
  wasteTypes: z.array(z.enum(['PLASTIC', 'ORGANIC', 'PAPER', 'METAL', 'GLASS', 'MIXED'])),
  estimatedWeight: z.number().positive().optional(),
  specialInstructions: z.string().max(500).optional(),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    notes: z.string().optional()
  })
});

// Schema for updating pickup
export const updatePickupSchema = z.object({
  pickupDate: z.string().datetime().optional(),
  wasteTypes: z.array(z.enum(['PLASTIC', 'ORGANIC', 'PAPER', 'METAL', 'GLASS', 'MIXED'])).optional(),
  estimatedWeight: z.number().positive().optional(),
  actualWeight: z.number().positive().optional(),
  specialInstructions: z.string().max(500).optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  driverNotes: z.string().max(500).optional()
});

// Type definitions
export type CreatePickupData = z.infer<typeof createPickupSchema>;
export type UpdatePickupData = z.infer<typeof updatePickupSchema>;

// Validation functions
export function validateCreatePickup(data: unknown): CreatePickupData {
  return createPickupSchema.parse(data);
}

export function validateUpdatePickup(data: unknown): UpdatePickupData {
  return updatePickupSchema.parse(data);
}
