export interface CreateScheduleRequest {
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  time: string; // Format: "HH:MM"
  notes?: string;
}

export interface UpdateScheduleRequest {
  dayOfWeek?: number;
  time?: string;
  isActive?: boolean;
  notes?: string;
}

export class ScheduleValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScheduleValidationError';
  }
}

export function validateCreateSchedule(data: any): CreateScheduleRequest {
  const { dayOfWeek, time, notes } = data;

  if (dayOfWeek === undefined || dayOfWeek === null) {
    throw new ScheduleValidationError('Day of week is required');
  }

  if (!time) {
    throw new ScheduleValidationError('Time is required');
  }

  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new ScheduleValidationError('Day of week must be between 0 (Sunday) and 6 (Saturday)');
  }

  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    throw new ScheduleValidationError('Time must be in HH:MM format');
  }

  return {
    dayOfWeek: parseInt(dayOfWeek),
    time: time.trim(),
    notes: notes?.trim()
  };
}

export function validateUpdateSchedule(data: any): UpdateScheduleRequest {
  const { dayOfWeek, time, isActive, notes } = data;
  const result: UpdateScheduleRequest = {};

  if (dayOfWeek !== undefined) {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new ScheduleValidationError('Day of week must be between 0 (Sunday) and 6 (Saturday)');
    }
    result.dayOfWeek = parseInt(dayOfWeek);
  }

  if (time !== undefined) {
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      throw new ScheduleValidationError('Time must be in HH:MM format');
    }
    result.time = time.trim();
  }

  if (isActive !== undefined) {
    result.isActive = Boolean(isActive);
  }

  if (notes !== undefined) {
    result.notes = notes?.trim();
  }

  return result;
}
