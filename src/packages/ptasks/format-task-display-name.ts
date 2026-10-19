import type { ScheduledTask } from '@/model';

/**
 * Display title without the "Business — " prefix when present.
 */
export const formatTaskDisplayName = (task: ScheduledTask): string => {
  const dashIndex = task.name.indexOf(' — ');
  if (dashIndex >= 0) {
    return task.name.slice(dashIndex + 3);
  }
  return task.name;
};
