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

  return (
    <div className={styles.bar} role="tablist" aria-label="Filter by project">
      <button
        type="button"
        role="tab"
        aria-selected={selectedProjectId === ALL_PROJECTS_TAB_ID}
        className={styles.tab(selectedProjectId === ALL_PROJECTS_TAB_ID)}
        onClick={() => onSelectProjectId(ALL_PROJECTS_TAB_ID)}
      >
        All
      </button>
      {projects.map((project) => (
        <button
          key={project.projectId}
          type="button"
          role="tab"
          aria-selected={selectedProjectId === project.projectId}
          className={styles.tab(selectedProjectId === project.projectId)}
          onClick={() => onSelectProjectId(project.projectId)}
        >
          {project.projectName}
        </button>
      ))}
    </div>
  );
};

const styles = {
  bar: `
    flex flex-wrap gap-1 border-b border-gray-200
  `,
  tab: (active: boolean) =>
    `-mb-px rounded-t-md px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? 'border border-b-white border-gray-200 bg-white text-gray-900'
        : 'border border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
    }`,
};
