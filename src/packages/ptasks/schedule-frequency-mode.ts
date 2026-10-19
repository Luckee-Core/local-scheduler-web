import type { DailyTaskSchedule, IntervalTaskSchedule, TaskSchedule } from '@/model';

export type ScheduleFrequencyMode = 'daily' | 'weekly' | 'interval';

/**
 * UI frequency mode derived from persisted schedule JSON.
 */
export const getScheduleFrequencyMode = (schedule: TaskSchedule): ScheduleFrequencyMode => {
  if (schedule.kind === 'interval') {
    return 'interval';
  }
  if (schedule.weekdays.length === 1) {
    return 'weekly';
  }
  return 'daily';
};

/**
 * Keeps interval window valid when only the start hour is edited in the UI.
 */
export const patchIntervalStartHour = (
  schedule: IntervalTaskSchedule,
  hourStart: number,
): IntervalTaskSchedule => {
  const hourEnd =
    schedule.hourEnd > hourStart + 1 ? schedule.hourEnd : Math.min(24, hourStart + 8);
  return { ...schedule, hourStart, hourEnd };
};

/**
 * Builds a daily schedule when switching frequency mode in the form.
 */
export const buildDailyScheduleFromMode = (
  mode: 'daily' | 'weekly',
  previous: TaskSchedule,
): DailyTaskSchedule => {
  const timezone = previous.timezone;
  const hour =
    previous.kind === 'daily'
      ? previous.hour
      : previous.kind === 'interval'
        ? previous.hourStart
        : 9;
  const minute = previous.kind === 'daily' ? previous.minute : 0;
  const weekdays =
    mode === 'weekly'
      ? [previous.weekdays[0] ?? 1]
      : previous.kind === 'daily' && previous.weekdays.length > 1
        ? previous.weekdays
        : [1, 2, 3, 4, 5];

  return { kind: 'daily', hour, minute, timezone, weekdays };
};

/**
 * Builds an interval schedule when switching from daily/weekly.
 */
export const buildIntervalScheduleFromPrevious = (previous: TaskSchedule): IntervalTaskSchedule => {
  const timezone = previous.timezone;
  const weekdays = previous.weekdays.length > 0 ? previous.weekdays : [1, 2, 3, 4, 5];
  const hourStart = previous.kind === 'daily' ? previous.hour : previous.kind === 'interval' ? previous.hourStart : 8;
  const hourEnd =
    previous.kind === 'interval' && previous.hourEnd > hourStart
      ? previous.hourEnd
      : Math.min(24, hourStart + 8);

  return {
    kind: 'interval',
    intervalMinutes: previous.kind === 'interval' ? previous.intervalMinutes : 15,
    timezone,
    weekdays,
    hourStart,
    hourEnd,
  };
};
