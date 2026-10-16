import type { TaskSchedule } from '@/model';

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

const formatClock = (hour: number, minute: number): string => {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const min = minute === 0 ? '' : `:${String(minute).padStart(2, '0')}`;
  return `${h12}${min} ${ampm}`;
};

/**
 * Formats a task schedule for display on the dashboard.
 */
export const formatTaskSchedule = (schedule: TaskSchedule): string => {
  const weekdays = formatWeekdays(schedule.weekdays);

  if (schedule.kind === 'daily') {
    return `Daily at ${formatClock(schedule.hour, schedule.minute)} · ${weekdays} · ${schedule.timezone}`;
  }

  const hours = `${schedule.hourStart}:00–${schedule.hourEnd}:00`;
  return `Every ${schedule.intervalMinutes}m · ${weekdays} · ${hours} ${schedule.timezone}`;
};
