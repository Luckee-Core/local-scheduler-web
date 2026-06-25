import { TASKS_PATH, RUNS_PATH } from '@/config/routes';

export type NavigationLink = {
  name: string;
  href: string;
};

/**
 * Sidebar navigation links for the scheduler dashboard.
 */
export const getNavigationLinks = (): NavigationLink[] => [
  { name: 'Tasks', href: TASKS_PATH },
  { name: 'Run history', href: RUNS_PATH },
];
