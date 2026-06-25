import { TASKS_PATH, RUNS_PATH } from '@/config/routes';

export type SidebarLink = {
  name: string;
  href: string;
};

export type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

/**
 * Sidebar sections for the local scheduler dashboard.
 */
export const getSchedulerSidebarSections = (): SidebarSection[] => [
  {
    title: 'Scheduler',
    links: [
      { name: 'Tasks', href: TASKS_PATH },
      { name: 'Run history', href: RUNS_PATH },
    ],
  },
];
