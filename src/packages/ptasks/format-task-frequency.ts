import type { TaskSchedule } from '@/model';
import { formatClock } from './format-task-schedule';
import { getScheduleFrequencyMode } from './schedule-frequency-mode';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatWeekdays = (weekdays: number[]): string => {
  if (weekdays.length === 5 && weekdays.every((d, i) => d === i + 1)) {
    return 'weekdays';
  }
  return weekdays.map((d) => WEEKDAY_LABELS[d] ?? String(d)).join(', ');
};

/**
 * Short schedule line for dashboard task rows (how often it runs).
 */
export const formatTaskFrequency = (schedule: TaskSchedule): string => {
  const mode = getScheduleFrequencyMode(schedule);

  if (mode === 'weekly' && schedule.kind === 'daily') {
    const day = WEEKDAY_LABELS[schedule.weekdays[0]] ?? '?';
    return `Weekly on ${day} at ${formatClock(schedule.hour, schedule.minute)}`;
  }

  if (schedule.kind === 'daily') {
    const weekdays = formatWeekdays(schedule.weekdays);
    return `Daily at ${formatClock(schedule.hour, schedule.minute)}, ${weekdays}`;
  }

  const weekdays = formatWeekdays(schedule.weekdays);
  return `Every ${schedule.intervalMinutes} min from ${formatClock(schedule.hourStart, 0)}, ${weekdays}`;
};
