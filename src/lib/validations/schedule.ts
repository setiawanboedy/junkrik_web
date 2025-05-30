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

// Input types for validation functions (form data comes as strings)
interface CreateScheduleInput {
  dayOfWeek: string | number;
  time: string;
  notes?: string;
}

interface UpdateScheduleInput {
  dayOfWeek?: string | number;
  time?: string;
  isActive?: string | boolean;
  notes?: string;
}

export function validateCreateSchedule(data: CreateScheduleInput): CreateScheduleRequest {
  const { dayOfWeek, time, notes } = data;

  if (dayOfWeek === undefined || dayOfWeek === null || dayOfWeek === '') {
    throw new ScheduleValidationError('Day of week is required');
  }

  if (!time) {
    throw new ScheduleValidationError('Time is required');
  }

  const dayOfWeekNum = typeof dayOfWeek === 'string' ? parseInt(dayOfWeek) : dayOfWeek;

  if (isNaN(dayOfWeekNum) || dayOfWeekNum < 0 || dayOfWeekNum > 6) {
    throw new ScheduleValidationError('Day of week must be between 0 (Sunday) and 6 (Saturday)');
  }

  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    throw new ScheduleValidationError('Time must be in HH:MM format');
  }

  return {
    dayOfWeek: dayOfWeekNum,
    time: time.trim(),
    notes: notes?.trim()
  };
}

export function validateUpdateSchedule(data: UpdateScheduleInput): UpdateScheduleRequest {
  const { dayOfWeek, time, isActive, notes } = data;
  const result: UpdateScheduleRequest = {};

  if (dayOfWeek !== undefined && dayOfWeek !== '') {
    const dayOfWeekNum = typeof dayOfWeek === 'string' ? parseInt(dayOfWeek) : dayOfWeek;
    if (isNaN(dayOfWeekNum) || dayOfWeekNum < 0 || dayOfWeekNum > 6) {
      throw new ScheduleValidationError('Day of week must be between 0 (Sunday) and 6 (Saturday)');
    }
    result.dayOfWeek = dayOfWeekNum;
  }

  if (time !== undefined && time !== '') {
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      throw new ScheduleValidationError('Time must be in HH:MM format');
    }
    result.time = time.trim();
  }

  if (isActive !== undefined) {
    result.isActive = typeof isActive === 'string' ? isActive === 'true' : Boolean(isActive);
  }

  if (notes !== undefined) {
    result.notes = typeof notes === 'string' ? notes.trim() : notes;
  }

  return result;
}
