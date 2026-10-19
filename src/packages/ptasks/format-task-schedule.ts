import type { TaskSchedule } from '@/model';
import { getScheduleFrequencyMode } from './schedule-frequency-mode';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatWeekdays = (weekdays: number[]): string => {
  if (
    weekdays.length === 5 &&
    weekdays.every((d, i) => d === i + 1)
  ) {
    return 'weekdays';
  }
  return weekdays.map((d) => WEEKDAY_LABELS[d] ?? String(d)).join(', ');
};

/**
 * Formats hour (and optional minute) for dashboard hour dividers and schedules.
 */
export const formatClock = (hour: number, minute: number): string => {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const min = minute === 0 ? '' : `:${String(minute).padStart(2, '0')}`;
  return `${h12}${min}\u00a0${ampm}`;
};

/**
 * Hour-only label for grouping tasks on the dashboard (e.g. "9 AM").
 */
export const formatHourDivider = (hour: number): string => formatClock(hour, 0);

/**
 * Formats a task schedule for display on the dashboard.
 */
export const formatTaskSchedule = (schedule: TaskSchedule): string => {
  const weekdays = formatWeekdays(schedule.weekdays);
  const mode = getScheduleFrequencyMode(schedule);

  if (mode === 'weekly' && schedule.kind === 'daily') {
    const day = WEEKDAY_LABELS[schedule.weekdays[0]] ?? '?';
    return `Weekly on ${day} at ${formatClock(schedule.hour, schedule.minute)} · ${schedule.timezone}`;
  }

  if (schedule.kind === 'daily') {
    return `Daily at ${formatClock(schedule.hour, schedule.minute)} · ${weekdays} · ${schedule.timezone}`;
  }

  return `Every ${schedule.intervalMinutes}m from ${formatClock(schedule.hourStart, 0)} · ${weekdays} · ${schedule.timezone}`;
};
