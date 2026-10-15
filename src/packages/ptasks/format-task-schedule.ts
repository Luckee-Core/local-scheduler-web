import type { TaskSchedule } from '@/model';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Formats a task schedule for display on the dashboard.
 */
export const formatTaskSchedule = (schedule: TaskSchedule): string => {
  const weekdays =
    schedule.weekdays.length === 5 &&
    schedule.weekdays.every((d, i) => d === i + 1)
      ? 'weekdays'
      : schedule.weekdays.map((d) => WEEKDAY_LABELS[d] ?? String(d)).join(', ');

  const hours = `${schedule.hourStart}:00–${schedule.hourEnd}:00`;
  return `Every ${schedule.intervalMinutes}m · ${weekdays} · ${hours} ${schedule.timezone}`;
};
