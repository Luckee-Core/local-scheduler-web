'use client';

import type { ProjectTab } from '../../group-tasks-for-dashboard';

export const ALL_PROJECTS_TAB_ID = 'all';

type PtasksProjectTabsProps = {
  projects: ProjectTab[];
  selectedProjectId: string;
  onSelectProjectId: (projectId: string) => void;
};

export const PtasksProjectTabs = (props: PtasksProjectTabsProps) => {
  const { projects, selectedProjectId, onSelectProjectId } = props;

  const tabs = [
    { id: ALL_PROJECTS_TAB_ID, label: 'All' },
    ...projects.map((project) => ({ id: project.projectId, label: project.projectName })),
  ];

  return (
    <div className={styles.container} role="tablist" aria-label="Filter by project">
      {tabs.map((tab) => {
        const isActive = selectedProjectId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? styles.activeTab : styles.inactiveTab}
            onClick={() => onSelectProjectId(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

const styles = {
  container: `
    bg-white
    flex flex-wrap items-center gap-1
    border-b border-gray-200
    px-1
    pt-2
  `,
  activeTab: `
    px-4 py-2
    text-sm font-medium text-blue-600
    border-b-2 border-blue-600
    border-t-0 border-l-0 border-r-0
    transition-colors
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    rounded-t
    bg-transparent
    cursor-pointer
    -mb-px
  `,
  inactiveTab: `
    px-4 py-2
    text-sm font-medium text-gray-600
    hover:text-gray-900
    border-b-2 border-transparent
    border-t-0 border-l-0 border-r-0
    transition-colors
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    rounded-t
    bg-transparent
    cursor-pointer
    -mb-px
  `,
};
