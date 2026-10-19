'use client';

import { useMemo, useState } from 'react';
import { useAppSelector } from '@/store';
import { groupTasksByHour, listProjectTabs } from '../group-tasks-for-dashboard';
import { ALL_PROJECTS_TAB_ID, PtasksProjectTabs } from './project-tabs';
import { PtasksTaskTimeline } from './task-timeline';

export const PtasksTable = () => {
  const tasks = useAppSelector((state) => state.tasks);
  const runs = useAppSelector((state) => state.runs);
  const schedulerBuilder = useAppSelector((state) => state.schedulerBuilder);

  const [selectedProjectId, setSelectedProjectId] = useState(ALL_PROJECTS_TAB_ID);

  const taskList = useMemo(() => Object.values(tasks), [tasks]);

  const projectTabs = useMemo(() => listProjectTabs(taskList), [taskList]);

  const filteredTasks = useMemo(() => {
    if (selectedProjectId === ALL_PROJECTS_TAB_ID) {
      return taskList;
    }
    return taskList.filter((task) => {
      const projectId = task.schedulerProject?.id ?? task.schedulerProjectRepoId;
      return projectId === selectedProjectId;
    });
  }, [taskList, selectedProjectId]);

  const buckets = useMemo(
    () => groupTasksByHour(filteredTasks, selectedProjectId === ALL_PROJECTS_TAB_ID),
    [filteredTasks, selectedProjectId],
  );

  const latestRunByTaskId = useMemo(() => {
    const map = new Map<string, { finishedAt: string; status: string }>();
    for (const run of Object.values(runs)) {
      const existing = map.get(run.taskId);
      if (!existing || run.finishedAt > existing.finishedAt) {
        map.set(run.taskId, { finishedAt: run.finishedAt, status: run.status });
      }
    }
    return map;
  }, [runs]);

  if (schedulerBuilder.isLoadingTasks && taskList.length === 0) {
    return <p className={styles.empty}>Loading tasks…</p>;
  }

  if (taskList.length === 0) {
    return (
      <p className={styles.empty}>
        No scheduled tasks found. Use <strong>Add task</strong> in the sidebar, run{' '}
        <code className={styles.code}>npm run db:seed</code> on the express server, or{' '}
        <code className={styles.code}>POST /api/tasks</code> from another project.
      </p>
    );
  }

  const showProjectOnTask = selectedProjectId === ALL_PROJECTS_TAB_ID;

  return (
    <div className={styles.wrapper}>
      <PtasksProjectTabs
        projects={projectTabs}
        selectedProjectId={selectedProjectId}
        onSelectProjectId={setSelectedProjectId}
      />

      <div className={styles.columnHeaders} aria-hidden="true">
        <span>Task</span>
        <span>How often</span>
        <span>Active</span>
        <span className={styles.lastRunHeader}>Last run</span>
      </div>

      {buckets.length === 0 ? (
        <p className={styles.emptyFiltered}>No tasks for this project.</p>
      ) : (
        <PtasksTaskTimeline
          buckets={buckets}
          latestRunByTaskId={latestRunByTaskId}
          showProjectOnTask={showProjectOnTask}
        />
      )}
    </div>
  );
};

const styles = {
  wrapper: `
    flex w-full flex-col gap-4
  `,
  columnHeaders: `
    hidden sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_5rem_8rem] sm:gap-4 sm:px-1 sm:text-xs sm:font-semibold sm:uppercase sm:tracking-wide sm:text-gray-400
  `,
  lastRunHeader: `
    sm:text-right
  `,
  empty: `
    rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-600
  `,
  emptyFiltered: `
    py-8 text-center text-sm text-gray-500
  `,
  code: `
    rounded bg-gray-100 px-1 py-0.5 font-mono text-xs
  `,
};
