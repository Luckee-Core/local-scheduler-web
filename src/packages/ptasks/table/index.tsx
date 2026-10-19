'use client';

import { useMemo, useState } from 'react';
import { detailPageStyles } from '@/components/detail-page-styles';
import { listTableStyles } from '@/components/list-table-styles';
import { useAppSelector } from '@/store';
import { groupTasksByHour, listProjectTabs } from '../group-tasks-for-dashboard';
import { ALL_PROJECTS_TAB_ID, PtasksProjectTabs } from './project-tabs';
import { PtasksTaskTimeline } from './task-timeline';
import { ptasksTableGridColsClass } from './task-grid-columns';

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
    return (
      <div className={listTableStyles.wrapper}>
        <div className={listTableStyles.emptyState}>
          <p className={listTableStyles.emptyText}>Loading tasks…</p>
        </div>
      </div>
    );
  }

  if (taskList.length === 0) {
    return (
      <div className={listTableStyles.wrapper}>
        <div className={detailPageStyles.emptyState}>
          <p className={detailPageStyles.fieldValue}>
            No scheduled tasks found. Use <strong>Add task</strong> in the sidebar, run{' '}
            <code className={styles.code}>npm run db:seed</code> on the express server, or{' '}
            <code className={styles.code}>POST /api/tasks</code> from another project.
          </p>
        </div>
      </div>
    );
  }

  const showProjectOnTask = selectedProjectId === ALL_PROJECTS_TAB_ID;

  return (
    <div className={listTableStyles.wrapper}>
      <PtasksProjectTabs
        projects={projectTabs}
        selectedProjectId={selectedProjectId}
        onSelectProjectId={setSelectedProjectId}
      />

      <div
        className={`${listTableStyles.columnHeaderRow} ${ptasksTableGridColsClass}`}
        aria-hidden="true"
      >
        <span>Task</span>
        <span>How often</span>
        <span>Active</span>
        <span className={styles.lastRunHeader}>Last run</span>
      </div>

      {buckets.length === 0 ? (
        <div className={listTableStyles.emptyState}>
          <p className={listTableStyles.emptyText}>No tasks for this project.</p>
        </div>
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
  code: `
    rounded bg-gray-100 px-1 py-0.5 font-mono text-xs
  `,
  lastRunHeader: `
    sm:text-right
  `,
};
